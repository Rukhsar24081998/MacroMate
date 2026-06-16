// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SERVING_UNAVAILABLE_MESSAGE, UnitSelector } from "./unit-selector";

afterEach(() => {
  cleanup();
});

describe("UnitSelector", () => {
  it("disables servings when USDA serving data is missing", () => {
    render(
      <UnitSelector unit="g" onUnitChange={vi.fn()} servingAvailable={false} />,
    );

    const servings = screen.getByLabelText(
      `servings — ${SERVING_UNAVAILABLE_MESSAGE}`,
    );
    expect(servings.getAttribute("aria-disabled")).toBe("true");
    expect(servings.getAttribute("title")).toBe(SERVING_UNAVAILABLE_MESSAGE);
    expect(screen.queryByRole("button", { name: "servings" })).toBeNull();
  });

  it("enables servings when USDA serving data exists", () => {
    const onUnitChange = vi.fn();
    render(
      <UnitSelector unit="g" onUnitChange={onUnitChange} servingAvailable={true} />,
    );

    const servings = screen.getByRole("button", { name: "servings" });
    expect((servings as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(servings);
    expect(onUnitChange).toHaveBeenCalledWith("serving");
  });
});
