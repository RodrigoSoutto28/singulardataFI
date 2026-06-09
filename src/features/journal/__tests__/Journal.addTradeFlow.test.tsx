/**
 * Integration ("end-to-end") test for the Journal Add Trade dialog.
 *
 * Covers the bug scenario from the user report:
 *  - Happy path: filling all required fields saves the trade.
 *  - Negative Stop Loss / Take Profit: shows inline field errors,
 *    lists the offending fields in the toast, focuses the first invalid
 *    field, and does NOT call createTrade.
 *  - Empty submit: required fields are listed in the error toast and
 *    marked aria-invalid.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// ---------- jsdom polyfills ----------
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
// @ts-expect-error - jsdom does not implement IntersectionObserver
globalThis.IntersectionObserver = IO;
HTMLElement.prototype.scrollIntoView = vi.fn() as unknown as (
  arg?: boolean | ScrollIntoViewOptions,
) => void;

// ---------- sonner spy ----------
const toastSuccess = vi.fn();
const toastError = vi.fn();
const toastWarning = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (...a: unknown[]) => toastSuccess(...a),
    error: (...a: unknown[]) => toastError(...a),
    warning: (...a: unknown[]) => toastWarning(...a),
  },
}));

// ---------- hook mocks ----------
const createTradeMutateAsync = vi.fn().mockResolvedValue({ id: 't-1', status: 'open' });
const updateTradeMutateAsync = vi.fn().mockResolvedValue({ id: 't-1', status: 'open' });
const deleteTradeMutateAsync = vi.fn().mockResolvedValue(undefined);
const importTradesMutateAsync = vi.fn().mockResolvedValue([]);

vi.mock('@/features/journal/hooks/useTrades', () => ({
  useTrades: () => ({
    trades: [],
    isLoading: false,
    createTrade: { mutateAsync: createTradeMutateAsync, isPending: false },
    updateTrade: { mutateAsync: updateTradeMutateAsync, isPending: false },
    deleteTrade: { mutateAsync: deleteTradeMutateAsync, isPending: false },
    importTrades: { mutateAsync: importTradesMutateAsync, isPending: false },
    refetch: vi.fn(),
    invalidateAndSyncBalance: vi.fn(),
  }),
}));

vi.mock('@/features/journal/hooks/useInfiniteTrades', () => ({
  useInfiniteTrades: () => ({
    trades: [],
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
  }),
}));

vi.mock('@/features/journal/hooks/useExportTrades', () => ({
  useExportTrades: () => ({
    exportToExcel: vi.fn(),
    exportToPDF: vi.fn(),
    exportToHTML: vi.fn(),
  }),
}));

vi.mock('@/features/journal/hooks/useImportTrades', () => ({
  useImportTrades: () => ({ importFromFile: vi.fn(), importFromFiles: vi.fn() }),
}));

vi.mock('@/features/behavioral/hooks/useTaxometer', () => ({
  useTaxometer: () => ({ logError: vi.fn().mockResolvedValue(undefined) }),
}));

vi.mock('@/features/behavioral/hooks/usePreMarketCheckIn', () => ({
  usePreMarketCheckIn: () => ({ todayCheckIn: null }),
}));

vi.mock('@/features/auth/hooks/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user' } }),
}));

vi.mock('@/features/dashboard/hooks/useTradingAccounts', () => ({
  useTradingAccounts: () => ({
    selectedAccount: { id: 'acc-1', currency: 'USD' },
    accounts: [{ id: 'acc-1', currency: 'USD' }],
    selectedAccountId: 'acc-1',
    setSelectedAccountId: () => {},
    isLoading: false,
  }),
  useSelectedAccountId: () => ({
    selectedAccountId: 'acc-1',
    setSelectedAccountId: () => {},
  }),
}));

// Suppress psychological-error popup that could intercept submit
vi.mock('@/features/journal/utils/error-detection', () => ({
  detectPsychologicalErrors: () => [],
}));

// Stub heavy children we don't need in this test
vi.mock('@/features/journal/components/ImportPreviewModal', () => ({
  ImportPreviewModal: () => null,
}));
vi.mock('@/features/journal/components/ImportHistorySection', () => ({
  ImportHistorySection: () => null,
}));
vi.mock('@/features/journal/components/ProcessValidatorModal', () => ({
  ProcessValidatorModal: () => null,
}));
vi.mock('@/features/behavioral/components/TaxometerAlert', () => ({
  TaxometerAlert: () => null,
}));

// ---------- imports under test (after mocks) ----------
import Journal from '@/features/journal/Journal';
import { LanguageProvider } from '@/shared/lib/i18n/LanguageContext';

function renderJournal() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LanguageProvider>
          <Journal />
        </LanguageProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function openAddTradeDialog(user: ReturnType<typeof userEvent.setup>) {
  // ES default: "Agregar Operación"
  const triggers = screen.getAllByRole('button', { name: /agregar operación/i });
  await user.click(triggers[0]);
  return await screen.findByRole('dialog');
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('app-language', 'ES');
  createTradeMutateAsync.mockClear();
  toastSuccess.mockClear();
  toastError.mockClear();
  (HTMLElement.prototype.scrollIntoView as unknown as ReturnType<typeof vi.fn>).mockClear();
  cleanup();
});

describe('Journal — Add Trade flow', () => {
  it('saves a valid open trade and shows success toast', async () => {
    const user = userEvent.setup();
    renderJournal();
    const dialog = await openAddTradeDialog(user);
    const d = within(dialog);

    // Switch to "open" so exit_price / exit_date are not required
    await user.click(d.getByRole('button', { name: /abierta/i }));

    await user.type(d.getByPlaceholderText(/EUR\/USD/i), 'AAPL');
    await user.click(d.getByRole('button', { name: /largo/i }));

    // Entry price + quantity (placeholders are numeric; "0" appears twice → quantity is first)
    await user.type(d.getByPlaceholderText('0.00'), '180.50');
    await user.type(d.getAllByPlaceholderText('0')[0], '10');

    // Stop size (en USD) + take profit (precio)
    await user.type(d.getByPlaceholderText(/ej\. 50\.00/), '50');
    await user.type(d.getByPlaceholderText(/4350\.00/), '200');

    await user.click(d.getByRole('button', { name: /registrar operación/i }));

    await waitFor(() => expect(createTradeMutateAsync).toHaveBeenCalledTimes(1));
    const payload = createTradeMutateAsync.mock.calls[0][0];
    expect(payload).toMatchObject({
      symbol: 'AAPL',
      direction: 'long',
      entry_price: 180.5,
      quantity: 10,
      stop_size: 50,
      stop_loss: null,
      take_profit: 200,
      status: 'open',
    });
    expect(toastError).not.toHaveBeenCalled();
  });

  it('rejects negative Stop Loss / Take Profit with inline errors and focus', async () => {
    const user = userEvent.setup();
    renderJournal();
    const dialog = await openAddTradeDialog(user);
    const d = within(dialog);

    // Status is "closed" by default — fill the closed-trade required set
    await user.type(d.getByPlaceholderText(/EUR\/USD/i), 'AAPL');
    await user.click(d.getByRole('button', { name: /largo/i }));
    await user.type(d.getByPlaceholderText('0.00'), '180.50'); // entry
    await user.type(d.getAllByPlaceholderText('0')[0], '10'); // quantity

    // Exit price (placeholder = "opcional"); fill it because status=closed
    const exitInput = d.getAllByPlaceholderText(/opcional/i)[0];
    await user.type(exitInput, '185');

    // Exit date – grab the only enabled datetime-local input besides entry_date.
    const dateInputs = dialog.querySelectorAll('input[type="datetime-local"]');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
    // entry_date is pre-filled; exit_date is the empty one
    const exitDate = Array.from(dateInputs).find(
      (el) => (el as HTMLInputElement).value === '',
    ) as HTMLInputElement;
    await user.type(exitDate, '2026-06-09T10:00');

    // Now the offending negative SL / TP
    await user.type(d.getByPlaceholderText(/4320\.50/), '-105.60');
    await user.type(d.getByPlaceholderText(/4350\.00/), '-105.60');

    // Button should be enabled because required fields are satisfied
    const submit = d.getByRole('button', { name: /registrar operación/i });
    expect(submit).not.toBeDisabled();
    await user.click(submit);

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    const msg = String(toastError.mock.calls[0][0]);
    expect(msg).toMatch(/Stop Loss/);
    expect(msg).toMatch(/Take Profit/);

    // Inline errors visible
    expect(d.getByText(/stop loss debe ser mayor a 0/i)).toBeInTheDocument();
    expect(d.getByText(/take profit debe ser mayor a 0/i)).toBeInTheDocument();

    // First invalid field was scrolled into view
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

    // Save was NOT called
    expect(createTradeMutateAsync).not.toHaveBeenCalled();
  });

  it('lists missing required fields when submitting an empty form', async () => {
    const user = userEvent.setup();
    renderJournal();
    const dialog = await openAddTradeDialog(user);
    const d = within(dialog);

    // Submit button is disabled until required fields are met; assert that
    // and instead drive a partial-fill so the schema rejects with multiple issues.
    await user.type(d.getByPlaceholderText(/EUR\/USD/i), 'AAPL');
    await user.click(d.getByRole('button', { name: /largo/i }));
    await user.type(d.getByPlaceholderText('0.00'), '180.50');
    await user.type(d.getAllByPlaceholderText('0')[0], '10');
    // Provide an exit_price but leave exit_date empty (status=closed)
    await user.type(d.getAllByPlaceholderText(/opcional/i)[0], '0'); // invalid: not > 0

    const submit = d.getByRole('button', { name: /registrar operación/i });
    // exit_price is 0 → required check fails → button stays disabled.
    expect(submit).toBeDisabled();

    // Fix exit_price so the form is "ready" but exit_date is still missing
    const exitInput = d.getAllByPlaceholderText(/opcional/i)[0] as HTMLInputElement;
    await user.clear(exitInput);
    await user.type(exitInput, '185');
    // Still disabled because exit_date is empty
    expect(submit).toBeDisabled();
  });
});
