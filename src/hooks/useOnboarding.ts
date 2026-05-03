import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingState {
  onboarding_completed: boolean;
  onboarding_step: number;
}

export function useOnboarding() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async (): Promise<OnboardingState | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed, onboarding_step')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as OnboardingState | null;
    },
    enabled: !!user,
  });

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true, onboarding_step: 4 })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  });

  const skipOnboarding = completeOnboarding;

  const saveProgress = async (step: number) => {
    if (!user) return;
    await supabase.from('profiles').update({ onboarding_step: step }).eq('id', user.id);
  };

  return {
    isOnboardingComplete: data?.onboarding_completed ?? true,
    currentStep: data?.onboarding_step ?? 0,
    completeOnboarding: completeOnboarding.mutate,
    skipOnboarding: skipOnboarding.mutate,
    saveProgress,
    isLoading,
  };
}
