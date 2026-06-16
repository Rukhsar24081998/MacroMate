import { NextRequest } from "next/server";
import { normalizeSearchQuery } from "@/lib/search/normalize-search-query";
import { searchFoods } from "@/lib/usda/client";
import {
  DEFAULT_SEARCH_PAGE_SIZE,
  MAX_SEARCH_PAGE_SIZE,
  MIN_SEARCH_QUERY_LENGTH,
  MAX_SEARCH_QUERY_LENGTH,
} from "@/lib/usda/constants";
import {
  handleRouteError,
  handleValidationError,
  ValidationError,
} from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.trim() ?? "";

    if (q.length < MIN_SEARCH_QUERY_LENGTH) {
      throw new ValidationError(
        `Search query must be at least ${MIN_SEARCH_QUERY_LENGTH} characters`,
      );
    }
    if (q.length > MAX_SEARCH_QUERY_LENGTH) {
      throw new ValidationError(
        `Search query must be at most ${MAX_SEARCH_QUERY_LENGTH} characters`,
      );
    }

    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(
      MAX_SEARCH_PAGE_SIZE,
      Math.max(
        1,
        Number.parseInt(
          searchParams.get("pageSize") ?? String(DEFAULT_SEARCH_PAGE_SIZE),
          10,
        ) || DEFAULT_SEARCH_PAGE_SIZE,
      ),
    );

    const searchNormalization = normalizeSearchQuery(q);
    const result = await searchFoods(
      searchNormalization.normalizedQuery,
      page,
      pageSize,
    );

    if (process.env.NODE_ENV === "development") {
      console.debug("[MacroMate search]", {
        originalQuery: searchNormalization.originalQuery,
        normalizedQuery: searchNormalization.normalizedQuery,
        aliasApplied: searchNormalization.aliasApplied,
        resultCount: result.foods.length,
      });
    }

    return Response.json({ ...result, searchNormalization });
  } catch (error) {
    if (error instanceof ValidationError) return handleValidationError(error);
    return handleRouteError(error);
  }
}
