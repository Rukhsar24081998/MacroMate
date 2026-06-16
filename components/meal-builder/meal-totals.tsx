import type { NormalizedNutrition } from "@/types/nutrition";
import { MacroSummaryCard } from "./macro-summary-card";

interface MealTotalsProps {
  totals: NormalizedNutrition;
}

export function MealTotals({ totals }: MealTotalsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <MacroSummaryCard
        macroKey="calories"
        value={totals.calories}
        subtitle={totals.calories != null ? "kcal total" : undefined}
        className="col-span-2 sm:col-span-1"
      />
      <MacroSummaryCard macroKey="protein" value={totals.protein} />
      <MacroSummaryCard macroKey="carbohydrates" value={totals.carbohydrates} />
      <MacroSummaryCard macroKey="fat" value={totals.fat} />
      <MacroSummaryCard
        macroKey="fiber"
        value={totals.fiber}
        subtitle={totals.fiber != null && totals.fiber >= 6 ? "high fiber" : undefined}
        className="col-span-2 sm:col-span-1"
      />
    </div>
  );
}
