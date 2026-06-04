import { useTradingAccounts } from './useTradingAccounts';
import type { TradingAccount, TradingAccountInsert, TradingAccountUpdate } from './useTradingAccounts';

export type { TradingAccount, TradingAccountInsert, TradingAccountUpdate };

/**
 * Backward-compatible single-account hook.
 * Internally delegates to useTradingAccounts and returns the currently selected account.
 */
export function useTradingAccount() {
  const {
    selectedAccount,
    isLoading,
    error,
    createAccount,
    updateAccount,
    updateBalance,
    updateInitialBalance,
    isCreating,
    isUpdating,
    isUpdatingInitialBalance,
    refetch,
  } = useTradingAccounts();

  return {
    account: selectedAccount,
    isLoading,
    error,
    createAccount,
    updateAccount,
    updateBalance,
    updateInitialBalance,
    isUpdatingInitialBalance,
    isCreating,
    isUpdating,
    refetch,
  };
}
