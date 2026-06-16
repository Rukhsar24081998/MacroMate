"use client";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useMeal } from "@/lib/hooks/use-meal";
import { ClearMealButton } from "./clear-meal-button";
import { MealIngredientRow } from "./meal-ingredient-row";

export function MealIngredientList() {
  const { ingredients } = useMeal();

  return (
    <section aria-label="Meal ingredients">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Meal Ingredients</h2>
          <p className="mt-0.5 text-sm text-gray-500 lg:hidden">Current Meal</p>
        </div>
        <ClearMealButton />
      </div>

      {ingredients.length === 0 ? (
        <Alert variant="empty">
          <span className="sr-only">Meal is empty. </span>
          No ingredients yet. Search for a food and add it to your meal.
        </Alert>
      ) : (
        <Card className="space-y-3 p-3 shadow-none">
          <ul className="space-y-3">
            {ingredients.map((ingredient) => (
              <MealIngredientRow key={ingredient.id} ingredient={ingredient} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
