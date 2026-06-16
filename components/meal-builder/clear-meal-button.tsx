"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { useMeal } from "@/lib/hooks/use-meal";

interface ClearMealButtonProps {
  className?: string;
}

export function ClearMealButton({ className }: ClearMealButtonProps) {
  const { ingredients, clearMeal } = useMeal();

  if (ingredients.length === 0) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={clearMeal}
      className={`h-auto gap-1.5 px-2 py-1 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 ${className ?? ""}`}
    >
      <TrashIcon className="h-4 w-4" />
      Clear All
    </Button>
  );
}
