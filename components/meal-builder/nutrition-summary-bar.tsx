"use client";

import { useMemo } from "react";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { useMeal } from "@/lib/hooks/use-meal";
import { macroProgressPercent } from "@/lib/design/daily-reference";
import { MACRO_KEYS, MACRO_LABELS, MACRO_UNITS } from "@/lib/nutrition/constants";
import { formatNutrientValue } from "@/lib/nutrition/format";
import type { MacroKey } from "@/types/nutrition";
import { cn } from "@/lib/utils/cn";
import { ChartIcon } from "@/components/ui/icons";
import { EmptyState } from "./empty-state";

const MACRO_ACCENT: Record<MacroKey, string> = {
  calories: "text-gray-900",
  protein: "text-brand-700",
  carbohydrates: "text-macro-protein",
  fat: "text-macro-fat",
  fiber: "text-macro-fiber",
};

const BAR_COLORS: Record<MacroKey, string> = {
  calories: "bg-gray-800",
  protein: "bg-brand-600",
  carbohydrates: "bg-macro-protein",
  fat: "bg-macro-fat",
  fiber: "bg-macro-fiber",
};

const SECONDARY_MACROS = MACRO_KEYS.filter((k) => k !== "calories");

export function NutritionSummaryBar() {
  const { ingredients } = useMeal();
  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);
  const hasIngredients = ingredients.length > 0;

  return (
    <section
      aria-label="Nutrition summary"
      className="shrink-0 rounded-xl bg-gradient-to-br from-brand-50/80 via-white to-white p-4 ring-1 ring-brand-100/60"
    >
      {hasIngredients ? (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700/80">
            Meal total
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900">
              {formatNutrientValue("calories", totals.calories)}
            </span>
            {totals.calories != null ? (
              <span className="text-sm font-medium text-gray-500">kcal</span>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {SECONDARY_MACROS.map((key) => (
              <div
                key={key}
                className="rounded-lg bg-white/80 px-2 py-2 text-center ring-1 ring-gray-100/80"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  {MACRO_LABELS[key]}
                </p>
                <p className={cn("mt-0.5 text-sm font-bold tabular-nums", MACRO_ACCENT[key])}>
                  {formatNutrientValue(key, totals[key])}
                  {totals[key] != null ? (
                    <span className="ml-0.5 text-[10px] font-medium text-gray-400">
                      {MACRO_UNITS[key]}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-brand-100/60 pt-3">
            {MACRO_KEYS.map((key) => {
              const progress = macroProgressPercent(key, totals[key]);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[10px] font-medium text-gray-400">
                    {MACRO_LABELS[key]}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100/80">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300 ease-out",
                        BAR_COLORS[key],
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<ChartIcon className="h-5 w-5" />}
          title="No meal totals yet"
          description="Add ingredients from search to see calories and macros update here instantly."
          className="border-none bg-transparent py-6"
        />
      )}
    </section>
  );
}
