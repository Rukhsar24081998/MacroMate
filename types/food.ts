import type { NormalizedNutrition } from "./nutrition";

export interface NormalizedFoodSummary {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServingFullText?: string | null;
  /** Abridged macros from USDA search — used when detail fetch is unavailable. */
  previewNutrition?: NormalizedNutrition;
}
