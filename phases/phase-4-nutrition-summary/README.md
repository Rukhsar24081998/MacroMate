# Phase 4 — Nutrition Calculation & Meal Summary

**Objective:** Display accurate meal-level totals for all MVP nutrients.  
**Complexity:** Medium (2 days)  
**Dependencies:** Phase 3  
**Status:** Complete ✓

## Deliverables

- [x] Calculation engine (pure functions, unit-tested)
- [x] Per-ingredient nutrition breakdown
- [x] Nutrition summary: Calories, Protein, Carbs, Fat, Fiber
- [x] Prominent calories + protein display
- [x] Edge case handling for missing nutrients

## Code paths

- `lib/nutrition/calculate.ts`, `lib/nutrition/format.ts`, `lib/nutrition/constants.ts`
- `lib/nutrition/calculate.test.ts`
- `components/meal-builder/nutrition-summary.tsx`, `meal-totals.tsx`, `ingredient-macros.tsx`, `macro-stat-card.tsx`
- `providers/meal-provider.tsx` (derived `totals`)
- `types/nutrition.ts` (`MacroKey`)

## Try it

```bash
npm run dev
npm test
```

Add ingredients at `/meal-builder` — per-row macros and sticky meal totals update automatically.

## Reference

- [`docs/mvp_blueprint.md`](../../docs/mvp_blueprint.md) — Nutrition Summary Section
