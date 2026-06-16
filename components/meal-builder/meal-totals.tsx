import type { NormalizedNutrition } from "@/types/nutrition";
import { MacroStatCard } from "./macro-stat-card";

interface MealTotalsProps {
  totals: NormalizedNutrition;
}

const EMPHASIZED_KEYS = ["calories", "protein"] as const;
const SECONDARY_KEYS = ["carbohydrates", "fat", "fiber"] as const;

export function MealTotals({ totals }: MealTotalsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {EMPHASIZED_KEYS.map((key) => (
          <MacroStatCard key={key} macroKey={key} value={totals[key]} emphasized />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {SECONDARY_KEYS.map((key) => (
          <MacroStatCard key={key} macroKey={key} value={totals[key]} />
        ))}
      </div>
    </div>
  );
}
