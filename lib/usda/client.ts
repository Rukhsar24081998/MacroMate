import type { FoodDetailResponse, FoodSearchResult } from "@/types/api";
import { cacheKey, getCached, setCached } from "./cache";
import {
  DEFAULT_DATA_TYPES,
  DEFAULT_SEARCH_PAGE_SIZE,
  USDA_API_BASE_URL,
  USDA_REQUEST_TIMEOUT_MS,
} from "./constants";
import { normalizeFoodDetail, normalizeSearchResponse, resolveServingFields } from "./normalizers";

export class UsdaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "UsdaApiError";
  }
}

function getApiKey(): string {
  const key = process.env.USDA_API_KEY;
  if (!key) {
    throw new UsdaApiError(
      "USDA API key is not configured",
      500,
      "CONFIG_ERROR",
    );
  }
  return key;
}

async function usdaFetch(path: string, params: Record<string, string>): Promise<Response> {
  const url = new URL(`${USDA_API_BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(USDA_REQUEST_TIMEOUT_MS),
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (process.env.NODE_ENV === "development") {
    const remaining = response.headers.get("X-RateLimit-Remaining");
    if (remaining != null) {
      console.info(`[USDA] Rate limit remaining: ${remaining}`);
    }
  }

  return response;
}

/**
 * Foundation foods (e.g. Grade A eggs) often 404 on GET /food/{fdcId} but appear in
 * /foods/search with full abridged nutrient data when queried by fdcId.
 */
async function fetchFoodByIdViaSearch(fdcId: number): Promise<Record<string, unknown> | null> {
  const response = await usdaFetch("/foods/search", {
    query: String(fdcId),
    pageSize: "10",
    pageNumber: "1",
    dataType: DEFAULT_DATA_TYPES.join(","),
  });

  if (!response.ok) return null;

  const raw = (await response.json()) as { foods?: Array<Record<string, unknown>> };
  const match = raw.foods?.find((food) => Number(food.fdcId) === fdcId);
  return match ?? null;
}

function applyServingFields(
  raw: Record<string, unknown>,
  serving: ReturnType<typeof resolveServingFields>,
): Record<string, unknown> {
  return {
    ...raw,
    servingSize: serving.servingSize,
    servingSizeUnit: serving.servingSizeUnit,
    householdServingFullText: serving.householdServingFullText,
  };
}

function hasServingData(raw: Record<string, unknown>): boolean {
  return resolveServingFields(raw as Parameters<typeof resolveServingFields>[0]).servingSize != null;
}

/** SR Legacy records often share an NDB number with Foundation foods and include foodPortions. */
async function fetchSrLegacyFoodByNdb(ndbNumber: number): Promise<Record<string, unknown> | null> {
  const searchResponse = await usdaFetch("/foods/search", {
    query: String(ndbNumber),
    pageSize: "10",
    pageNumber: "1",
    dataType: "SR Legacy",
  });

  if (!searchResponse.ok) return null;

  const searchRaw = (await searchResponse.json()) as {
    foods?: Array<{ fdcId?: number; ndbNumber?: number }>;
  };
  const match = searchRaw.foods?.find((food) => Number(food.ndbNumber) === ndbNumber);
  if (match?.fdcId == null) return null;

  const detailResponse = await usdaFetch(`/food/${match.fdcId}`, {});
  if (!detailResponse.ok) return null;

  return detailResponse.json();
}

async function enrichServingData(raw: Record<string, unknown>): Promise<Record<string, unknown>> {
  const directServing = resolveServingFields(raw as Parameters<typeof resolveServingFields>[0]);
  if (directServing.servingSize != null) {
    return applyServingFields(raw, directServing);
  }

  const dataType = String(raw.dataType ?? "");
  const ndbNumber = Number(raw.ndbNumber);
  if (dataType === "Foundation" && Number.isFinite(ndbNumber) && ndbNumber > 0) {
    const srLegacy = await fetchSrLegacyFoodByNdb(ndbNumber);
    if (srLegacy && hasServingData(srLegacy)) {
      const srServing = resolveServingFields(srLegacy as Parameters<typeof resolveServingFields>[0]);
      return applyServingFields(raw, srServing);
    }
  }

  return applyServingFields(raw, directServing);
}

function mapUsdaStatus(status: number): UsdaApiError {
  switch (status) {
    case 403:
      return new UsdaApiError("Invalid USDA API key", 500, "CONFIG_ERROR");
    case 404:
      return new UsdaApiError("Food not found", 404, "NOT_FOUND");
    case 429:
      return new UsdaApiError(
        "Search temporarily unavailable. Please try again in a few minutes.",
        429,
        "RATE_LIMITED",
      );
    default:
      if (status >= 500) {
        return new UsdaApiError(
          "USDA service is temporarily unavailable",
          502,
          "UPSTREAM_ERROR",
        );
      }
      return new UsdaApiError("Unexpected USDA API error", 502, "UPSTREAM_ERROR");
  }
}

export async function searchFoods(
  query: string,
  page = 1,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE,
): Promise<FoodSearchResult> {
  const key = cacheKey("search", query.toLowerCase(), page, pageSize);
  const cached = getCached<FoodSearchResult>(key);
  if (cached) return cached;

  const response = await usdaFetch("/foods/search", {
    query,
    pageSize: String(pageSize),
    pageNumber: String(page),
    dataType: DEFAULT_DATA_TYPES.join(","),
  });

  if (!response.ok) throw mapUsdaStatus(response.status);

  const raw = await response.json();
  const result = normalizeSearchResponse(raw, pageSize);
  setCached(key, result);
  return result;
}

export async function getFoodById(fdcId: number): Promise<FoodDetailResponse> {
  const key = cacheKey("food", fdcId);
  const cached = getCached<FoodDetailResponse>(key);
  if (cached) return cached;

  const response = await usdaFetch(`/food/${fdcId}`, {});

  let raw: Record<string, unknown>;
  if (response.ok) {
    raw = await response.json();
  } else if (response.status === 404) {
    const searchFood = await fetchFoodByIdViaSearch(fdcId);
    if (!searchFood) throw new UsdaApiError("Food not found", 404, "NOT_FOUND");
    raw = searchFood;
  } else {
    throw mapUsdaStatus(response.status);
  }

  raw = await enrichServingData(raw);

  const result = normalizeFoodDetail(raw);
  setCached(key, result);
  return result;
}
