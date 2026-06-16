"use client";

import { Button } from "@/components/ui/button";
import { useMeal } from "@/lib/hooks/use-meal";

interface ClearMealButtonProps {
  className?: string;
}

export function ClearMealButton({ className }: ClearMealButtonProps) {
  const { ingredients, clearMeal } = useMeal();

  if (ingredients.length === 0) return null;

  return (
    <Button type="button" variant="secondary" onClick={clearMeal} className={className}>
      Clear meal
    </Button>
  );
}
