"use client";

import { useMeal } from "@/lib/hooks/use-meal";
import { UtensilsIcon } from "@/components/ui/icons";
import { ClearMealButton } from "./clear-meal-button";
import { ColumnHeader } from "./column-header";
import { EmptyState } from "./empty-state";
import { MealIngredientRow } from "./meal-ingredient-row";
import { NutritionSummaryBar } from "./nutrition-summary-bar";

export function MealPanelColumn() {
  const { ingredients } = useMeal();

  return (
    <section aria-label="Current meal" className="flex h-full min-h-0 flex-col">
      <NutritionSummaryBar />

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <ColumnHeader
          title="Ingredients"
          meta={
            ingredients.length > 0
              ? `${ingredients.length} added`
              : undefined
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
          {ingredients.length === 0 ? (
            <EmptyState
              icon={<UtensilsIcon className="h-5 w-5" />}
              title="Your meal is empty"
              description="Search for foods, set a quantity, and tap Add To Meal. Items will appear here."
            />
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
