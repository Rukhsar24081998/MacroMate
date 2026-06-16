import { calculateIngredientNutrition } from "@/lib/nutrition/calculate";
import { MACRO_KEYS } from "@/lib/nutrition/constants";
import type { Ingredient } from "@/types/ingredient";
import { MacroStatCard } from "./macro-stat-card";

interface IngredientMacrosProps {
  ingredient: Ingredient;
}

export function IngredientMacros({ ingredient }: IngredientMacrosProps) {
  const nutrition = calculateIngredientNutrition(ingredient);

  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {MACRO_KEYS.map((key) => (
        <MacroStatCard key={key} macroKey={key} value={nutrition[key]} className="py-1.5" />
      ))}
    </div>
  );
}
