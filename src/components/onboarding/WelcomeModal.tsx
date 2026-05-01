import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Database, FileQuestion, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { generateSampleTrades } from '@/lib/sampleData';
import { toast } from 'sonner';

const STORAGE_KEY = 'sdf-welcome-seen';

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, skips localStorage check and forces open. Used for "Cargar datos de ejemplo" desde Settings. */
  manual?: boolean;
}

export function WelcomeModal({ open: openProp, onOpenChange, manual = false }: Props) {
  const { user } = useAuth();
  const { trades, isLoading, importTrades } = useTrades();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Auto-show para usuarios nuevos: primera vez sin trades
  useEffect(() => {
    if (manual) return;
    if (!user) return;
    if (isLoading) return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    if (trades.length > 0) {
      localStorage.setItem(STORAGE_KEY, 'true');
      return;
    }
    setInternalOpen(true);
  }, [user, trades.length, isLoading, manual]);

  const handleStartEmpty = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  const handleLoadSample = async () => {
    setLoading(true);
    try {
      const samples = generateSampleTrades();
      await importTrades.mutateAsync(samples as any);
      localStorage.setItem(STORAGE_KEY, 'true');
      toast.success('Datos de ejemplo cargados', {
        description: '30 operaciones de muestra agregadas a tu cuenta.',
      });
      setOpen(false);
    } catch (e: any) {
      toast.error('No se pudieron cargar los datos de ejemplo', {
        description: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : setOpen}>
      <DialogContent className="max-w-lg" aria-labelledby="welcome-title">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <DialogTitle id="welcome-title">Bienvenido a SINGULAR dataFI</DialogTitle>
          <DialogDescription>
            ¿Cómo quieres empezar? Puedes explorar la plataforma con datos de
            ejemplo o registrar tus propias operaciones desde cero.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 mt-2">
          <button
            onClick={handleLoadSample}
            disabled={loading}
            className="text-left p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Database className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  Ver con datos de ejemplo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  30 operaciones distribuidas en los últimos 2 meses (BTCUSD, EURUSD,
                  XAUUSD). Ideal para explorar gráficos y métricas.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleStartEmpty}
            disabled={loading}
            className="text-left p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors disabled:opacity-60"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  Empezar desde cero
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comienza con una cuenta vacía. Podrás cargar datos de ejemplo
                  más tarde desde Configuración.
                </p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Botón reutilizable para cargar datos de ejemplo desde Settings. */
export function useLoadSampleData() {
  const { importTrades } = useTrades();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const samples = generateSampleTrades();
      await importTrades.mutateAsync(samples as any);
      toast.success('Datos de ejemplo cargados', {
        description: '30 operaciones agregadas.',
      });
    } catch (e: any) {
      toast.error('No se pudieron cargar los datos', { description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  return { load, loading };
}
