import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type AlertVariant = "error" | "info" | "empty";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  empty: "border-gray-200 bg-surface-muted text-gray-600",
};

export function Alert({
  variant = "info",
  title,
  children,
  action,
  className,
}: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      <p>{children}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
