import { describe, expect, it } from "vitest";
import { extractNutrition, normalizeSearchResponse } from "./normalizers";

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

  it("reads search-format nutrients (nutrientId + value)", () => {
    const nutrition = extractNutrition({
      foodNutrients: [
        { nutrientId: 1008, value: 148 },
        { nutrientId: 1003, value: 12.4 },
        { nutrientId: 1005, value: 0.96 },
        { nutrientId: 1004, value: 9.96 },
        { nutrientId: 1079, value: 0 },
      ],
    });
    expect(nutrition.calories).toBe(148);
    expect(nutrition.protein).toBe(12.4);
  });
});

describe("normalizeSearchResponse", () => {
  it("includes previewNutrition from search foodNutrients", () => {
    const result = normalizeSearchResponse(
      {
        foods: [
          {
            fdcId: 747997,
            description: "Eggs, Grade A, Large, egg white",
            dataType: "Foundation",
            foodNutrients: [
              { nutrientId: 1008, value: 55 },
              { nutrientId: 1003, value: 10.7 },
            ],
          },
        ],
      },
      10,
    );

    expect(result.foods[0]?.previewNutrition?.calories).toBe(55);
    expect(result.foods[0]?.previewNutrition?.protein).toBe(10.7);
  });
});
