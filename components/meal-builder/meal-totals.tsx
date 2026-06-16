import type { NormalizedNutrition } from "@/types/nutrition";
import {
  CaloriesHeroCard,
  MacroSummaryCard,
} from "./macro-summary-card";

interface MealTotalsProps {
  totals: NormalizedNutrition;
  layout?: "desktop" | "mobile";
}

export function MealTotals({ totals, layout = "desktop" }: MealTotalsProps) {
  if (layout === "mobile") {
    return (
      <div className="space-y-3">
        <CaloriesHeroCard value={totals.calories} />
        <div className="grid grid-cols-2 gap-3">
          <MacroSummaryCard macroKey="protein" value={totals.protein} compact />
          <MacroSummaryCard macroKey="carbohydrates" value={totals.carbohydrates} compact />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
      <MacroSummaryCard
        macroKey="calories"
        value={totals.calories}
        subtitle={totals.calories != null ? "kcal total" : undefined}
        className="col-span-2 xl:col-span-1"
      />
      <MacroSummaryCard macroKey="protein" value={totals.protein} />
      <MacroSummaryCard macroKey="carbohydrates" value={totals.carbohydrates} />
      <MacroSummaryCard macroKey="fat" value={totals.fat} />
      <MacroSummaryCard
        macroKey="fiber"
        value={totals.fiber}
        subtitle={totals.fiber != null && totals.fiber >= 6 ? "high fiber" : undefined}
        className="col-span-2 xl:col-span-1"
      />
    </div>
  );
}
