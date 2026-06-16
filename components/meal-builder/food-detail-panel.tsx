"use client";

import { useCallback, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useFoodDetailReveal } from "@/lib/hooks/use-food-detail-reveal";
import { cn } from "@/lib/utils/cn";
import type { NormalizedFoodSummary } from "@/types/food";
import type { NormalizedNutrition } from "@/types/nutrition";
import { AddToMealButton } from "./add-to-meal-button";
import { FoodDetailSkeleton } from "./food-detail-skeleton";
import { NutritionPreviewGrid } from "./nutrition-preview-grid";
import { QuantityInput, type QuantityValue } from "./quantity-input";

interface FoodDetailPanelProps {
  food: NormalizedFoodSummary | null;
  nutrition: NormalizedNutrition | null;
  isLoadingDetail: boolean;
  error: string | null;
  onClear: () => void;
  onRetry: () => void;
  enableScrollReveal?: boolean;
}

function dataTypeBadgeClass(dataType: string): string {
  if (dataType === "Foundation") return "bg-brand-100 text-brand-800";
  if (dataType === "SR Legacy") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-700";
}

export function FoodDetailPanel({
  food,
  nutrition,
  isLoadingDetail,
  error,
  onClear,
  onRetry,
  enableScrollReveal = true,
}: FoodDetailPanelProps) {
  const [quantityValue, setQuantityValue] = useState<QuantityValue | null>(null);

  const handleQuantityChange = useCallback((value: QuantityValue | null) => {
    setQuantityValue(value);
  }, []);

  const focusQuantityInput = useCallback(() => {
    const input = document.getElementById("food-quantity") as HTMLInputElement | null;
    input?.focus({ preventScroll: true });
    input?.select();
  }, []);

  const isReadyToFocus = Boolean(food && nutrition && !isLoadingDetail && !error);

  const { panelRef, highlighted } = useFoodDetailReveal({
    fdcId: food?.fdcId,
    isReadyToFocus,
    onFocusQuantity: focusQuantityInput,
    enableScrollReveal,
  });

  if (!food && !isLoadingDetail && !error) return null;

  const showSkeleton = isLoadingDetail && !nutrition;

  return (
    <div
      id="food-detail-panel"
      ref={panelRef}
      role="region"
      aria-label="Selected food details"
      aria-live="polite"
      className={cn(
        "rounded-2xl transition-[box-shadow,background-color] duration-500",
        highlighted &&
          "bg-brand-50/40 shadow-[0_0_0_2px_rgba(26,107,82,0.35),0_8px_24px_rgba(26,107,82,0.12)]",
      )}
    >
      {showSkeleton ? (
        <FoodDetailSkeleton food={food} />
      ) : (
        <div className="space-y-4">
          {food ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    dataTypeBadgeClass(food.dataType),
                  )}
                >
                  {food.dataType}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClear}
                  className="h-auto px-2 py-1 text-xs text-gray-400"
                >
                  Clear
                </Button>
              </div>
              <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-gray-900">
                {food.description}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {food.brandOwner ?? "USDA FoodData Central · per 100g"}
              </p>
            </div>
          ) : null}

          {error && food ? (
            <Alert
              variant="error"
              title="Could not load details"
              action={
                <Button variant="secondary" onClick={onRetry}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : null}

          {nutrition && food ? (
            <>
              <NutritionPreviewGrid nutrition={nutrition} />

              <div className="rounded-xl bg-surface-muted p-4">
                <QuantityInput
                  food={food}
                  onChange={handleQuantityChange}
                  disabled={isLoadingDetail}
                />
              </div>

              <AddToMealButton
                food={food}
                nutrition={nutrition}
                quantityValue={quantityValue}
                disabled={isLoadingDetail}
              />
            </>
          ) : null}
        </div>
      )}

      {food && highlighted ? (
        <span className="sr-only">
          Selected {food.description}. Enter a quantity below.
        </span>
      ) : null}
    </div>
  );
}
