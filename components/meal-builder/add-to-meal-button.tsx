"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { resolveServingSizeGrams } from "@/lib/nutrition/convert";
import { useMeal } from "@/lib/hooks/use-meal";
import { cn } from "@/lib/utils/cn";
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
  const [justAdded, setJustAdded] = useState(false);

  const canAdd = quantityValue?.isValid === true && !disabled;

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

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
    setJustAdded(true);
    onAdded?.();
  };

  return (
    <Button
      type="button"
      onClick={handleAdd}
      disabled={!canAdd}
      className={cn(
        "w-full transition-all duration-300 ease-out",
        justAdded && "bg-emerald-600 hover:bg-emerald-600 focus-visible:ring-emerald-600",
      )}
      aria-live="polite"
    >
      {justAdded ? (
        "Added!"
      ) : (
        <>
          <PlusIcon className="h-4 w-4" />
          Add To Meal
        </>
      )}
    </Button>
  );
}
