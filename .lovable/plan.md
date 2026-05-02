## Process Validator System

Implements a post-trade validation modal that triggers after closing a trade, evaluates adherence to plan (5 questions), and shows context-aware AI feedback celebrating discipline over P&L.

### Database (new migration)

Two new tables with RLS (user owns rows):

**`process_validations`**
- `id uuid pk`, `user_id uuid not null`, `trade_id uuid not null`
- `matched_setup bool`, `respected_sl bool`, `correct_position_size bool`, `waited_confirmation bool`, `closed_as_planned bool`
- `adherence_score int` (0–5), `reflection_note text`, `ai_message_type text`, `ai_message_shown text`
- `created_at timestamptz default now()`
- Unique `(user_id, trade_id)` so each trade is validated once

**`user_streaks`**
- `id uuid pk`, `user_id uuid`, `streak_type text` (e.g. `validation`, `discipline`)
- `current_count int`, `best_count int`, `start_date date`, `last_activity_date date`
- `created_at`, `updated_at timestamptz`
- Unique `(user_id, streak_type)`

RLS: standard `auth.uid() = user_id` for select/insert/update/delete on both.

### Files to create

1. **`src/lib/ai-messages.ts`** — `getAIMessage(result, score, pnl)` returns one of 4 message variants (loss+discipline = celebration, win+no-discipline = warning, loss+no-discipline = intervention, win+discipline = excellence) plus breakeven neutral. Returns icon node, title, message, stat, suggested actions.

2. **`src/lib/streak-manager.ts`** — Helper `updateStreak(userId, streakType)` encapsulating the consecutive-day logic (increment if diff=1, no-op if 0, reset if >1, insert if missing).

3. **`src/hooks/useProcessValidation.ts`** — React Query mutation that inserts into `process_validations`, then calls `updateStreak(user.id, 'validation')`, invalidates `['trades']`, `['user-streaks']`, `['analytics']`. Uses `useAuth` from `@/contexts/AuthContext`.

4. **`src/components/trades/ProcessValidatorModal.tsx`** — 2-step Dialog:
   - Step 1: Trade summary (symbol/direction/PnL), 5 Yes/No adherence questions with Lucide icons, live discipline score 0–5 with colored progress bar.
   - Step 2: AI message card (color-coded by variant), suggested actions list, optional 500-char reflection textarea, Submit.
   - Auto-detects `win/loss/breakeven` from `trade.pnl`.

### File to modify

**`src/pages/Journal.tsx`** — In `handleAddTrade`, after a successful update/create where the resulting status is `'closed'` (and previously was open or new), open the validator with the closed trade. Add state `validatorOpen`, `tradeToValidate`. Render `<ProcessValidatorModal>` at the end of the JSX. Capture the returned trade record from `updateTrade.mutateAsync` / `createTrade.mutateAsync` to pass `id`, `pnl`, `pnl_percentage`, `symbol`, `direction`.

### Trigger logic

- Only fires when `status === 'closed'` and `pnl` is non-null.
- For edits: only open if the trade was previously open (avoid re-prompting on every edit). If validation already exists for that trade, skip (best-effort check via select before opening).

### Notes

- All UI strings in Spanish to match existing Journal page.
- Icons rendered as JSX elements inside `ai-messages.ts` (file becomes `.tsx`).
- Toast on save success/failure via `sonner`.
- Modal is closeable normally (unlike pre-market check-in).
