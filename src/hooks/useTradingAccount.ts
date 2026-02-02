import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
      toast.error(`Error al crear cuenta: ${error.message}`);
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

  return {
    account: accountQuery.data ?? null,
    isLoading: accountQuery.isLoading,
    error: accountQuery.error,
    createAccount,
    updateAccount,
    updateBalance,
    refetch: accountQuery.refetch,
  };
}
