"use client";

import { useIsLgUp } from "@/lib/hooks/use-breakpoint";
import type { FoodSearchState } from "@/types/state";
import { FoodDetailEmptyState } from "./food-detail-empty-state";
import { FoodDetailPanel } from "./food-detail-panel";

interface FoodDetailColumnProps {
  search: FoodSearchState;
}

export function FoodDetailColumn({ search }: FoodDetailColumnProps) {
  const isDesktop = useIsLgUp();
  const hasSelection =
    search.selectedFood != null || search.isLoadingDetail || search.detailError != null;

  return (
    <section aria-label="Selected food" className="flex h-full min-h-0 flex-col">
      <h2 className="mb-3 shrink-0 text-sm font-bold uppercase tracking-wide text-gray-500">
        Selected Food
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!hasSelection ? (
          <FoodDetailEmptyState />
        ) : (
          <FoodDetailPanel
            food={search.selectedFood}
            nutrition={search.selectedNutrition}
            isLoadingDetail={search.isLoadingDetail}
            error={search.detailError}
            onClear={search.clearSelection}
            onRetry={search.retryDetail}
            enableScrollReveal={!isDesktop}
          />
        )}
      </div>
    </section>
  );
}
