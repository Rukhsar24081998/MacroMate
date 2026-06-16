"use client";

import { useContext } from "react";
import { MealContext } from "@/providers/meal-provider";
import type { MealState } from "@/types/state";

export function useMeal(): MealState {
  const context = useContext(MealContext);
  if (context == null) {
    throw new Error("useMeal must be used within a MealProvider");
  }
  return context;
}
