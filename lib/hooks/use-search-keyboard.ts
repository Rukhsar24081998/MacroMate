import { useCallback, useEffect, useState, type KeyboardEvent } from "react";

interface UseSearchKeyboardOptions {
  resultCount: number;
  isActive: boolean;
  onSelectIndex: (index: number) => void;
  onDismiss: () => void;
}

export function useSearchKeyboard({
  resultCount,
  isActive,
  onSelectIndex,
  onDismiss,
}: UseSearchKeyboardOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (!isActive || resultCount === 0) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex(0);
  }, [isActive, resultCount]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (!isActive || resultCount === 0) {
        if (event.key === "Escape") {
          onDismiss();
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < resultCount - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : resultCount - 1,
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < resultCount) {
            onSelectIndex(highlightedIndex);
          }
          break;
        case "Escape":
          event.preventDefault();
          onDismiss();
          break;
        default:
          break;
      }
    },
    [highlightedIndex, isActive, onDismiss, onSelectIndex, resultCount],
  );

  return { highlightedIndex, handleKeyDown, resetHighlight: () => setHighlightedIndex(-1) };
}
