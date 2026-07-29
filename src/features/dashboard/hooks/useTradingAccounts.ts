import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/shared/types/database';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/shared/lib/errors';
import { GUEST_MOCK_ACCOUNT } from '@/features/auth/utils/guestMockData';
import { syncAccountBalance } from '@/features/journal/hooks/useTrades';

export type TradingAccount = Tables<'trading_accounts'>;
export type TradingAccountInsert = TablesInsert<'trading_accounts'>;
export type TradingAccountUpdate = TablesUpdate<'trading_accounts'>;

const STORAGE_KEY = 'sdf:selected_account_id';
const SELECTED_QK = ['selected_account_id'] as const;

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(id: string | null) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function useSelectedAccountId() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: SELECTED_QK,
    queryFn: () => readStored(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const setSelectedAccountId = (id: string | null) => {
    writeStored(id);
    qc.setQueryData(SELECTED_QK, id);
  };
  return { selectedAccountId: data ?? null, setSelectedAccountId };
}

export function useTradingAccounts() {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();
  const { selectedAccountId, setSelectedAccountId } = useSelectedAccountId();

  // ── Guest mode: single static demo account ──
  const guestAccountNoOp = useMutation({
    mutationFn: async () => {
      toast.info('Registrate para gestionar tus cuentas.');
    },
  });

  const accountsQuery = useQuery({
    queryKey: ['trading_accounts', user?.id],
    queryFn: async () => {
      if (isGuest) return [GUEST_MOCK_ACCOUNT];
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data ?? []) as TradingAccount[];
    },
    enabled: !!user?.id || isGuest,
  });

  const accounts = accountsQuery.data ?? [];

  // Auto-select first account if none selected, or if stored id no longer exists
  useEffect(() => {
    if (!accounts.length) return;
    const stillExists = selectedAccountId && accounts.some((a) => a.id === selectedAccountId);
    if (!stillExists) {
      setSelectedAccountId(accounts[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.length, selectedAccountId]);

  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) ?? accounts[0] ?? null;

  const createAccount = useMutation({
    mutationFn: async (account: Omit<TradingAccountInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('trading_accounts')
        .insert({ ...account, user_id: user.id } as TradingAccountInsert)
        .select()
        .single();
      if (error) throw error;
      return data as TradingAccount;
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['trading_accounts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
      if (created?.id) setSelectedAccountId(created.id);
      toast.success('Cuenta creada correctamente');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo crear la cuenta.'));
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...updates }: TradingAccountUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading_accounts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
      toast.success('Cuenta actualizada');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo actualizar.'));
    },
  });

  const updateBalance = useMutation({
    mutationFn: async ({ accountId, balance }: { accountId: string; balance: number }) => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .update({ current_balance: balance })
        .eq('id', accountId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading_accounts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
    },
  });

  const updateInitialBalance = useMutation({
    mutationFn: async ({ accountId, initialBalance }: { accountId: string; initialBalance: number }) => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .update({ initial_balance: initialBalance })
        .eq('id', accountId)
        .select()
        .single();
      if (error) throw error;
      if (user?.id) {
        await syncAccountBalance(user.id, accountId);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['trading_account'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['analytics_snapshots'] });
      toast.success('Balance inicial actualizado');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo actualizar el balance inicial.'));
    },
  });

  const deactivateAccount = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('trading_accounts')
        .update({ is_active: false })
        .eq('id', accountId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading_accounts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
    },
  });

  if (isGuest) {
    return {
      accounts: [GUEST_MOCK_ACCOUNT],
      selectedAccount: GUEST_MOCK_ACCOUNT,
      selectedAccountId: GUEST_MOCK_ACCOUNT.id,
      setSelectedAccountId: () => {},
      isLoading: false,
      error: null,
      createAccount: () => guestAccountNoOp.mutateAsync(),
      updateAccount: () => guestAccountNoOp.mutateAsync(),
      updateBalance: () => guestAccountNoOp.mutateAsync(),
      updateInitialBalance: () => guestAccountNoOp.mutateAsync(),
      deactivateAccount: () => guestAccountNoOp.mutateAsync(),
      isCreating: false,
      isUpdating: false,
      isUpdatingInitialBalance: false,
      refetch: accountsQuery.refetch,
    };
  }

  return {
    accounts,
    selectedAccount,
    selectedAccountId: selectedAccount?.id ?? null,
    setSelectedAccountId,
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
    createAccount: createAccount.mutateAsync,
    updateAccount: updateAccount.mutateAsync,
    updateBalance: updateBalance.mutateAsync,
    updateInitialBalance: updateInitialBalance.mutateAsync,
    deactivateAccount: deactivateAccount.mutateAsync,
    isCreating: createAccount.isPending,
    isUpdating: updateAccount.isPending,
    isUpdatingInitialBalance: updateInitialBalance.isPending,
    refetch: accountsQuery.refetch,
  };
}
