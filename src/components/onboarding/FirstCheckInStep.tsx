import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, Shield, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  onNext: () => void;
}

export function FirstCheckInStep({ onNext }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSetups, setSelectedSetups] = useState<string[]>([]);
  const [maxRisk, setMaxRisk] = useState([1.0]);
  const [maxTrades, setMaxTrades] = useState(3);
  const [emotion, setEmotion] = useState<string>('calm');
  const [saving, setSaving] = useState(false);

  const setups = [
    { id: 'breakout', label: 'Breakout', icon: '📈' },
    { id: 'pullback', label: 'Pullback', icon: '📊' },
    { id: 'reversal', label: 'Reversión', icon: '🔄' },
  ];

  const emotions = ['calm', 'confident', 'anxious', 'neutral'];

  const toggle = (id: string) =>
    setSelectedSetups((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSubmit = async () => {
    if (!user) return;
    if (selectedSetups.length === 0) {
      toast.error('Selecciona al menos un setup');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('pre_market_checkins').insert({
        user_id: user.id,
        emotional_state: emotion,
        allowed_setups: selectedSetups,
        max_risk_per_trade: maxRisk[0],
        max_daily_trades: maxTrades,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['pre-market-checkin'] });
      toast.success('Check-in guardado');
      onNext();
    } catch (e) {
      toast.error('No se pudo guardar el check-in');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 py-2">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Tu Primer Check-in Pre-Mercado</h2>
        <p className="text-sm text-muted-foreground">Lo que separa profesionales de aficionados</p>
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Declarar tu plan ANTES de operar crea un "ancla cognitiva". Tu cerebro luchará por mantenerse coherente.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label>¿Cómo te sientes hoy?</Label>
          <div className="grid grid-cols-4 gap-2">
            {emotions.map((e) => (
              <button
                key={e}
                onClick={() => setEmotion(e)}
                className={cn(
                  'py-2 rounded-md border-2 text-sm capitalize transition-all',
                  emotion === e ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <Label className="flex items-center gap-2"><Target className="h-4 w-4" /> Setups que vas a operar hoy</Label>
          <div className="grid grid-cols-3 gap-2">
            {setups.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={cn(
                  'p-3 rounded-md border-2 transition-all text-center',
                  selectedSetups.includes(s.id) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
                )}
              >
                <div className="text-2xl">{s.icon}</div>
                <div className="text-xs font-semibold mt-1">{s.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <Label className="flex items-center gap-2"><Shield className="h-4 w-4" /> Riesgo máximo por trade</Label>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Conservador</span>
            <Badge variant={maxRisk[0] > 2 ? 'destructive' : 'default'}>{maxRisk[0].toFixed(1)}%</Badge>
            <span className="text-muted-foreground">Agresivo</span>
          </div>
          <Slider value={maxRisk} onValueChange={setMaxRisk} min={0.25} max={5} step={0.25} />
          <p className="text-xs text-muted-foreground">Profesionales usan 1-2% por trade.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <Label>Número máximo de trades hoy</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMaxTrades(n)}
                className={cn(
                  'flex-1 py-2 rounded-md border-2 font-bold transition-all',
                  maxTrades === n ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar plan y continuar'}
        </Button>
      </div>
    </div>
  );
}
