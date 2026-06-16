# MacroMate MVP — Project Blueprint

Authoritative structural blueprint for the MacroMate MVP. Derived from all documents in `/docs`, with explicit support for **Home Page**, **Meal Builder Page**, and **Nutrition Summary Section**.

**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** Structure and contracts only — no implementation code in this document.

Related docs: [`implementation_plan.md`](implementation_plan.md) · [`technical_architecture.md`](technical_architecture.md) · [`frontend_component_map.md`](frontend_component_map.md) · [`database_schema.md`](database_schema.md) · [`api_integration_plan.md`](api_integration_plan.md)

---

## 1. Folder Structure

```
MacroMate/
│
├── app/                              # Next.js App Router — routes & API
│   ├── api/
│   │   └── foods/
│   │       ├── search/
│   │       └── [fdcId]/
│   ├── meal-builder/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                       # React UI layer
│   ├── home/                         # Home page sections
│   ├── layout/                       # Shared layout chrome
│   ├── meal-builder/                 # Meal builder feature
│   ├── nutrition-summary/            # Nutrition summary section
│   └── ui/                           # Generic UI primitives
│
├── lib/                              # Business logic (no JSX)
│   ├── hooks/
│   ├── nutrition/
│   ├── usda/
│   └── utils/
│
├── providers/                        # React context providers
│
├── types/                            # Shared TypeScript contracts
│
├── public/                           # Static assets
│
└── docs/                             # Product & engineering documentation
```

### Folder Purposes

| Folder | Purpose |
|--------|---------|
| `app/` | Defines URL routes, root layout, global styles, and server-side API proxy endpoints. |
| `app/api/` | Server-only Route Handlers that proxy USDA FoodData Central and hide the API key. |
| `app/meal-builder/` | Route segment for the meal-building workflow (`/meal-builder`). |
| `components/home/` | Presentational sections for the landing/home experience. |
| `components/layout/` | Shared shell elements (header, footer) used across pages. |
| `components/meal-builder/` | Feature UI for searching foods, entering quantities, and managing ingredients. |
| `components/nutrition-summary/` | Dedicated UI for displaying aggregated meal nutrition totals. |
| `components/ui/` | Reusable, domain-agnostic Tailwind primitives. |
| `lib/hooks/` | Custom React hooks encapsulating search and meal state access. |
| `lib/nutrition/` | Pure calculation functions (scaling, unit conversion, totals). |
| `lib/usda/` | Server-side USDA client, normalizers, and constants. |
| `lib/utils/` | Shared non-domain helpers. |
| `providers/` | React Context providers for cross-component state. |
| `types/` | TypeScript interfaces shared across client, server, and API boundaries. |
| `public/` | Static files served at the site root (favicon, images). |
| `docs/` | Planning artifacts — not part of the runtime app. |

---

## 2. File Structure

Every file that will exist at MVP completion, with its responsibility.

### Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies and scripts (`dev`, `build`, `start`, `lint`). |
| `package-lock.json` | Locked dependency tree. |
| `tsconfig.json` | TypeScript config; `@/*` path alias maps to project root. |
| `next.config.ts` | Next.js configuration. |
| `postcss.config.mjs` | PostCSS pipeline for Tailwind CSS. |
| `eslint.config.mjs` | Lint rules (Next.js + TypeScript). |
| `next-env.d.ts` | Next.js generated type references. |
| `.gitignore` | Excludes `node_modules`, `.next`, env files, build artifacts. |
| `.env.example` | Template documenting required environment variables. |
| `.env.local` | **Local secrets only** (gitignored). Contains `USDA_API_KEY`. Must live at project root — not inside `lib/`. |
| `README.md` | Setup instructions and links to documentation. |

### `app/` — Routes

| File | Route | Purpose |
|------|-------|---------|
| `app/layout.tsx` | — | Root HTML shell, metadata, global CSS import, shared `Header`. Server Component. |
| `app/page.tsx` | `/` | **Home Page** — product intro, value proposition, CTA to meal builder. Server or Client Component. |
| `app/globals.css` | — | Tailwind CSS entry point and global base styles. |
| `app/meal-builder/layout.tsx` | `/meal-builder` | Wraps meal builder in `MealProvider` so meal state is scoped to this route. Client Component boundary. |
| `app/meal-builder/page.tsx` | `/meal-builder` | **Meal Builder Page** — composes search, ingredient list, and nutrition summary section. Client Component. |
| `app/api/foods/search/route.ts` | `/api/foods/search` | Proxies USDA food search; validates query; returns normalized results. |
| `app/api/foods/[fdcId]/route.ts` | `/api/foods/:fdcId` | Proxies USDA food detail; returns normalized nutrient profile. |

