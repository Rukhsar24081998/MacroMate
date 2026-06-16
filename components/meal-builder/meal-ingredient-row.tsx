"use client";

import { useCallback, useEffect, useState } from "react";
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
import { CloseIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

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
    <li className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <FoodAvatar name={ingredient.name} className="h-10 w-10 text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{ingredient.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {formatIngredientQuantity(ingredient)}
            {nutrition.calories != null
              ? ` · ${formatNutrientWithUnit("calories", nutrition.calories)}`
              : ""}
          </p>
          {nutrition.protein != null ? (
            <p className="mt-0.5 text-xs font-semibold text-brand-700">
              {formatNutrientWithUnit("protein", nutrition.protein)} protein
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => removeIngredient(ingredient.id)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label={`Remove ${ingredient.name}`}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {!isEditing ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="mt-2 h-auto px-0 py-1 text-xs text-brand-700"
          aria-label={`Edit quantity for ${ingredient.name}`}
        >
          Edit quantity
        </Button>
      ) : null}

      {isEditing ? (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700">
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
            <p className="mb-2 text-sm font-medium text-gray-700">Unit</p>
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
