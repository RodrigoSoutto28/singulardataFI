import { useEffect, useState } from 'react';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, DollarSign, Timer, XCircle } from 'lucide-react';
import { ERROR_LABELS, type DetectedError } from '@/lib/error-detection';

interface TaxometerAlertProps {
  open: boolean;
  errors: DetectedError[];
  onContinue: () => void;
  onCancel: () => void;
}

export function TaxometerAlert({ open, errors, onContinue, onCancel }: TaxometerAlertProps) {
  const [countdown, setCountdown] = useState(60);
  const high = errors.filter((e) => e.confidence === 'high');
  const totalCost = errors.reduce((s, e) => s + (e.costEstimate || 0), 0);

  useEffect(() => {
    if (!open) {
      setCountdown(60);
      return;
    }
    const t = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [open]);

  if (high.length === 0) return null;
  const canContinue = countdown === 0;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            ⚠️ Alerta de Error Psicológico
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Hemos detectado {high.length} señal(es) de alerta antes de este trade
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {high.map((err, i) => (
            <Alert key={i} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold capitalize">
                  {ERROR_LABELS[err.type] ?? err.type.replace(/_/g, ' ')}:
                </span>{' '}
                {err.reason}
              </AlertDescription>
            </Alert>
          ))}

          {totalCost > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-3 w-3" />
                Costo estimado de este patrón
              </p>
              <p className="font-mono text-2xl font-bold text-destructive">
                ${totalCost.toFixed(2)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Timer className="h-3 w-3" /> Tiempo de reflexión
              </span>
              <span className="font-mono font-semibold">{countdown}s</span>
            </div>
            <Progress value={((60 - countdown) / 60) * 100} />
            <p className="text-xs text-muted-foreground text-center">
              Tómate este tiempo para reconsiderar tu decisión
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <Button variant="default" onClick={onCancel} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Cancelar este Trade (Recomendado)
          </Button>
          <Button
            variant="outline"
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full"
          >
            <XCircle className="h-4 w-4 mr-2" />
            {canContinue ? 'Continuar de Todas Formas' : `Espera ${countdown}s para continuar`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
