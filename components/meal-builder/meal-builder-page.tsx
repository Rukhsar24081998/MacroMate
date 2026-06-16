"use client";

import { FoodSearchSection } from "./food-search-section";
import { MealIngredientList } from "./meal-ingredient-list";
import { NutritionSummary } from "./nutrition-summary";

export function MealBuilderPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start lg:gap-8 lg:space-y-0">
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Meal Builder
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Search for ingredients, set quantities, and build your meal from USDA FoodData Central.
          </p>
        </div>
        <FoodSearchSection />
        <MealIngredientList />
      </div>
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <NutritionSummary />
      </aside>
    </div>
  );
}
