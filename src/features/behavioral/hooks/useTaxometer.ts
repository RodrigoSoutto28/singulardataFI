import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { ErrorType } from '@/features/journal/utils/error-detection';

export interface PsychErrorRow {
  id: string;
  user_id: string;
  trade_id: string | null;
  error_type: ErrorType;
  confidence: 'high' | 'medium' | 'low';
  reason: string | null;
  cost_dollars: number;
  was_prevented: boolean;
  metadata: Record<string, unknown> | null;
  timestamp: string;
  created_at: string;
}

export interface LogErrorInput {
  trade_id?: string | null;
  error_type: ErrorType;
  confidence?: 'high' | 'medium' | 'low';
  reason?: string | null;
  cost_dollars?: number;
  was_prevented?: boolean;
  metadata?: Record<string, unknown> | null;
}

export function useTaxometer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: errors = [], isLoading } = useQuery({
    queryKey: ['psychological-errors', user?.id],
    queryFn: async (): Promise<PsychErrorRow[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('psychological_errors')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return (data ?? []) as PsychErrorRow[];
    },
    enabled: !!user?.id,
  });

  const now = Date.now();
  const week = now - 7 * 86400000;
  const month = now - 30 * 86400000;
  const quarter = now - 90 * 86400000;

  const sumIf = (pred: (e: PsychErrorRow) => boolean) =>
    errors.filter(pred).reduce((s, e) => s + Number(e.cost_dollars || 0), 0);

  const stats = {
    totalCost: sumIf(() => true),
    weekCost: sumIf((e) => new Date(e.timestamp).getTime() >= week),
    monthCost: sumIf((e) => new Date(e.timestamp).getTime() >= month),
    quarterCost: sumIf((e) => new Date(e.timestamp).getTime() >= quarter),
    savingsFromImprovement: 0,
    count: errors.length,
  };

  const errorsByType = errors.reduce<Record<string, { count: number; total_cost: number }>>(
    (acc, e) => {
      const k = e.error_type;
      if (!acc[k]) acc[k] = { count: 0, total_cost: 0 };
      acc[k].count += 1;
      acc[k].total_cost += Number(e.cost_dollars || 0);
      return acc;
    },
    {},
  );

  const logError = useMutation({
    mutationFn: async (input: LogErrorInput) => {
      if (!user?.id) throw new Error('No user');
      const { data, error } = await supabase
        .from('psychological_errors')
        .insert({
          user_id: user.id,
          trade_id: input.trade_id ?? null,
          error_type: input.error_type,
          confidence: input.confidence ?? 'medium',
          reason: input.reason ?? null,
          cost_dollars: input.cost_dollars ?? 0,
          was_prevented: input.was_prevented ?? false,
          metadata: (input.metadata ?? null) as never,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychological-errors', user?.id] });
    },
  });

  return {
    errors,
    stats,
    errorsByType,
    isLoading,
    logError: logError.mutateAsync,
    isLogging: logError.isPending,
  };
}


