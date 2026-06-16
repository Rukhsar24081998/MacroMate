# Phase 2 — Quantity Input & Ingredient Model

**Objective:** Users can specify how much of a selected food they are adding.  
**Complexity:** Medium (2–3 days)  
**Dependencies:** Phase 1  
**Status:** Complete ✓

## Deliverables

- [x] Quantity input component (numeric + unit selector)
- [x] Supported units: grams, milliliters, servings
- [x] `Ingredient` model with base nutrition snapshot
- [x] Unit conversion logic (`convertToGrams`)
- [x] Validation (positive numbers, reasonable bounds)

## Code paths

- `components/meal-builder/quantity-input.tsx`, `numeric-input.tsx`, `unit-selector.tsx`, `food-detail-panel.tsx`
- `lib/nutrition/convert.ts`, `lib/nutrition/constants.ts`, `lib/nutrition/validate.ts`, `lib/nutrition/calculate.ts`
- `types/ingredient.ts` (`Unit`, `AddIngredientPayload`, `Ingredient`)

## Try it

```bash
npm run dev
```

Open [http://localhost:3000/meal-builder](http://localhost:3000/meal-builder), search for a food, select it, and enter a quantity.

## Notes

- MVP simplification: treat ml ≈ g for liquids
- Disable "serving" unit when USDA serving size is unavailable
- Scaled nutrition preview shown for valid quantity input

## Reference

- [`docs/database_schema.md`](../../docs/database_schema.md)
