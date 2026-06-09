## Goal

Add a React Testing Library test for the Journal "Add Trade" dialog that covers:

1. **Happy path** — fill all required fields, submit, verify `createTrade` is called with the right payload and a success toast.
2. **Invalid path** — submit with negative Stop Loss / Take Profit (the bug scenario), verify inline field errors render, focus/scroll moves to the first invalid field, and the error toast lists the offending fields.

## File

New: `src/features/journal/__tests__/Journal.addTradeFlow.test.tsx`

Sits next to the existing `Journal.addTrade.test.ts` (which is a source-grep smoke test). The new file is a real RTL render test.

## Approach

Render `<Journal />` wrapped in the minimal providers it needs:

- `QueryClientProvider` (fresh `QueryClient` per test, retries off)
- `MemoryRouter`
- `LanguageProvider` (already used app-wide)
- `AuthContext` mock provider supplying `{ user: { id: 'test-user' } }`
- `ThemeProvider` if required by children

Mock the following modules with `vi.mock`:

- `@/config/supabase` → minimal `supabase` whose `from('trades').insert(...).select().single()` resolves to a fake row, and `from('trading_accounts')` / `from('trades').select` return empty data so `syncAccountBalance` is a no-op.
- `@/features/dashboard/hooks/useTradingAccounts` → `useSelectedAccountId` returns `{ selectedAccountId: 'acc-1' }`.
- `sonner` → spy on `toast.success` / `toast.error`.
- Heavy children that aren't relevant (e.g. `TaxometerAlert`, `ImportPreviewModal`, `ProcessValidatorModal`) → stub to `() => null` to keep the render cheap.
- `scrollIntoView` on `HTMLElement.prototype` → `vi.fn()` (jsdom doesn't implement it; needed for the auto-scroll assertion).

## Test cases

### 1. `saves a valid trade and shows success toast`

- Click "Agregar operación" / "Nueva operación" button to open the dialog.
- Use `userEvent` to fill: Symbol, Direction (select Long), Entry Price, Quantity, Entry Date (already pre-filled to today — leave as-is), Stop Loss = `4300`, Take Profit = `4350`, Strategy, Notes.
- Leave status as Abierta so exit fields are not required.
- Click "Registrar operación".
- Assert: `supabase.from('trades').insert` called once with object containing `symbol`, `direction: 'long'`, `entry_price: <number>`, `quantity: <number>`, `user_id: 'test-user'`.
- Assert: `toast.success` called with `/creada correctamente/i`.
- Assert: dialog closes (`queryByRole('dialog')` is null).

### 2. `shows inline errors and focuses the first invalid field on negative SL/TP`

- Open dialog, fill required fields validly, then enter Stop Loss = `-105.60` and Take Profit = `-105.60`.
- Click "Registrar operación".
- Assert: `toast.error` called with a string matching `/Stop Loss/` and `/Take Profit/`.
- Assert: Stop Loss input has `aria-invalid="true"` and an adjacent message matching `/mayor a 0/i`.
- Assert: same for Take Profit.
- Assert: `HTMLElement.prototype.scrollIntoView` was called (the auto-scroll wired in `handleAddTrade`).
- Assert: `supabase.from('trades').insert` was NOT called.

### 3. `lists missing required fields in the error toast when submitting empty form`

- Open dialog, immediately submit.
- Assert: `toast.error` called with a string containing `Símbolo`, `Precio entrada`, `Cantidad`.
- Assert: corresponding inputs have `aria-invalid="true"`.

## Notes / risks

- The dialog trigger label and exact form labels need to be read from `Journal.tsx` before writing the test — selectors will use `getByRole('button', { name: /…/ })` and `getByLabelText(/…/i)` keyed to the Spanish labels actually in the component.
- If `LanguageProvider` defaults to EN we will force `LanguageProvider` initial language to ES (the labels in the bug report are Spanish) or query by `name`/placeholder that is language-agnostic.
- No production code changes. Only the new test file. If a missing test-only shim is needed (e.g. `scrollIntoView` polyfill), it goes into the test file itself, not into `src/app/test/setup.ts`, to keep this PR scoped.
- Run with `bunx vitest run src/features/journal/__tests__/Journal.addTradeFlow.test.tsx`.
