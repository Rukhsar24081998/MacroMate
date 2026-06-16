// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SearchEmptyResults } from "./search-empty-results";
import {
  SEARCH_EMPTY_HINT,
  SEARCH_EMPTY_TITLE,
} from "@/lib/search/search-ui";

afterEach(() => {
  cleanup();
});

describe("SearchEmptyResults", () => {
  it("renders the empty-state title and hint text", () => {
    render(<SearchEmptyResults />);

    expect(screen.getByText(SEARCH_EMPTY_TITLE)).toBeTruthy();
    expect(screen.getByText(SEARCH_EMPTY_HINT)).toBeTruthy();
  });

  it("exposes empty results as a status region", () => {
    render(<SearchEmptyResults />);

    expect(screen.getByRole("status")).toBeTruthy();
  });
});
