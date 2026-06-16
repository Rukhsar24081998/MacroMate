/** MVP macro keys displayed in nutrition summaries */
export type MacroKey =
  | "calories"
  | "protein"
  | "carbohydrates"
  | "fat"
  | "fiber";

/** Normalized nutrient profile — values are per 100g unless scaled */
export interface NormalizedNutrition {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  fiber: number | null;
}
