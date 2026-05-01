import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/lib/errors';

export type TradingAccount = Tables<'trading_accounts'>;
export type TradingAccountInsert = TablesInsert<'trading_accounts'>;
export type TradingAccountUpdate = TablesUpdate<'trading_accounts'>;

export function useTradingAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const accountQuery = useQuery({
    queryKey: ['trading_account', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as TradingAccount | null;
    },
    enabled: !!user?.id,
  });

  const createAccount = useMutation({
    mutationFn: async (account: Omit<TradingAccountInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('trading_accounts')
        .insert({ ...account, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
      toast.success('Cuenta actualizada');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
    },
  });

  // Inline initial-balance update used by the Portfolio Balance card
  const updateInitialBalance = useMutation({
    mutationFn: async ({ accountId, initialBalance }: { accountId: string; initialBalance: number }) => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .update({ initial_balance: initialBalance })
        .eq('id', accountId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate account + trades so analytics (drawdown, win-rate, equity) recompute
      queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['analytics_snapshots'] });
      toast.success('Balance inicial actualizado');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo actualizar el balance inicial.'));
    },
  });

  return {
    account: accountQuery.data ?? null,
    isLoading: accountQuery.isLoading,
    error: accountQuery.error,
    createAccount: createAccount.mutateAsync,
    updateAccount: updateAccount.mutateAsync,
    updateBalance: updateBalance.mutateAsync,
    updateInitialBalance: updateInitialBalance.mutateAsync,
    isUpdatingInitialBalance: updateInitialBalance.isPending,
    isCreating: createAccount.isPending,
    isUpdating: updateAccount.isPending,
    refetch: accountQuery.refetch,
  };
}
