import type { Unit } from "@/types/ingredient";
import type { MacroKey, NormalizedNutrition } from "@/types/nutrition";

/** Default quantity when a food is first selected (grams). */
export const DEFAULT_QUANTITY = 100;

/** Upper bound for gram / milliliter input (~10 kg). */
export const MAX_GRAMS_OR_ML = 10_000;

/** Upper bound for serving count. */
export const MAX_SERVINGS = 100;

export const UNIT_LABELS: Record<Unit, string> = {
  g: "grams",
  ml: "milliliters",
  serving: "servings",
};

export const UNIT_SHORT_LABELS: Record<Unit, string> = {
  g: "g",
  ml: "ml",
  serving: "serving",
};

export const ALL_UNITS: Unit[] = ["g", "ml", "serving"];

export const MACRO_KEYS: MacroKey[] = [
  "calories",
  "protein",
  "carbohydrates",
  "fat",
  "fiber",
];

export const MACRO_LABELS: Record<MacroKey, string> = {
  calories: "Calories",
  protein: "Protein",
  carbohydrates: "Carbs",
  fat: "Fat",
  fiber: "Fiber",
};

export const MACRO_UNITS: Record<MacroKey, string> = {
  calories: "kcal",
  protein: "g",
  carbohydrates: "g",
  fat: "g",
  fiber: "g",
};

export const EMPTY_NUTRITION: NormalizedNutrition = {
  calories: null,
  protein: null,
  carbohydrates: null,
  fat: null,
  fiber: null,
};
