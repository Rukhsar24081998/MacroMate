import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 5;

export function SearchResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading search results" className="space-y-2 pb-2">
      <ul aria-hidden="true">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <li key={index} className="mb-2 rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
