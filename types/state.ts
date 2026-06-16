import type { SearchNormalization } from "./api";
import type { AddIngredientPayload, Ingredient, Unit } from "./ingredient";
import type { NormalizedFoodSummary } from "./food";
import type { NormalizedNutrition } from "./nutrition";

/** MealProvider context shape */
export interface MealState {
  ingredients: Ingredient[];
  totals: NormalizedNutrition;
  addIngredient: (payload: AddIngredientPayload) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, quantity: number, unit: Unit) => void;
  clearMeal: () => void;
}

export interface FoodSearchState {
  query: string;
  setQuery: (query: string) => void;
  searchNormalization: SearchNormalization | null;
  results: NormalizedFoodSummary[];
  selectedFood: NormalizedFoodSummary | null;
  selectedNutrition: NormalizedNutrition | null;
  isSearching: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  detailError: string | null;
  hasSearched: boolean;
  selectFood: (fdcId: number) => Promise<void>;
  clearSelection: () => void;
  retrySearch: () => void;
  retryDetail: () => void;
}
