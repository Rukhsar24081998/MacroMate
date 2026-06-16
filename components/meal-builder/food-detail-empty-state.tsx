import { EmptyState } from "./empty-state";
import { SearchIcon } from "@/components/ui/icons";

export function FoodDetailEmptyState() {
  return (
    <EmptyState
      icon={<SearchIcon className="h-5 w-5" />}
      title="Select a food to see nutrition details."
      className="min-h-[180px] justify-center py-8"
    />
  );
}
