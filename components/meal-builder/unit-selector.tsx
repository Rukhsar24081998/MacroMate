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

export const SERVING_UNAVAILABLE_MESSAGE = "Serving size unavailable for this food.";

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
        const isServingUnavailable = isServing && !servingAvailable;
        const isOptionDisabled = Boolean(disabled) || isServingUnavailable;
        const isSelected = unit === option && !isServingUnavailable;

        const buttonClass = cn(
          "w-full rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
          isSelected
            ? "border-brand-800 bg-brand-800 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
          isServingUnavailable &&
            "border-gray-200 bg-gray-50 text-gray-400 opacity-40 shadow-none hover:bg-gray-50",
          disabled && !isServingUnavailable && "cursor-not-allowed opacity-50",
        );

        if (isServingUnavailable) {
          return (
            <span
              key={option}
              className="relative flex flex-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1"
              title={SERVING_UNAVAILABLE_MESSAGE}
              tabIndex={disabled ? -1 : 0}
              aria-disabled="true"
              aria-label={`${UNIT_LABELS[option]} — ${SERVING_UNAVAILABLE_MESSAGE}`}
            >
              <span
                aria-hidden="true"
                className={cn(buttonClass, "pointer-events-none block select-none text-center")}
              >
                {UNIT_LABELS[option]}
              </span>
            </span>
          );
        }

        return (
          <button
            key={option}
            type="button"
            onClick={() => onUnitChange(option)}
            disabled={isOptionDisabled}
            aria-pressed={isSelected}
            className={cn(buttonClass, "flex-1")}
          >
            {UNIT_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
