/**
 * Maps common user-facing food names to USDA-friendly search terms.
 * Keys are lowercase; lookup is case-insensitive via normalizeSearchQuery.
 */
export const FOOD_SEARCH_ALIASES: Readonly<Record<string, string>> = {
  omelette: "egg omelet",
  omelet: "egg omelet",
  "tandoori chicken": "roasted chicken breast",
  paneer: "cottage cheese",
  "paneer bhurji": "cottage cheese",
  roti: "whole wheat flatbread",
  chapati: "whole wheat flatbread",
  milk: "fluid milk",
  curd: "plain yogurt",
  dahi: "plain yogurt",
  dal: "cooked lentils",
  rajma: "cooked kidney beans",
  chole: "cooked chickpeas",
};
