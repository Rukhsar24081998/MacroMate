import { cn } from "@/lib/utils/cn";
import { macroProgressPercent } from "@/lib/design/daily-reference";
import { MACRO_LABELS, MACRO_UNITS } from "@/lib/nutrition/constants";
import {
  formatNutrientValue,
  MISSING_NUTRIENT_TITLE,
} from "@/lib/nutrition/format";
import type { MacroKey } from "@/types/nutrition";

type MacroVariant = "calories" | "protein" | "carbohydrates" | "fat" | "fiber";

const VARIANT_STYLES: Record<
  MacroVariant,
  { card: string; value: string; bar: string; label: string }
> = {
  calories: {
    card: "bg-brand-50 border-brand-100",
    value: "text-brand-800",
    bar: "bg-brand-700",
    label: "text-brand-700/70",
  },
  protein: {
    card: "bg-blue-50 border-blue-100",
    value: "text-macro-protein",
    bar: "bg-macro-protein",
    label: "text-blue-600/70",
  },
  carbohydrates: {
    card: "bg-teal-50 border-teal-100",
    value: "text-macro-carbs",
    bar: "bg-macro-carbs",
    label: "text-teal-700/70",
  },
  fat: {
    card: "bg-rose-50 border-rose-100",
    value: "text-macro-fat",
    bar: "bg-macro-fat",
    label: "text-rose-600/70",
  },
  fiber: {
    card: "bg-slate-50 border-slate-200",
    value: "text-macro-fiber",
    bar: "bg-macro-fiber",
    label: "text-slate-500",
  },
};

interface MacroSummaryCardProps {
  macroKey: MacroKey;
  value: number | null;
  subtitle?: string;
  showProgress?: boolean;
  compact?: boolean;
  className?: string;
}

export function MacroSummaryCard({
  macroKey,
  value,
  subtitle,
  showProgress = true,
  compact = false,
  className,
}: MacroSummaryCardProps) {
  const styles = VARIANT_STYLES[macroKey];
  const isMissing = value == null;
  const progress = macroProgressPercent(macroKey, value);
  const unit = MACRO_UNITS[macroKey];

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        styles.card,
        compact ? "p-3" : "p-4",
        className,
      )}
      title={isMissing ? MISSING_NUTRIENT_TITLE : undefined}
    >
      <p className={cn("text-[11px] font-semibold uppercase tracking-wide", styles.label)}>
        {MACRO_LABELS[macroKey]}
      </p>
      <p className={cn("mt-1 font-bold", compact ? "text-xl" : "text-2xl", styles.value)}>
        {formatNutrientValue(macroKey, value)}
        {!isMissing ? (
          <span className={cn("ml-1 text-sm font-semibold", styles.label)}>{unit}</span>
        ) : null}
      </p>
      {subtitle ? <p className={cn("mt-0.5 text-xs", styles.label)}>{subtitle}</p> : null}
      {showProgress && !isMissing ? (
        <div className={cn("mt-3 h-1.5 overflow-hidden rounded-full bg-white/70", compact && "mt-2")}>
          <div
            className={cn("h-full rounded-full transition-all", styles.bar)}
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
