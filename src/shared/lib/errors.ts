/**
 * Centralized error sanitization for user-facing toasts.
 * Raw Supabase / PostgREST errors can leak schema details, RLS policy names,
 * column names, and FK constraint names — never show them to end users.
 *
 * Usage:
 *   toast.error(getUserErrorMessage(error, 'No se pudo guardar la operación.'));
 */

const isDev = import.meta.env.DEV;

export function getUserErrorMessage(error: unknown, fallback = 'Algo salió mal. Inténtalo de nuevo.'): string {
  // In development, surface the real error to help debugging
  if (isDev) {
    if (error instanceof Error) return `${fallback} [dev: ${error.message}]`;
    if (typeof error === 'string') return `${fallback} [dev: ${error}]`;
  } else {
    // In production, log raw error to console only — never to the user
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[app error]', error);
    }
  }
  return fallback;
}
