import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface MealBuilderLayoutShellProps {
  searchColumn: ReactNode;
  detailColumn: ReactNode;
  mealColumn: ReactNode;
}

function DashboardColumn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,74,54,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MealBuilderLayoutShell({
  searchColumn,
  detailColumn,
  mealColumn,
}: MealBuilderLayoutShellProps) {
  return (
    <>
      <div className="meal-builder-dashboard hidden lg:grid lg:h-[calc(100dvh-4.5rem)] lg:min-h-0 lg:grid-cols-[minmax(0,28%)_minmax(0,34%)_minmax(0,38%)] lg:gap-4 lg:overflow-hidden">
        <DashboardColumn>{searchColumn}</DashboardColumn>
        <DashboardColumn>{detailColumn}</DashboardColumn>
        <DashboardColumn className="border-brand-100/50 bg-gradient-to-b from-brand-50/20 to-white">
          {mealColumn}
        </DashboardColumn>
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm">
          {searchColumn}
        </div>
        <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm">
          {detailColumn}
        </div>
        <div className="rounded-2xl border border-brand-100/50 bg-gradient-to-b from-brand-50/20 to-white p-4 shadow-sm">
          {mealColumn}
        </div>
      </div>
    </>
  );
}
