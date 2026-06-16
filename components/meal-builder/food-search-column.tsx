"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchKeyboard } from "@/lib/hooks/use-search-keyboard";
import {
  shouldShowAliasNotice,
  shouldShowEmptyResults,
  shouldShowSearchSkeleton,
} from "@/lib/search/search-ui";
import type { FoodSearchState } from "@/types/state";
import { ColumnHeader } from "./column-header";
import { SearchAliasNotice } from "./search-alias-notice";
import { SearchEmptyResults } from "./search-empty-results";
import { SearchInput } from "./search-input";
import { SearchResultsList } from "./search-results-list";
import { SearchResultsSkeleton } from "./search-results-skeleton";
import { SearchStatus } from "./search-status";

interface FoodSearchColumnProps {
  search: FoodSearchState;
}

export function FoodSearchColumn({ search }: FoodSearchColumnProps) {
  const [resultsDismissed, setResultsDismissed] = useState(false);
  const queryLength = search.query.trim().length;
  const hasError = search.error != null;

  useEffect(() => {
    setResultsDismissed(false);
  }, [search.query, search.results]);

  const showResults =
    !search.isSearching &&
    !hasError &&
    search.results.length > 0 &&
    !resultsDismissed;

  const showSearchSkeleton = shouldShowSearchSkeleton({
    isSearching: search.isSearching,
    hasError,
    queryLength,
  });

  const showAliasNotice = shouldShowAliasNotice({
    aliasApplied: search.searchNormalization?.aliasApplied === true,
    isSearching: search.isSearching,
    hasError,
    hasSearched: search.hasSearched,
  });

  const showEmptyResults = shouldShowEmptyResults({
    isSearching: search.isSearching,
    hasError,
    hasSearched: search.hasSearched,
    resultsCount: search.results.length,
    queryLength,
  });

  const handleSelectIndex = useCallback(
    (index: number) => {
      const food = search.results[index];
      if (food) void search.selectFood(food.fdcId);
    },
    [search],
  );

  const { highlightedIndex, handleKeyDown } = useSearchKeyboard({
    resultCount: search.results.length,
    isActive: showResults,
    onSelectIndex: handleSelectIndex,
    onDismiss: () => setResultsDismissed(true),
  });

  const resultMeta = showResults
    ? `${search.results.length} result${search.results.length === 1 ? "" : "s"}`
    : search.isSearching
      ? "Searching…"
      : undefined;

  return (
    <section aria-label="Food search" className="flex h-full min-h-0 flex-col">
      <ColumnHeader title="Find ingredients" meta={resultMeta} />

      <div className="shrink-0">
        <SearchInput
          value={search.query}
          onChange={search.setQuery}
          onKeyDown={handleKeyDown}
          isLoading={search.isSearching}
          aria-controls="food-search-results"
          aria-expanded={showResults}
          aria-activedescendant={
            showResults && highlightedIndex >= 0
              ? `search-result-${search.results[highlightedIndex]?.fdcId}`
              : undefined
          }
        />
      </div>

      <div className="mt-2 shrink-0" aria-live="polite">
        <SearchStatus
          queryLength={queryLength}
          error={search.error}
          onRetry={search.retrySearch}
        />
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto scroll-smooth">
        {showSearchSkeleton ? <SearchResultsSkeleton /> : null}

        {showAliasNotice ? (
          <SearchAliasNotice normalizedQuery={search.searchNormalization!.normalizedQuery} />
        ) : null}

        {showEmptyResults ? <SearchEmptyResults /> : null}

        {showResults ? (
          <div id="food-search-results" className="pb-2">
            <SearchResultsList
              foods={search.results}
              selectedFdcId={search.selectedFood?.fdcId ?? null}
              highlightedIndex={highlightedIndex}
              onSelect={(fdcId) => void search.selectFood(fdcId)}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
