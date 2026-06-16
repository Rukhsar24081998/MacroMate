import { describe, expect, it } from "vitest";
import type { Ingredient } from "@/types/ingredient";
import type { NormalizedNutrition } from "@/types/nutrition";
import {
  calculateIngredientNutrition,
  calculateMealTotals,
  scaleNutrition,
} from "./calculate";
import { formatNutrientValue, formatNutrientWithUnit, MISSING_NUTRIENT_DISPLAY } from "./format";

const basePer100g: NormalizedNutrition = {
  calories: 100,
  protein: 10,
  carbohydrates: 20,
  fat: 5,
  fiber: 3,
};

function makeIngredient(
  overrides: Partial<Ingredient> & Pick<Ingredient, "id" | "scaledNutrition">,
): Ingredient {
  return {
    fdcId: 1,
    name: "Test food",
    quantity: 100,
    unit: "g",
    baseNutrition: basePer100g,
    servingSizeGrams: null,
    ...overrides,
  };
}

describe("scaleNutrition", () => {
  it("scales all nutrients linearly by gram amount", () => {
    expect(scaleNutrition(basePer100g, 200)).toEqual({
      calories: 200,
      protein: 20,
      carbohydrates: 40,
      fat: 10,
      fiber: 6,
    });
  });

  it("returns null for nutrients that are null in the base profile", () => {
    const partialBase: NormalizedNutrition = {
      calories: 100,
      protein: null,
      carbohydrates: 20,
      fat: null,
      fiber: 3,
    };

    expect(scaleNutrition(partialBase, 50)).toEqual({
      calories: 50,
      protein: null,
      carbohydrates: 10,
      fat: null,
      fiber: 1.5,
    });
  });

  it("returns zeros when scaling zero grams", () => {
    expect(scaleNutrition(basePer100g, 0)).toEqual({
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    });
  });
});

describe("calculateIngredientNutrition", () => {
  it("returns the ingredient scaledNutrition snapshot", () => {
    const scaled: NormalizedNutrition = {
      calories: 250,
      protein: 12.5,
      carbohydrates: 30,
      fat: 8,
      fiber: 4,
    };
    const ingredient = makeIngredient({ id: "a", scaledNutrition: scaled });

    expect(calculateIngredientNutrition(ingredient)).toBe(scaled);
  });
});

describe("calculateMealTotals", () => {
  it("returns empty nutrition for an empty meal", () => {
    expect(calculateMealTotals([])).toEqual({
      calories: null,
      protein: null,
      carbohydrates: null,
      fat: null,
      fiber: null,
    });
  });

  it("sums scaled nutrition across ingredients", () => {
    const ingredients = [
      makeIngredient({
        id: "a",
        scaledNutrition: {
          calories: 200,
          protein: 20,
          carbohydrates: 10,
          fat: 5,
          fiber: 2,
        },
      }),
      makeIngredient({
        id: "b",
        scaledNutrition: {
          calories: 150,
          protein: 10,
          carbohydrates: 15,
          fat: 3,
          fiber: 1,
        },
      }),
    ];

    expect(calculateMealTotals(ingredients)).toEqual({
      calories: 350,
      protein: 30,
      carbohydrates: 25,
      fat: 8,
      fiber: 3,
    });
  });

  it("ignores null nutrients when summing and returns null if all are missing", () => {
    const ingredients = [
      makeIngredient({
        id: "a",
        scaledNutrition: {
          calories: 100,
          protein: null,
          carbohydrates: 10,
          fat: 5,
          fiber: null,
        },
      }),
      makeIngredient({
        id: "b",
        scaledNutrition: {
          calories: 50,
          protein: 5,
          carbohydrates: null,
          fat: null,
          fiber: 2,
        },
      }),
    ];

    expect(calculateMealTotals(ingredients)).toEqual({
      calories: 150,
      protein: 5,
      carbohydrates: 10,
      fat: 5,
      fiber: 2,
    });
  });

  it("returns null for a nutrient when every ingredient lacks that nutrient", () => {
    const ingredients = [
      makeIngredient({
        id: "a",
        scaledNutrition: {
          calories: 100,
          protein: null,
          carbohydrates: 10,
          fat: 5,
          fiber: null,
        },
      }),
      makeIngredient({
        id: "b",
        scaledNutrition: {
          calories: 50,
          protein: null,
          carbohydrates: 5,
          fat: 2,
          fiber: null,
        },
      }),
    ];

    expect(calculateMealTotals(ingredients).protein).toBeNull();
    expect(calculateMealTotals(ingredients).fiber).toBeNull();
    expect(calculateMealTotals(ingredients).calories).toBe(150);
  });
});

describe("format", () => {
  it("formats calories as whole numbers and macros to one decimal", () => {
    expect(formatNutrientValue("calories", 123.6)).toBe("124");
    expect(formatNutrientValue("protein", 12.34)).toBe("12.3");
  });

  it("shows an em dash for missing nutrients", () => {
    expect(formatNutrientValue("fat", null)).toBe(MISSING_NUTRIENT_DISPLAY);
    expect(formatNutrientWithUnit("fiber", null)).toBe(MISSING_NUTRIENT_DISPLAY);
  });

  it("appends units for present values", () => {
    expect(formatNutrientWithUnit("calories", 200)).toBe("200 kcal");
    expect(formatNutrientWithUnit("carbohydrates", 45.2)).toBe("45.2 g");
  });
});
