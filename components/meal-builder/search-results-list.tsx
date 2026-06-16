import type { NormalizedFoodSummary } from "@/types/food";
import { SearchResultItem } from "./search-result-item";

interface SearchResultsListProps {
  foods: NormalizedFoodSummary[];
  selectedFdcId: number | null;
  highlightedIndex: number;
  onSelect: (fdcId: number) => void;
}

export function SearchResultsList({
  foods,
  selectedFdcId,
  highlightedIndex,
  onSelect,
}: SearchResultsListProps) {
  if (foods.length === 0) return null;

  return (
    <ul role="listbox" aria-label="Food search results" className="divide-y divide-gray-100">
      {foods.map((food, index) => (
        <SearchResultItem
          key={food.fdcId}
          food={food}
          isSelected={food.fdcId === selectedFdcId}
          isHighlighted={index === highlightedIndex}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
