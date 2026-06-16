import { describe, expect, it } from "vitest";
import { FOOD_SEARCH_ALIASES } from "./food-aliases";
import { normalizeSearchQuery, toAliasLookupKey } from "./normalize-search-query";

describe("normalizeSearchQuery", () => {
  it("maps a known alias to the USDA-friendly term", () => {
    expect(normalizeSearchQuery("omelette")).toEqual({
      originalQuery: "omelette",
      normalizedQuery: "egg omelet",
      aliasApplied: true,
    });
  });

  it("matches aliases case-insensitively", () => {
    expect(normalizeSearchQuery("Omelette")).toEqual({
      originalQuery: "Omelette",
      normalizedQuery: "egg omelet",
      aliasApplied: true,
    });

    expect(normalizeSearchQuery("TANDOORI CHICKEN")).toEqual({
      originalQuery: "TANDOORI CHICKEN",
      normalizedQuery: "roasted chicken breast",
      aliasApplied: true,
    });
  });

  it("returns the original query when no alias exists", () => {
    expect(normalizeSearchQuery("oats")).toEqual({
      originalQuery: "oats",
      normalizedQuery: "oats",
      aliasApplied: false,
    });
  });

  it("trims leading and trailing whitespace before lookup", () => {
    expect(normalizeSearchQuery("  omelette  ")).toEqual({
      originalQuery: "omelette",
      normalizedQuery: "egg omelet",
      aliasApplied: true,
    });
  });

  it("collapses internal whitespace for alias lookup", () => {
    expect(normalizeSearchQuery("  tandoori   chicken  ")).toEqual({
      originalQuery: "tandoori   chicken",
      normalizedQuery: "roasted chicken breast",
      aliasApplied: true,
    });
  });

  it("preserves original query casing when no alias is applied", () => {
    expect(normalizeSearchQuery("  Oats  ")).toEqual({
      originalQuery: "Oats",
      normalizedQuery: "Oats",
      aliasApplied: false,
    });
  });

  it("normalizes paneer bhurji to cottage cheese", () => {
    expect(normalizeSearchQuery("paneer bhurji")).toEqual({
      originalQuery: "paneer bhurji",
      normalizedQuery: "cottage cheese",
      aliasApplied: true,
    });
  });

  it("normalizes Indian and regional food aliases", () => {
    expect(normalizeSearchQuery("paneer").normalizedQuery).toBe("cottage cheese");
    expect(normalizeSearchQuery("milk").normalizedQuery).toBe("fluid milk");
    expect(normalizeSearchQuery("curd").normalizedQuery).toBe("plain yogurt");
    expect(normalizeSearchQuery("dahi").normalizedQuery).toBe("plain yogurt");
    expect(normalizeSearchQuery("dal").normalizedQuery).toBe("cooked lentils");
    expect(normalizeSearchQuery("rajma").normalizedQuery).toBe("cooked kidney beans");
    expect(normalizeSearchQuery("chole").normalizedQuery).toBe("cooked chickpeas");
  });
});

describe("toAliasLookupKey", () => {
  it("normalizes whitespace and casing for lookup keys", () => {
    expect(toAliasLookupKey("  Chapati  ")).toBe("chapati");
    expect(toAliasLookupKey("paneer   bhurji")).toBe("paneer bhurji");
  });
});

describe("FOOD_SEARCH_ALIASES", () => {
  it("includes updated paneer mappings", () => {
    expect(FOOD_SEARCH_ALIASES.paneer).toBe("cottage cheese");
    expect(FOOD_SEARCH_ALIASES["paneer bhurji"]).toBe("cottage cheese");
  });
});