### `components/home/`

| File | Purpose |
|------|---------|
| `hero-section.tsx` | Headline, subheadline, primary CTA ("Build a Meal"). |
| `how-it-works-section.tsx` | 3-step explainer: search → add → view totals. |
| `cta-section.tsx` | Secondary call-to-action linking to `/meal-builder`. |

### `components/layout/`

| File | Purpose |
|------|---------|
| `header.tsx` | App logo/name, nav link to Home and Meal Builder. |
| `footer.tsx` | Optional minimal footer (data source attribution: USDA). |

### `components/meal-builder/`

| File | Purpose |
|------|---------|
| `meal-builder-layout.tsx` | Two-column page layout: builder (left) + summary (right). Responsive stacking on mobile. |
| `food-search-section.tsx` | Groups search input, results, and status indicators. |
| `search-input.tsx` | Debounced text input for food queries (min 2 chars). |
| `search-results-list.tsx` | Scrollable list of USDA search hits. |
| `search-result-item.tsx` | Single clickable result row (name, brand, data type). |
| `search-status.tsx` | Loading, empty, and error states for search. |
| `food-detail-panel.tsx` | Shown after food selection; hosts quantity input and add action. |
| `food-info-header.tsx` | Selected food name, brand, data type badge. |
| `quantity-input.tsx` | Combines numeric input and unit selector. |
| `numeric-input.tsx` | Validated numeric quantity field. |
| `unit-selector.tsx` | Unit toggle: grams, milliliters, servings. |
| `add-to-meal-button.tsx` | Validates and adds ingredient to meal state. |
| `meal-ingredient-list.tsx` | Renders all ingredients currently in the meal. |
| `meal-ingredient-row.tsx` | Single ingredient row with remove (and optional edit). |
| `ingredient-info.tsx` | Ingredient name and quantity display. |
| `ingredient-macros.tsx` | Per-ingredient mini macro breakdown. |

### `components/nutrition-summary/`

| File | Purpose |
|------|---------|
| `nutrition-summary-section.tsx` | **Nutrition Summary Section** — top-level container; sticky on desktop, pinned/stacked on mobile. |
| `summary-header.tsx` | Section title, ingredient count, empty-state message. |
| `macro-totals-grid.tsx` | Grid layout for the five MVP macro cards. |
| `macro-stat-card.tsx` | Single stat display (label, value, unit); supports emphasized styling for calories/protein. |
| `summary-empty-state.tsx` | Placeholder when no ingredients have been added. |
| `clear-meal-button.tsx` | Clears all ingredients from the meal. |

### `components/ui/`

| File | Purpose |
|------|---------|
| `button.tsx` | Styled button with variant support (primary, secondary, ghost). |
| `input.tsx` | Styled text/number input. |
| `card.tsx` | Container with border, padding, and optional shadow. |
| `spinner.tsx` | Loading indicator. |
| `alert.tsx` | Error, warning, and info message banner. |

### `lib/hooks/`

| File | Purpose |
|------|---------|
| `use-food-search.ts` | Search query, debounce, results, selection, detail fetch, error state. |
| `use-meal.ts` | Typed accessor for meal context (ingredients, actions, derived totals). |
| `use-debounce.ts` | Generic debounce utility hook (used by food search). |

### `lib/nutrition/`

| File | Purpose |
|------|---------|
| `calculate.ts` | `scaleNutrition()`, `calculateMealTotals()`, `sumNutrition()`. |
| `convert.ts` | `convertToGrams()` for g, ml, and serving units. |
| `constants.ts` | Supported units, rounding/display rules. |
| `format.ts` | Display formatting (round calories to whole number, macros to 1 decimal). |

### `lib/usda/`

| File | Purpose |
|------|---------|
| `client.ts` | Server-side HTTP calls to USDA with timeout and status mapping. |
| `normalizers.ts` | Raw USDA JSON → `NormalizedFoodSummary` / `NormalizedNutrition`. |
| `constants.ts` | Nutrient IDs, API base URL, default search parameters. |
| `cache.ts` | In-memory LRU cache for search/detail responses (rate-limit mitigation). |

### `lib/utils/`

| File | Purpose |
|------|---------|
| `cn.ts` | Conditional classname helper for Tailwind. |
| `errors.ts` | Maps HTTP/API error codes to user-facing messages. |

### `providers/`

| File | Purpose |
|------|---------|
| `meal-provider.tsx` | React Context holding meal ingredients and CRUD actions; derives totals. |
| `index.tsx` | Re-exports providers for clean imports. |

