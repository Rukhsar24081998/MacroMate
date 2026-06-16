"use client";

import { Alert } from "@/components/ui/alert";
import { useMeal } from "@/lib/hooks/use-meal";
import { ClearMealButton } from "./clear-meal-button";
import { MealIngredientRow } from "./meal-ingredient-row";
import { NutritionSummaryBar } from "./nutrition-summary-bar";

export function MealPanelColumn() {
  const { ingredients } = useMeal();

  return (
    <section aria-label="Current meal" className="flex h-full min-h-0 flex-col">
      <NutritionSummaryBar />

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
            Ingredients List
          </h2>
          {ingredients.length > 0 ? (
            <span className="text-xs font-medium text-gray-400">
              {ingredients.length} item{ingredients.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {ingredients.length === 0 ? (
            <Alert variant="empty" className="text-sm">
              <span className="sr-only">Meal is empty. </span>
              No ingredients yet. Search for a food and add it to your meal.
            </Alert>
          ) : (
            <ul className="space-y-2 pb-2">
              {ingredients.map((ingredient) => (
                <MealIngredientRow key={ingredient.id} ingredient={ingredient} />
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 shrink-0 border-t border-gray-100 pt-4">
          <ClearMealButton className="w-full" />
        </div>
      </div>
    </section>
  );
}
