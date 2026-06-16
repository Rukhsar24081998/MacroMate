import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,74,54,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
