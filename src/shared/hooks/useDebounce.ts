import { useEffect, useState } from 'react';

/**
 * Debounce a value by `delay` ms. Useful to avoid excessive queries
 * (e.g. search inputs hitting Supabase on every keystroke).
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
