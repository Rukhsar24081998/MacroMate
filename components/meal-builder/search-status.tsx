import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SearchStatusProps {
  queryLength: number;
  error: string | null;
  onRetry?: () => void;
}

export function SearchStatus({ queryLength, error, onRetry }: SearchStatusProps) {
  if (error) {
    return (
      <Alert
        variant="error"
        title="Search error"
        action={
          onRetry ? (
            <Button variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          ) : undefined
        }
      >
        {error}
      </Alert>
    );
  }

  if (queryLength > 0 && queryLength < 2) {
    return (
      <Alert variant="empty">Keep typing — enter at least 2 characters to search.</Alert>
    );
  }

  return null;
}
