"use client";

import { useCallback, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScaleIcon } from "@/components/ui/icons";
import { scaleNutrition } from "@/lib/nutrition/calculate";
import { MACRO_KEYS, UNIT_SHORT_LABELS } from "@/lib/nutrition/constants";
import type { NormalizedFoodSummary } from "@/types/food";
import type { NormalizedNutrition } from "@/types/nutrition";
import { FoodInfoHeader } from "./food-info-header";
import { AddToMealButton } from "./add-to-meal-button";
import { FoodDetailSkeleton } from "./food-detail-skeleton";
import { MacroStatCard } from "./macro-stat-card";
import { QuantityInput, type QuantityValue } from "./quantity-input";

interface FoodDetailPanelProps {
  food: NormalizedFoodSummary | null;
  nutrition: NormalizedNutrition | null;
  isLoadingDetail: boolean;
  error: string | null;
  onClear: () => void;
  onRetry: () => void;
}

function formatQuantityLabel(value: QuantityValue): string {
  const unitLabel = value.unit === "serving" && value.quantity !== 1
    ? `${UNIT_SHORT_LABELS.serving}s`
    : UNIT_SHORT_LABELS[value.unit];
  return `${value.quantity} ${unitLabel}`;
}

function NutritionGrid({ nutrition }: { nutrition: NormalizedNutrition }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MACRO_KEYS.map((key) => (
        <MacroStatCard key={key} macroKey={key} value={nutrition[key]} />
      ))}
    </div>
  );
}

export function FoodDetailPanel({
  food,
  nutrition,
  isLoadingDetail,
  error,
  onClear,
  onRetry,
}: FoodDetailPanelProps) {
  const [quantityValue, setQuantityValue] = useState<QuantityValue | null>(null);

  const handleQuantityChange = useCallback((value: QuantityValue | null) => {
    setQuantityValue(value);
  }, []);

  if (!food && !isLoadingDetail && !error) return null;

  if (isLoadingDetail && !nutrition) {
    return <FoodDetailSkeleton food={food} />;
  }

  const scaledNutrition =
    nutrition && quantityValue?.isValid
      ? scaleNutrition(nutrition, quantityValue.effectiveGrams)
      : null;

  return (
    <Card className="overflow-hidden border-brand-200 p-0">
      <div className="border-t-4 border-brand-700 px-5 pt-5">
        <div className="flex items-center gap-2">
          <ScaleIcon className="h-5 w-5 text-brand-700" />
          <h2 className="text-lg font-bold text-gray-900">Configure Addition</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">Set quantity and add to your meal</p>
      </div>

      <div className="px-5 pb-5">
        {food ? <FoodInfoHeader food={food} className="mt-4" /> : null}

        {error && food ? (
          <Alert
            variant="error"
            title="Could not load details"
            action={
              <Button variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            }
            className="mt-4"
          >
            {error}
          </Alert>
        ) : null}

        {nutrition && food ? (
          <>
            <div className="mt-4 hidden rounded-xl bg-surface-muted p-4 sm:block">
              <p className="mb-2 text-sm font-semibold text-gray-900">Nutrition per 100g</p>
              <NutritionGrid nutrition={nutrition} />
            </div>

            <div className="mt-5 rounded-2xl bg-surface-muted p-4">
              <QuantityInput food={food} onChange={handleQuantityChange} disabled={isLoadingDetail} />
            </div>

            {scaledNutrition && quantityValue ? (
              <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">
                  Nutrition for {formatQuantityLabel(quantityValue)}
                  <span className="font-normal text-gray-600">
                    {" "}
                    ({Math.round(quantityValue.effectiveGrams)}g)
                  </span>
                </p>
                <NutritionGrid nutrition={scaledNutrition} />
              </div>
            ) : null}

            <AddToMealButton
              food={food}
              nutrition={nutrition}
              quantityValue={quantityValue}
              disabled={isLoadingDetail}
            />
          </>
        ) : null}

        {food ? (
          <div className="mt-3">
            <Button variant="ghost" onClick={onClear} className="px-0 text-gray-500">
              Clear selection
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