### `types/`

| File | Purpose |
|------|---------|
| `index.ts` | Barrel export for all types. |
| `food.ts` | `NormalizedFoodSummary`. |
| `ingredient.ts` | `Ingredient`, `Meal`, `Unit`, `AddIngredientPayload`. |
| `nutrition.ts` | `NormalizedNutrition`, `MacroKey`. |
| `api.ts` | API request/response shapes and error types. |
| `state.ts` | Context and hook state interfaces (`MealState`, `FoodSearchState`). |

### `public/`

| File | Purpose |
|------|---------|
| `favicon.ico` | Browser tab icon. |
| *(optional)* `og-image.png` | Open Graph image for portfolio/social sharing. |

---

## 3. Component Hierarchy

### Application Tree

```
RootLayout (app/layout.tsx)                          [Server]
├── Header (components/layout/header.tsx)
├── {children}
└── Footer (components/layout/footer.tsx)            [optional]

HomePage (app/page.tsx)                              [Server or Client]
├── HeroSection
├── HowItWorksSection
└── CtaSection

MealBuilderLayout (app/meal-builder/layout.tsx)      [Client — MealProvider wrapper]
└── MealBuilderPage (app/meal-builder/page.tsx)      [Client]
    └── MealBuilderLayout (components/meal-builder/meal-builder-layout.tsx)
        ├── [Left Column — Builder]
        │   ├── FoodSearchSection
        │   │   ├── SearchInput
        │   │   ├── SearchResultsList
        │   │   │   └── SearchResultItem (×N)
        │   │   └── SearchStatus
        │   ├── FoodDetailPanel (conditional — food selected)
        │   │   ├── FoodInfoHeader
        │   │   ├── QuantityInput
        │   │   │   ├── NumericInput
        │   │   │   └── UnitSelector
        │   │   └── AddToMealButton
        │   └── MealIngredientList
        │       └── MealIngredientRow (×N)
        │           ├── IngredientInfo
        │           ├── IngredientMacros
        │           └── Button (remove)
        │
        └── [Right Column — Summary]
            └── NutritionSummarySection              ★ Nutrition Summary Section
                ├── SummaryHeader
                ├── SummaryEmptyState (conditional — no ingredients)
                ├── MacroTotalsGrid
                │   └── MacroStatCard (×5)
                │       ├── Calories  ← emphasized
                │       ├── Protein   ← emphasized
                │       ├── Carbohydrates
                │       ├── Fat
                │       └── Fiber
                └── ClearMealButton
```

### Page-to-Component Mapping

| User-facing surface | Route | Primary components |
|---------------------|-------|--------------------|
| **Home Page** | `/` | `HeroSection`, `HowItWorksSection`, `CtaSection` |
| **Meal Builder Page** | `/meal-builder` | `FoodSearchSection`, `FoodDetailPanel`, `MealIngredientList` |
| **Nutrition Summary Section** | `/meal-builder` (embedded) | `NutritionSummarySection` and children |

The Nutrition Summary Section is **not a separate route** — it is a persistent, visually distinct section on the Meal Builder Page. On desktop it renders as a sticky right column; on mobile it stacks below the ingredient list or pins to the bottom.

### Component Types

| Layer | Components | `"use client"` |
|-------|------------|----------------|
| Pages | `app/page.tsx`, `app/meal-builder/page.tsx` | Meal builder yes; home optional |
| Layouts | `app/layout.tsx`, `app/meal-builder/layout.tsx` | Meal builder layout yes |
| Feature | `components/home/*`, `components/meal-builder/*`, `components/nutrition-summary/*` | Yes (interactive) |
| Shell | `components/layout/*` | Optional |
| Primitives | `components/ui/*` | Yes |

---

## 4. Type Definitions

All types are in-memory contracts — no database tables in V1. Source of truth: [`database_schema.md`](database_schema.md).

### `types/nutrition.ts`

```typescript
/** MVP macro keys displayed in the Nutrition Summary Section */
export type MacroKey =
  | "calories"
  | "protein"
  | "carbohydrates"
  | "fat"
  | "fiber";

/** Normalized nutrient profile — values are per 100g unless scaled */
export interface NormalizedNutrition {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  fiber: number | null;
}
```

### `types/food.ts`

```typescript
/** Abridged food shape returned from search and detail endpoints */
export interface NormalizedFoodSummary {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
}
```

### `types/ingredient.ts`

