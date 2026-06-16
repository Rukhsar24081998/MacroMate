# MacroMate

Build custom meals and calculate calories and macronutrients in under one minute — powered by [USDA FoodData Central](https://fdc.nal.usda.gov/).

**Live Demo:** _Add your Vercel URL after deployment_

**GitHub Repository:** [github.com/Rukhsar24081998/MacroMate](https://github.com/Rukhsar24081998/MacroMate)

---

## Problem Statement

Fitness-focused individuals often eat custom meals with multiple ingredients, but calculating nutrition means jumping between labels, search engines, and spreadsheets. That friction makes it hard to hit protein and calorie targets consistently.

MacroMate solves this with a single workflow: **search → quantity → add → summary**.

---

## Why I Built MacroMate

I built MacroMate during my own fitness journey, when hitting daily calorie and protein targets meant manually adding up labels, guessing portions, and rebuilding the same meals in spreadsheets every week.

Custom meals — eggs, chicken, rice, snacks combined on one plate — were especially painful. Existing tools were built around logging packaged foods or full recipes, not the way I actually ate.

MacroMate is the product I wanted: search real foods, set a quantity, build a meal, and see the nutrition impact immediately. The goal is to make meal nutrition tracking fast enough that it becomes a habit, not a chore.

---

## Key Product Decisions

### USDA FoodData Central as Source of Truth

USDA FoodData Central is the authoritative public nutrition database for the United States. MacroMate uses it as the **single source of truth** instead of maintaining a custom food database.

That choice keeps data standardized and credible, reduces long-term maintenance, and lets the product focus on UX and calculation logic rather than curating nutrition tables.

**Trade-offs:** USDA naming does not always match how people search (e.g. cultural dish names). Some Foundation foods list nutrition per 100g without household serving sizes. MacroMate addresses discoverability with search normalization and serving-size fallbacks where USDA provides portion data — without replacing USDA as the underlying data source.

### Dashboard-Based Meal Builder

Early layouts treated search, food detail, and meal summary as stacked sections on one page. User testing showed too much scrolling and lost context — especially when adjusting quantity after selecting a food.

The product was redesigned into a **three-column dashboard**: search on the left, selected food and quantity in the center, and meal summary on the right. That layout keeps the full workflow visible on desktop and preserves the same mental model on mobile through a stacked, scroll-aware layout.

### No Authentication in MVP

Authentication, saved meals, and user profiles were intentionally deferred. The first problem to solve was **accurate meal nutrition calculation in one session** — search, quantity, add, summary — without account friction.

Session persistence via `sessionStorage` lets users refresh the page without losing their meal, which covers the most common MVP use case. Auth and saved meals remain on the post-MVP roadmap once the core loop is proven.

---

## Architecture

![MacroMate Architecture](docs/screenshots/architecture-diagram.png)

MacroMate is a **client-heavy, server-proxied** Next.js application. The browser owns meal state and all nutrition calculations; the Next.js server acts as a thin API proxy to USDA FoodData Central, keeping the API key off the client.

### Layers

| Layer | Role |
|-------|------|
| **User** | Interacts via the browser to search foods, configure quantities, and build meals. |
| **Frontend (Next.js)** | Four UI surfaces: Food Search, Selected Food Panel, Meal Builder, and Nutrition Summary Dashboard. |
| **State** | `MealProvider` (React Context), custom hooks (`useMeal`, `useFoodSearch`), and session persistence sync meal data in memory and to `sessionStorage`. |
| **API** | Server route handlers `/api/foods/search` and `/api/foods/[fdcId]` validate input, proxy requests, and normalize USDA responses. |
| **External Service** | USDA FoodData Central API provides food search and per-100g nutrient profiles. |
| **Business Logic** | Pure TypeScript functions handle search normalization, quantity conversion, nutrition scaling, and meal total calculation. |
| **Storage** | `sessionStorage` persists the ingredient list across page refresh (no database in MVP). |

### Data flow

1. User searches for a food in the browser.
2. The frontend calls a Next.js API route.
3. The route proxies the request to USDA FoodData Central.
4. Normalized nutrition data is returned to the client.
5. The user adds ingredients to the meal builder.
6. The nutrition engine scales macros by quantity.
7. The summary dashboard updates meal totals.
8. Ingredients are saved to `sessionStorage`.

See [`docs/technical_architecture.md`](docs/technical_architecture.md) for the full technical write-up.

---

## Features

- **USDA food search** — debounced search with loading, empty, and error states
- **Search normalization** — search normalization framework for improving food discoverability and USDA search compatibility
- **Quantity input** — grams, milliliters, or servings (when USDA serving data exists)
- **Meal builder** — add, edit, and remove multiple ingredients
- **Nutrition summary** — calories, protein, carbs, fat, and fiber totals
- **Session persistence** — meal survives page refresh via `sessionStorage`
- **Keyboard search** — arrow keys, Enter, and Escape for mouse-free selection
- **Mobile-friendly layout** — responsive meal builder with accessible tap targets

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data source | USDA FoodData Central API v1 |
| State | React Context + custom hooks |
| Persistence | `sessionStorage` (meal only) |
| Tests | Vitest + Testing Library |

---

## Screenshots

![MacroMate Architecture](docs/screenshots/architecture-diagram.png)

_Add portfolio screenshots to [`docs/screenshots/`](docs/screenshots/) after deployment:_

| File | Description |
|------|-------------|
| `meal-builder-empty.png` | Empty meal builder with search |
| `meal-builder-search.png` | Search results with alias notice |
| `meal-builder-ingredients.png` | Meal with multiple ingredients |
| `meal-builder-mobile.png` | Mobile layout |
| `nutrition-summary.png` | Nutrition totals panel |

Example markdown once images are added:

```markdown
![Meal Builder](docs/screenshots/meal-builder-ingredients.png)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [USDA FoodData Central API key](https://fdc.nal.usda.gov/api-key-signup.html) (free)

### Setup

```bash
git clone <your-repo-url>
cd MacroMate
npm install
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
USDA_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000/meal-builder](http://localhost:3000/meal-builder).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm test` | Run unit tests |
| `npm run lint` | ESLint |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `USDA_API_KEY` | Yes | USDA FoodData Central API key (server-side only) |
| `USDA_API_BASE_URL` | No | Override API base URL (default: `https://api.nal.usda.gov/fdc/v1`) |

See [`.env.example`](.env.example) for a template. **Never commit `.env.local` or expose the API key to the browser.**

---

## Project Structure

```
app/                  Next.js routes and API handlers
components/           UI components (meal-builder, layout, ui)
lib/                  Nutrition logic, USDA client, search aliases, hooks
providers/            React Context (MealProvider)
types/                Shared TypeScript types
phases/               Phase-based development docs (0–6)
docs/                 Planning and architecture docs
```

Phase deliverables and code-path mapping: [`phases/README.md`](phases/README.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Vercel deployment and production setup |
| [`PORTFOLIO_SUMMARY.md`](PORTFOLIO_SUMMARY.md) | Case study for PM portfolio |
| [`docs/PRODUCTION_VERIFICATION_CHECKLIST.md`](docs/PRODUCTION_VERIFICATION_CHECKLIST.md) | Pre-launch QA checklist |
| [`docs/mvp_blueprint.md`](docs/mvp_blueprint.md) | Full MVP architecture |
| [`docs/implementation_plan.md`](docs/implementation_plan.md) | Phase-by-phase build plan |

---

## Future Roadmap

**Post-MVP (not in scope today):**

- Saved meals and recent searches
- Natural language meal entry
- Daily nutrition dashboard
- Weight and goal tracking
- Personalized calorie/protein targets

See [`docs/roadmap.md`](docs/roadmap.md) for the full product roadmap.

---

## License

Private / portfolio project — update as needed.
