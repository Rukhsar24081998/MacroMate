export const SEARCH_EMPTY_TITLE = "No matching foods found.";
export const SEARCH_EMPTY_HINT =
  "Try a more generic ingredient name such as cottage cheese, yogurt, lentils, chicken breast, or oats.";

export function shouldShowAliasNotice(options: {
  aliasApplied: boolean;
  isSearching: boolean;
  hasError: boolean;
  hasSearched: boolean;
}): boolean {
  const { aliasApplied, isSearching, hasError, hasSearched } = options;
  return aliasApplied && !isSearching && !hasError && hasSearched;
}

export function shouldShowEmptyResults(options: {
  isSearching: boolean;
  hasError: boolean;
  hasSearched: boolean;
  resultsCount: number;
  queryLength: number;
}): boolean {
  const { isSearching, hasError, hasSearched, resultsCount, queryLength } =
    options;
  return (
    !isSearching &&
    !hasError &&
    hasSearched &&
    resultsCount === 0 &&
    queryLength >= 2
  );
}

export function shouldShowSearchSkeleton(options: {
  isSearching: boolean;
  hasError: boolean;
  queryLength: number;
}): boolean {
  const { isSearching, hasError, queryLength } = options;
  return isSearching && !hasError && queryLength >= 2;
}
