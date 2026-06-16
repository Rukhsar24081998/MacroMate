import { Skeleton } from "@/components/ui/skeleton";
import type { NormalizedFoodSummary } from "@/types/food";

interface FoodDetailSkeletonProps {
  food?: NormalizedFoodSummary | null;
}

export function FoodDetailSkeleton({ food }: FoodDetailSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading food details" className="space-y-4">
      {food ? (
        <div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="mt-3 h-7 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      ) : (
        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
      )}

      <div className="grid grid-cols-5 gap-2" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-16 rounded-xl" />
        ))}
      </div>

      <div className="space-y-2 rounded-xl bg-surface-muted p-4" aria-hidden="true">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
