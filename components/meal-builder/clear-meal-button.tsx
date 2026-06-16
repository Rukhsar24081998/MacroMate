"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { useMeal } from "@/lib/hooks/use-meal";
import { cn } from "@/lib/utils/cn";

interface ClearMealButtonProps {
  className?: string;
}

export function ClearMealButton({ className }: ClearMealButtonProps) {
  const { ingredients, clearMeal } = useMeal();

  if (ingredients.length === 0) return null;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={clearMeal}
      className={cn("gap-2", className)}
    >
      <TrashIcon className="h-4 w-4" />
      Clear Meal
    </Button>
  );
}
