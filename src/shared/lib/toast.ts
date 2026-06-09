import { toast as sonnerToast } from 'sonner';

/**
 * Wrapper sobre sonner que aplica reglas globales:
 * - toast.error → 10s con fade-out automático (override con `duration` si se necesita)
 * - toast.success → 4s (default configurado en <Toaster />)
 */
const originalError = sonnerToast.error.bind(sonnerToast);
sonnerToast.error = ((message: any, opts?: any) => {
  return originalError(message, { duration: 10000, ...opts });
}) as typeof sonnerToast.error;

export const toast = sonnerToast;