```typescript
import type { NormalizedNutrition } from "./nutrition";

export type Unit = "g" | "ml" | "serving";

/** A single line item in the user's meal */
export interface Ingredient {
  id: string;
  fdcId: number;
  name: string;
  quantity: number;
  unit: Unit;
  baseNutrition: NormalizedNutrition;
  servingSizeGrams: number | null;
  scaledNutrition: NormalizedNutrition;
}

/** Payload when adding a new ingredient from the food detail panel */
export interface AddIngredientPayload {
  fdcId: number;
  name: string;
  quantity: number;
  unit: Unit;
  baseNutrition: NormalizedNutrition;
  servingSizeGrams: number | null;
}

/** Aggregate meal model — derived totals, not stored independently */
export interface Meal {
  ingredients: Ingredient[];
  totals: NormalizedNutrition;
}
```

### `types/api.ts`

```typescript
import type { NormalizedFoodSummary } from "./food";
import type { NormalizedNutrition } from "./nutrition";

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface FoodSearchResponse {
  foods: NormalizedFoodSummary[];
  pagination: {
    page: number;
    pageSize: number;
    totalHits: number;
  };
}

export interface FoodDetailResponse {
  food: NormalizedFoodSummary;
  nutrition: NormalizedNutrition;
}
```

### `types/state.ts`

```typescript
import type { AddIngredientPayload, Ingredient, Unit } from "./ingredient";
import type { NormalizedFoodSummary } from "./food";
import type { NormalizedNutrition } from "./nutrition";

/** MealProvider context shape */
export interface MealState {
  ingredients: Ingredient[];
  totals: NormalizedNutrition;
  addIngredient: (payload: AddIngredientPayload) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, quantity: number, unit: Unit) => void;
  clearMeal: () => void;
}

/** useFoodSearch hook return shape */
export interface FoodSearchState {
  query: string;
  setQuery: (query: string) => void;
  results: NormalizedFoodSummary[];
  selectedFood: NormalizedFoodSummary | null;
  selectedNutrition: NormalizedNutrition | null;
  isSearching: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  selectFood: (fdcId: number) => void;
  clearSelection: () => void;
}
```

### `types/index.ts`

Barrel re-export of all types above for `@/types` imports.

### Type Flow

```
USDA API (raw JSON)
    → lib/usda/normalizers.ts
    → NormalizedFoodSummary / NormalizedNutrition
    → API routes (FoodSearchResponse, FoodDetailResponse)
    → useFoodSearch hook
    → FoodDetailPanel → AddIngredientPayload
    → MealProvider → Ingredient[]
    → lib/nutrition/calculate.ts → NormalizedNutrition (totals)
    → NutritionSummarySection
```

---

## 5. State Management Approach

### Strategy: React Context + Custom Hooks

No external state library required for MVP. Meal state uses **React Context** (`MealProvider`); search state uses a **local custom hook** (`useFoodSearch`). Calculations use **pure functions** in `lib/nutrition/`.

This aligns with `technical_constraints.md`: single-user, no database, client-side calculations, minimal complexity.

### State Domains

| Domain | Owner | Scope | Persistence |
|--------|-------|-------|-------------|
| Food search query | `useFoodSearch` | Meal Builder Page | Ephemeral |
| Search results | `useFoodSearch` | Meal Builder Page | Ephemeral |
| Selected food + nutrients | `useFoodSearch` | Meal Builder Page | Ephemeral |
| Search loading/error | `useFoodSearch` | Meal Builder Page | Ephemeral |
| Meal ingredients | `MealProvider` | `/meal-builder` route | Optional `sessionStorage` (Phase 5) |
| Meal totals | Derived in `MealProvider` | `/meal-builder` route | Recomputed on every ingredient change |
| Quantity/unit draft | Local state in `FoodDetailPanel` | Component | Ephemeral |
| UI toggles (mobile summary expand) | Local component state | Component | Ephemeral |

### Provider Placement

```
app/layout.tsx
  └── Header, Footer, {children}

app/meal-builder/layout.tsx
  └── MealProvider                    ← meal state scoped to meal builder only
        └── app/meal-builder/page.tsx
              └── useFoodSearch()     ← search state local to this page
```

**Why scope `MealProvider` to `/meal-builder`:** The Home Page has no meal data. Scoping avoids unnecessary context overhead and keeps responsibilities clear.

### State Transitions

```
[Search]
  User types → useFoodSearch.setQuery → debounce → GET /api/foods/search → results

[Select]
  User clicks result → useFoodSearch.selectFood → GET /api/foods/:fdcId → FoodDetailPanel

[Add]
  User enters quantity → AddToMealButton → MealProvider.addIngredient()
    → lib/nutrition/convertToGrams()
    → lib/nutrition/scaleNutrition()
    → ingredients[] updated → totals recalculated → NutritionSummarySection re-renders

[Remove]
  User clicks remove → MealProvider.removeIngredient(id) → totals recalculated

[Clear]
  User clicks clear → MealProvider.clearMeal() → summary shows empty state
```

