/** USDA FoodData Central nutrient IDs */
export const NUTRIENT_IDS = {
  ENERGY_KCAL: 1008,
  /** Foundation Foods — Metabolizable Energy (Atwater General Factor) */
  ENERGY_ATWATER_GENERAL: 2047,
  /** Foundation Foods — Metabolizable Energy (Atwater Specific Factor) */
  ENERGY_ATWATER_SPECIFIC: 2048,
  ENERGY_KJ: 1062,
  PROTEIN: 1003,
  CARBOHYDRATES: 1005,
  FAT: 1004,
  FIBER: 1079,
} as const;

export const USDA_API_BASE_URL =
  process.env.USDA_API_BASE_URL ?? "https://api.nal.usda.gov/fdc/v1";

export const USDA_REQUEST_TIMEOUT_MS = 8000;

export const DEFAULT_SEARCH_PAGE_SIZE = 10;
export const MAX_SEARCH_PAGE_SIZE = 25;

export const DEFAULT_DATA_TYPES = ["Foundation", "SR Legacy"] as const;

export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MAX_SEARCH_QUERY_LENGTH = 100;

export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
