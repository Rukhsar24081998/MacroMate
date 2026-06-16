import { EmptyState } from "./empty-state";
import { SearchIcon } from "@/components/ui/icons";

export function FoodDetailEmptyState() {
  return (
    <EmptyState
      icon={<SearchIcon className="h-5 w-5" />}
      title="Select a food"
      description="Choose an item from search results to preview nutrition and set your serving size."
      className="min-h-[240px] justify-center"
    />
  );
}
