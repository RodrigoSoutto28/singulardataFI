import { cn } from '@/lib/utils';
import { Brain, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface MentalStateCardProps {
  disciplineScore: number;
  className?: string;
}
export function MentalStateCard({
  disciplineScore,
  className
}: MentalStateCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };
  return <div className={cn("space-y-4 my-0 mx-0 border-2 border-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Tu Estado Mental
        </h3>
        <Badge className={cn('font-mono', getScoreColor(disciplineScore))}>
          Discipline: {disciplineScore}
        </Badge>
      </div>

      {/* Insight Card */}
      <div className="p-4 rounded-xl glass-card space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Insight del Día
              </p>
              <p className="text-sm font-medium">Alerta de Tilt Detectada</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">AI-Free</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          El sistema ha detectado sesiones con múltiples pérdidas consecutivas. Esto suele indicar pérdida de control emocional.
        </p>
        <div className="flex items-center gap-2 text-xs text-warning">
          <Lightbulb className="h-4 w-4" />
          <span>Si pierdes 2 operaciones seguidas hoy, cierra la plataforma inmediatamente.</span>
        </div>
      </div>

      {/* Ritual Completed */}
      <div className="p-4 rounded-xl border border-success/20 bg-success/5 backdrop-blur-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-success/20">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Ritual Completado</p>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="text-xs text-muted-foreground">Vuelve mañana para un nuevo análisis.</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">Racha Diaria</Badge>
      </div>

      {/* Weekly Summary */}
      <div className="p-4 rounded-xl glass-card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium uppercase tracking-wider">Resumen Semanal</p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl font-bold font-mono text-success">+$0</span>
          <Badge variant="secondary" className="text-[10px]">0% WR</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Mejor día: -</p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Sin operaciones aún. La paciencia también es una posición.
        </p>
      </div>
    </div>;
}