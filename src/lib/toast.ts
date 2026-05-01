import { toast as sonnerToast } from 'sonner';

/**
 * Wrapper sobre sonner que aplica reglas globales:
 * - toast.error → persistente (duration: Infinity) salvo override explícito
 * - toast.success → 4s (default ya configurado en <Toaster />)
 * Importar { toast } desde aquí en lugar de "sonner" para que los errores
 * no desaparezcan automáticamente.
 */
const originalError = sonnerToast.error.bind(sonnerToast);
sonnerToast.error = ((message: any, opts?: any) => {
  return originalError(message, { duration: Infinity, ...opts });
}) as typeof sonnerToast.error;

export const toast = sonnerToast;
