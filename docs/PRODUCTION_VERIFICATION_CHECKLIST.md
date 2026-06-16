# Production Verification Checklist

Run this checklist after deploying MacroMate to Vercel (or any production host).

**Environment:** Production URL  
**Date:** _______________  
**Tester:** _______________

---

## 1. Search

| # | Test | Pass | Notes |
|---|------|------|-------|
| 1.1 | Home page (`/`) loads | ☐ | |
| 1.2 | Navigate to `/meal-builder` | ☐ | |
| 1.3 | Search **"oats"** returns results within ~3s | ☐ | |
| 1.4 | Search **"omelette"** shows alias banner ("egg omelet") | ☐ | |
| 1.5 | Search **"xyznotafood123"** shows empty state with hint | ☐ | |
| 1.6 | Search with 1 character shows "keep typing" message | ☐ | |
| 1.7 | Skeleton appears while search is loading | ☐ | |

---

## 2. USDA Integration

| # | Test | Pass | Notes |
|---|------|------|-------|
| 2.1 | API: `GET /api/foods/search?q=oats&pageSize=3` returns JSON | ☐ | |
| 2.2 | Response includes `foods`, `pagination`, `searchNormalization` | ☐ | |
| 2.3 | Select a search result — detail panel loads | ☐ | |
| 2.4 | Detail shows per-100g nutrition (calories, protein, etc.) | ☐ | |
| 2.5 | Food detail skeleton shows while loading | ☐ | |
| 2.6 | Invalid `fdcId` shows error (optional API test) | ☐ | |

---

## 3. Meal Builder

| # | Test | Pass | Notes |
|---|------|------|-------|
| 3.1 | Add ingredient at 100g — appears in "Your meal" | ☐ | |
| 3.2 | Add second ingredient — list shows 2 items | ☐ | |
| 3.3 | Edit quantity inline — macros update | ☐ | |
| 3.4 | Remove ingredient — removed from list | ☐ | |
| 3.5 | Clear meal — all ingredients removed | ☐ | |

---

## 4. Nutrition Calculations

| # | Test | Pass | Notes |
|---|------|------|-------|
| 4.1 | Single ingredient: row macros match detail panel | ☐ | |
| 4.2 | Multiple ingredients: summary totals = sum of rows | ☐ | |
| 4.3 | Change quantity — scaled nutrition updates correctly | ☐ | |
| 4.4 | Missing nutrients show `—` (e.g. some chicken entries) | ☐ | |

**Spot-check (optional):**

| Food | Qty | Expected cal (approx) |
|------|-----|----------------------|
| Oats (dry) | 100g | ~379 |
| Banana (raw) | 100g | ~89 |

---

## 5. Session Persistence

| # | Test | Pass | Notes |
|---|------|------|-------|
| 5.1 | Build meal with 2+ ingredients | ☐ | |
| 5.2 | Hard refresh (Cmd+R / F5) | ☐ | |
| 5.3 | Meal ingredients restored | ☐ | |
| 5.4 | Nutrition summary matches pre-refresh totals | ☐ | |
| 5.5 | Search query is **not** restored (expected) | ☐ | |

---

## 6. Mobile Responsiveness

Test at **375px width** (iPhone SE) or use device mode in DevTools.

| # | Test | Pass | Notes |
|---|------|------|-------|
| 6.1 | Layout is single column (no horizontal scroll) | ☐ | |
| 6.2 | Search input is tappable and readable | ☐ | |
| 6.3 | Search results list is scrollable | ☐ | |
| 6.4 | Ingredient rows readable (name + macros visible) | ☐ | |
| 6.5 | Edit / Remove buttons are tappable (44px min height) | ☐ | |
| 6.6 | Nutrition summary visible (scroll to bottom) | ☐ | |
| 6.7 | Add to meal button full width on mobile | ☐ | |

---

## 7. Keyboard & Accessibility

| # | Test | Pass | Notes |
|---|------|------|-------|
| 7.1 | Tab through search input and buttons | ☐ | |
| 7.2 | Arrow Down/Up navigates search results | ☐ | |
| 7.3 | Enter selects highlighted result | ☐ | |
| 7.4 | Escape dismisses search results | ☐ | |
| 7.5 | Focus ring visible on interactive elements | ☐ | |

---

## 8. Error Handling

| # | Test | Pass | Notes |
|---|------|------|-------|
| 8.1 | Disconnect network → search shows error + retry | ☐ | |
| 8.2 | Retry button works after reconnect | ☐ | |
| 8.3 | Food detail error shows retry (if simulatable) | ☐ | |

---

## Sign-off

| Area | Status |
|------|--------|
| Search | ☐ Pass / ☐ Fail |
| USDA integration | ☐ Pass / ☐ Fail |
| Meal builder | ☐ Pass / ☐ Fail |
| Nutrition calculations | ☐ Pass / ☐ Fail |
| Session persistence | ☐ Pass / ☐ Fail |
| Mobile responsiveness | ☐ Pass / ☐ Fail |

**Overall:** ☐ Ready for portfolio demo / ☐ Blockers remain

**Blockers (if any):**

_______________________________________________
