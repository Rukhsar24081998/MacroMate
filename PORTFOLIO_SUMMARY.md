# MacroMate — Portfolio Summary

A case study for PM and product-focused engineering portfolios.

---

## Problem

Fitness-focused users eat custom meals with multiple ingredients but struggle to calculate nutrition quickly. Existing tools require excessive manual entry, label hunting, and spreadsheet math — causing users to miss protein targets and abandon tracking.

**Goal:** Calculate a custom meal's nutrition in **under one minute**.

---

## Solution

MacroMate is a web app that lets users:

1. Search USDA FoodData Central for ingredients
2. Set quantity (grams, ml, or servings)
3. Build a multi-ingredient meal
4. View aggregated calories and macros instantly

No accounts, no database, no AI — just a fast, trustworthy core loop.

**Live demo:** _Add Vercel URL after deployment_

---

## Product Decisions

| Decision | Rationale |
|----------|-----------|
| **USDA FoodData Central as sole data source** | Standardized, authoritative nutrition data without maintaining a food database |
| **Next.js API proxy** | Keeps API key server-side; enables validation and consistent error shapes |
| **Foundation + SR Legacy filter** | Cleaner per-100g analytical data vs. noisy branded foods |
| **Client-side nutrition math** | Instant recalculation on quantity change; no round-trips |
| **sessionStorage persistence** | Survives refresh without auth or database (MVP scope) |
| **Search alias layer** | User testing showed cultural food names (omelette, roti, paneer) don't match USDA naming — static alias map improves discoverability without AI |
| **No auth / saved meals in MVP** | Ship core loop first; validate workflow before expanding scope |

---

## Tradeoffs

| Tradeoff | What we chose | Cost |
|----------|---------------|------|
| **ml ≈ g for liquids** | MVP simplification (1 ml = 1 g) | Inaccurate for milk, oil, etc. — documented limitation |
| **In-memory USDA cache** | Fast repeat searches; simple implementation | Unbounded growth possible under heavy traffic |
| **Static alias map** | Lightweight, maintainable, no LLM | Manual curation; some aliases return generic USDA matches |
| **sessionStorage only** | No backend persistence | Meal lost when tab/browser session ends |
| **10 search results max** | Scannable UI | User may not find food without refining query |
| **Missing nutrients on some USDA foods** | Display `—` and exclude from sum | Incomplete totals for some Foundation foods (e.g. raw chicken breast calories) |

---

## Lessons Learned

1. **User language ≠ USDA language** — Testing with real search terms (omelette, tandoori chicken, chapati) revealed a discoverability gap solved by a normalization layer, not more API features.

2. **Transparency builds trust** — Showing "Showing results for: cottage cheese" when the user searched "paneer bhurji" reduces confusion when USDA naming differs from user expectations.

3. **Phase-based delivery works** — Six phases (setup → search → quantity → meal → summary → polish → deploy) kept scope controlled and demoable at every step.

4. **Pure functions for nutrition** — Centralizing `scaleNutrition` and `calculateMealTotals` with unit tests prevented calculation bugs as UI grew.

5. **Portfolio value is in packaging** — A working MVP plus clear problem/solution narrative matters more than feature count for PM portfolios.

---

## Technical Highlights

- **Next.js 15** App Router with TypeScript
- **37 unit tests** covering nutrition math, search aliases, session parsing, UI empty states
- **Accessible search** — combobox pattern, keyboard navigation, focus indicators
- **Skeleton loaders** — no blank loading states during USDA fetches
- **Structured error handling** — typed API errors with retry UX

---

## Metrics & Success Criteria (MVP)

| Criterion | Status |
|-----------|--------|
| Build a meal in under 1 minute | ✅ Achievable in user testing |
| Search → add → view totals | ✅ Core loop complete |
| Persist meal across refresh | ✅ sessionStorage |
| Keyboard-only food selection | ✅ Arrow / Enter / Escape |
| Mobile-usable layout | ✅ Responsive with tap targets |

---

## Future Roadmap

**Phase 2 — Convenience**
- Saved meals, recent searches, favorite foods

**Phase 3 — AI-assisted entry**
- Natural language: "50g oats, 180ml milk"

**Phase 4 — Progress tracking**
- Weight tracking, weekly summaries

**Phase 5 — Personalization**
- Calorie/protein targets, goal-based insights

See [`docs/roadmap.md`](docs/roadmap.md).

---

## Demo Script (60 seconds)

1. Open `/meal-builder`
2. Search **"oats dry"** → select oats → add **100g**
3. Search **"chicken breast"** → add **100g**
4. Search **"milk"** (alias → fluid milk) → add **100g**
5. Point to **nutrition summary** — totals update live
6. **Refresh page** — meal persists
7. Optional: search **"omelette"** — show alias banner

---

## Links

- [README](README.md) — setup and overview
- [DEPLOYMENT.md](DEPLOYMENT.md) — Vercel deploy guide
- [Production checklist](docs/PRODUCTION_VERIFICATION_CHECKLIST.md)
- [Implementation plan](docs/implementation_plan.md)
