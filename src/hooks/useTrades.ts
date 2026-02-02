import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Trade = Tables<'trades'>;
export type TradeInsert = TablesInsert<'trades'>;
export type TradeUpdate = TablesUpdate<'trades'>;

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
      toast.success('Operación creada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al crear operación: ${error.message}`);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
      toast.success(`${data.length} operaciones importadas`);
    },
    onError: (error) => {
      toast.error(`Error al importar: ${error.message}`);
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
  };
}
