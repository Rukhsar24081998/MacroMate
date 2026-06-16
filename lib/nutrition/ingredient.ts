import type { AddIngredientPayload, Ingredient, Unit } from "@/types/ingredient";
import { scaleNutrition } from "./calculate";
import { convertToGrams } from "./convert";
import { validateQuantity } from "./validate";

export function createIngredientFromPayload(payload: AddIngredientPayload): Ingredient {
  const effectiveGrams = convertToGrams(
    payload.quantity,
    payload.unit,
    payload.servingSizeGrams,
  );

  return {
    id: crypto.randomUUID(),
    fdcId: payload.fdcId,
    name: payload.name,
    quantity: payload.quantity,
    unit: payload.unit,
    baseNutrition: payload.baseNutrition,
    servingSizeGrams: payload.servingSizeGrams,
    scaledNutrition: scaleNutrition(payload.baseNutrition, effectiveGrams),
  };
}

export function applyIngredientQuantityUpdate(
  ingredient: Ingredient,
  quantity: number,
  unit: Unit,
): Ingredient {
  const validationError = validateQuantity(quantity, unit, ingredient.servingSizeGrams);
  if (validationError != null) {
    throw new Error(validationError);
  }

  const effectiveGrams = convertToGrams(quantity, unit, ingredient.servingSizeGrams);

  return {
    ...ingredient,
    quantity,
    unit,
    scaledNutrition: scaleNutrition(ingredient.baseNutrition, effectiveGrams),
  };
}
