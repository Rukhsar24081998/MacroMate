import { describe, expect, it } from "vitest";
import type { Ingredient } from "@/types/ingredient";
import { parseStoredMeal } from "./meal-session";

const validIngredient: Ingredient = {
  id: "abc-123",
  fdcId: 42,
  name: "Oats",
  quantity: 100,
  unit: "g",
  servingSizeGrams: null,
  baseNutrition: {
    calories: 379,
    protein: 13.2,
    carbohydrates: 67.7,
    fat: 6.5,
    fiber: 10.1,
  },
  scaledNutrition: {
    calories: 379,
    protein: 13.2,
    carbohydrates: 67.7,
    fat: 6.5,
    fiber: 10.1,
  },
};

describe("parseStoredMeal", () => {
  it("parses valid stored ingredients", () => {
    const raw = JSON.stringify([validIngredient]);
    expect(parseStoredMeal(raw)).toEqual([validIngredient]);
  });

  it("returns null for invalid JSON", () => {
    expect(parseStoredMeal("{not json")).toBeNull();
  });

  it("returns null for non-array payloads", () => {
    expect(parseStoredMeal(JSON.stringify({ ingredients: [] }))).toBeNull();
  });

  it("returns null when any ingredient is invalid", () => {
    const raw = JSON.stringify([
      validIngredient,
      { ...validIngredient, unit: "invalid" },
    ]);
    expect(parseStoredMeal(raw)).toBeNull();
  });

  it("returns null for corrupted nutrition data", () => {
    const raw = JSON.stringify([
      {
        ...validIngredient,
        scaledNutrition: { ...validIngredient.scaledNutrition, calories: "bad" },
      },
    ]);
    expect(parseStoredMeal(raw)).toBeNull();
  });
});
