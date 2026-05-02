## Taxímetro de Malos Hábitos

System that detects psychological trading errors, quantifies their dollar cost, and surfaces them via a Psychology tab + Dashboard widget + a blocking pre-trade alert.

### Database (new migration)

**`psychological_errors`** table with RLS (`auth.uid() = user_id` for all CRUD):
- `id`, `user_id`, `trade_id` (nullable)
- `error_type text` (`revenge_trading | fomo | overtrading | risk_exceeded | no_stop_loss | holding_losers`)
- `confidence text` (`high | medium | low`), `reason text`
- `cost_dollars numeric default 0`, `was_prevented boolean default false`
- `metadata jsonb`, `timestamp timestamptz default now()`, `created_at`
- Index on `(user_id, timestamp desc)`

### Files to create

1. **`src/lib/error-detection.ts`** — Pure detection logic:
   - `ErrorType` union, `DetectedError` interface.
   - `detectPsychologicalErrors(currentTrade, recentTrades, todayCheckIn)` — checks: revenge trading (<15 min after a loss), overtrading (exceeds `max_daily_trades`), risk exceeded (`stop_loss` distance > `max_risk_per_trade`%), missing stop loss, FOMO keyword in notes.
   - `calculateErrorCost(errorType, trade, historicalData)` — uses real loss when present, else multiplies user's avg loss.

2. **`src/hooks/useTaxometer.ts`** — React Query hook reading `psychological_errors` for the user, computing `{ totalCost, weekCost, monthCost, quarterCost, savingsFromImprovement }` and grouping by `error_type`. Also exports a `logError(...)` mutation that inserts a row.

3. **`src/components/psychology/TaxometerDashboard.tsx`** — Full dashboard:
   - Hero card with total lost, tangible comparison ($500 = "Un curso profesional", etc.).
   - 4 period stat cards (week / month / quarter / total).
   - Recharts bar chart of cost per error type with semantic-token colors.
   - List breakdown with counts per type.
   - Optional savings card.
   - Empty state when no errors detected yet.

4. **`src/components/psychology/TaxometerWidget.tsx`** — Compact card for Dashboard showing total + this-week cost + small CTA linking to `/psychology` taxímetro tab. Uses semantic tokens (warning/destructive). Empty state: "Sin errores registrados — sigue así".

5. **`src/components/psychology/TaxometerAlert.tsx`** — `AlertDialog` triggered before opening risky trades:
   - Lists high-confidence detected errors.
   - Shows estimated historical cost.
   - 60-second reflection countdown progress bar before "Continuar de todas formas" enables.
   - "Cancelar trade" primary action.

### Files to modify

- **`src/pages/Psychology.tsx`** — Add a 4th tab `taxometer` with `DollarSign` icon rendering `<TaxometerDashboard />`.
- **`src/pages/Dashboard.tsx`** — Insert `<TaxometerWidget />` in the metrics/cards grid.
- **`src/pages/Journal.tsx`** — On submit of a new (open or closed) trade, run `detectPsychologicalErrors` against today's check-in (`usePreMarketCheckIn`) and recent trades (`useTrades`); if any high-confidence error: open `<TaxometerAlert>`. On "Cancelar" abort save; on "Continuar" save the trade AND insert a `psychological_errors` row via `useTaxometer.logError`. Also auto-log post-close errors when applicable (e.g. `no_stop_loss` confirmed) using the closed trade's loss as `cost_dollars`.

### Notes

- All copy in Spanish.
- All colors via semantic tokens (`destructive`, `warning`, `success`, `muted-foreground`) — no hardcoded hex in components. The chart uses HSL values resolved from CSS vars.
- Types: extend project types or use lightweight local interfaces (`PreMarketCheckIn` shape already exists in `src/lib/checkin-helpers.ts`; `Trade` from `@/hooks/useTrades`).
- `useAuth` from `@/contexts/AuthContext` (project does not have a `useAuth` hook file).
