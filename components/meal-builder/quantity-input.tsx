"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_QUANTITY, MAX_GRAMS_OR_ML, MAX_SERVINGS } from "@/lib/nutrition/constants";
import { convertToGrams, resolveServingSizeGrams } from "@/lib/nutrition/convert";
import { parseQuantityInput, validateQuantity } from "@/lib/nutrition/validate";
import type { NormalizedFoodSummary } from "@/types/food";
import type { Unit } from "@/types/ingredient";
import { NumericInput } from "./numeric-input";
import { UnitSelector } from "./unit-selector";

export interface QuantityValue {
  quantity: number;
  unit: Unit;
  effectiveGrams: number;
  isValid: boolean;
}

interface QuantityInputProps {
  food: NormalizedFoodSummary;
  onChange?: (value: QuantityValue | null) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function QuantityInput({ food, onChange, disabled, compact }: QuantityInputProps) {
  const [quantityInput, setQuantityInput] = useState(String(DEFAULT_QUANTITY));
  const [unit, setUnit] = useState<Unit>("g");

  const servingSizeGrams = useMemo(
    () => resolveServingSizeGrams(food.servingSize, food.servingSizeUnit),
    [food.servingSize, food.servingSizeUnit],
  );

  const servingAvailable = servingSizeGrams != null;

  useEffect(() => {
    setQuantityInput(String(DEFAULT_QUANTITY));
    setUnit("g");
  }, [food.fdcId]);

  useEffect(() => {
    if (unit === "serving" && !servingAvailable) {
      setUnit("g");
    }
  }, [unit, servingAvailable]);

  const parsedQuantity = parseQuantityInput(quantityInput);
  const validationError = validateQuantity(parsedQuantity, unit, servingSizeGrams);

  const quantityValue = useMemo((): QuantityValue | null => {
    if (validationError != null) return null;
    try {
      const effectiveGrams = convertToGrams(parsedQuantity, unit, servingSizeGrams);
      return {
        quantity: parsedQuantity,
        unit,
        effectiveGrams,
        isValid: true,
      };
    } catch {
      return null;
    }
  }, [parsedQuantity, unit, servingSizeGrams, validationError]);

  useEffect(() => {
    onChange?.(quantityValue);
  }, [quantityValue, onChange]);

  const numericMax = unit === "serving" ? MAX_SERVINGS : MAX_GRAMS_OR_ML;
  const numericStep = unit === "serving" ? 0.5 : unit === "ml" ? 10 : 1;

  const labelClass = compact
    ? "mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500"
    : "mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500";
  const noteClass = compact ? "mt-1 text-[11px] text-gray-500" : "mt-2 text-xs text-gray-500";

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className={compact ? "grid gap-2.5 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="food-quantity" className={labelClass}>
            Quantity
          </label>
          <NumericInput
            id="food-quantity"
            value={quantityInput}
            onChange={setQuantityInput}
            disabled={disabled}
            error={validationError}
            min={0.1}
            max={numericMax}
            step={numericStep}
          />
        </div>

        <div className="min-w-0">
          <p className={labelClass}>Unit</p>
          <UnitSelector
            unit={unit}
            onUnitChange={setUnit}
            servingAvailable={servingAvailable}
            disabled={disabled}
          />
          {unit === "ml" ? (
            <p className={noteClass}>MVP note: milliliters are treated as grams (1 ml ≈ 1 g).</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
