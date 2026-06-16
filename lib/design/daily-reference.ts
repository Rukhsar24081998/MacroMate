import type { MacroKey } from "@/types/nutrition";

/** Display-only daily reference values for progress bars (not user-configurable in MVP). */
export const DAILY_MACRO_REFERENCE: Record<MacroKey, number> = {
  calories: 2000,
  protein: 150,
  carbohydrates: 250,
  fat: 65,
  fiber: 28,
};

export function macroProgressPercent(key: MacroKey, value: number | null): number {
  if (value == null || value <= 0) return 0;
  const reference = DAILY_MACRO_REFERENCE[key];
  return Math.min(100, Math.round((value / reference) * 100));
}
