import { describe, expect, it } from "vitest";
import { shouldShowAliasNotice, shouldShowEmptyResults, shouldShowSearchSkeleton } from "./search-ui";

describe("shouldShowAliasNotice", () => {
  it("shows alias notice when alias applied and search finished with zero results", () => {
    expect(
      shouldShowAliasNotice({
        aliasApplied: true,
        isSearching: false,
        hasError: false,
        hasSearched: true,
      }),
    ).toBe(true);
  });

  it("hides alias notice while searching", () => {
    expect(
      shouldShowAliasNotice({
        aliasApplied: true,
        isSearching: true,
        hasError: false,
        hasSearched: false,
      }),
    ).toBe(false);
  });

  it("hides alias notice when no alias was applied", () => {
    expect(
      shouldShowAliasNotice({
        aliasApplied: false,
        isSearching: false,
        hasError: false,
        hasSearched: true,
      }),
    ).toBe(false);
  });

  it("hides alias notice when search errored", () => {
    expect(
      shouldShowAliasNotice({
        aliasApplied: true,
        isSearching: false,
        hasError: true,
        hasSearched: true,
      }),
    ).toBe(false);
  });
});

describe("shouldShowEmptyResults", () => {
  it("shows empty state after a completed search with no results", () => {
    expect(
      shouldShowEmptyResults({
        isSearching: false,
        hasError: false,
        hasSearched: true,
        resultsCount: 0,
        queryLength: 12,
      }),
    ).toBe(true);
  });

  it("hides empty state when results exist", () => {
    expect(
      shouldShowEmptyResults({
        isSearching: false,
        hasError: false,
        hasSearched: true,
        resultsCount: 3,
        queryLength: 4,
      }),
    ).toBe(false);
  });

  it("hides empty state while searching", () => {
    expect(
      shouldShowEmptyResults({
        isSearching: true,
        hasError: false,
        hasSearched: false,
        resultsCount: 0,
        queryLength: 4,
      }),
    ).toBe(false);
  });
});

describe("shouldShowSearchSkeleton", () => {
  it("shows skeleton while searching with a valid query", () => {
    expect(
      shouldShowSearchSkeleton({
        isSearching: true,
        hasError: false,
        queryLength: 4,
      }),
    ).toBe(true);
  });

  it("hides skeleton when query is too short", () => {
    expect(
      shouldShowSearchSkeleton({
        isSearching: true,
        hasError: false,
        queryLength: 1,
      }),
    ).toBe(false);
  });
});
