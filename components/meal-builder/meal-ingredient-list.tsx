"use client";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useMeal } from "@/lib/hooks/use-meal";
import { ClearMealButton } from "./clear-meal-button";
import { MealIngredientRow } from "./meal-ingredient-row";

export function MealIngredientList() {
  const { ingredients } = useMeal();

  return (
    <section aria-label="Meal ingredients" className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your meal</h2>
          <p className="mt-1 text-sm text-gray-500">
            {ingredients.length === 0
              ? "Added ingredients will appear here."
              : `${ingredients.length} ingredient${ingredients.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <ClearMealButton />
      </div>

      {ingredients.length === 0 ? (
        <Alert variant="empty">
          <span className="sr-only">Meal is empty. </span>
          No ingredients yet. Search for a food and add it to your meal.
        </Alert>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-gray-100 p-2">
            {ingredients.map((ingredient) => (
              <MealIngredientRow key={ingredient.id} ingredient={ingredient} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