### Derived State (Not Stored)

| Derived value | Computed by | Consumed by |
|---------------|-------------|-------------|
| `Meal.totals` | `calculateMealTotals(ingredients)` in provider | `NutritionSummarySection` |
| `Ingredient.scaledNutrition` | `scaleNutrition(base, grams)` on add/update | `MealIngredientRow`, `IngredientMacros` |
| `ingredientCount` | `ingredients.length` | `SummaryHeader` |
| `hasIngredients` | `ingredients.length > 0` | `SummaryEmptyState` visibility |

### Optional Persistence (Phase 5)

```
sessionStorage key: "macromate:meal:v1"
  → serialize ingredients[] on change
  → hydrate MealProvider on mount
  → cleared when tab closes
```

No persistence on the Home Page. Navigating from Home → Meal Builder starts fresh unless session data exists.

### Why Not Zustand / Redux?

- Single-user MVP with one meaningful state domain (meal)
- One page owns interactive state (meal builder)
- Context + hooks keeps dependencies minimal and matches portfolio MVP scope
- Zustand remains an acceptable swap-in for `MealProvider` if complexity grows in Phase 2

---

## 6. Route & Layout Summary

| URL | Page | Server/Client | Key files |
|-----|------|---------------|-----------|
| `/` | Home Page | Server (preferred) | `app/page.tsx`, `components/home/*` |
| `/meal-builder` | Meal Builder Page | Client | `app/meal-builder/page.tsx`, `components/meal-builder/*` |
| `/meal-builder` (right column) | Nutrition Summary Section | Client | `components/nutrition-summary/*` |
| `/api/foods/search` | API | Server | `app/api/foods/search/route.ts` |
| `/api/foods/:fdcId` | API | Server | `app/api/foods/[fdcId]/route.ts` |

---

## 7. Data Flow (End-to-End)

```
┌──────────────────────────────────────────────────────────────────┐
│  HOME PAGE (/)                                                    │
│  Hero → How It Works → CTA → navigates to /meal-builder          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  MEAL BUILDER PAGE (/meal-builder)                                │
│                                                                   │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐  │
│  │  MEAL BUILDER            │   │  NUTRITION SUMMARY SECTION   │  │
│  │  useFoodSearch           │   │  reads MealProvider.totals   │  │
│  │  FoodSearchSection       │   │  MacroTotalsGrid             │  │
│  │  FoodDetailPanel         │   │  MacroStatCard × 5           │  │
│  │  MealIngredientList      │   │  ClearMealButton             │  │
│  └───────────┬─────────────┘   └──────────────▲───────────────┘  │
│              │                                 │                  │
│              ▼                                 │                  │
│         MealProvider ──► lib/nutrition ────────┘                  │
│              │                                                    │
│              ▼                                                    │
│         /api/foods/* ──► lib/usda ──► USDA FoodData Central      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Phase Mapping

| Phase | Files / folders created or implemented |
|-------|----------------------------------------|
| **0 – Setup** | Root config, `app/layout.tsx`, `components/layout/`, `components/ui/`, `app/page.tsx` (home stub) |
| **1 – Search** | `app/api/foods/*`, `lib/usda/*`, `use-food-search.ts`, search components |
| **2 – Quantity** | `quantity-input`, `unit-selector`, `lib/nutrition/convert.ts` |
| **3 – Meal Builder** | `app/meal-builder/*`, `MealProvider`, ingredient list components |
| **4 – Summary** | `components/nutrition-summary/*`, `lib/nutrition/calculate.ts` |
| **5 – Polish** | Home page content, responsive layout, `sessionStorage`, a11y |
| **6 – Deploy** | Env vars, Vercel, README |

---

## 9. Conventions

| Convention | Rule |
|------------|------|
| Path alias | `@/*` → project root |
| File naming | kebab-case files, PascalCase exported components |
| Colocation | Feature components grouped by domain folder |
| Server-only | `lib/usda/*` and `app/api/*` never imported in client components |
| Env vars | `USDA_API_KEY` in root `.env.local` only — never in `lib/` subfolders |
| No DB | All persistence is in-memory or optional `sessionStorage` |

---

## 10. Explicitly Out of Scope

Per PRD and implementation plan: authentication, social features, barcode scanning, photo recognition, workout tracking, AI features, saved meals, user accounts, daily dashboards.
