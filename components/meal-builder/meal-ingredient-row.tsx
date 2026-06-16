"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";
import { calculateIngredientNutrition } from "@/lib/nutrition/calculate";
import { MAX_GRAMS_OR_ML, MAX_SERVINGS } from "@/lib/nutrition/constants";
import { formatNutrientWithUnit } from "@/lib/nutrition/format";
import { useMeal } from "@/lib/hooks/use-meal";
import { parseQuantityInput, validateQuantity } from "@/lib/nutrition/validate";
import type { Ingredient, Unit } from "@/types/ingredient";
import { FoodAvatar } from "./food-avatar";
import { formatIngredientQuantity } from "./ingredient-info";
import { NumericInput } from "./numeric-input";
import { UnitSelector } from "./unit-selector";

interface MealIngredientRowProps {
  ingredient: Ingredient;
}

export function MealIngredientRow({ ingredient }: MealIngredientRowProps) {
  const { removeIngredient, updateIngredient } = useMeal();
  const [quantityInput, setQuantityInput] = useState(String(ingredient.quantity));
  const [unit, setUnit] = useState<Unit>(ingredient.unit);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setQuantityInput(String(ingredient.quantity));
    setUnit(ingredient.unit);
  }, [ingredient.quantity, ingredient.unit, ingredient.id]);

  const parsedQuantity = parseQuantityInput(quantityInput);
  const validationError = validateQuantity(
    parsedQuantity,
    unit,
    ingredient.servingSizeGrams,
  );
  const servingAvailable = ingredient.servingSizeGrams != null;
  const nutrition = calculateIngredientNutrition(ingredient);

  const commitChanges = useCallback(() => {
    if (validationError != null) return;
    if (parsedQuantity === ingredient.quantity && unit === ingredient.unit) {
      setIsEditing(false);
      return;
    }
    updateIngredient(ingredient.id, parsedQuantity, unit);
    setIsEditing(false);
  }, [
    validationError,
    parsedQuantity,
    unit,
    ingredient.quantity,
    ingredient.unit,
    ingredient.id,
    updateIngredient,
  ]);

  const numericMax = unit === "serving" ? MAX_SERVINGS : MAX_GRAMS_OR_ML;
  const numericStep = unit === "serving" ? 0.5 : unit === "ml" ? 10 : 1;
  const inputId = `ingredient-quantity-${ingredient.id}`;

  return (
    <li className="group rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow duration-150 hover:border-gray-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <FoodAvatar name={ingredient.name} className="h-10 w-10 shrink-0 text-xs" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold leading-snug text-gray-900">
              {ingredient.name}
            </p>
            {nutrition.calories != null ? (
              <span className="shrink-0 text-sm font-bold tabular-nums text-gray-900">
                {formatNutrientWithUnit("calories", nutrition.calories)}
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              {formatIngredientQuantity(ingredient)}
              {nutrition.protein != null ? (
                <span className="font-medium text-brand-700">
                  {" · "}
                  {formatNutrientWithUnit("protein", nutrition.protein)} protein
                </span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={() => removeIngredient(ingredient.id)}
              className="shrink-0 rounded-md p-1.5 text-gray-300 opacity-100 transition-colors hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
              aria-label={`Remove ${ingredient.name}`}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {!isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-2 text-xs font-medium text-brand-700 underline-offset-2 hover:underline"
          aria-label={`Edit quantity for ${ingredient.name}`}
        >
          Edit quantity
        </button>
      ) : null}

      {isEditing ? (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <label htmlFor={inputId} className="mb-2 block text-xs font-medium text-gray-600">
              Quantity
            </label>
            <NumericInput
              id={inputId}
              value={quantityInput}
              onChange={setQuantityInput}
              error={validationError}
              min={0.1}
              max={numericMax}
              step={numericStep}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-gray-600">Unit</p>
            <UnitSelector
              unit={unit}
              onUnitChange={setUnit}
              servingAvailable={servingAvailable}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setQuantityInput(String(ingredient.quantity));
                setUnit(ingredient.unit);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={commitChanges} disabled={validationError != null}>
              Save
            </Button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
