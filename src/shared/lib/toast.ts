import { toast as sonnerToast } from 'sonner';

/**
 * Wrapper sobre sonner que aplica reglas globales:
 * - toast.error → 10s con fade-out automático (override con `duration` si se necesita)
 * - toast.success → 4s (default configurado en <Toaster />)
 */
const originalError = sonnerToast.error.bind(sonnerToast);
sonnerToast.error = ((message: Parameters<typeof sonnerToast.error>[0], opts?: Parameters<typeof sonnerToast.error>[1]) => {
  return originalError(message, { duration: 10000, ...opts });
}) as typeof sonnerToast.error;

export const toast = sonnerToast;
