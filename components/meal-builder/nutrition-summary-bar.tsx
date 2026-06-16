"use client";

import { useMemo } from "react";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { useMeal } from "@/lib/hooks/use-meal";
import { MACRO_LABELS, MACRO_UNITS } from "@/lib/nutrition/constants";
import { formatNutrientValue } from "@/lib/nutrition/format";
import type { MacroKey } from "@/types/nutrition";
import { cn } from "@/lib/utils/cn";

const SECONDARY_MACROS: MacroKey[] = ["carbohydrates", "fat", "fiber"];

const SECONDARY_ACCENT: Partial<Record<MacroKey, string>> = {
  carbohydrates: "text-blue-700",
  fat: "text-amber-800",
  fiber: "text-emerald-700",
};

function KpiCard({
  label,
  value,
  unit,
  valueClassName,
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/90 px-3 py-2.5 ring-1 ring-gray-100/90 transition-shadow duration-200 hover:shadow-sm",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className={cn("font-bold tabular-nums tracking-tight", valueClassName)}>{value}</span>
        {unit ? <span className="text-xs font-medium text-gray-400">{unit}</span> : null}
      </div>
    </div>
  );
}

export function NutritionSummaryBar() {
  const { ingredients } = useMeal();
  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);
  const hasIngredients = ingredients.length > 0;

  return (
    <section
      aria-label="Nutrition summary"
      className="shrink-0 rounded-xl bg-gradient-to-br from-brand-50/70 via-white to-white p-3.5 ring-1 ring-brand-100/60"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700/70">
        Meal summary
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <KpiCard
          label={MACRO_LABELS.calories}
          value={formatNutrientValue("calories", hasIngredients ? totals.calories : null)}
          unit={hasIngredients && totals.calories != null ? MACRO_UNITS.calories : undefined}
          valueClassName="text-3xl text-gray-900"
          className="col-span-1 bg-gradient-to-br from-white to-brand-50/30 ring-brand-100/80"
        />
        <KpiCard
          label={MACRO_LABELS.protein}
          value={formatNutrientValue("protein", hasIngredients ? totals.protein : null)}
          unit={hasIngredients && totals.protein != null ? MACRO_UNITS.protein : undefined}
          valueClassName="text-2xl text-brand-700"
          className="ring-brand-100/60"
        />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {SECONDARY_MACROS.map((key) => (
          <KpiCard
            key={key}
            label={MACRO_LABELS[key]}
            value={formatNutrientValue(key, hasIngredients ? totals[key] : null)}
            unit={hasIngredients && totals[key] != null ? MACRO_UNITS[key] : undefined}
            valueClassName={cn("text-base", SECONDARY_ACCENT[key])}
            className="px-2 py-2"
          />
        ))}
      </div>

      {!hasIngredients ? (
        <p className="mt-3 border-t border-brand-100/50 pt-2.5 text-center text-xs text-gray-500">
          Totals update as you add ingredients.
        </p>
      ) : null}
    </section>
  );
}
