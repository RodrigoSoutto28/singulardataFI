import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { Tables } from '@/shared/types/database';

export type AIInsight = Tables<'ai_insights'>;

export function useInsights() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const insightsQuery = useQuery({
    queryKey: ['ai_insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AIInsight[];
    },
    enabled: !!user?.id,
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_insights', user?.id] });
    },
  });

  const markActionTaken = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_insights')
        .update({ action_taken: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_insights', user?.id] });
    },
  });

  const stats = {
    patternsDetected: insightsQuery.data?.filter(i => i.insight_type === 'pattern').length ?? 0,
    edgesFound: insightsQuery.data?.filter(i => i.insight_type === 'edge').length ?? 0,
    warnings: insightsQuery.data?.filter(i => i.severity === 'high' || i.insight_type === 'warning').length ?? 0,
    actionsTaken: insightsQuery.data?.filter(i => i.action_taken).length ?? 0,
  };

  const newInsights = insightsQuery.data?.filter(i => !i.is_read) ?? [];
  const readInsights = insightsQuery.data?.filter(i => i.is_read) ?? [];

  return {
    insights: insightsQuery.data ?? [],
    newInsights,
    readInsights,
    stats,
    isLoading: insightsQuery.isLoading,
    error: insightsQuery.error,
    markAsRead,
    markActionTaken,
    refetch: insightsQuery.refetch,
  };
}

