# Phase 1 — Food Search & Selection

**Objective:** Users can search USDA foods and pick one result.  
**Complexity:** Medium (2–3 days)  
**Dependencies:** Phase 0  
**Status:** Complete ✓

## Deliverables

- [x] Food search input with debounced queries (400ms)
- [x] Search results list (name, brand, data type badge)
- [x] Loading, empty, and error states
- [x] Food detail fetch on selection (full nutrient profile)
- [x] TypeScript types for normalized USDA responses

## Code paths

- `app/api/foods/search/route.ts`, `app/api/foods/[fdcId]/route.ts`
- `lib/usda/client.ts`, `lib/usda/normalizers.ts`, `lib/usda/constants.ts`, `lib/usda/cache.ts`
- `lib/hooks/use-food-search.ts`, `lib/hooks/use-debounce.ts`
- `components/meal-builder/food-search-section.tsx`, `search-input.tsx`, `search-results-list.tsx`, `search-result-item.tsx`, `search-status.tsx`, `food-detail-panel.tsx`, `food-info-header.tsx`
- `types/food.ts`, `types/api.ts`, `types/nutrition.ts`, `types/state.ts`
- `lib/utils/errors.ts`

## Try it

```bash
npm run dev
```

Open [http://localhost:3000/meal-builder](http://localhost:3000/meal-builder) and search for foods (e.g. "oats", "chicken").

## Reference

- [`docs/api_integration_plan.md`](../../docs/api_integration_plan.md)
