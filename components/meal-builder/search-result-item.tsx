import type { NormalizedFoodSummary } from "@/types/food";

interface SearchResultItemProps {
  food: NormalizedFoodSummary;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (fdcId: number) => void;
}

function dataTypeSubtitle(dataType: string): string {
  if (dataType === "Foundation") return "Foundation food • per 100g";
  if (dataType === "SR Legacy") return "SR Legacy • per 100g";
  return `${dataType} • per 100g`;
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
        className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-brand-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-inset ${
          isActive ? "bg-brand-50 ring-1 ring-inset ring-brand-200" : ""
        }`}
      >
        <p className="truncate font-semibold text-gray-900">{food.description}</p>
        <p className="mt-0.5 truncate text-sm text-gray-500">
          {food.brandOwner ?? dataTypeSubtitle(food.dataType)}
        </p>
      </button>
    </li>
  );
}
