import type { NormalizedNutrition } from "./nutrition";

export interface NormalizedFoodSummary {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServingFullText?: string | null;
  /** USDA food category when provided (e.g. "Dairy and Egg Products"). */
  foodCategory?: string | null;
  /** Abridged macros from USDA search — used when detail fetch is unavailable. */
  previewNutrition?: NormalizedNutrition;
}
