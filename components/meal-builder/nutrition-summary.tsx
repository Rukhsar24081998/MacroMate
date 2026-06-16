"use client";

import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { useMeal } from "@/lib/hooks/use-meal";
import { MealTotals } from "./meal-totals";

export function NutritionSummary() {
  const { ingredients } = useMeal();
  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);

  return (
    <section aria-label="Nutrition summary" className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Nutrition summary</h2>
        <p className="mt-1 text-sm text-gray-600">
          Meal totals based on added ingredients.
        </p>
      </div>

      {ingredients.length === 0 ? (
        <Alert variant="empty">
          <span className="sr-only">Nutrition summary empty. </span>
          Add ingredients to see meal-level calories and macros.
        </Alert>
      ) : (
        <Card>
          <MealTotals totals={totals} />
        </Card>
      )}
    </section>
  );
}
