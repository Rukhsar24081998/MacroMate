import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 5;

export function SearchResultsSkeleton() {
  return (
    <Card
      className="mt-4 overflow-hidden p-0"
      aria-busy="true"
      aria-label="Loading search results"
    >
      <ul className="divide-y divide-gray-100" aria-hidden="true">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <li key={index} className="px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
