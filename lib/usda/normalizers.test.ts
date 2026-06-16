import { describe, expect, it } from "vitest";
import { extractNutrition } from "./normalizers";

function nutrient(id: number, amount: number) {
  return { nutrient: { id }, amount };
}

describe("extractNutrition", () => {
  it("uses legacy energy (1008) when present", () => {
    const nutrition = extractNutrition({
      foodNutrients: [
        nutrient(1008, 389),
        nutrient(1003, 13.2),
      ],
    });
    expect(nutrition.calories).toBe(389);
  });

  it("falls back to Atwater general factor (2047) for Foundation foods", () => {
    const nutrition = extractNutrition({
      foodNutrients: [
        nutrient(2047, 404),
        nutrient(1003, 13.2),
        nutrient(1005, 69.9),
      ],
    });
    expect(nutrition.calories).toBe(404);
  });

  it("falls back to Atwater specific factor (2048) when 2047 is absent", () => {
    const nutrition = extractNutrition({
      foodNutrients: [nutrient(2048, 395), nutrient(1003, 10)],
    });
    expect(nutrition.calories).toBe(395);
  });

  it("prefers 1008 over Foundation energy IDs", () => {
    const nutrition = extractNutrition({
      foodNutrients: [nutrient(1008, 100), nutrient(2047, 200)],
    });
    expect(nutrition.calories).toBe(100);
  });

  it("converts kJ (1062) when no kcal fields are present", () => {
    const nutrition = extractNutrition({
      foodNutrients: [nutrient(1062, 418.4)],
    });
    expect(nutrition.calories).toBeCloseTo(100);
  });
});
