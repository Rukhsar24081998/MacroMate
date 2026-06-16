// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFoodDetailReveal } from "./use-food-detail-reveal";

describe("useFoodDetailReveal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
    );
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("scrolls and highlights when fdcId is selected", () => {
    const panel = document.createElement("div");
    const onFocusQuantity = vi.fn();

    const { result, rerender } = renderHook(
      (props: { fdcId: number | null; isReadyToFocus: boolean }) =>
        useFoodDetailReveal({
          fdcId: props.fdcId,
          isReadyToFocus: props.isReadyToFocus,
          onFocusQuantity,
        }),
      { initialProps: { fdcId: null as number | null, isReadyToFocus: false } },
    );

    result.current.panelRef.current = panel;

    rerender({ fdcId: 12345, isReadyToFocus: false });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
    expect(result.current.highlighted).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.highlighted).toBe(false);
  });

  it("focuses quantity input when nutrition becomes ready", () => {
    const onFocusQuantity = vi.fn();

    const { rerender } = renderHook(
      (props: { fdcId: number | null; isReadyToFocus: boolean }) =>
        useFoodDetailReveal({
          fdcId: props.fdcId,
          isReadyToFocus: props.isReadyToFocus,
          onFocusQuantity,
        }),
      { initialProps: { fdcId: 12345, isReadyToFocus: false } },
    );

    rerender({ fdcId: 12345, isReadyToFocus: true });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onFocusQuantity).toHaveBeenCalledTimes(1);
  });
});
