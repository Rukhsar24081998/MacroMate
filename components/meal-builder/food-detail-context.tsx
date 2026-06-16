import {
  BowlIllustration,
  ClipboardIcon,
  LeafIcon,
  LightbulbIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import type { NormalizedFoodSummary } from "@/types/food";

interface FoodDetailContextProps {
  food: NormalizedFoodSummary;
  className?: string;
}

function formatReferenceBasis(food: NormalizedFoodSummary): string {
  if (food.householdServingFullText && food.servingSize != null) {
    const unit = food.servingSizeUnit ?? "g";
    return `${food.householdServingFullText} (${food.servingSize} ${unit})`;
  }

  if (food.servingSize != null && food.dataType === "Branded") {
    const unit = food.servingSizeUnit ?? "g";
    return `per serving (${food.servingSize} ${unit})`;
  }

  if (food.dataType === "Foundation" || food.dataType === "SR Legacy") {
    return "per 100g";
  }

  return food.servingSize != null
    ? `per serving (${food.servingSize} ${food.servingSizeUnit ?? "g"})`
    : "per 100g";
}

function formatCategory(food: NormalizedFoodSummary): string {
  if (food.foodCategory) return food.foodCategory;
  if (food.dataType === "Foundation") return "Foundation Foods";
  if (food.dataType === "SR Legacy") return "SR Legacy Foods";
  return food.dataType;
}

function aboutDescription(food: NormalizedFoodSummary): string {
  const category = formatCategory(food);
  return `${food.description} is listed under ${category} in USDA FoodData Central. Values shown are scaled from the reference amount below.`;
}

export function FoodDetailContext({ food, className }: FoodDetailContextProps) {
  const referenceBasis = formatReferenceBasis(food);

  return (
    <div className={cn("space-y-3 pt-1", className)}>
      <section
        aria-label="About this food"
        className="rounded-xl border border-brand-100/80 bg-brand-50/50 p-3.5"
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <LeafIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900">About this food</h4>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{aboutDescription(food)}</p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-1 gap-2.5 border-t border-brand-100/70 pt-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 min-w-0">
            <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Category
              </dt>
              <dd className="truncate text-xs font-medium text-gray-700">{formatCategory(food)}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2 min-w-0">
            <ClipboardIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Reference basis
              </dt>
              <dd className="truncate text-xs font-medium text-gray-700">{referenceBasis}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2 min-w-0 sm:col-span-2">
            <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
            <div className="min-w-0">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Data source
              </dt>
              <dd className="text-xs font-medium text-gray-700">USDA FoodData Central</dd>
            </div>
          </div>
        </dl>
      </section>

      <section
        aria-label="Tip"
        className="rounded-xl border border-blue-100/80 bg-blue-50/40 p-3.5"
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <LightbulbIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900">Tip</h4>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              Enter a quantity and click Add To Meal to include this ingredient in your meal
              summary.
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-1 pb-2 text-brand-600/25" aria-hidden="true">
        <BowlIllustration className="h-16 w-24 max-w-full" />
      </div>
    </div>
  );
}
