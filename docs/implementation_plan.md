# MacroMate MVP — Implementation Plan

## Overview

MacroMate is a single-user web app that lets fitness-focused users build custom meals and see calories and macronutrients in under one minute. Development follows the stack defined in `technical_constraints.md`: **Next.js, TypeScript, Tailwind CSS**, with **USDA FoodData Central** as the nutrition source and **no database or auth** in V1.

## Guiding Principles

- Ship the core loop first: search → quantity → add → summary
- Keep all meal state in the browser (session/localStorage only if needed for refresh)
- Proxy USDA API calls through Next.js API routes to protect the API key
- Client-side nutrition math after data is retrieved
- Defer Phase 2+ roadmap items (saved meals, AI, dashboards)

---

## Phase 0: Project Setup & Foundation

> **Phase folder:** [`phases/phase-0-setup/`](../phases/phase-0-setup/)

**Objective:** Runnable Next.js app with tooling, env config, and USDA API connectivity.

**Deliverables:**

- Next.js 14+ App Router project with TypeScript and Tailwind CSS
- Environment variable setup (`USDA_API_KEY`)
- Next.js API route stub for USDA proxy (`/api/foods/search`, `/api/foods/[fdcId]`)
- Basic layout shell (header, main content area)
- README with local dev instructions

**Dependencies:** None

**Estimated Complexity:** Low (1–2 days)

---

## Phase 1: Food Search & Selection

> **Phase folder:** [`phases/phase-1-food-search/`](../phases/phase-1-food-search/)

**Objective:** Users can search USDA foods and pick one result.

**Deliverables:**

- Food search input with debounced queries (300–500ms)
- Search results list (food name, brand if applicable, data type badge)
- Loading, empty, and error states
- Food detail fetch on selection (full nutrient profile for chosen `fdcId`)
- TypeScript types for USDA API responses (normalized internal shape)

**Dependencies:** Phase 0

**Estimated Complexity:** Medium (2–3 days)

**Notes:**

- Prefer `Foundation` and `SR Legacy` data types for cleaner per-100g values
- Search returns abridged data; fetch full details only after user selects

---

## Phase 2: Quantity Input & Ingredient Model

> **Phase folder:** [`phases/phase-2-quantity/`](../phases/phase-2-quantity/)

**Objective:** Users can specify how much of a selected food they are adding.

**Deliverables:**

- Quantity input component (numeric input + unit selector)
- Supported units: **grams**, **milliliters**, **servings**
- Internal `Ingredient` model: `{ fdcId, name, quantity, unit, baseNutritionPer100g, servingSize? }`
- Unit conversion logic (grams/ml as direct mass/volume; servings use USDA serving size when available)
- Validation (positive numbers, max reasonable bounds)

**Dependencies:** Phase 1

**Estimated Complexity:** Medium (2–3 days)

**Notes:**

- For liquids without density data, treat ml ≈ g as MVP simplification (document assumption)
- Servings fallback: if no serving size in USDA data, disable servings unit or default to 100g

---

## Phase 3: Meal Builder

> **Phase folder:** [`phases/phase-3-meal-builder/`](../phases/phase-3-meal-builder/)

**Objective:** Users can add multiple ingredients and manage the meal list.

**Deliverables:**

- "Add to meal" action from food selection flow
- Meal ingredient list (name, quantity, per-ingredient macros, remove button)
- Edit quantity inline or re-open quantity modal
- Clear meal / remove individual ingredient
- In-memory meal state (React context or Zustand)

**Dependencies:** Phase 2

**Estimated Complexity:** Medium (2 days)

---

## Phase 4: Nutrition Calculation & Meal Summary

> **Phase folder:** [`phases/phase-4-nutrition-summary/`](../phases/phase-4-nutrition-summary/)

**Objective:** Display accurate meal-level totals for all MVP nutrients.

**Deliverables:**

- Calculation engine (pure functions, unit-tested)
- Per-ingredient nutrition breakdown
- Meal summary panel: **Calories, Protein, Carbohydrates, Fat, Fiber**
- Prominent totals UI (primary: calories + protein per personas)
- Edge case handling (missing nutrient → show "—" or 0 with tooltip)

**Dependencies:** Phase 3

**Estimated Complexity:** Medium (2 days)

---

## Phase 5: UX Polish & MVP Hardening

> **Phase folder:** [`phases/phase-5-polish/`](../phases/phase-5-polish/)

**Objective:** Meet the "< 1 minute" success criterion with a clean, portfolio-ready experience.

**Deliverables:**

- Responsive mobile-first layout
- Keyboard-friendly search (Enter to select first result)
- Optimistic UI and skeleton loaders
- Error recovery (retry on API failure)
- Optional: `sessionStorage` persistence so refresh doesn't lose the meal
- Basic analytics hooks (console or lightweight event logging for portfolio demo metrics)
- Accessibility pass (labels, focus management, color contrast)

**Dependencies:** Phases 1–4

**Estimated Complexity:** Low–Medium (2–3 days)

---

## Phase 6: Deploy & Documentation

> **Phase folder:** [`phases/phase-6-deploy/`](../phases/phase-6-deploy/)

**Objective:** Public demo for PM portfolio.

**Deliverables:**

- Deploy to Vercel (or similar)
- Production env vars configured
- Short demo script / portfolio write-up linking problem → solution → metrics

**Dependencies:** Phase 5

**Estimated Complexity:** Low (1 day)

---

## Total Estimated Timeline

| Phase | Duration |
|-------|----------|
| 0 – Setup | 1–2 days |
| 1 – Search | 2–3 days |
| 2 – Quantity | 2–3 days |
| 3 – Meal Builder | 2 days |
| 4 – Calculation | 2 days |
| 5 – Polish | 2–3 days |
| 6 – Deploy | 1 day |
| **Total** | **~12–16 days** (solo developer, part-time adjust accordingly) |

## Risk Register

| Risk | Mitigation |
|------|------------|
| USDA nutrient IDs vary by food type | Map by nutrient name/number; document fallback nutrients |
| Branded vs Foundation serving confusion | Filter search to Foundation/SR Legacy by default |
| Rate limits during demos | Cache search results in memory; use registered API key |
| Missing fiber on some foods | Graceful null display |

## Explicitly Out of Scope (MVP)

Per PRD and technical constraints: auth, social, barcode, photo, workouts, AI, diet recommendations, saved meals, user accounts.
