"use client";

import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ChartIcon } from "@/components/ui/icons";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { useMeal } from "@/lib/hooks/use-meal";
import { MealTotals } from "./meal-totals";

export function NutritionSummary() {
  const { ingredients } = useMeal();
  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);

  return (
    <section aria-label="Nutrition summary">
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Current Meal Summary</h2>
            <p className="mt-0.5 text-sm text-gray-500">Meal totals based on added ingredients</p>
          </div>
          <ChartIcon className="hidden h-5 w-5 text-gray-400 sm:block" />
        </div>

        {ingredients.length === 0 ? (
          <Alert variant="empty">
            <span className="sr-only">Nutrition summary empty. </span>
            Add ingredients to see meal-level calories and macros.
          </Alert>
        ) : (
          <>
            <div className="hidden lg:block">
              <MealTotals totals={totals} layout="desktop" />
            </div>
            <div className="lg:hidden">
              <MealTotals totals={totals} layout="mobile" />
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
