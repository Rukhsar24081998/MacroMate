import type { Unit } from "@/types/ingredient";

/**
 * MVP simplification: treat milliliters as grams (1 ml ≈ 1 g).
 * Documented in technical_architecture.md — no density data in V1.
 */
export function convertToGrams(
  quantity: number,
  unit: Unit,
  servingSizeGrams: number | null,
): number {
  switch (unit) {
    case "g":
    case "ml":
      return quantity;
    case "serving": {
      if (servingSizeGrams == null || servingSizeGrams <= 0) {
        throw new Error("Serving size is not available for this food");
      }
      return quantity * servingSizeGrams;
    }
  }
}

/** Normalize USDA serving size to grams when possible. */
export function resolveServingSizeGrams(
  servingSize: number | null,
  servingSizeUnit: string | null,
): number | null {
  if (servingSize == null || servingSize <= 0) return null;

  const unit = (servingSizeUnit ?? "g").trim().toLowerCase();
  if (unit === "g" || unit === "grm" || unit === "gram" || unit === "grams") {
    return servingSize;
  }
  if (unit === "ml" || unit === "mlt" || unit === "milliliter" || unit === "milliliters") {
    return servingSize;
  }

  return null;
}
