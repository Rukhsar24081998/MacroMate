import type { NormalizedFoodSummary } from "./food";
import type { NormalizedNutrition } from "./nutrition";

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface SearchNormalization {
  originalQuery: string;
  normalizedQuery: string;
  aliasApplied: boolean;
}

export interface FoodSearchResult {
  foods: NormalizedFoodSummary[];
  pagination: {
    page: number;
    pageSize: number;
    totalHits: number;
  };
}

export interface FoodSearchResponse extends FoodSearchResult {
  searchNormalization: SearchNormalization;
}

export interface FoodDetailResponse {
  food: NormalizedFoodSummary;
  nutrition: NormalizedNutrition;
}
