import type { NormalizedFoodSummary } from "@/types/food";

interface SearchResultItemProps {
  food: NormalizedFoodSummary;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (fdcId: number) => void;
}

function dataTypeBadgeClass(dataType: string): string {
  if (dataType === "Foundation") return "bg-green-100 text-green-800";
  if (dataType === "SR Legacy") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

export function SearchResultItem({
  food,
  isSelected,
  isHighlighted,
  onSelect,
}: SearchResultItemProps) {
  const isActive = isSelected || isHighlighted;

  return (
    <li role="option" id={`search-result-${food.fdcId}`} aria-selected={isSelected}>
      <button
        type="button"
        onClick={() => onSelect(food.fdcId)}
        className={`w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
          isActive ? "bg-gray-100 ring-1 ring-gray-300" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{food.description}</p>
            {food.brandOwner ? (
              <p className="mt-0.5 truncate text-sm text-gray-600">{food.brandOwner}</p>
            ) : null}
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${dataTypeBadgeClass(food.dataType)}`}
          >
            {food.dataType}
          </span>
        </div>
      </button>
    </li>
  );
}
