import type { MacroKey } from "@/types/nutrition";
import { MACRO_UNITS } from "./constants";

export const MISSING_NUTRIENT_DISPLAY = "—";
export const MISSING_NUTRIENT_TITLE = "Nutrient data unavailable for this item";

/** Format a single nutrient value for display (no unit suffix). */
export function formatNutrientValue(key: MacroKey, value: number | null): string {
  if (value == null) return MISSING_NUTRIENT_DISPLAY;
  if (key === "calories") return Math.round(value).toString();
  return value.toFixed(1);
}

/** Format a nutrient value with its display unit (kcal or g). */
export function formatNutrientWithUnit(key: MacroKey, value: number | null): string {
  const formatted = formatNutrientValue(key, value);
  if (formatted === MISSING_NUTRIENT_DISPLAY) return formatted;
  return `${formatted} ${MACRO_UNITS[key]}`;
}
