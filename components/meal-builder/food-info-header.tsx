import type { NormalizedFoodSummary } from "@/types/food";

interface FoodInfoHeaderProps {
  food: NormalizedFoodSummary;
}

function dataTypeBadgeClass(dataType: string): string {
  if (dataType === "Foundation") return "bg-green-100 text-green-800";
  if (dataType === "SR Legacy") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-700";
}

export function FoodInfoHeader({ food }: FoodInfoHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{food.description}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${dataTypeBadgeClass(food.dataType)}`}
        >
          {food.dataType}
        </span>
      </div>
      {food.brandOwner ? (
        <p className="mt-1 text-sm text-gray-500">{food.brandOwner}</p>
      ) : null}
      {food.householdServingFullText ? (
        <p className="mt-1 text-sm text-gray-500">
          Serving: {food.householdServingFullText}
        </p>
      ) : null}
    </div>
  );
}
