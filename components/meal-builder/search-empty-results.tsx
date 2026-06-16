import { Alert } from "@/components/ui/alert";
import {
  SEARCH_EMPTY_HINT,
  SEARCH_EMPTY_TITLE,
} from "@/lib/search/search-ui";

export function SearchEmptyResults() {
  return (
    <Alert variant="empty" title={SEARCH_EMPTY_TITLE} className="mt-2">
      <span className="sr-only">Search returned no foods. </span>
      {SEARCH_EMPTY_HINT}
    </Alert>
  );
}
