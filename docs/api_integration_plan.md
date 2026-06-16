# MacroMate — API Integration Plan

## Overview

MacroMate integrates with the **USDA FoodData Central API v1** as the sole external data source. All integration goes through **Next.js Route Handlers**; the browser never calls USDA directly.

**Base URL:** `https://api.nal.usda.gov/fdc/v1`

**Authentication:** API key via query param `api_key` (server-side only)

---

## How Food Search Works

### Trigger

- User types ≥2 characters in search input
- Client debounces 300–500ms, then calls internal API

### Internal API

```
GET /api/foods/search?q={query}&pageSize={n}&page={n}
```

**Query validation:**

- `q`: required, string, 2–100 chars, trimmed
- `pageSize`: optional, default 10, max 25
- `page`: optional, default 1

### USDA Request

```
GET https://api.nal.usda.gov/fdc/v1/foods/search
  ?api_key={USDA_API_KEY}
  &query={encodedQuery}
  &pageSize={pageSize}
  &pageNumber={page}
  &dataType=Foundation,SR Legacy
```

**Why filter dataType:** Foundation and SR Legacy foods have consistent per-100g analytical values. Branded foods add noise and inconsistent serving sizes for MVP.

### Response Normalization

USDA returns `{ foods: [...], totalHits, currentPage, totalPages }`.

Map each food to:

```typescript
{
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
}
```

Return to client:

```json
{
  "foods": [],
  "pagination": { "page": 1, "pageSize": 10, "totalHits": 142 }
}
```

### UX Behaviors

- Show top 10 results; "Load more" optional (Phase 5 polish)
- Empty state: "No foods found. Try a different search."
- Highlight match in food name (optional polish)

---

## How Nutrition Data Is Retrieved

Search results contain **abridged** nutrient data. For accurate calculations, fetch **full food detail** after selection.

### Internal API

```
GET /api/foods/{fdcId}
```

**Validation:** `fdcId` must be positive integer

### USDA Request

```
GET https://api.nal.usda.gov/fdc/v1/food/{fdcId}?api_key={USDA_API_KEY}
```

### Nutrient Extraction

Parse `foodNutrients[]` array. Map by `nutrient.id` or `nutrient.name`:

| Nutrient | USDA ID (typical) | Unit |
|----------|-------------------|------|
| Energy | 1008 | kcal |
| Protein | 1003 | g |
| Carbohydrate, by difference | 1005 | g |
| Total lipid (fat) | 1004 | g |
| Fiber, total dietary | 1079 | g |

**Energy fallback:** Some records use nutrient 1062 (kJ). Convert: `kcal = kJ / 4.184` if 1008 missing.

**Base reference:** For Foundation/SR Legacy, amounts are per **100g**.

Also extract:

- `servingSize` + `servingSizeUnit` (for serving-based quantity input)
- `householdServingFullText` (display only)

### Client Storage

On "Add to meal," snapshot `baseNutrition` into the `Ingredient` object so totals remain stable even if user removes and re-adds (no re-fetch needed for same ingredient in meal).

---

## Rate Limit Considerations

### USDA Limits

| Key Type | Limit |
|----------|-------|
| Registered API key | ~1,000 requests/hour per IP |
| DEMO_KEY | 30/hour, 50/day |

**Action:** Require registered key for all environments except initial local spike testing.

### Response Headers (monitor)

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`

Log remaining count server-side in dev; surface graceful degradation in prod.

### Mitigation Strategies (MVP)

1. **Debounced search** — reduces search calls (~1 per typed word, not per keystroke)
2. **Min query length** — 2 chars prevents overly broad queries
3. **Fetch detail on selection only** — not for every search result
4. **In-memory server cache** — LRU Map keyed by `query` and `fdcId` (TTL 30–60 min)
5. **Client deduplication** — cache fetched `fdcId` details in hook state
6. **Avoid redundant calls** — don't re-fetch food detail when adjusting quantity

### Estimated Usage (typical meal)

- ~5–8 search requests (debounced)
- ~3–5 detail requests (one per unique ingredient)
- **~10–13 API calls per meal** → well within 1,000/hour for demo and moderate use

### 429 Handling

When rate limited:

- Return `{ error: "RATE_LIMITED", retryAfter: 3600 }` with HTTP 429
- Client shows: "Search temporarily unavailable. Please try again in a few minutes."
- Do **not** auto-retry aggressively on 429 (key blocked for 1 hour)

---

## Error Handling

### Error Categories

| Category | USDA/HTTP Signal | MacroMate Response | Client UX |
|----------|------------------|--------------------|-----------|
| Invalid API key | 403 | 500 + log alert | Generic error + check deployment |
| Rate limited | 429 | 429 + `RATE_LIMITED` | User-friendly cooldown message |
| Food not found | 404 | 404 + `NOT_FOUND` | "Food not found" |
| Bad input | — | 400 + validation message | Inline field error |
| USDA timeout | network/504 | 504 + `UPSTREAM_TIMEOUT` | "Try again" + retry button |
| USDA 5xx | 502/503 | 502 + `UPSTREAM_ERROR` | Retry button (max 2 retries, exponential backoff) |
| Malformed USDA response | parse error | 500 + log | Generic error |

### Standard Error Shape

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Human-readable message"
  }
}
```

### Client Error Handling

- `useFoodSearch`: sets `error` state; UI shows `SearchStatus` alert with retry
- Failed detail fetch: keep selection, show retry on FoodDetailPanel
- Network offline: detect `TypeError` on fetch → "Check your connection"

### Server Error Handling

```typescript
// Pseudocode pattern for route handlers
try {
  validateInput(params);
  const response = await fetch(usdaUrl, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) mapStatusToError(response.status);
  const data = await response.json();
  return NextResponse.json(normalize(data));
} catch (error) {
  return NextResponse.json({ error: { code, message } }, { status });
}
```

### Logging (dev/prod)

- Log: endpoint, query/fdcId, status, rate-limit remaining
- Do **not** log: full API key
- Portfolio demo: optional Vercel log drain review

---

## Environment Configuration

| Variable | Location | Required |
|----------|----------|----------|
| `USDA_API_KEY` | Server only (`.env.local`, Vercel) | Yes |
| `USDA_API_BASE_URL` | Server (default: official URL) | No |

**Signup:** https://fdc.nal.usda.gov/api-key-signup.html (free)

---

## Testing Strategy (Integration)

- Mock USDA responses in unit tests for normalizer and calc engine
- Manual integration tests with real API key (limited)
- Contract test: verify nutrient ID mapping against 3–5 known foods (oats, chicken breast, milk, peanut butter, whey proxy)

---

## Out of Scope (API)

- Batch `/foods` endpoint (not needed until saved meals preload multiple IDs)
- `/foods/list` pagination (no local catalog sync)
- Branded/barcode-specific flows
- Webhooks or background sync
