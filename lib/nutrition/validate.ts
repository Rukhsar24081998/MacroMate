import { MAX_GRAMS_OR_ML, MAX_SERVINGS, UNIT_SHORT_LABELS } from "./constants";
import type { Unit } from "@/types/ingredient";

export function validateQuantity(
  quantity: number,
  unit: Unit,
  servingSizeGrams: number | null,
): string | null {
  if (!Number.isFinite(quantity)) {
    return "Enter a valid number";
  }

  if (quantity <= 0) {
    return "Quantity must be greater than 0";
  }

  if (unit === "serving") {
    if (servingSizeGrams == null || servingSizeGrams <= 0) {
      return "Serving size is not available for this food";
    }
    if (quantity > MAX_SERVINGS) {
      return `Quantity cannot exceed ${MAX_SERVINGS} ${UNIT_SHORT_LABELS.serving}s`;
    }
    return null;
  }

  if (quantity > MAX_GRAMS_OR_ML) {
    return `Quantity cannot exceed ${MAX_GRAMS_OR_ML.toLocaleString()} ${UNIT_SHORT_LABELS[unit]}`;
  }

  return null;
}

export function parseQuantityInput(value: string): number {
  const trimmed = value.trim();
  if (trimmed === "") return Number.NaN;
  return Number.parseFloat(trimmed);
}
