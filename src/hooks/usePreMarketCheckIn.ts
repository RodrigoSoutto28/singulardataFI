import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTodayDateString, type PreMarketCheckInData } from '@/lib/checkin-helpers';

export function usePreMarketCheckIn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = getTodayDateString();

  const query = useQuery({
    queryKey: ['pre-market-checkin', user?.id, today],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('pre_market_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  const saveCheckIn = useMutation({
    mutationFn: async (input: PreMarketCheckInData) => {
      if (!user?.id) throw new Error('No user');
      const { data, error } = await supabase
        .from('pre_market_checkins')
        .insert({
          user_id: user.id,
          checkin_date: today,
          allowed_setups: input.allowed_setups,
          max_risk_per_trade: input.max_risk_per_trade,
          max_daily_trades: input.max_daily_trades,
          emotional_state: input.emotional_state,
          goals_today: input.goals_today ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-market-checkin', user?.id, today] });
    },
  });

  return {
    todayCheckIn: query.data ?? null,
    hasCheckedInToday: !!query.data,
    isLoading: query.isLoading,
    saveCheckIn: saveCheckIn.mutateAsync,
    isSaving: saveCheckIn.isPending,
  };
}
