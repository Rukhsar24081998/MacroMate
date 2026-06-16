"use client";

import { FoodSearchSection } from "./food-search-section";
import { MealBuilderActions } from "./meal-builder-actions";
import { MealIngredientList } from "./meal-ingredient-list";
import { NutritionSummary } from "./nutrition-summary";

export function MealBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="sr-only">Meal Builder</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <FoodSearchSection />
        </div>

        <div className="min-w-0 space-y-6">
          <div id="nutrition-summary">
            <NutritionSummary />
          </div>
          <MealIngredientList />
          <MealBuilderActions />
        </div>
      </div>
    </div>
  );
}
