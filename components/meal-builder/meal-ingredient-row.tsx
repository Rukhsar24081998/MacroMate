"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";
import { calculateIngredientNutrition } from "@/lib/nutrition/calculate";
import { MAX_GRAMS_OR_ML, MAX_SERVINGS } from "@/lib/nutrition/constants";
import { useMeal } from "@/lib/hooks/use-meal";
import { parseQuantityInput, validateQuantity } from "@/lib/nutrition/validate";
import type { Ingredient, Unit } from "@/types/ingredient";
import { FoodAvatar } from "./food-avatar";
import { formatIngredientQuantity } from "./ingredient-info";
import { MacroPills } from "./macro-pills";
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
    <li className="group rounded-lg border border-gray-100 bg-white px-2.5 py-2 shadow-sm transition-all duration-150 hover:border-gray-200 hover:shadow-md">
      <div className="flex items-start gap-2.5">
        <FoodAvatar name={ingredient.name} className="h-8 w-8 shrink-0 text-[10px]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[13px] font-semibold leading-snug text-gray-900">
              {ingredient.name}
            </p>
            <button
              type="button"
              onClick={() => removeIngredient(ingredient.id)}
              className="-mr-1 shrink-0 rounded-md p-1 text-gray-300 opacity-100 transition-colors hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
              aria-label={`Remove ${ingredient.name}`}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500">{formatIngredientQuantity(ingredient)}</p>
          <MacroPills
            className="mt-1.5"
            calories={nutrition.calories}
            protein={nutrition.protein}
            carbohydrates={nutrition.carbohydrates}
            fat={nutrition.fat}
          />
        </div>
      </div>

      {!isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-1.5 text-[11px] font-medium text-brand-700 underline-offset-2 transition-colors hover:text-brand-800 hover:underline"
          aria-label={`Edit quantity for ${ingredient.name}`}
        >
          Edit quantity
        </button>
      ) : null}

      {isEditing ? (
        <div className="mt-2.5 space-y-2.5 border-t border-gray-100 pt-2.5">
          <div>
            <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-medium text-gray-600">
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
            <p className="mb-1.5 text-[11px] font-medium text-gray-600">Unit</p>
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
