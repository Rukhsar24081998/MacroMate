"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_GRAMS_OR_ML, MAX_SERVINGS } from "@/lib/nutrition/constants";
import { useMeal } from "@/lib/hooks/use-meal";
import { parseQuantityInput, validateQuantity } from "@/lib/nutrition/validate";
import type { Ingredient, Unit } from "@/types/ingredient";
import { IngredientInfo } from "./ingredient-info";
import { IngredientMacros } from "./ingredient-macros";
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
    <li className="rounded-lg border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <IngredientInfo ingredient={ingredient} />
        <div className="flex shrink-0 gap-2 self-end sm:self-start">
          {!isEditing ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="min-h-11 px-3 text-sm"
              aria-label={`Edit quantity for ${ingredient.name}`}
            >
              Edit
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeIngredient(ingredient.id)}
            className="min-h-11 px-3 text-sm text-red-700 hover:bg-red-50 hover:text-red-800"
            aria-label={`Remove ${ingredient.name}`}
          >
            Remove
          </Button>
        </div>
      </div>

      {!isEditing ? <IngredientMacros ingredient={ingredient} /> : null}

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
