## Goal

Make the Import Preview Modal a clear pre-save audit report so the user can verify, before confirming, exactly **what was detected, what was mapped, what was ignored, and per file**.

## What changes (UI only — parser engine stays as-is)

### 1. New "Detection Report" header section in `ImportPreviewModal.tsx`
A grid of three cards, replacing the small inline summary, shown above the stats:

- **Broker / Source detected** — large pill with `metadata.brokerDetected` (cTrader, MT5, Binance, IBKR, …) and "Generic" fallback styling.
- **Delimiter / Header row / Quality** — same data already shown, regrouped.
- **File hash** — moved here for compactness.

### 2. New "Field Mapping" panel (collapsible, open by default)
A two-column table built from `metadata.columnMapping`:

```text
Internal field        ←  Detected header
─────────────────────────────────────────
symbol                ←  "Symbol"
direction             ←  "Side"
entryPrice            ←  "Open Price"
…
```

- Green check for mapped fields, amber warning for items in `metadata.missingColumns` ("not found in file").
- Uses `FIELD_LABELS` so labels are human-readable (already exported, will be re-exposed from the hook if needed).

### 3. New "Unmapped headers" panel
List `metadata.unmappedHeaders` as badges. Empty-state: "All headers were recognized." Helps the user spot data the engine ignored (e.g. swap, commission, tags).

### 4. New "Per-file report" panel (only in multi-file mode)
Replace the current single-line summary built in `Journal.tsx` (lines 379-382) with a real per-file table inside the modal:

| File | Broker | Rows valid / total | Ignored | Missing fields | Unmapped headers |
|---|---|---|---|---|---|
| trades-mt5.csv | MT5 | 42 / 48 | 6 | — | Swap, Comment |
| binance.csv | Binance | 17 / 17 | 0 | takeProfit | Fee Coin |

Powered by passing `multi.files: FileParseResult[]` into the modal as a new optional prop `perFileReports`. Single-file imports omit this section.

### 5. Add "Trade Origin" column in the trades table when multi-file
Show `trade.sourceFile` (already populated) as a compact badge in a new column, hidden in single-file mode.

### 6. Wiring in `Journal.tsx`
- Pass `multi.files` to the modal as `perFileReports`.
- Stop stuffing the multi-file summary into `previewErrors` (lines 378-386) — the new panel replaces it. Only real errors remain.
- For single-file flow, no behavior change.

## Files to touch

- `src/features/journal/components/ImportPreviewModal.tsx` — new sections + Origin column + props.
- `src/features/journal/Journal.tsx` — pass `perFileReports`, drop summary-as-error injection.
- `src/features/journal/hooks/useImportTrades.ts` — export `FIELD_LABELS` (one-line export, no logic change).

## Out of scope

- No parser changes, no new broker support, no DB changes.
- i18n keys are added inline in Spanish to match the rest of the modal (already partially hard-coded ES).
