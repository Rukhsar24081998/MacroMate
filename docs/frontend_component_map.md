# MacroMate — Frontend Component Map

## Application Structure

**MVP is a single-page app** (`/`) — no routing beyond the main meal builder. Keeps scope minimal per MVP goals.

---

## Pages

| Page | Route | Type | Description |
|------|-------|------|-------------|
| Meal Builder | `/` | Client Component | Primary and only user-facing page |

### `app/layout.tsx`

- Root HTML shell, fonts, global styles
- App header with MacroMate branding
- Server Component

### `app/page.tsx`

- Composes the full meal builder experience
- Wraps children in `MealProvider` (state)
- Client Component

---

## Component Hierarchy

```
AppLayout
└── Header
└── MealBuilderPage
    ├── FoodSearchSection
    │   ├── SearchInput
    │   ├── SearchResultsList
    │   │   └── SearchResultItem
    │   └── SearchStatus (loading | empty | error)
    ├── FoodDetailPanel (visible when food selected)
    │   ├── FoodInfoHeader (name, brand, data type)
    │   ├── QuantityInput
    │   │   ├── NumericInput
    │   │   └── UnitSelector (g | ml | serving)
    │   └── AddToMealButton
    ├── MealIngredientList
    │   └── MealIngredientRow (×N)
    │       ├── IngredientInfo
    │       ├── IngredientMacros (mini breakdown)
    │       └── RemoveButton
    └── MealSummaryPanel
        ├── MacroStatCard (Calories) ← emphasized
        ├── MacroStatCard (Protein)   ← emphasized
        ├── MacroStatCard (Carbs)
        ├── MacroStatCard (Fat)
        ├── MacroStatCard (Fiber)
        └── ClearMealButton
```

---

## Component Specifications

### `Header`

- **Props:** none
- **State:** none
- **Role:** Branding, optional tagline ("Build your meal in under a minute")

### `SearchInput`

- **Props:** `value`, `onChange`, `onSubmit`, `isLoading`, `disabled`
- **State:** local (controlled by parent hook)
- **Behavior:** Debounced search; clear button; min 2 chars before search

### `SearchResultsList` / `SearchResultItem`

- **Props:** `foods: NormalizedFoodSummary[]`, `onSelect(fdcId)`, `selectedFdcId?`
- **State:** none (presentational)
- **Behavior:** Click row → triggers detail fetch + shows FoodDetailPanel

### `FoodDetailPanel`

- **Props:** `food: NormalizedFoodSummary`, `nutrition: NormalizedNutrition`, `onAdd(quantity, unit)`, `isLoadingDetail`
- **State:** local quantity + unit
- **Behavior:** Validates input; calls `addIngredient` from meal context

### `QuantityInput` / `UnitSelector`

- **Props:** `quantity`, `unit`, `onQuantityChange`, `onUnitChange`, `servingSizeGrams?`, `errors?`
- **State:** local or lifted to FoodDetailPanel
- **Behavior:** Disables "serving" unit if no serving size available

### `MealIngredientList` / `MealIngredientRow`

- **Props:** `ingredients: Ingredient[]`, `onRemove(id)`, `onUpdateQuantity?`
- **State:** none (from context)
- **Behavior:** Lists added items; remove updates totals

### `MealSummaryPanel`

- **Props:** `totals: NormalizedNutrition`, `ingredientCount: number`, `onClear`
- **State:** none (derived from context)
- **Behavior:** Sticky on desktop; prominent calories + protein

### `MacroStatCard`

- **Props:** `label`, `value`, `unit`, `emphasized?`
- **State:** none
- **Reusable** across summary and optional per-ingredient display

### Shared UI (`/components/ui/`)

- `Button`, `Input`, `Card`, `Spinner`, `Alert` — minimal Tailwind primitives

---

## State Ownership

| State | Owner | Scope | Persistence |
|-------|-------|-------|-------------|
| Search query | `useFoodSearch` hook | Component | Ephemeral |
| Search results | `useFoodSearch` hook | Component | Ephemeral |
| Selected food + detail | `useFoodSearch` hook | Component | Ephemeral |
| Meal ingredients | `MealContext` / Zustand | App-wide | Optional sessionStorage |
| Meal totals | Derived (selector/memo) | App-wide | Recomputed on ingredient change |
| UI toggles (panel open, etc.) | Local component state | Component | Ephemeral |

### Recommended: `MealContext` (or Zustand store)

```typescript
interface MealState {
  ingredients: Ingredient[];
  addIngredient: (payload: AddIngredientPayload) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, quantity: number, unit: Unit) => void;
  clearMeal: () => void;
  totals: NormalizedNutrition; // derived
}
```

### `useFoodSearch` hook

```typescript
interface FoodSearchState {
  query: string;
  setQuery: (q: string) => void;
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

---

## Data Flow Diagram

```
User Input (search)
    → useFoodSearch → /api/foods/search → results UI
    → selectFood → /api/foods/[fdcId] → FoodDetailPanel

User Input (quantity + Add)
    → FoodDetailPanel → mealStore.addIngredient()
    → calc engine scales nutrition
    → MealIngredientList + MealSummaryPanel re-render

User Action (remove)
    → mealStore.removeIngredient(id)
    → totals recalculated
```

---

## Responsive Layout

| Breakpoint | Layout |
|------------|--------|
| Mobile | Stacked: Search → Detail → List → Summary (summary sticky bottom optional) |
| Desktop (≥768px) | Two-column: Left (search + detail + list), Right (sticky summary panel) |

---

## Accessibility Requirements

- Search input: `<label>` + `aria-describedby` for hints
- Results list: `role="listbox"`, items `role="option"`
- Loading: `aria-live="polite"` region
- Macro values: semantic headings, sufficient contrast for emphasized cards
