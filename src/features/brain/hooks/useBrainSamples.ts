import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { toast } from 'sonner';
import { getUserErrorMessage } from '@/shared/lib/errors';
import type { BrainSample, BrainSampleInput } from '../types';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_SIZE_MB = 8;

export function validateImage(file: File): string | null {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
    return 'Formato no permitido. Usá PNG, JPG, WEBP o GIF.';
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `La imagen no puede superar ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

export function useBrainSamples() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const key = ['brain_samples', user?.id];

  const samplesQuery = useQuery({
    queryKey: key,
    queryFn: async (): Promise<BrainSample[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('brain_samples')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as BrainSample[];
    },
    enabled: !!user?.id,
  });

  const analyzeSample = useMutation({
    mutationFn: async (sampleId: string) => {
      const { data, error } = await supabase.functions.invoke('analyze-brain-sample', {
        body: { sampleId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    onError: (error: unknown) => {
      toast.error(getUserErrorMessage(error));
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const createSample = useMutation({
    mutationFn: async (input: BrainSampleInput): Promise<BrainSample> => {
      if (!user?.id) throw new Error('No autenticado');

      const ext = (input.file.name.split('.').pop() || 'png').toLowerCase();
      const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('brain-samples')
        .upload(path, input.file, { upsert: false, cacheControl: '3600' });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('brain_samples')
        .insert({
          user_id: user.id,
          image_path: path,
          session: input.session,
          symbol: input.symbol,
          timeframe: input.timeframe || null,
          occurred_at: input.occurred_at,
          structure_tags: input.structure_tags,
          outcome: input.outcome,
          r_multiple: input.r_multiple,
          setup_type: input.setup_type || null,
          notes: input.notes || null,
          ai_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        await supabase.storage.from('brain-samples').remove([path]);
        throw error;
      }
      return data as BrainSample;
    },
    onSuccess: (sample) => {
      queryClient.invalidateQueries({ queryKey: key });
      analyzeSample.mutate(sample.id);
    },
    onError: (error: unknown) => toast.error(getUserErrorMessage(error)),
  });

  const deleteSample = useMutation({
    mutationFn: async (sample: BrainSample) => {
      const { error } = await supabase.from('brain_samples').delete().eq('id', sample.id);
      if (error) throw error;
      await supabase.storage.from('brain-samples').remove([sample.image_path]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    onError: (error: unknown) => toast.error(getUserErrorMessage(error)),
  });

  return {
    samples: samplesQuery.data ?? [],
    isLoading: samplesQuery.isLoading,
    createSample,
    deleteSample,
    analyzeSample,
  };
}

/** Signed URL cache for private bucket images. */
export function useSignedImage(path: string | null | undefined) {
  return useQuery({
    queryKey: ['brain_sample_image', path],
    queryFn: async () => {
      if (!path) return null;
      const { data, error } = await supabase.storage
        .from('brain-samples')
        .createSignedUrl(path, 3600);
      if (error) throw error;
      return data?.signedUrl ?? null;
    },
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
  });
}
