import { MACRO_KEYS } from "@/lib/nutrition/constants";
import type { NormalizedNutrition } from "@/types/nutrition";
import { MacroSummaryCard } from "./macro-summary-card";

interface NutritionPreviewGridProps {
  nutrition: NormalizedNutrition;
  label?: string;
}

/** Compact per-100g macro tiles for the selected food panel. */
export function NutritionPreviewGrid({ nutrition, label = "per 100g" }: NutritionPreviewGridProps) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div className="grid grid-cols-5 gap-2">
        {MACRO_KEYS.map((key) => (
          <MacroSummaryCard
            key={key}
            macroKey={key}
            value={nutrition[key]}
            compact
            showProgress={false}
            className="!p-2.5"
          />
        ))}
      </div>
    </div>
  );
}
