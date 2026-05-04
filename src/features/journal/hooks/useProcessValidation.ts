import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { updateStreak } from '@/features/behavioral/utils/streak-manager';

export interface ValidationData {
  trade_id: string;
  matched_setup: boolean;
  respected_sl: boolean;
  correct_position_size: boolean;
  waited_confirmation: boolean;
  closed_as_planned: boolean;
  adherence_score: number;
  reflection_note: string | null;
  ai_message_type: string;
  ai_message_shown: string;
}

export function useProcessValidation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const saveValidation = useMutation({
    mutationFn: async (data: ValidationData) => {
      if (!user) throw new Error('No user');

      const { data: result, error } = await supabase
        .from('process_validations')
        .insert({ user_id: user.id, ...data })
        .select()
        .single();

      if (error) throw error;

      try {
        await updateStreak(user.id, 'validation');
        if (data.adherence_score >= 4) {
          await updateStreak(user.id, 'discipline');
        }
      } catch (e) {
        console.error('Streak update failed:', e);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['user-streaks'] });
      queryClient.invalidateQueries({ queryKey: ['process-validations'] });
    },
  });

  return {
    saveValidation: saveValidation.mutateAsync,
    isSaving: saveValidation.isPending,
  };
}

export async function hasValidation(tradeId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('process_validations')
    .select('id')
    .eq('trade_id', tradeId)
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}


