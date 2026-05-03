import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  detectUserLanguage,
  toContextCode,
  toDbCode,
  validateLanguage,
} from '@/lib/i18n/detector';

/**
 * Detects and syncs the user's preferred language.
 * - For anonymous users: uses localStorage (handled by context) and falls back to browser detection.
 * - For signed-in users: prefers `profiles.language`; if absent, persists the detected one.
 * Non-blocking: returns flags but never gates rendering.
 */
export function useLanguageDetection() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const ranForUser = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const hasStored = !!localStorage.getItem('app-language');

        if (!user) {
          if (!hasStored) {
            const detection = await detectUserLanguage();
            if (!cancelled) setLanguage(toContextCode(detection.language));
          }
          if (!cancelled) {
            setDetectionComplete(true);
            setIsDetecting(false);
          }
          return;
        }

        if (ranForUser.current === user.id) return;
        ranForUser.current = user.id;

        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .maybeSingle();

        const saved = (profile as any)?.language as string | null | undefined;
        const detection = await detectUserLanguage(saved);
        const nextCtx = toContextCode(detection.language);
        if (!cancelled && nextCtx !== language) setLanguage(nextCtx);

        if (!saved) {
          await supabase
            .from('profiles')
            .update({ language: validateLanguage(toDbCode(nextCtx)) } as any)
            .eq('id', user.id);
        }
      } catch (e) {
        console.warn('Language detection failed:', e);
      } finally {
        if (!cancelled) {
          setDetectionComplete(true);
          setIsDetecting(false);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return { isDetecting, detectionComplete };
}
