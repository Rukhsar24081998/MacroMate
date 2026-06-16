# MacroMate — Deployment Guide

Deploy MacroMate to [Vercel](https://vercel.com) (recommended for Next.js App Router).

---

## Prerequisites

- GitHub repository with MacroMate code
- Vercel account
- USDA FoodData Central API key ([sign up free](https://fdc.nal.usda.gov/api-key-signup.html))
- Local verification: `npm test` and `npm run build` pass

---

## Pre-Deploy Verification

Run locally before deploying:

```bash
npm test
npm run build
npm run start
```

Open [http://localhost:3000/meal-builder](http://localhost:3000/meal-builder) and confirm search → add → summary works.

**Note:** Do not run `npm run build` while `npm run dev` is active — this can corrupt the `.next` cache. Stop the dev server first.

---

## Vercel Deployment Steps

### 1. Push to GitHub

Ensure your latest code is on the default branch (`main` or `master`).

### 2. Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects **Next.js** — keep default settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** (default)
   - **Install Command:** `npm install`

### 3. Configure environment variables

In **Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|-------|--------------|
| `USDA_API_KEY` | Your USDA API key | Production, Preview, Development |

Optional:

| Name | Value |
|------|-------|
| `USDA_API_BASE_URL` | `https://api.nal.usda.gov/fdc/v1` |

**Important:** The API key is used only in server-side API routes (`/api/foods/*`). It is never exposed to the browser.

### 4. Deploy

Click **Deploy**. Vercel runs `npm run build` and publishes your app.

### 5. Update README

Add your live URL to `README.md`:

```markdown
**Live demo:** https://your-project.vercel.app
```

---

## Environment Variable Setup

### Local development

```bash
cp .env.example .env.local
# Edit .env.local and set USDA_API_KEY
```

### Vercel production

1. **Settings → Environment Variables**
2. Add `USDA_API_KEY`
3. Redeploy if you add variables after the first deploy

### Verify env is loaded

After deploy, test the search API:

```bash
curl "https://YOUR_DOMAIN.vercel.app/api/foods/search?q=oats&pageSize=3"
```

Expected: JSON with `foods` array and `searchNormalization` object.

If misconfigured, you may see:

```json
{ "error": { "code": "CONFIG_ERROR", "message": "..." } }
```

---

## Production Behavior

### API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/foods/search?q=...` | GET | USDA food search (proxied) |
| `/api/foods/[fdcId]` | GET | USDA food detail (proxied) |

### Error handling in production

- Validation errors → `400` with `{ error: { code, message } }`
- USDA rate limit → `429` with user-friendly message
- USDA timeout → `504`
- Missing API key → `500` (`CONFIG_ERROR`)
- Network failures → `502`

Client UI shows retry buttons for search and food-detail errors.

### Development-only code

The following runs **only** when `NODE_ENV === "development"` and is stripped from production behavior:

- Search normalization debug logging (`app/api/foods/search/route.ts`)
- USDA rate-limit header logging (`lib/usda/client.ts`)

No action required — production builds do not execute these paths.

---

## Production Verification Checklist

Use [`docs/PRODUCTION_VERIFICATION_CHECKLIST.md`](docs/PRODUCTION_VERIFICATION_CHECKLIST.md) for the full QA walkthrough.

Quick smoke test after deploy:

- [ ] Home page loads (`/`)
- [ ] Meal builder loads (`/meal-builder`)
- [ ] Search returns results (`oats`, `chicken breast`)
- [ ] Food detail loads after selection
- [ ] Add ingredient updates meal totals
- [ ] Refresh preserves meal (session persistence)
- [ ] Mobile layout readable (resize browser or use device)

---

## Troubleshooting

### 500 on `/meal-builder` locally

Corrupted `.next` cache:

```bash
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null
rm -rf .next
npm run dev
```

### Search returns CONFIG_ERROR

- Verify `USDA_API_KEY` is set in Vercel environment variables
- Redeploy after adding env vars

### Search returns 429

USDA rate limit exceeded. Wait a few minutes or verify your API key quota at [FoodData Central](https://fdc.nal.usda.gov/).

### Build fails on Vercel

- Confirm `npm run build` passes locally
- Check Vercel build logs for TypeScript or lint errors
- Ensure Node.js version is 18+ (Vercel default is fine)

---

## Optional: Custom Domain

1. Vercel → **Project → Settings → Domains**
2. Add your domain and follow DNS instructions
3. Update README live demo link

---

## Optional: CI (GitHub Actions)

Add `.github/workflows/ci.yml` to run tests on every push:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

Note: `npm run build` does not require `USDA_API_KEY` at build time (API routes are server functions). The key is required at **runtime** when API routes are called.
