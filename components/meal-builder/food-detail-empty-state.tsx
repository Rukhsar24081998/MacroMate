import { SearchIcon } from "@/components/ui/icons";

export function FoodDetailEmptyState() {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-surface-muted/50 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <h2 className="text-base font-semibold text-gray-900">No food selected</h2>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        Search and select an ingredient to view nutrition, set quantity, and add it to your meal.
      </p>
    </div>
  );
}
