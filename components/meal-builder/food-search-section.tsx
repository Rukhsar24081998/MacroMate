"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useFoodSearch } from "@/lib/hooks/use-food-search";
import { useSearchKeyboard } from "@/lib/hooks/use-search-keyboard";
import {
  shouldShowAliasNotice,
  shouldShowEmptyResults,
  shouldShowSearchSkeleton,
} from "@/lib/search/search-ui";
import { FoodDetailPanel } from "./food-detail-panel";
import { SearchAliasNotice } from "./search-alias-notice";
import { SearchEmptyResults } from "./search-empty-results";
import { SearchInput } from "./search-input";
import { SearchResultsList } from "./search-results-list";
import { SearchResultsSkeleton } from "./search-results-skeleton";
import { SearchStatus } from "./search-status";

export function FoodSearchSection() {
  const search = useFoodSearch();
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

  return (
    <section aria-label="Food search">
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

      <div className="mt-4" aria-live="polite">
        <SearchStatus
          queryLength={queryLength}
          error={search.error}
          onRetry={search.retrySearch}
        />
      </div>

      {showSearchSkeleton ? <SearchResultsSkeleton /> : null}

      {showAliasNotice ? (
        <SearchAliasNotice
          normalizedQuery={search.searchNormalization!.normalizedQuery}
        />
      ) : null}

      {showEmptyResults ? <SearchEmptyResults /> : null}

      {showResults ? (
        <Card id="food-search-results" className="mt-4 overflow-hidden p-0">
          <SearchResultsList
            foods={search.results}
            selectedFdcId={search.selectedFood?.fdcId ?? null}
            highlightedIndex={highlightedIndex}
            onSelect={(fdcId) => void search.selectFood(fdcId)}
          />
        </Card>
      ) : null}

      <FoodDetailPanel
        food={search.selectedFood}
        nutrition={search.selectedNutrition}
        isLoadingDetail={search.isLoadingDetail}
        error={search.detailError}
        onClear={search.clearSelection}
        onRetry={search.retryDetail}
      />
    </section>
  );
}
