# MacroMate — Project Structure

> **Note:** This document reflects the initial scaffold. For the latest MVP blueprint — including Home Page, Meal Builder Page, and Nutrition Summary Section — see [`mvp_blueprint.md`](mvp_blueprint.md).

This document describes the folder and file layout for the MacroMate MVP. It mirrors the approved [`implementation_plan.md`](implementation_plan.md), [`technical_architecture.md`](technical_architecture.md), and [`frontend_component_map.md`](frontend_component_map.md).

---

## Directory Tree

```
MacroMate/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── foods/
│   │       ├── search/
│   │       │   └── route.ts      # GET /api/foods/search
│   │       └── [fdcId]/
│   │           └── route.ts      # GET /api/foods/:fdcId
│   ├── globals.css               # Tailwind imports + global styles
│   ├── layout.tsx                # Root HTML shell, metadata
│   └── page.tsx                  # Home page (meal builder entry)
│
├── components/
│   ├── layout/
│   │   └── header.tsx            # App header / branding
│   ├── meal-builder/             # Feature components (single-page MVP)
│   │   ├── meal-builder-page.tsx
│   │   ├── food-search-section.tsx
│   │   ├── search-input.tsx
│   │   ├── search-results-list.tsx
│   │   ├── search-result-item.tsx
│   │   ├── search-status.tsx
│   │   ├── food-detail-panel.tsx
│   │   ├── food-info-header.tsx
│   │   ├── quantity-input.tsx
│   │   ├── numeric-input.tsx
│   │   ├── unit-selector.tsx
│   │   ├── add-to-meal-button.tsx
│   │   ├── meal-ingredient-list.tsx
│   │   ├── meal-ingredient-row.tsx
│   │   ├── ingredient-info.tsx
│   │   ├── ingredient-macros.tsx
│   │   ├── meal-summary-panel.tsx
│   │   ├── macro-stat-card.tsx
│   │   └── clear-meal-button.tsx
│   └── ui/                       # Reusable UI primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── spinner.tsx
│       └── alert.tsx
│
├── lib/
│   ├── hooks/
│   │   ├── use-food-search.ts    # Search query, results, selection
│   │   └── use-meal.ts           # Meal ingredients and actions
│   ├── nutrition/
│   │   ├── calculate.ts          # Scale nutrients, meal totals
│   │   ├── convert.ts            # Unit → grams conversion
│   │   └── constants.ts          # Units, rounding rules
│   ├── usda/
│   │   ├── client.ts             # Server-side USDA fetch helpers
│   │   ├── normalizers.ts        # Raw USDA → internal models
│   │   └── constants.ts          # Nutrient IDs, API config
│   └── utils/
│       └── index.ts              # Shared helpers (e.g. classnames)
│
├── providers/
│   └── meal-provider.tsx         # React context for meal state
│
├── types/
│   ├── index.ts                  # Barrel export for all types
│   ├── food.ts                   # NormalizedFoodSummary
│   ├── ingredient.ts             # Ingredient, Meal, Unit
│   ├── nutrition.ts              # NormalizedNutrition
│   └── api.ts                    # API request/response shapes
│
├── public/                       # Static assets (favicon, images)
├── docs/                         # Product & engineering documentation
├── phases/                       # Phase-based dev structure (see phases/README.md)
│   ├── phase-0-setup/
│   ├── phase-1-food-search/
│   ├── phase-2-quantity/
│   ├── phase-3-meal-builder/
│   ├── phase-4-nutrition-summary/
│   ├── phase-5-polish/
│   └── phase-6-deploy/
│
├── .env.example                  # Environment variable template
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## Root Configuration Files

| File | Responsibility |
|------|----------------|
| `package.json` | Dependencies, npm scripts (`dev`, `build`, `start`, `lint`) |
| `tsconfig.json` | TypeScript compiler options; `@/*` path alias to project root |
| `next.config.ts` | Next.js configuration |
| `postcss.config.mjs` | PostCSS pipeline for Tailwind CSS v4 |
| `eslint.config.mjs` | ESLint rules (Next.js + TypeScript) |
| `next-env.d.ts` | Auto-generated Next.js type references |
| `.gitignore` | Ignores `node_modules`, `.next`, env files, build artifacts |
| `.env.example` | Documents required env vars (`USDA_API_KEY`) |
| `README.md` | Setup instructions and links to docs |

---

## `app/` — Next.js App Router

The App Router owns all routes and API endpoints.

| File / Folder | Responsibility |
|---------------|----------------|
| `layout.tsx` | Root layout: `<html>`, `<body>`, global CSS, app metadata. Server Component. |
| `page.tsx` | Route `/` — composes the meal builder. Will wrap content in `MealProvider`. |
| `globals.css` | Tailwind CSS entry point and any global base styles. |
| `api/foods/search/route.ts` | **Server proxy** for USDA food search. Validates query params, calls USDA, normalizes response. |
| `api/foods/[fdcId]/route.ts` | **Server proxy** for full food detail by FDC ID. Returns normalized nutrient profile. |

**Why API routes live here:** Keeps the USDA API key server-side. The browser only calls same-origin `/api/*` endpoints.

---

## `components/` — UI Layer

### `components/layout/`

| File | Responsibility |
|------|----------------|
| `header.tsx` | App branding, tagline. Rendered in root layout or page. |

### `components/meal-builder/`

Feature-specific components for the single-page meal builder. Maps 1:1 to the component hierarchy in `frontend_component_map.md`.

| File | Responsibility | Phase |
|------|----------------|-------|
| `meal-builder-page.tsx` | Top-level composition: search, detail, list, summary | 3 |
| `food-search-section.tsx` | Groups search input, results, and status | 1 |
| `search-input.tsx` | Debounced text input for food queries | 1 |
| `search-results-list.tsx` | Renders list of USDA search hits | 1 |
| `search-result-item.tsx` | Single clickable search result row | 1 |
| `search-status.tsx` | Loading spinner, empty state, error alert | 1 |
| `food-detail-panel.tsx` | Shown after food selection; quantity + add action | 2 |
| `food-info-header.tsx` | Food name, brand, data type badge | 2 |
| `quantity-input.tsx` | Combines numeric input and unit selector | 2 |
| `numeric-input.tsx` | Numeric quantity field with validation | 2 |
| `unit-selector.tsx` | Toggle between g, ml, serving | 2 |
| `add-to-meal-button.tsx` | Adds ingredient to meal state | 3 |
| `meal-ingredient-list.tsx` | Renders all added ingredients | 3 |
| `meal-ingredient-row.tsx` | Single ingredient with remove action | 3 |
| `ingredient-info.tsx` | Name and quantity display per row | 3 |
| `ingredient-macros.tsx` | Mini per-ingredient macro breakdown | 4 |
| `meal-summary-panel.tsx` | Aggregated meal totals panel | 4 |
| `macro-stat-card.tsx` | Reusable stat card (calories, protein, etc.) | 4 |
| `clear-meal-button.tsx` | Clears all ingredients from meal | 3 |

### `components/ui/`

Generic, reusable primitives. No business logic.

| File | Responsibility |
|------|----------------|
| `button.tsx` | Styled button variants |
| `input.tsx` | Styled text/number input |
| `card.tsx` | Container with border/shadow |
| `spinner.tsx` | Loading indicator |
| `alert.tsx` | Error/info/status messages |

---

## `lib/` — Business Logic & Utilities

Pure logic and hooks, separate from UI rendering.

### `lib/hooks/`

| File | Responsibility |
|------|----------------|
| `use-food-search.ts` | Manages search query, debounce, results, selected food, detail fetch, errors |
| `use-meal.ts` | Reads/writes meal state from `MealProvider` (add, remove, clear, totals) |

### `lib/usda/`

Server-side USDA integration (used by API routes, not imported in client components).

| File | Responsibility |
|------|----------------|
| `client.ts` | HTTP calls to USDA endpoints with timeout and error mapping |
| `normalizers.ts` | Transforms raw USDA JSON → `NormalizedFoodSummary` / `NormalizedNutrition` |
| `constants.ts` | Nutrient IDs (1008, 1003, etc.), default search params, base URL |

### `lib/nutrition/`

Client-side calculation engine (pure functions, unit-testable).

| File | Responsibility |
|------|----------------|
| `calculate.ts` | `scaleNutrition()`, `calculateMealTotals()` |
| `convert.ts` | `convertToGrams()` for g, ml, serving units |
| `constants.ts` | Supported units, display rounding rules |

### `lib/utils/`

| File | Responsibility |
|------|----------------|
| `index.ts` | Shared helpers (e.g. classname merging) added as needed |

---

## `providers/` — React Context

| File | Responsibility |
|------|----------------|
| `meal-provider.tsx` | Holds `ingredients[]`, exposes add/remove/clear actions, derives meal totals |

Meal state is app-wide but ephemeral (in-memory). Optional `sessionStorage` sync added in Phase 5.

---

## `types/` — TypeScript Contracts

Shared interfaces used across client, server, and API boundaries. Defined upfront from `database_schema.md` (in-memory models, not DB tables).

| File | Responsibility |
|------|----------------|
| `nutrition.ts` | `NormalizedNutrition` — calories, protein, carbs, fat, fiber |
| `food.ts` | `NormalizedFoodSummary` — search result shape |
| `ingredient.ts` | `Ingredient`, `Meal`, `Unit` |
| `api.ts` | `FoodSearchResponse`, `FoodDetailResponse`, `ApiError` |
| `index.ts` | Barrel re-export for `@/types` imports |

---

## `public/` — Static Assets

Served as-is at the site root. Holds favicon, logos, and other static files. Empty at scaffold time.

---

## `docs/` — Documentation

Product requirements, architecture, and planning artifacts. Not part of the runtime application.

---

## Data Flow Summary

```
User → components/meal-builder → lib/hooks
                                      ↓
                              providers/meal-provider (meal state)
                                      ↓
                              lib/nutrition (calculations)

User search → lib/hooks/use-food-search → app/api/foods/*
                                                ↓
                                          lib/usda (proxy + normalize)
                                                ↓
                                          USDA FoodData Central
```

---

## Implementation Phase Mapping

Each phase has a dedicated folder under [`phases/`](../phases/) with deliverable subfolders and code-path mapping. Implementation code stays in the standard Next.js paths below.

| Phase | Phase folder | Primary folders touched |
|-------|--------------|-------------------------|
| 0 – Setup | [`phase-0-setup/`](../phases/phase-0-setup/) | Root config, `app/layout.tsx`, `app/page.tsx`, `components/ui/`, `components/layout/` |
| 1 – Search | [`phase-1-food-search/`](../phases/phase-1-food-search/) | `app/api/foods/`, `lib/usda/`, `lib/hooks/use-food-search.ts`, search components |
| 2 – Quantity | [`phase-2-quantity/`](../phases/phase-2-quantity/) | `quantity-*`, `unit-selector`, `lib/nutrition/convert.ts` |
| 3 – Meal Builder | [`phase-3-meal-builder/`](../phases/phase-3-meal-builder/) | `providers/`, `lib/hooks/use-meal.ts`, ingredient list components |
| 4 – Calculation | [`phase-4-nutrition-summary/`](../phases/phase-4-nutrition-summary/) | `lib/nutrition/calculate.ts`, summary + macro components |
| 5 – Polish | [`phase-5-polish/`](../phases/phase-5-polish/) | `components/ui/`, responsive layout, `sessionStorage`, accessibility |
| 6 – Deploy | [`phase-6-deploy/`](../phases/phase-6-deploy/) | Root config, env vars, Vercel |

---

## Conventions

- **Path alias:** `@/*` maps to project root (e.g. `@/components/ui/button`)
- **File naming:** kebab-case for files, PascalCase for exported components
- **Server vs client:** API routes and `lib/usda/*` are server-only; meal builder page and hooks use `"use client"` when implemented
- **Phase-by-phase implementation:** Future-phase files are created when that phase starts; see [`phases/`](../phases/) for status
