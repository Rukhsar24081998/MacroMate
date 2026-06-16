import { UNIT_SHORT_LABELS } from "@/lib/nutrition/constants";
import type { Ingredient } from "@/types/ingredient";

interface IngredientInfoProps {
  ingredient: Ingredient;
}

export function formatIngredientQuantity(ingredient: Ingredient): string {
  const unitLabel =
    ingredient.unit === "serving" && ingredient.quantity !== 1
      ? `${UNIT_SHORT_LABELS.serving}s`
      : UNIT_SHORT_LABELS[ingredient.unit];
  return `${ingredient.quantity} ${unitLabel}`;
}

export function IngredientInfo({ ingredient }: IngredientInfoProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-gray-900">{ingredient.name}</p>
      <p className="mt-0.5 text-sm text-gray-500">{formatIngredientQuantity(ingredient)}</p>
    </div>
  );
}
