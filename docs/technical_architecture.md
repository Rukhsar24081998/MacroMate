# MacroMate — Technical Architecture

## System Overview

MacroMate is a **client-heavy, server-proxied** Next.js application. The browser owns all meal state and calculation logic. The Next.js server acts as a thin **API proxy** to USDA FoodData Central, keeping the API key off the client.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   UI Layer  │→ │ Meal State   │→ │ Calc Engine   │  │
│  │ (React)     │  │ (Context/    │  │ (pure TS fn)  │  │
│  │             │  │  Zustand)    │  │               │  │
│  └──────┬──────┘  └──────────────┘  └───────────────┘  │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                         │
│  │ API Client  │  fetch('/api/foods/...')                │
│  └──────┬──────┘                                         │
└─────────┼────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (App Router)                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Route Handlers: /api/foods/search, /api/foods/[id]│   │
│  │  • Validate input  • Proxy to USDA  • Normalize   │   │
│  └──────────────────────┬──────────────────────────┘    │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ USDA FoodData Central │
              │ api.nal.usda.gov      │
              └───────────────────────┘
```

---

## Frontend Architecture

**Framework:** Next.js App Router, TypeScript, Tailwind CSS

**Directory Structure (proposed):**

```
/app
  /page.tsx                 # Main meal builder (single-page MVP)
  /layout.tsx               # Root layout, fonts, metadata
  /api
    /foods
      /search/route.ts      # GET/POST proxy for search
      /[fdcId]/route.ts     # GET proxy for food details
/components
  /meal-builder/            # Feature-specific components
  /ui/                      # Reusable primitives (Button, Input, Card)
/lib
  /usda/                    # API client, types, normalizers
  /nutrition/               # Calculation engine
  /hooks/                   # useFoodSearch, useMeal, etc.
/types/                     # Shared TypeScript interfaces
```

**State Management:**

- **Meal state:** React Context or Zustand (single store: `ingredients[]`, `totals`)
- **Search state:** Local component state + `useFoodSearch` hook (query, results, loading, error)
- **No global server state** — no DB, no sessions

**Rendering Strategy:**

- Main page: Client Component (`"use client"`) for interactivity
- API routes: Server-side only
- No SSR for meal data (ephemeral, user-driven)

**Styling:**

- Tailwind utility classes
- Mobile-first responsive layout
- Emphasis on calories and protein in summary (per personas)

---

## Data Flow

### Food Search Flow

1. User types in search input → debounced query
2. Client calls `GET /api/foods/search?q=oats&pageSize=10`
3. Next.js route handler calls USDA `/fdc/v1/foods/search`
4. Handler normalizes response → `{ foods: NormalizedFoodSummary[] }`
5. Client renders results list
6. User selects food → client calls `GET /api/foods/[fdcId]`
7. Handler fetches USDA `/fdc/v1/food/{fdcId}` → returns normalized nutrient profile
8. Client stores base nutrition (per 100g) with selected food

### Add Ingredient Flow

1. User enters quantity + unit
2. Client creates `Ingredient` object with base nutrition snapshot
3. Calc engine computes scaled nutrients → appended to meal state
4. Meal totals recalculated (derived state or memoized reducer)

### Meal Summary Flow

1. `ingredients[]` changes
2. `calculateMealTotals(ingredients)` runs (pure function)
3. Summary panel re-renders with aggregated values

---

## USDA API Integration Strategy

**Endpoints Used:**

| USDA Endpoint | MacroMate Proxy | Purpose |
|---------------|-----------------|---------|
| `GET /fdc/v1/foods/search` | `/api/foods/search` | Keyword search |
| `GET /fdc/v1/food/{fdcId}` | `/api/foods/[fdcId]` | Full nutrient detail |

**Why proxy through Next.js:**

- Hides `USDA_API_KEY` from browser
- Enables request validation and consistent error shapes
- Room for in-memory caching later without client changes

**Search Parameters (defaults):**

- `pageSize`: 10–15 (keep UI scannable)
- `dataType`: `Foundation,SR Legacy` (cleaner analytical data; branded optional toggle in Phase 2)
- `query`: user input, trimmed, min 2 chars

**Normalization Layer:**

USDA returns nested `foodNutrients[]` with varying nutrient IDs. The proxy/normalizer maps to a stable internal shape:

```typescript
interface NormalizedNutrition {
  calories: number | null;      // Energy (kcal), nutrient ~1008
  protein: number | null;       // g, nutrient ~1003
  carbohydrates: number | null; // g, nutrient ~1005
  fat: number | null;           // g, nutrient ~1004
  fiber: number | null;         // g, nutrient ~1079
}
// All values per 100g (or per serving base as documented)
```

**Caching (MVP-light):**

- In-memory `Map` in route handlers (or LRU with TTL ~1 hour) for repeated searches during a session
- Client-side: don't re-fetch food detail if same `fdcId` already in memory

---

## Calculation Logic

**Base assumption:** USDA Foundation/SR Legacy values are **per 100g**. Branded foods may include `servingSize`; handle separately.

**Scaling formula:**

```
scaledValue = (baseValuePer100g / 100) × effectiveGrams
```

**Unit conversion:**

| Unit | effectiveGrams |
|------|----------------|
| grams | `quantity` |
| milliliters | `quantity` (MVP: 1ml ≈ 1g; document limitation) |
| servings | `quantity × servingSizeGrams` (from USDA `servingSize` + `householdServingFullText`) |

**Meal totals:**

```
mealTotal[nutrient] = Σ ingredientScaled[nutrient] for all ingredients
```

**Rounding:** Display to 1 decimal for macros, whole number for calories (UX preference).

**Missing nutrients:** If USDA omits a field, treat as `null`; exclude from sum or show "—" in UI.

**Pure functions (testable):**

- `scaleNutrition(base: NormalizedNutrition, grams: number): NormalizedNutrition`
- `convertToGrams(quantity: number, unit: Unit, servingSizeGrams?: number): number`
- `calculateMealTotals(ingredients: Ingredient[]): NormalizedNutrition`
- `extractNutrients(rawUsdaFood): NormalizedNutrition`

---

## Security & Configuration

- `USDA_API_KEY` in server env only (`.env.local`, Vercel env)
- Input validation on API routes (query length, fdcId numeric)
- No PII collected in MVP
- CORS not an issue (same-origin API routes)

---

## Future Architecture Hooks (Post-MVP)

- Database (Postgres/Supabase) for saved meals → Phase 2 roadmap
- Auth layer when user accounts added
- LLM parsing service → Phase 3 roadmap
- Edge caching / CDN for popular foods
