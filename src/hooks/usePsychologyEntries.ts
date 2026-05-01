import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/lib/errors';

export type PsychologyEntry = Tables<'psychology_entries'>;
export type PsychologyEntryInsert = TablesInsert<'psychology_entries'>;
export type PsychologyEntryUpdate = TablesUpdate<'psychology_entries'>;

export function usePsychologyEntries() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['psychology_entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('psychology_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      return data as PsychologyEntry[];
    },
    enabled: !!user?.id,
  });

  const createEntry = useMutation({
    mutationFn: async (entry: Omit<PsychologyEntryInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('psychology_entries')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychology_entries', user?.id] });
      toast.success('Entrada guardada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...updates }: PsychologyEntryUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('psychology_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychology_entries', user?.id] });
      toast.success('Entrada actualizada');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('psychology_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychology_entries', user?.id] });
      toast.success('Entrada eliminada');
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, 'No se pudo eliminar la entrada.'));
    },
  });

  // Calculate stats from entries
  const stats = {
    avgDiscipline: entriesQuery.data?.length 
      ? entriesQuery.data.reduce((sum, e) => sum + (e.discipline_score ?? 0), 0) / entriesQuery.data.length 
      : 0,
    avgSleep: entriesQuery.data?.length 
      ? entriesQuery.data.reduce((sum, e) => sum + (e.sleep_quality ?? 0), 0) / entriesQuery.data.length 
      : 0,
    rulesFollowed: entriesQuery.data?.filter(e => e.followed_rules).length ?? 0,
    totalEntries: entriesQuery.data?.length ?? 0,
  };

  const latestEntry = entriesQuery.data?.[0] ?? null;

  return {
    entries: entriesQuery.data ?? [],
    isLoading: entriesQuery.isLoading,
    error: entriesQuery.error,
    stats,
    latestEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: entriesQuery.refetch,
  };
}
