import { cn } from '@/lib/utils';
import { Brain, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface MentalStateCardProps {
  disciplineScore: number;
  className?: string;
}

export function MentalStateCard({ disciplineScore, className }: MentalStateCardProps) {
  const { t } = useLanguage();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  return (
    <div className={cn("space-y-4 my-0 mx-0 border-card border-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t.dashboard.mentalState}
        </h3>
        <Badge className={cn('font-mono', getScoreColor(disciplineScore))}>
          {t.dashboard.discipline}: {disciplineScore}
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
                {t.dashboard.insightOfDay}
              </p>
              <p className="text-sm font-medium">{t.dashboard.tiltAlert}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">{t.dashboard.aiFree}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {t.dashboard.tiltDescription}
        </p>
        <div className="flex items-center gap-2 text-xs text-warning">
          <Lightbulb className="h-4 w-4" />
          <span>{t.dashboard.tiltAdvice}</span>
        </div>
      </div>

      {/* Ritual Completed */}
      <div className="p-4 rounded-xl border border-success/20 bg-success/5 backdrop-blur-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-success/20">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{t.dashboard.ritualCompleted}</p>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="text-xs text-muted-foreground">{t.dashboard.comeBackTomorrow}</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">{t.dashboard.dailyStreak}</Badge>
      </div>

      {/* Weekly Summary */}
      <div className="p-4 rounded-xl glass-card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium uppercase tracking-wider">{t.dashboard.weeklySummary}</p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl font-bold font-mono text-success">+$0</span>
          <Badge variant="secondary" className="text-[10px]">0% WR</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{t.dashboard.bestDay}: -</p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          {t.dashboard.noTrades} {t.dashboard.patienceMessage}
        </p>
      </div>
    </div>
  );
}
