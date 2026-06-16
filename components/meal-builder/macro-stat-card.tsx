import { cn } from "@/lib/utils/cn";
import { MACRO_LABELS } from "@/lib/nutrition/constants";
import {
  formatNutrientWithUnit,
  MISSING_NUTRIENT_TITLE,
} from "@/lib/nutrition/format";
import type { MacroKey } from "@/types/nutrition";

interface MacroStatCardProps {
  macroKey: MacroKey;
  value: number | null;
  label?: string;
  emphasized?: boolean;
  className?: string;
}

export function MacroStatCard({
  macroKey,
  value,
  label,
  emphasized = false,
  className,
}: MacroStatCardProps) {
  const displayLabel = label ?? MACRO_LABELS[macroKey];
  const isMissing = value == null;

  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2",
        emphasized ? "bg-brand-800 text-white" : "bg-white",
        className,
      )}
      title={isMissing ? MISSING_NUTRIENT_TITLE : undefined}
    >
      <p
        className={cn(
          "text-xs font-medium uppercase tracking-wide",
          emphasized ? "text-brand-100" : "text-gray-500",
        )}
      >
        {displayLabel}
      </p>
      <p
        className={cn(
          "font-semibold",
          emphasized ? "text-lg text-white" : "text-gray-900",
        )}
      >
        {formatNutrientWithUnit(macroKey, value)}
      </p>
    </div>
  );
}
