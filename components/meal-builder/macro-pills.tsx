import { formatNutrientValue } from "@/lib/nutrition/format";
import { cn } from "@/lib/utils/cn";

interface MacroPillsProps {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  className?: string;
}

const CHIP =
  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ring-1";

/** Compact macro chips for ingredient rows and food preview. */
export function MacroPills({
  calories,
  protein,
  carbohydrates,
  fat,
  className,
}: MacroPillsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      <span className={cn(CHIP, "bg-gray-900/5 text-gray-900 ring-gray-200/80")}>
        {calories != null ? `${formatNutrientValue("calories", calories)} kcal` : "— kcal"}
      </span>
      <span className={cn(CHIP, "bg-brand-50 text-brand-800 ring-brand-100")}>
        P {formatNutrientValue("protein", protein)}
      </span>
      <span className={cn(CHIP, "bg-blue-50 text-blue-800 ring-blue-100")}>
        C {formatNutrientValue("carbohydrates", carbohydrates)}
      </span>
      <span className={cn(CHIP, "bg-amber-50 text-amber-900 ring-amber-100")}>
        F {formatNutrientValue("fat", fat)}
      </span>
    </div>
  );
}
