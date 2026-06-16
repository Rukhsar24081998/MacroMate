import { FoodAvatar } from "./food-avatar";
import type { NormalizedFoodSummary } from "@/types/food";

interface SearchResultItemProps {
  food: NormalizedFoodSummary;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (fdcId: number) => void;
}

function dataTypeSubtitle(dataType: string): string {
  if (dataType === "Foundation") return "Foundation · per 100g";
  if (dataType === "SR Legacy") return "SR Legacy · per 100g";
  return `${dataType} · per 100g`;
}

export function SearchResultItem({
  food,
  isSelected,
  isHighlighted,
  onSelect,
}: SearchResultItemProps) {
  return (
    <li role="option" id={`search-result-${food.fdcId}`} aria-selected={isSelected}>
      <button
        type="button"
        onClick={() => onSelect(food.fdcId)}
        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all hover:border-brand-200 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
          isSelected
            ? "border-brand-500 bg-brand-50 shadow-sm"
            : isHighlighted
              ? "border-brand-200 bg-brand-50/60"
              : "border-gray-100 bg-white"
        }`}
      >
        <FoodAvatar name={food.description} className="h-10 w-10 text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{food.description}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {food.brandOwner ?? dataTypeSubtitle(food.dataType)}
          </p>
        </div>
        {isSelected ? (
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
        ) : null}
      </button>
    </li>
  );
}
