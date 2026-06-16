import type { Ingredient, Unit } from "@/types/ingredient";
import type { NormalizedNutrition } from "@/types/nutrition";

export const MEAL_SESSION_KEY = "macromate:meal:v1";

const VALID_UNITS: Unit[] = ["g", "ml", "serving"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isNormalizedNutrition(value: unknown): value is NormalizedNutrition {
  if (!isRecord(value)) return false;
  return (
    isNullableNumber(value.calories) &&
    isNullableNumber(value.protein) &&
    isNullableNumber(value.carbohydrates) &&
    isNullableNumber(value.fat) &&
    isNullableNumber(value.fiber)
  );
}

function isIngredient(value: unknown): value is Ingredient {
  if (!isRecord(value)) return false;

  const unit = value.unit;
  if (typeof unit !== "string" || !VALID_UNITS.includes(unit as Unit)) return false;

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.fdcId === "number" &&
    Number.isFinite(value.fdcId) &&
    typeof value.name === "string" &&
    value.name.length > 0 &&
    typeof value.quantity === "number" &&
    Number.isFinite(value.quantity) &&
    value.quantity > 0 &&
    isNormalizedNutrition(value.baseNutrition) &&
    isNormalizedNutrition(value.scaledNutrition) &&
    (value.servingSizeGrams === null ||
      (typeof value.servingSizeGrams === "number" &&
        Number.isFinite(value.servingSizeGrams) &&
        value.servingSizeGrams > 0))
  );
}

export function parseStoredMeal(raw: string): Ingredient[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const ingredients = parsed.filter(isIngredient);
    return ingredients.length === parsed.length ? ingredients : null;
  } catch {
    return null;
  }
}

export function loadMealFromSession(): Ingredient[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(MEAL_SESSION_KEY);
    if (raw == null) return [];

    const ingredients = parseStoredMeal(raw);
    if (ingredients == null) {
      window.sessionStorage.removeItem(MEAL_SESSION_KEY);
      return [];
    }

    return ingredients;
  } catch {
    return [];
  }
}

export function saveMealToSession(ingredients: Ingredient[]): void {
  if (typeof window === "undefined") return;

  try {
    if (ingredients.length === 0) {
      window.sessionStorage.removeItem(MEAL_SESSION_KEY);
      return;
    }

    window.sessionStorage.setItem(MEAL_SESSION_KEY, JSON.stringify(ingredients));
  } catch {
    // Quota exceeded or private browsing — fail silently.
  }
}
