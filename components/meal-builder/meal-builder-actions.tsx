"use client";

import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/icons";
import { useMeal } from "@/lib/hooks/use-meal";

export function MealBuilderActions() {
  const { ingredients } = useMeal();
  const hasIngredients = ingredients.length > 0;

  return (
    <div className="hidden flex-wrap gap-3 lg:flex">
      <Button variant="outline" disabled title="Coming soon">
        Save as Template
      </Button>
      <Button variant="outline" disabled title="Coming soon">
        Compare Stats
      </Button>
      <Button
        variant="primary"
        disabled={!hasIngredients}
        className="ml-auto min-w-[180px]"
        onClick={() => {
          document.getElementById("nutrition-summary")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Finish Tracking
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
