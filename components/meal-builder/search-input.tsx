"use client";

import { Input } from "@/components/ui/input";
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
      <label htmlFor="food-search" className="mb-2 block text-sm font-medium text-gray-900">
        Search foods
      </label>
      <Input
        id="food-search"
        type="search"
        role="combobox"
        placeholder="e.g. oats, chicken breast, milk"
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
      />
      <p id="food-search-hint" className="mt-1 text-xs text-gray-600">
        Type at least 2 characters. Results from USDA FoodData Central. Use arrow
        keys to navigate results, Enter to select, Escape to close.
      </p>
      {isLoading ? (
        <span className="sr-only" aria-live="polite">
          Searching USDA database
        </span>
      ) : null}
    </div>
  );
}
