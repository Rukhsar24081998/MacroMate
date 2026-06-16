import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200/90 bg-surface-muted/40 px-5 py-8 text-center transition-colors duration-200",
        className,
      )}
    >
      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-100">
        {icon}
      </div>
      <p className="max-w-[260px] text-[13px] font-medium leading-relaxed text-gray-600">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}
