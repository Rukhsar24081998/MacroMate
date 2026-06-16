import type { Ingredient } from "@/types/ingredient";
import type { MacroKey, NormalizedNutrition } from "@/types/nutrition";
import { EMPTY_NUTRITION, MACRO_KEYS } from "./constants";

function scaleValue(value: number | null, factor: number): number | null {
  if (value == null) return null;
  return value * factor;
}

/** Scale per-100g nutrition to an arbitrary gram amount. */
export function scaleNutrition(
  base: NormalizedNutrition,
  grams: number,
): NormalizedNutrition {
  const factor = grams / 100;
  return {
    calories: scaleValue(base.calories, factor),
    protein: scaleValue(base.protein, factor),
    carbohydrates: scaleValue(base.carbohydrates, factor),
    fat: scaleValue(base.fat, factor),
    fiber: scaleValue(base.fiber, factor),
  };
}

/** Returns the ingredient's precomputed scaled nutrition (source of truth). */
export function calculateIngredientNutrition(ingredient: Ingredient): NormalizedNutrition {
  return ingredient.scaledNutrition;
}

function sumNutrientValues(values: Array<number | null>): number | null {
  const present = values.filter((value): value is number => value != null);
  if (present.length === 0) return null;
  return present.reduce((total, value) => total + value, 0);
}

function sumNutrientKey(ingredients: Ingredient[], key: MacroKey): number | null {
  const values = ingredients.map((ingredient) => calculateIngredientNutrition(ingredient)[key]);
  return sumNutrientValues(values);
}

/** Aggregate meal totals from ingredient scaled nutrition snapshots. */
export function calculateMealTotals(ingredients: Ingredient[]): NormalizedNutrition {
  if (ingredients.length === 0) return { ...EMPTY_NUTRITION };

  return MACRO_KEYS.reduce<NormalizedNutrition>(
    (totals, key) => {
      totals[key] = sumNutrientKey(ingredients, key);
      return totals;
    },
    { ...EMPTY_NUTRITION },
  );
}
