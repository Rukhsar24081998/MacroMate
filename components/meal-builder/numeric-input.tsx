"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface NumericInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
  min?: number;
  max?: number;
  step?: number;
}

export function NumericInput({
  id,
  value,
  onChange,
  disabled,
  error,
  min = 0.1,
  max,
  step = 1,
}: NumericInputProps) {
  return (
    <div>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(error && "border-red-500 focus:border-red-500 focus:ring-red-500")}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
