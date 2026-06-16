"use client";

import { Input } from "@/components/ui/input";
import { UtensilsIcon } from "@/components/ui/icons";
import type { KeyboardEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-activedescendant"?: string;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  isLoading,
  disabled,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-activedescendant": ariaActiveDescendant,
}: SearchInputProps) {
  return (
    <div className="relative">
      <label htmlFor="food-search" className="sr-only">
        Search foods
      </label>
      <UtensilsIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        id="food-search"
        type="search"
        role="combobox"
        placeholder="Search protein, grains, veg..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-describedby="food-search-hint"
        aria-autocomplete="list"
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-activedescendant={ariaActiveDescendant}
        autoComplete="off"
        className="rounded-xl border-gray-200 bg-surface-muted py-3 pl-10 pr-4"
      />
      <p id="food-search-hint" className="mt-2 text-xs text-gray-500">
        Type at least 2 characters. USDA FoodData Central. Arrow keys, Enter, Escape.
      </p>
      {isLoading ? (
        <span className="sr-only" aria-live="polite">
          Searching USDA database
        </span>
      ) : null}
    </div>
  );
}
