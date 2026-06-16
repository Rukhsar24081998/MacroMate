# Phase 0 — Project Setup & Foundation

**Objective:** Runnable Next.js app with tooling, env config, and USDA API connectivity.  
**Complexity:** Low (1–2 days)  
**Dependencies:** None  
**Status:** Complete ✓

## Deliverables

- [x] Next.js App Router + TypeScript + Tailwind CSS
- [x] Environment variable setup (`USDA_API_KEY` in `.env.local`)
- [x] API route stubs (`/api/foods/search`, `/api/foods/[fdcId]`)
- [x] Basic layout shell (header, main content area)
- [x] README with local dev instructions

## Code paths

- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.env.example`
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `app/api/foods/search/route.ts`, `app/api/foods/[fdcId]/route.ts`
- `components/ui/*`, `components/layout/header.tsx`
- `README.md`, `docs/project_structure.md`

## Verify

```bash
npm install
npm run build
npm run dev
```
