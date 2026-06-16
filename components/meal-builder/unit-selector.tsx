"use client";

import { cn } from "@/lib/utils/cn";
import { UNIT_LABELS } from "@/lib/nutrition/constants";
import type { Unit } from "@/types/ingredient";

interface UnitSelectorProps {
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
  servingAvailable: boolean;
  disabled?: boolean;
}

const UNITS: Unit[] = ["g", "ml", "serving"];

export function UnitSelector({
  unit,
  onUnitChange,
  servingAvailable,
  disabled,
}: UnitSelectorProps) {
  return (
    <div role="group" aria-label="Unit" className="flex gap-2">
      {UNITS.map((option) => {
        const isServing = option === "serving";
        const isDisabled = disabled || (isServing && !servingAvailable);
        const isSelected = unit === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onUnitChange(option)}
            disabled={isDisabled}
            aria-pressed={isSelected}
            title={
              isServing && !servingAvailable
                ? "Serving size not available for this food"
                : undefined
            }
            className={cn(
              "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
              isSelected
                ? "border-brand-800 bg-brand-800 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              isDisabled && "cursor-not-allowed opacity-50",
            )}
          >
            {UNIT_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
