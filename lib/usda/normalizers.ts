import type { NormalizedFoodSummary } from "@/types/food";
import type { NormalizedNutrition } from "@/types/nutrition";
import { NUTRIENT_IDS } from "./constants";

interface UsdaNutrientEntry {
  nutrient?: { id?: number; unitName?: string };
  amount?: number;
  /** Present in /foods/search abridged nutrient entries */
  nutrientId?: number;
  value?: number;
}

interface UsdaFoodPortion {
  gramWeight?: number;
  amount?: number;
  portionDescription?: string;
}

interface UsdaSearchFood {
  fdcId?: number;
  description?: string;
  dataType?: string;
  brandOwner?: string;
  ndbNumber?: number;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: UsdaNutrientEntry[];
  foodPortions?: UsdaFoodPortion[];
}

interface UsdaSearchResponse {
  foods?: UsdaSearchFood[];
  totalHits?: number;
  currentPage?: number;
  totalPages?: number;
}

interface UsdaFoodDetail {
  fdcId?: number;
  description?: string;
  dataType?: string;
  brandOwner?: string;
  ndbNumber?: number;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: UsdaNutrientEntry[];
  foodPortions?: UsdaFoodPortion[];
}

type UsdaServingSource = Pick<
  UsdaFoodDetail,
  "servingSize" | "servingSizeUnit" | "householdServingFullText" | "foodPortions"
>;

export function resolveServingFields(raw: UsdaServingSource): {
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServingFullText: string | null;
} {
  if (raw.servingSize != null && raw.servingSize > 0) {
    return {
      servingSize: raw.servingSize,
      servingSizeUnit: nullIfEmpty(raw.servingSizeUnit ?? null) ?? "g",
      householdServingFullText: nullIfEmpty(raw.householdServingFullText ?? null),
    };
  }

  const portions = raw.foodPortions ?? [];
  const oneUnitPortions = portions.filter(
    (portion) =>
      portion.gramWeight != null &&
      portion.gramWeight > 0 &&
      (portion.amount === 1 || portion.amount == null),
  );
  const primary =
    [...oneUnitPortions].sort(
      (left, right) => (left.gramWeight ?? Infinity) - (right.gramWeight ?? Infinity),
    )[0] ??
    portions.find((portion) => portion.gramWeight != null && portion.gramWeight > 0);

  if (primary?.gramWeight != null) {
    return {
      servingSize: primary.gramWeight,
      servingSizeUnit: "g",
      householdServingFullText:
        nullIfEmpty(raw.householdServingFullText ?? null) ??
        nullIfEmpty(primary.portionDescription ?? null) ??
        (primary.amount === 1 ? "1 serving" : null),
    };
  }

  return {
    servingSize: null,
    servingSizeUnit: null,
    householdServingFullText: nullIfEmpty(raw.householdServingFullText ?? null),
  };
}

function nullIfEmpty(value: string | undefined | null): string | null {
  if (value == null || value.trim() === "") return null;
  return value.trim();
}

export function normalizeFoodSummary(raw: UsdaSearchFood | UsdaFoodDetail): NormalizedFoodSummary {
  const serving = resolveServingFields(raw);

  return {
    fdcId: raw.fdcId ?? 0,
    description: raw.description?.trim() ?? "Unknown food",
    dataType: raw.dataType ?? "Unknown",
    brandOwner: nullIfEmpty(raw.brandOwner ?? null),
    servingSize: serving.servingSize,
    servingSizeUnit: serving.servingSizeUnit,
    householdServingFullText: serving.householdServingFullText,
  };
}

function findNutrientAmount(
  nutrients: UsdaNutrientEntry[],
  id: number,
): number | null {
  const entry = nutrients.find(
    (n) => n.nutrient?.id === id || n.nutrientId === id,
  );
  const amount = entry?.amount ?? entry?.value;
  if (amount == null || Number.isNaN(amount)) return null;
  return amount;
}

export function extractNutrition(
  raw: Pick<UsdaFoodDetail, "foodNutrients"> | Record<string, unknown>,
): NormalizedNutrition {
  const nutrients =
    (raw as UsdaFoodDetail).foodNutrients ??
    (Array.isArray((raw as Record<string, unknown>).foodNutrients)
      ? ((raw as Record<string, unknown>).foodNutrients as UsdaNutrientEntry[])
      : []);

  let calories = findNutrientAmount(nutrients, NUTRIENT_IDS.ENERGY_KCAL);
  if (calories == null) {
    calories = findNutrientAmount(nutrients, NUTRIENT_IDS.ENERGY_ATWATER_GENERAL);
  }
  if (calories == null) {
    calories = findNutrientAmount(nutrients, NUTRIENT_IDS.ENERGY_ATWATER_SPECIFIC);
  }
  if (calories == null) {
    const kj = findNutrientAmount(nutrients, NUTRIENT_IDS.ENERGY_KJ);
    if (kj != null) calories = kj / 4.184;
  }

  return {
    calories,
    protein: findNutrientAmount(nutrients, NUTRIENT_IDS.PROTEIN),
    carbohydrates: findNutrientAmount(nutrients, NUTRIENT_IDS.CARBOHYDRATES),
    fat: findNutrientAmount(nutrients, NUTRIENT_IDS.FAT),
    fiber: findNutrientAmount(nutrients, NUTRIENT_IDS.FIBER),
  };
}

function normalizeSearchFoodItem(raw: UsdaSearchFood) {
  const summary = normalizeFoodSummary(raw);
  if (!raw.foodNutrients?.length) return summary;

  return {
    ...summary,
    previewNutrition: extractNutrition({ foodNutrients: raw.foodNutrients }),
  };
}

export function normalizeSearchResponse(raw: UsdaSearchResponse, pageSize: number) {
  const foods = (raw.foods ?? [])
    .filter((f) => f.fdcId != null)
    .map(normalizeSearchFoodItem);

  return {
    foods,
    pagination: {
      page: raw.currentPage ?? 1,
      pageSize,
      totalHits: raw.totalHits ?? foods.length,
    },
  };
}

export function normalizeFoodDetail(raw: UsdaFoodDetail | Record<string, unknown>) {
  return {
    food: normalizeFoodSummary(raw),
    nutrition: extractNutrition(raw),
  };
}
