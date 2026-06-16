"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { resolveServingSizeGrams } from "@/lib/nutrition/convert";
import { useMeal } from "@/lib/hooks/use-meal";
import type { NormalizedFoodSummary } from "@/types/food";
import type { NormalizedNutrition } from "@/types/nutrition";
import type { QuantityValue } from "./quantity-input";

interface AddToMealButtonProps {
  food: NormalizedFoodSummary;
  nutrition: NormalizedNutrition;
  quantityValue: QuantityValue | null;
  onAdded?: () => void;
  disabled?: boolean;
}

export function AddToMealButton({
  food,
  nutrition,
  quantityValue,
  onAdded,
  disabled,
}: AddToMealButtonProps) {
  const { addIngredient } = useMeal();

  const canAdd = quantityValue?.isValid === true && !disabled;

  const handleAdd = () => {
    if (!canAdd || !quantityValue) return;

    addIngredient({
      fdcId: food.fdcId,
      name: food.description,
      quantity: quantityValue.quantity,
      unit: quantityValue.unit,
      baseNutrition: nutrition,
      servingSizeGrams: resolveServingSizeGrams(food.servingSize, food.servingSizeUnit),
    });
    onAdded?.();
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className="mt-4 hidden w-full lg:inline-flex"
      >
        Add To Meal
      </Button>
      <Button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className="mt-4 w-full lg:hidden"
      >
        <PlusIcon className="h-4 w-4" />
        Add Ingredient
      </Button>
    </>
  );
}
