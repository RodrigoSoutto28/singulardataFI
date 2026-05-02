import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { usePreMarketCheckIn } from '@/hooks/usePreMarketCheckIn';
import {
  SETUPS,
  EMOTIONS,
  isNegativeEmotion,
  type EmotionalState,
} from '@/lib/checkin-helpers';

interface PreMarketCheckInModalProps {
  open: boolean;
  onComplete: () => void;
}

export function PreMarketCheckInModal({ open, onComplete }: PreMarketCheckInModalProps) {
  const { saveCheckIn, isSaving } = usePreMarketCheckIn();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [selectedSetups, setSelectedSetups] = useState<string[]>([]);
  const [maxRisk, setMaxRisk] = useState<number[]>([1.0]);
  const [maxTrades, setMaxTrades] = useState(3);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | ''>('');
  const [goals, setGoals] = useState('');

  const toggleSetup = (id: string) => {
    setSelectedSetups((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedSetups.length === 0) {
      toast.error('Selecciona al menos un setup válido');
      setStep(1);
      return;
    }
    if (!emotionalState) {
      toast.error('Selecciona tu estado emocional');
      setStep(3);
      return;
    }
    try {
      await saveCheckIn({
        allowed_setups: selectedSetups,
        max_risk_per_trade: maxRisk[0],
        max_daily_trades: maxTrades,
        emotional_state: emotionalState,
        goals_today: goals.trim() || null,
      });
      toast.success('✅ Check-in completado. Tu plan está guardado.');
      onComplete();
    } catch (err) {
      toast.error('Error al guardar el check-in. Intenta de nuevo.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Check-in Pre-Mercado</h2>
              <p className="text-sm text-muted-foreground">
                Define tu plan antes de que el mercado defina el tuyo.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paso {step} de {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>
        </div>

        {/* Step 1: Setups */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                ¿Cuáles son tus setups válidos hoy?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Solo operarás cuando veas uno de estos patrones.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SETUPS.map((setup) => {
                const selected = selectedSetups.includes(setup.id);
                return (
                  <button
                    key={setup.id}
                    type="button"
                    onClick={() => toggleSetup(setup.id)}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="text-2xl mb-1">{setup.icon}</div>
                    <div className="text-sm font-medium">{setup.label}</div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full"
              disabled={selectedSetups.length === 0}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Step 2: Risk */}
        {step === 2 && (
          <div className="space-y-6">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Gestión de Riesgo
            </Label>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Riesgo máximo por trade</Label>
                <Badge variant={maxRisk[0] > 2 ? 'destructive' : 'default'} className="font-mono">
                  {maxRisk[0].toFixed(1)}%
                </Badge>
              </div>
              <Slider
                value={maxRisk}
                onValueChange={setMaxRisk}
                min={0.5}
                max={5}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservador (0.5%)</span>
                <span>Agresivo (5%)</span>
              </div>
              {maxRisk[0] > 2 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Riesgo alto. La mayoría de traders profesionales usan 1-2% por trade.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm">Número máximo de trades hoy</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxTrades(num)}
                    className={cn(
                      'flex-1 py-3 rounded-lg border-2 font-bold transition-all',
                      maxTrades === num
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Limitar trades previene overtrading emocional.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Atrás
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Emotion */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                ¿Cómo te sientes hoy?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Tu estado emocional afecta tus decisiones.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EMOTIONS.map((emotion) => {
                const selected = emotionalState === emotion.value;
                const toneBg =
                  emotion.tone === 'positive'
                    ? 'bg-success/5'
                    : emotion.tone === 'negative'
                    ? 'bg-destructive/5'
                    : 'bg-muted/30';
                return (
                  <button
                    key={emotion.value}
                    type="button"
                    onClick={() => setEmotionalState(emotion.value)}
                    className={cn(
                      'p-4 rounded-lg border-2 text-center transition-all',
                      selected
                        ? 'border-primary bg-primary/10'
                        : cn('border-border hover:border-primary/50', toneBg)
                    )}
                  >
                    <div className="text-3xl mb-1">{emotion.emoji}</div>
                    <div className="text-xs font-medium">{emotion.label}</div>
                  </button>
                );
              })}
            </div>

            {isNegativeEmotion(emotionalState) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Estado emocional desafiante detectado. Considera reducir tu tamaño de posición o
                  esperar a sentirte más estable antes de operar.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Atrás
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1" disabled={!emotionalState}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Goals + Summary */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Metas y Recordatorios (opcional)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                ¿Algo específico en lo que quieres enfocarte hoy?
              </p>
            </div>

            <Textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ej: Ser paciente y esperar mi setup perfecto. No entrar por FOMO. Respetar mi SL sin moverlo..."
              className="min-h-[120px] resize-none"
              maxLength={300}
            />
            <div className="text-xs text-muted-foreground text-right">{goals.length}/300</div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm border border-border">
              <h4 className="font-semibold mb-2">Resumen de tu Plan:</h4>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Setups:{' '}
                  {selectedSetups
                    .map((id) => SETUPS.find((s) => s.id === id)?.label ?? id)
                    .join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>Riesgo máximo: {maxRisk[0].toFixed(1)}% por trade</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary shrink-0" />
                <span>Máximo {maxTrades} trades hoy</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Estado: {EMOTIONS.find((e) => e.value === emotionalState)?.label ?? '—'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1" disabled={isSaving}>
                Atrás
              </Button>
              <Button onClick={handleSubmit} className="flex-1" size="lg" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-5 w-5" />
                )}
                Comprometerme
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
