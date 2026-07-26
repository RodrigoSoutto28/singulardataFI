import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/shared/types/database';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/shared/lib/errors';
import { useSelectedAccountId } from '@/features/dashboard/hooks/useTradingAccounts';
import { GUEST_MOCK_TRADES } from '@/features/auth/utils/guestMockData';

export type Trade = Tables<'trades'>;
export type TradeInsert = TablesInsert<'trades'>;
export type TradeUpdate = TablesUpdate<'trades'>;

// Helper: sync the active account balance based on P&L of closed trades in THAT account
async function syncAccountBalance(userId: string, accountId: string | null) {
  let accountQuery = supabase
    .from('trading_accounts')
    .select('id, initial_balance')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (accountId) {
    accountQuery = accountQuery.eq('id', accountId);
  } else {
    accountQuery = accountQuery.order('created_at', { ascending: true }).limit(1);
  }

  const { data: account, error: accountError } = await accountQuery.maybeSingle();
  if (accountError || !account) return;

  // Solo incluir trades con account_id explícito de ESTA cuenta.
  // Los trades legados (account_id = null) solo se atribuyen a la primera cuenta
  // cuando no se seleccionó ninguna cuenta específica (accountId === null).
  let tradesQuery = supabase
    .from('trades')
    .select('pnl')
    .eq('user_id', userId)
    .eq('status', 'closed');

  if (accountId) {
    // Cuenta específica: solo sus trades explícitos + legados sin asignar
    tradesQuery = tradesQuery.or(`account_id.eq.${account.id},account_id.is.null`);
  } else {
    // Sin cuenta seleccionada: solo los trades sin account_id (verdaderos legados)
    tradesQuery = tradesQuery.is('account_id', null);
  }

  const { data: trades, error: tradesError } = await tradesQuery;
  if (tradesError) return;

  const totalPnl = trades?.reduce((sum, t) => sum + (t.pnl ?? 0), 0) ?? 0;
  const newBalance = (account.initial_balance ?? 0) + totalPnl;

  await supabase
    .from('trading_accounts')
    .update({ current_balance: newBalance })
    .eq('id', account.id);
}


export function useTrades() {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();
  const { selectedAccountId } = useSelectedAccountId();

  // ── Guest mode: return demo data, all mutations are no-ops ──
  const guestNoOp = useMutation({
    mutationFn: async () => {
      toast.info('Registrate para guardar tus operaciones.');
    },
  });

  const tradesQuery = useQuery({
    queryKey: ['trades', user?.id, selectedAccountId],
    queryFn: async () => {
      if (isGuest) return GUEST_MOCK_TRADES;
      if (!user?.id) return [];

      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id);

      // If an account is selected, show its trades + legacy trades without account_id
      if (selectedAccountId) {
        query = query.or(`account_id.eq.${selectedAccountId},account_id.is.null`);
      }

      const { data, error } = await query.order('entry_date', { ascending: false });
      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user?.id || isGuest,
  });

  const invalidateAndSyncBalance = async () => {
    // Invalida tanto la lista completa como la vista paginada del Journal
    await queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['trades-infinite', user?.id] });
    if (user?.id) {
      await syncAccountBalance(user.id, selectedAccountId);
      await queryClient.invalidateQueries({ queryKey: ['trading_accounts', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['trading_account', user?.id] });
    }
  };


  const createTradeMutation = useMutation({
    mutationFn: async (trade: Omit<TradeInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const payload: TradeInsert = {
        ...trade,
        user_id: user.id,
        account_id: trade.account_id ?? selectedAccountId ?? null,
      } as TradeInsert;

      const { data, error } = await supabase
        .from('trades')
        .insert(payload)
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

  const createTrade = (trade: Omit<TradeInsert, 'user_id'>) => createTradeMutation.mutateAsync(trade);

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
      toast.error(getUserErrorMessage(error, 'No se pudo actualizar.'));
    },
  });

  const deleteTrade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await invalidateAndSyncBalance();
      toast.success('Operación eliminada');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo eliminar.'));
    },
  });

  const importTradesMutation = useMutation({
    mutationFn: async (trades: Omit<TradeInsert, 'user_id'>[]) => {
      if (!user?.id) throw new Error('User not authenticated');

      const tradesWithUser = trades.map((trade) => ({
        ...trade,
        user_id: user.id,
        account_id: trade.account_id ?? selectedAccountId ?? null,
      }));

      // Check if any of the trades has an import_row_hash
      const hasHash = tradesWithUser.some((t) => t.import_row_hash !== undefined && t.import_row_hash !== null);

      let query;
      if (hasHash) {
        query = supabase
          .from('trades')
          .upsert(tradesWithUser as TradeInsert[], {
            onConflict: 'user_id,import_row_hash',
            ignoreDuplicates: true,
          });
      } else {
        query = supabase
          .from('trades')
          .insert(tradesWithUser as TradeInsert[]);
      }

      const { data, error } = await query.select();

      if (error) throw error;
      return data ?? [];
    },
    onSuccess: async () => {
      await invalidateAndSyncBalance();
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudieron importar las operaciones.'));
    },
  });

  const importTrades = async (trades: Omit<TradeInsert, 'user_id'>[]) => importTradesMutation.mutateAsync(trades);

  // In guest mode, replace all mutations with friendly no-ops
  if (isGuest) {
    return {
      trades: tradesQuery.data ?? GUEST_MOCK_TRADES,
      isLoading: tradesQuery.isLoading,
      error: null,
      createTrade: guestNoOp,
      updateTrade: guestNoOp,
      deleteTrade: guestNoOp,
      importTrades: async () => {
        toast.info('Registrate para guardar tus operaciones.');
        return [];
      },
      refetch: tradesQuery.refetch,
      syncBalance: () => Promise.resolve(),
      invalidateAndSyncBalance: async () => {},
    };
  }

  return {
    trades: tradesQuery.data ?? [],
    isLoading: tradesQuery.isLoading,
    error: tradesQuery.error,
    createTrade,
    updateTrade,
    deleteTrade,
    importTrades,
    refetch: tradesQuery.refetch,
    syncBalance: () => (user?.id ? syncAccountBalance(user.id, selectedAccountId) : Promise.resolve()),
    invalidateAndSyncBalance,
  };
}
