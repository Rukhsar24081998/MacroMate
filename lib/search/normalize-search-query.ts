import { FOOD_SEARCH_ALIASES } from "./food-aliases";

export interface NormalizedSearchQuery {
  originalQuery: string;
  normalizedQuery: string;
  aliasApplied: boolean;
}

/** Collapse whitespace and lowercase for alias lookup. */
export function toAliasLookupKey(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizeSearchQuery(query: string): NormalizedSearchQuery {
  const originalQuery = query.trim();
  const lookupKey = toAliasLookupKey(originalQuery);
  const alias = FOOD_SEARCH_ALIASES[lookupKey];

  if (alias) {
    return {
      originalQuery,
      normalizedQuery: alias,
      aliasApplied: true,
    };
  }

  return {
    originalQuery,
    normalizedQuery: originalQuery,
    aliasApplied: false,
  };
}
