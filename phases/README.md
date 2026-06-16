# MacroMate — Phase-Based Development Structure

This directory organizes the MVP build into **7 phases** aligned with [`docs/implementation_plan.md`](../docs/implementation_plan.md).

## How to use

- Each `phase-N-*` folder has a `README.md` with deliverables, status checklist, and **code path mapping**.
- Implementation code lives in the standard Next.js paths (`app/`, `components/`, `lib/`, etc.).

## Phases

| Folder | Phase | Objective |
|--------|-------|-----------|
| [`phase-0-setup/`](phase-0-setup/) | 0 | Project setup & foundation |
| [`phase-1-food-search/`](phase-1-food-search/) | 1 | Food search & selection |
| [`phase-2-quantity/`](phase-2-quantity/) | 2 | Quantity input & ingredient model |
| [`phase-3-meal-builder/`](phase-3-meal-builder/) | 3 | Meal builder |
| [`phase-4-nutrition-summary/`](phase-4-nutrition-summary/) | 4 | Nutrition calculation & summary |
| [`phase-5-polish/`](phase-5-polish/) | 5 | UX polish & hardening |
| [`phase-6-deploy/`](phase-6-deploy/) | 6 | Deploy & documentation |

## Dependency chain

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Do not start a phase until its dependencies are complete.
