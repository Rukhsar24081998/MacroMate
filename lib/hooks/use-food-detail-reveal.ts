"use client";

import { useEffect, useRef, useState } from "react";

interface UseFoodDetailRevealOptions {
  /** Selected food id; triggers scroll + highlight when it changes. */
  fdcId: number | null | undefined;
  /** When true, focus moves to the quantity field (after nutrition loads). */
  isReadyToFocus: boolean;
  onFocusQuantity: () => void;
  /** Scroll + highlight (mobile stacked layout). Off on desktop dashboard. */
  enableScrollReveal?: boolean;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useFoodDetailReveal({
  fdcId,
  isReadyToFocus,
  onFocusQuantity,
  enableScrollReveal = true,
}: UseFoodDetailRevealOptions) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [highlighted, setHighlighted] = useState(false);
  const lastScrolledFdcId = useRef<number | null>(null);
  const lastFocusedFdcId = useRef<number | null>(null);

  useEffect(() => {
    if (fdcId == null) {
      lastScrolledFdcId.current = null;
      lastFocusedFdcId.current = null;
      setHighlighted(false);
      return;
    }

    if (!enableScrollReveal) return;

    if (lastScrolledFdcId.current === fdcId) return;

    lastScrolledFdcId.current = fdcId;
    lastFocusedFdcId.current = null;
    setHighlighted(true);

    const highlightTimer = window.setTimeout(() => setHighlighted(false), 1500);

    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.clearTimeout(highlightTimer);
  }, [fdcId, enableScrollReveal]);

  useEffect(() => {
    if (fdcId == null || !isReadyToFocus) return;
    if (lastFocusedFdcId.current === fdcId) return;

    lastFocusedFdcId.current = fdcId;

    const focusDelayMs = prefersReducedMotion() ? 0 : 400;
    const focusTimer = window.setTimeout(() => {
      onFocusQuantity();
    }, focusDelayMs);

    return () => window.clearTimeout(focusTimer);
  }, [fdcId, isReadyToFocus, onFocusQuantity]);

  return { panelRef, highlighted };
}
