import type { NormalizedNutrition } from "@/types/nutrition";
import { MacroPills } from "./macro-pills";

interface NutritionPreviewGridProps {
  nutrition: NormalizedNutrition;
  label?: string;
}

/** Compact per-100g macro chips for the selected food panel. */
export function NutritionPreviewGrid({ nutrition, label = "per 100g" }: NutritionPreviewGridProps) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <MacroPills
        calories={nutrition.calories}
        protein={nutrition.protein}
        carbohydrates={nutrition.carbohydrates}
        fat={nutrition.fat}
      />
    </div>
  );
}
