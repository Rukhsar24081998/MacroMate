"use client";

import { useFoodSearch } from "@/lib/hooks/use-food-search";
import { FoodDetailColumn } from "./food-detail-column";
import { FoodSearchColumn } from "./food-search-column";
import { MealBuilderLayoutShell } from "./meal-builder-layout-shell";
import { MealPanelColumn } from "./meal-panel-column";

export function MealBuilderPage() {
  const search = useFoodSearch();

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <h1 className="sr-only">Meal Builder</h1>

      <MealBuilderLayoutShell
        searchColumn={<FoodSearchColumn search={search} />}
        detailColumn={<FoodDetailColumn search={search} />}
        mealColumn={<MealPanelColumn />}
      />
    </div>
  );
}
