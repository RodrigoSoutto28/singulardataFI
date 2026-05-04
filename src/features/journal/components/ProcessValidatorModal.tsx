import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import {
  CheckCircle2, XCircle, AlertTriangle, Target, Shield,
  Clock, TrendingUp, Brain, Sparkles, MessageSquare, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getAIMessage, AIMessage } from '@/features/dashboard/utils/ai-messages';
import { useProcessValidation } from '@/features/journal/hooks/useProcessValidation';
import { toast } from 'sonner';

interface ProcessValidatorModalProps {
  open: boolean;
  onClose: () => void;
  trade: {
    id: string;
    pnl: number;
    pnl_percentage: number;
    symbol: string;
    direction: 'long' | 'short';
  };
}

type AnswerKey = 'matchedSetup' | 'respectedSL' | 'correctPositionSize' | 'waitedConfirmation' | 'closedAsPlanned';

const QUESTIONS: { id: AnswerKey; text: string; icon: typeof Target }[] = [
  { id: 'matchedSetup', text: '¿Este trade coincidía con tu setup declarado?', icon: Target },
  { id: 'respectedSL', text: '¿Respetaste tu Stop Loss inicial?', icon: Shield },
  { id: 'correctPositionSize', text: '¿El tamaño de posición estuvo dentro de tu límite?', icon: TrendingUp },
  { id: 'waitedConfirmation', text: '¿Esperaste confirmación técnica antes de entrar?', icon: Clock },
  { id: 'closedAsPlanned', text: '¿Cerraste según plan (no por emoción)?', icon: Brain },
];

export function ProcessValidatorModal({ open, onClose, trade }: ProcessValidatorModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [answers, setAnswers] = useState<Record<AnswerKey, boolean | null>>({
    matchedSetup: null,
    respectedSL: null,
    correctPositionSize: null,
    waitedConfirmation: null,
    closedAsPlanned: null,
  });
  const [reflection, setReflection] = useState('');
  const { saveValidation, isSaving } = useProcessValidation();

  const tradeResult: 'win' | 'loss' | 'breakeven' =
    trade.pnl > 0 ? 'win' : trade.pnl < 0 ? 'loss' : 'breakeven';

  const score = useMemo(
    () => Object.values(answers).filter((a) => a === true).length,
    [answers],
  );
  const allAnswered = Object.values(answers).every((a) => a !== null);

  const aiMessage: AIMessage | null = useMemo(
    () => (step === 2 ? getAIMessage(tradeResult, score, trade.pnl) : null),
    [step, tradeResult, score, trade.pnl],
  );

  const reset = () => {
    setStep(1);
    setAnswers({
      matchedSetup: null, respectedSL: null, correctPositionSize: null,
      waitedConfirmation: null, closedAsPlanned: null,
    });
    setReflection('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!aiMessage) return;
    try {
      await saveValidation({
        trade_id: trade.id,
        matched_setup: answers.matchedSetup!,
        respected_sl: answers.respectedSL!,
        correct_position_size: answers.correctPositionSize!,
        waited_confirmation: answers.waitedConfirmation!,
        closed_as_planned: answers.closedAsPlanned!,
        adherence_score: score,
        reflection_note: reflection.trim() || null,
        ai_message_type: aiMessage.type,
        ai_message_shown: aiMessage.message,
      });
      toast.success('Validación guardada');
      handleClose();
    } catch {
      toast.error('Error al guardar validación');
    }
  };

  const variantClasses = (v: AIMessage['variant']) => {
    switch (v) {
      case 'success': return 'border-success/40 bg-success/5';
      case 'warning': return 'border-warning/40 bg-warning/5';
      case 'danger': return 'border-destructive/40 bg-destructive/5';
      default: return 'border-primary/40 bg-primary/5';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex justify-center mb-2">
                {tradeResult === 'win' ? (
                  <CheckCircle2 className="h-12 w-12 text-success" />
                ) : tradeResult === 'loss' ? (
                  <XCircle className="h-12 w-12 text-destructive" />
                ) : (
                  <Target className="h-12 w-12 text-primary" />
                )}
              </div>
              <DialogTitle className="text-center text-2xl">Validación de Proceso</DialogTitle>
              <DialogDescription className="text-center">
                {trade.symbol} · {trade.direction.toUpperCase()} ·{' '}
                <span className={cn('font-mono font-semibold', trade.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} USD ({trade.pnl_percentage.toFixed(2)}%)
                </span>
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                Evalúa tu adherencia al plan
              </div>

              {QUESTIONS.map((q, idx) => {
                const Icon = q.icon;
                const answer = answers[q.id];
                return (
                  <Card key={q.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium">{idx + 1}. {q.text}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={answer === true ? 'default' : 'outline'}
                              onClick={() => setAnswers((p) => ({ ...p, [q.id]: true }))}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" /> Sí
                            </Button>
                            <Button
                              size="sm"
                              variant={answer === false ? 'destructive' : 'outline'}
                              onClick={() => setAnswers((p) => ({ ...p, [q.id]: false }))}
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" /> No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {allAnswered && (
              <Card className={cn(
                'border-2',
                score >= 4 ? 'border-success bg-success/5' :
                score >= 3 ? 'border-warning bg-warning/5' :
                'border-destructive bg-destructive/5',
              )}>
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-medium">Score de Disciplina</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold">{score}/5</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all',
                          score >= 4 ? 'bg-success' : score >= 3 ? 'bg-warning' : 'bg-destructive',
                        )}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full"
              disabled={!allAnswered}
              onClick={() => setStep(2)}
            >
              Ver Feedback de IA
            </Button>
          </div>
        )}

        {step === 2 && aiMessage && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Feedback Personalizado</DialogTitle>
            </DialogHeader>

            <Card className={cn('border-2', variantClasses(aiMessage.variant))}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">{aiMessage.icon}</div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold">{aiMessage.title}</h3>
                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                      {aiMessage.message}
                    </p>
                    {aiMessage.stat && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-background/60 border">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs font-medium">{aiMessage.stat}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {aiMessage.actions && aiMessage.actions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Acciones sugeridas:</p>
                <ul className="space-y-1.5">
                  {aiMessage.actions.map((action, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Tu reflexión personal (opcional)
              </label>
              <Textarea
                placeholder="¿Qué aprendiste de este trade?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">{reflection.length}/500</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Atrás
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving} className="flex-1">
                {isSaving ? 'Guardando...' : 'Completar Validación'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


