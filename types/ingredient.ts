import type { NormalizedNutrition } from "./nutrition";

export type Unit = "g" | "ml" | "serving";

export interface Ingredient {
  id: string;
  fdcId: number;
  name: string;
  quantity: number;
  unit: Unit;
  /** Per-100g nutrition snapshot at add time. */
  baseNutrition: NormalizedNutrition;
  servingSizeGrams: number | null;
  scaledNutrition: NormalizedNutrition;
}

/** Payload when adding an ingredient from the food detail panel (Phase 3). */
export interface AddIngredientPayload {
  fdcId: number;
  name: string;
  quantity: number;
  unit: Unit;
  baseNutrition: NormalizedNutrition;
  servingSizeGrams: number | null;
}

export interface Meal {
  ingredients: Ingredient[];
  totals: NormalizedNutrition;
}
