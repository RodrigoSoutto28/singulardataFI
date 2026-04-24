# Plan: Journal Fixes + iOS 26 Liquid Glass Redesign + Verification

## Part 1 — Fix Trade CRUD in Journal (`src/pages/Journal.tsx`)

**Problems detected:**
- The "Edit" item in each trade row's dropdown has no `onClick` handler — it does nothing.
- The Add Trade form cannot close trades (missing `exit_price`, `exit_date`, `pnl`, `status`).
- Creating/saving operations sometimes fails because the form does not branch between create vs. update.

**Changes:**
- Add `editingTrade: Trade | null` state.
- Import `updateTrade` from `useTrades()`.
- Expand `formData` with `exit_price`, `exit_date`, `pnl`, `pnl_percentage`, `status`.
- Wire the row dropdown "Edit" item to set `editingTrade`, prefill `formData`, and open the dialog.
- Refactor `handleAddTrade` to call `updateTrade.mutateAsync({ id: editingTrade.id, ...payload })` when editing, otherwise `createTrade.mutateAsync(payload)`.
- Reset `editingTrade` and `formData` on dialog close.
- Adapt dialog title/CTA labels based on edit vs. create mode.

## Part 2 — iOS 26 "Liquid Glass" Aesthetic

**Global CSS (`src/index.css`):**
- Add utilities:
  - `.glass` → `backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg` (dark) / `bg-white/60` (light)
  - `.glass-card`, `.glass-sidebar`, `.glass-topbar`, `.glass-dialog` variants with adjusted opacity/blur.
- Subtle inner highlight via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)`.

**UI primitives:**
- `src/components/ui/card.tsx` → glass base with hover border lift.
- `src/components/ui/dialog.tsx` → glass content + stronger overlay blur.
- `src/components/ui/badge.tsx` → translucent variant.

**Layout:**
- `src/components/layout/Sidebar.tsx` → glass sidebar.
- `src/components/layout/TopBar.tsx` → glass topbar.
- `src/components/effects/CorporateGrid.tsx` → keep grid + add soft gradient orbs so glass has something to refract.

**Dashboard widgets:** apply glass to `StatCard`, `CapitalCard`, `MentalStateCard`, `EquityChart`, `TasksCard`, `AIInsightCard`, `AchievementBadges`, `MetricCard`, `AccountSetupModal`.

**Pages:** apply glass containers to `Dashboard`, `Journal`, `Analytics`, `Psychology`, `Insights`, `Settings`, `Auth`.

**Color strategy:**
- Dark: `bg-white/5–10` + `border-white/10`
- Light: `bg-white/60–80` + `border-black/5`
- Always paired with `backdrop-blur-xl`.

## Part 3 — Verification

After implementation:
1. Log in and create a new trade → confirm it persists and balance syncs.
2. Click Edit on an existing trade → confirm prefill + save works.
3. Delete a trade → confirm removal.
4. Import a CSV and an Excel file → confirm `ImportPreviewModal` shows counts, errors, and selection works; confirm import.
5. Navigate Dashboard / Journal / Analytics / Psychology / Insights / Settings → confirm glass effect is consistent and legible in light + dark mode.
6. Test mobile viewport (375px) for sidebar sheet + responsive grids.

## Files to modify
1. `src/index.css`
2. `src/components/ui/card.tsx`
3. `src/components/ui/dialog.tsx`
4. `src/components/ui/badge.tsx`
5. `src/components/layout/Sidebar.tsx`
6. `src/components/layout/TopBar.tsx`
7. `src/components/effects/CorporateGrid.tsx`
8. `src/pages/Journal.tsx` (CRUD fixes + glass)
9. `src/pages/Dashboard.tsx`
10. `src/pages/Analytics.tsx`
11. `src/pages/Psychology.tsx`
12. `src/pages/Insights.tsx`
13. `src/pages/Settings.tsx`
14. `src/pages/Auth.tsx`
15. `src/components/dashboard/*.tsx` (StatCard, CapitalCard, MentalStateCard, EquityChart, TasksCard, AIInsightCard, AchievementBadges, MetricCard, AccountSetupModal)

## Execution order
1. CSS glass utilities
2. UI primitives (card, dialog, badge)
3. Layout (sidebar, topbar, background)
4. Journal CRUD fixes
5. Dashboard widgets + remaining pages
6. Browser verification (CRUD + import + visual audit)
