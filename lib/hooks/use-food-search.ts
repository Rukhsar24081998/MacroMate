"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { parseApiError } from "@/lib/utils/errors";
import type {
  FoodDetailResponse,
  FoodSearchResponse,
  SearchNormalization,
} from "@/types/api";
import type { NormalizedFoodSummary } from "@/types/food";
import type { NormalizedNutrition } from "@/types/nutrition";
import type { FoodSearchState } from "@/types/state";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export function useFoodSearch(): FoodSearchState {
  const [query, setQuery] = useState("");
  const [searchNormalization, setSearchNormalization] =
    useState<SearchNormalization | null>(null);
  const [results, setResults] = useState<NormalizedFoodSummary[]>([]);
  const [selectedFood, setSelectedFood] = useState<NormalizedFoodSummary | null>(null);
  const [selectedNutrition, setSelectedNutrition] = useState<NormalizedNutrition | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);
  const detailCache = useRef(new Map<number, FoodDetailResponse>());
  const selectedFdcIdRef = useRef<number | null>(null);

  const runSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearchNormalization(null);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams({ q: searchQuery, pageSize: "10" });
      const response = await fetch(`/api/foods/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const data: FoodSearchResponse = await response.json();
      setResults(data.foods);
      setSearchNormalization(data.searchNormalization);
      setHasSearched(true);
    } catch (err) {
      setResults([]);
      setSearchNormalization(null);
      setHasSearched(true);
      if (err instanceof TypeError) {
        setSearchError("Check your internet connection and try again.");
      } else {
        setSearchError(err instanceof Error ? err.message : "Search failed.");
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    void runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const applyPreviewFallback = useCallback(
    (fdcId: number, food: NormalizedFoodSummary | null) => {
      const previewNutrition = food?.previewNutrition;
      if (!previewNutrition || !food) return false;

      const fallback: FoodDetailResponse = { food, nutrition: previewNutrition };
      detailCache.current.set(fdcId, fallback);

      if (selectedFdcIdRef.current === fdcId) {
        setSelectedFood(food);
        setSelectedNutrition(previewNutrition);
        setDetailError(null);
      }
      return true;
    },
    [],
  );

  const fetchDetail = useCallback(
    async (fdcId: number, foodPreview: NormalizedFoodSummary | null) => {
      const cached = detailCache.current.get(fdcId);
      if (cached) {
        setSelectedFood(cached.food);
        setSelectedNutrition(cached.nutrition);
        setDetailError(null);
        return;
      }

      setIsLoadingDetail(true);
      setDetailError(null);
      selectedFdcIdRef.current = fdcId;

      try {
        const response = await fetch(`/api/foods/${fdcId}`);
        if (!response.ok) throw new Error(await parseApiError(response));

        const data: FoodDetailResponse = await response.json();
        detailCache.current.set(fdcId, data);

        if (selectedFdcIdRef.current === fdcId) {
          setSelectedFood(data.food);
          setSelectedNutrition(data.nutrition);
        }
      } catch (err) {
        if (selectedFdcIdRef.current === fdcId) {
          const recovered = applyPreviewFallback(fdcId, foodPreview);
          if (!recovered) {
            setSelectedNutrition(null);
            if (err instanceof TypeError) {
              setDetailError("Check your internet connection and try again.");
            } else {
              setDetailError(
                err instanceof Error ? err.message : "Failed to load food details.",
              );
            }
          }
        }
      } finally {
        if (selectedFdcIdRef.current === fdcId) {
          setIsLoadingDetail(false);
        }
      }
    },
    [applyPreviewFallback],
  );

  const selectFood = useCallback(
    async (fdcId: number) => {
      selectedFdcIdRef.current = fdcId;
      const preview = results.find((f) => f.fdcId === fdcId) ?? null;
      setSelectedFood(preview);
      setSelectedNutrition(preview?.previewNutrition ?? null);
      setDetailError(null);
      await fetchDetail(fdcId, preview);
    },
    [results, fetchDetail],
  );

  const clearSelection = useCallback(() => {
    selectedFdcIdRef.current = null;
    setSelectedFood(null);
    setSelectedNutrition(null);
    setDetailError(null);
  }, []);

  const retrySearch = useCallback(() => {
    void runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const retryDetail = useCallback(() => {
    if (selectedFdcIdRef.current != null) {
      const fdcId = selectedFdcIdRef.current;
      const preview = results.find((f) => f.fdcId === fdcId) ?? selectedFood;
      void fetchDetail(fdcId, preview);
    }
  }, [fetchDetail, results, selectedFood]);

  return {
    query,
    setQuery,
    searchNormalization,
    results,
    selectedFood,
    selectedNutrition,
    isSearching,
    isLoadingDetail,
    error: searchError,
    detailError,
    hasSearched,
    selectFood,
    clearSelection,
    retrySearch,
    retryDetail,
  };
}
