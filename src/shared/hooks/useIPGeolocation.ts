import { useCallback, useEffect, useState } from 'react';
import {
  detectLanguageByIP,
  detectLanguageByIPFromCache,
  IPLanguageDetection,
} from '@/shared/lib/geolocation/ip-detector';
import { clearGeolocationCache, getCachedGeolocation } from '@/shared/lib/geolocation/cache';

export function useIPGeolocation(options?: { autoDetect?: boolean }) {
  const [detection, setDetection] = useState<IPLanguageDetection | null>(() =>
    detectLanguageByIPFromCache(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const detectLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await detectLanguageByIP();
      setDetection(result);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Unknown error');
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    clearGeolocationCache();
    setDetection(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (options?.autoDetect && !detection) {
      detectLocation().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.autoDetect]);

  return {
    detection,
    isLoading,
    error,
    detectLocation,
    reset,
    hasCache: !!getCachedGeolocation(),
  };
}

