"use client";

import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { useMeal } from "@/lib/hooks/use-meal";
import { macroProgressPercent } from "@/lib/design/daily-reference";
import { MACRO_KEYS, MACRO_LABELS, MACRO_UNITS } from "@/lib/nutrition/constants";
import { formatNutrientValue } from "@/lib/nutrition/format";
import type { MacroKey } from "@/types/nutrition";
import { cn } from "@/lib/utils/cn";

const BAR_COLORS: Record<MacroKey, string> = {
  calories: "bg-gray-900",
  protein: "bg-brand-600",
  carbohydrates: "bg-macro-protein",
  fat: "bg-macro-fat",
  fiber: "bg-macro-fiber",
};

export function NutritionSummaryBar() {
  const { ingredients } = useMeal();
  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);
  const proteinProgress = macroProgressPercent("protein", totals.protein);

  return (
    <section aria-label="Nutrition summary" className="shrink-0">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900">Meal Summary</h2>
            {ingredients.length > 0 ? (
              <p className="mt-0.5 text-xs font-medium text-brand-700">
                {proteinProgress}% daily protein reference
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-gray-500">Add ingredients to see totals</p>
            )}
          </div>
        </div>

        {ingredients.length === 0 ? (
          <Alert variant="empty" className="text-xs">
            <span className="sr-only">Nutrition summary empty. </span>
            No ingredients yet.
          </Alert>
        ) : (
          <div className="space-y-3">
            {MACRO_KEYS.map((key) => {
              const progress = macroProgressPercent(key, totals[key]);
              return (
                <div key={key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-gray-500">{MACRO_LABELS[key]}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatNutrientValue(key, totals[key])}
                      {totals[key] != null ? (
                        <span className="ml-0.5 text-xs font-medium text-gray-400">
                          {MACRO_UNITS[key]}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn("h-full rounded-full transition-all", BAR_COLORS[key])}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
