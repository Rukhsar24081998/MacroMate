import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NormalizedFoodSummary } from "@/types/food";
import { FoodInfoHeader } from "./food-info-header";

interface FoodDetailSkeletonProps {
  food?: NormalizedFoodSummary | null;
}

export function FoodDetailSkeleton({ food }: FoodDetailSkeletonProps) {
  return (
    <Card className="mt-4" aria-busy="true" aria-label="Loading food details">
      {food ? <FoodInfoHeader food={food} /> : null}

      <div className={`space-y-4 ${food ? "mt-4" : ""}`} aria-hidden="true">
        {!food ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 p-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </Card>
  );
}
