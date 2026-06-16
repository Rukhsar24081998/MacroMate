# MacroMate — Database Schema (MVP Assessment)

## Is a Database Necessary for V1?

**No.** This aligns with `technical_constraints.md`: *"No database required for V1"* and *"Nutrition data fetched directly from USDA API"*.

### Justification

| Requirement | V1 Solution | Why DB isn't needed |
|-------------|-------------|---------------------|
| Food catalog | USDA API (live) | USDA maintains 300K+ foods; duplicating is out of scope |
| Meal building | In-memory React state | Single-user, session-scoped; no persistence requirement in MVP |
| User accounts | Out of scope | No auth → no user records |
| Saved meals | Out of scope (Phase 2) | Deferred to roadmap |
| Search history / favorites | Out of scope (Phase 2) | Deferred |
| Analytics | Optional client events or external tool | No server-side storage required for portfolio demo |

### Trade-offs Accepted for V1

- Meal lost on full page close (unless optional `sessionStorage`)
- Repeated searches hit USDA API (mitigated by debounce + server-side cache)
- No cross-device sync

### When to Add a Database

Phase 2 (saved meals, recent searches, favorites) or when introducing auth.

---

## V1 Data Models (In-Memory / TypeScript Only)

These are **application types**, not DB tables.

### `NormalizedFoodSummary` (search result)

| Field | Type | Description |
|-------|------|-------------|
| fdcId | number | USDA food identifier |
| description | string | Food name |
| dataType | string | Foundation, SR Legacy, Branded, etc. |
| brandOwner | string \| null | Brand if branded food |
| servingSize | number \| null | Grams per serving (if available) |
| servingSizeUnit | string \| null | e.g., "g", "ml" |

### `NormalizedNutrition` (per 100g base)

| Field | Type | Unit |
|-------|------|------|
| calories | number \| null | kcal |
| protein | number \| null | g |
| carbohydrates | number \| null | g |
| fat | number \| null | g |
| fiber | number \| null | g |

### `Ingredient` (meal line item)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Client-generated UUID |
| fdcId | number | Source food reference |
| name | string | Display name (snapshot) |
| quantity | number | User-entered amount |
| unit | `'g' \| 'ml' \| 'serving'` | Unit enum |
| baseNutrition | NormalizedNutrition | Per 100g snapshot at add time |
| servingSizeGrams | number \| null | For serving unit conversion |
| scaledNutrition | NormalizedNutrition | Computed at add/update time |

### `Meal` (aggregate)

| Field | Type | Description |
|-------|------|-------------|
| ingredients | Ingredient[] | Ordered list |
| totals | NormalizedNutrition | Derived sum |

---

## Optional Client Persistence (Not a Database)

**`sessionStorage` key:** `macromate:meal:v1`

```json
{
  "ingredients": [],
  "updatedAt": "ISO-8601"
}
```

- Survives page refresh within same tab/session
- Cleared when tab closes
- No schema migration needed for MVP

---

## Phase 2 Database Schema (Future Reference)

Included for planning continuity; **not built in MVP**.

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| email | varchar unique | When auth added |
| created_at | timestamp | |

### `saved_meals`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK → users | |
| name | varchar | e.g., "Morning Oats" |
| created_at | timestamp | |
| updated_at | timestamp | |

### `saved_meal_ingredients`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| meal_id | uuid FK → saved_meals | |
| fdc_id | integer | USDA reference |
| name | varchar | Denormalized for display |
| quantity | decimal | |
| unit | varchar | g, ml, serving |
| base_nutrition | jsonb | Snapshot per 100g |
| sort_order | integer | |

### `recent_searches` / `favorite_foods`

Lightweight tables keyed by `user_id` + `fdc_id` with `searched_at` / `favorited_at`.

**Recommendation for Phase 2:** Postgres via Supabase or Neon; Prisma ORM for type safety with Next.js.
