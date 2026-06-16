"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyIngredientQuantityUpdate,
  createIngredientFromPayload,
} from "@/lib/nutrition/ingredient";
import { calculateMealTotals } from "@/lib/nutrition/calculate";
import { loadMealFromSession, saveMealToSession } from "@/lib/storage/meal-session";
import type { AddIngredientPayload, Ingredient, Unit } from "@/types/ingredient";
import type { MealState } from "@/types/state";

export const MealContext = createContext<MealState | null>(null);

export function MealProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    setIngredients(loadMealFromSession());
    setHasRestored(true);
  }, []);

  useEffect(() => {
    if (!hasRestored) return;
    saveMealToSession(ingredients);
  }, [ingredients, hasRestored]);

  const addIngredient = useCallback((payload: AddIngredientPayload) => {
    setIngredients((prev) => [...prev, createIngredientFromPayload(payload)]);
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateIngredient = useCallback((id: string, quantity: number, unit: Unit) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        try {
          return applyIngredientQuantityUpdate(item, quantity, unit);
        } catch {
          return item;
        }
      }),
    );
  }, []);

  const clearMeal = useCallback(() => {
    setIngredients([]);
  }, []);

  const totals = useMemo(() => calculateMealTotals(ingredients), [ingredients]);

  const value = useMemo<MealState>(
    () => ({
      ingredients,
      totals,
      addIngredient,
      removeIngredient,
      updateIngredient,
      clearMeal,
    }),
    [ingredients, totals, addIngredient, removeIngredient, updateIngredient, clearMeal],
  );

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
}
