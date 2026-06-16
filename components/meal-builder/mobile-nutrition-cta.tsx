"use client";

import { Button } from "@/components/ui/button";
import { useMeal } from "@/lib/hooks/use-meal";

export function MobileNutritionCta() {
  const { ingredients } = useMeal();

  if (ingredients.length === 0) return null;

  return (
    <div className="lg:hidden">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          document.getElementById("nutrition-summary")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        View Nutrition Summary
      </Button>
    </div>
  );
}
