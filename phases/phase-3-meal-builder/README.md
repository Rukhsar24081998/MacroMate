# Phase 3 — Meal Builder

**Objective:** Users can add multiple ingredients and manage the meal list.  
**Complexity:** Medium (2 days)  
**Dependencies:** Phase 2  
**Status:** Complete ✓

## Deliverables

- [x] "Add to meal" action from food selection flow
- [x] Meal ingredient list with remove button
- [x] Edit quantity inline (expand row editor)
- [x] Clear meal / remove individual ingredient
- [x] In-memory meal state (React Context)

## Code paths

- `app/meal-builder/layout.tsx`
- `providers/meal-provider.tsx`
- `lib/hooks/use-meal.ts`
- `lib/nutrition/ingredient.ts`
- `components/meal-builder/meal-builder-page.tsx`, `add-to-meal-button.tsx`, `meal-ingredient-list.tsx`, `meal-ingredient-row.tsx`, `ingredient-info.tsx`, `clear-meal-button.tsx`, `food-detail-panel.tsx`
- `types/state.ts` (`MealState`), `types/ingredient.ts`

## Try it

```bash
npm run dev
```

Open [http://localhost:3000/meal-builder](http://localhost:3000/meal-builder), search for foods, add ingredients, edit quantities, and remove items.

## Notes

- `MealProvider` scoped to `/meal-builder` route only
- Per-ingredient `scaledNutrition` stored on add/update; meal totals deferred to Phase 4

## Reference

- [`docs/mvp_blueprint.md`](../../docs/mvp_blueprint.md) — Meal Builder Page
