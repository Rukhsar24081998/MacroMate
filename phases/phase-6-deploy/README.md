# Phase 6 — Deploy & Documentation

**Objective:** Public demo for PM portfolio.  
**Complexity:** Low (1 day)  
**Dependencies:** Phase 5  
**Status:** Complete

## Deliverables

- [x] Production build verified (`npm run build`)
- [x] Environment variables documented (`.env.example`, README, DEPLOYMENT.md)
- [x] Deployment guide (`DEPLOYMENT.md`)
- [x] Portfolio case study (`PORTFOLIO_SUMMARY.md`)
- [x] Production verification checklist (`docs/PRODUCTION_VERIFICATION_CHECKLIST.md`)
- [x] README updated (overview, setup, roadmap, screenshots section)
- [ ] Deploy to Vercel (manual step — see DEPLOYMENT.md)
- [ ] Live URL added to README after deploy
- [ ] Screenshots captured and added to `docs/screenshots/`

## Code paths

- `README.md`, `DEPLOYMENT.md`, `PORTFOLIO_SUMMARY.md`
- `.env.example`
- `docs/PRODUCTION_VERIFICATION_CHECKLIST.md`
- `app/api/foods/search/route.ts`, `app/api/foods/[fdcId]/route.ts` — production API routes
- Dev-only logging gated by `NODE_ENV === "development"`

## Deploy checklist

- [ ] `USDA_API_KEY` set in Vercel environment variables
- [ ] `npm run build` passes in CI (optional GitHub Action in DEPLOYMENT.md)
- [ ] Live URL tested using production verification checklist
- [ ] README updated with live demo link

## Reference

- [`DEPLOYMENT.md`](../../DEPLOYMENT.md)
- [`PORTFOLIO_SUMMARY.md`](../../PORTFOLIO_SUMMARY.md)
- [`docs/prd.md`](../../docs/prd.md) — Success metrics
