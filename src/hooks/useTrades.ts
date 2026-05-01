import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/lib/errors';

export type Trade = Tables<'trades'>;
export type TradeInsert = TablesInsert<'trades'>;
export type TradeUpdate = TablesUpdate<'trades'>;

// Helper function to sync account balance based on closed trades P&L
async function syncAccountBalance(userId: string) {
  // Get the active trading account
  const { data: account, error: accountError } = await supabase
    .from('trading_accounts')
    .select('id, initial_balance')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (accountError || !account) return;

  // Calculate total P&L from closed trades
  const { data: trades, error: tradesError } = await supabase
    .from('trades')
    .select('pnl')
    .eq('user_id', userId)
    .eq('status', 'closed');

  if (tradesError) return;

  const totalPnl = trades?.reduce((sum, t) => sum + (t.pnl ?? 0), 0) ?? 0;
  const newBalance = (account.initial_balance ?? 0) + totalPnl;

  // Update the account balance
  await supabase
    .from('trading_accounts')
    .update({ current_balance: newBalance })
    .eq('id', account.id);
}

export function useTrades() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tradesQuery = useQuery({
    queryKey: ['trades', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user?.id,
  });

  const invalidateAndSyncBalance = async () => {
    await queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
    if (user?.id) {
      await syncAccountBalance(user.id);
      await queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
    }
  };

  const createTrade = useMutation({
    mutationFn: async (trade: Omit<TradeInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('trades')
        .insert({ ...trade, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await invalidateAndSyncBalance();
      toast.success('Operación creada correctamente');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo crear la operación. Inténtalo de nuevo.'));
    },
  });

  const updateTrade = useMutation({
    mutationFn: async ({ id, ...updates }: TradeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await invalidateAndSyncBalance();
      toast.success('Operación actualizada');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const deleteTrade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await invalidateAndSyncBalance();
      toast.success('Operación eliminada');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  const importTrades = useMutation({
    mutationFn: async (trades: Omit<TradeInsert, 'user_id'>[]) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const tradesWithUser = trades.map(trade => ({
        ...trade,
        user_id: user.id,
      }));

      const { data, error } = await supabase
        .from('trades')
        .insert(tradesWithUser)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      await invalidateAndSyncBalance();
      toast.success(`${data.length} operaciones importadas`);
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudieron importar las operaciones.'));
    },
  });

  return {
    trades: tradesQuery.data ?? [],
    isLoading: tradesQuery.isLoading,
    error: tradesQuery.error,
    createTrade,
    updateTrade,
    deleteTrade,
    importTrades,
    refetch: tradesQuery.refetch,
    syncBalance: () => user?.id ? syncAccountBalance(user.id) : Promise.resolve(),
  };
}
