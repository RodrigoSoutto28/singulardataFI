import { Sparkles, Target } from 'lucide-react';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';
import { cn } from '@/shared/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

const Brain3D = createIcon3DComponent('brain');

interface MentalStateCardProps {
  disciplineScore: number;
  className?: string;
}

export function MentalStateCard({ disciplineScore, className }: MentalStateCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getDisciplineStatus = (score: number) => {
    if (score >= 8) return { label: t.common?.excellent ?? 'Excelente', color: 'text-success', emoji: '🔥' };
    if (score >= 6) return { label: t.common?.good ?? 'Bien', color: 'text-warning', emoji: '👍' };
    return { label: t.common?.improvable ?? 'Mejorable', color: 'text-[hsl(28_95%_55%)]', emoji: '⚠️' };
  };

  const status = getDisciplineStatus(disciplineScore);
  const circumference = 2 * Math.PI * 56;
  const dashLength = (disciplineScore / 10) * circumference;

  return (
    <Card className={cn('relative overflow-hidden group', className)}>
      {/* Hero 3D icon — anchored top-right */}
      <div className="icon3d-hero">
        <Brain3D className="h-full w-full" />
      </div>

      <CardHeader className="relative z-10 pr-[6.5rem] md:pr-[7.5rem] pb-2">
        <CardTitle className="text-base">
          {t.dashboard.mentalStateTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Score Visual */}
        <div className="text-center">
          <div className="text-4xl mb-1.5 animate-subtle-bounce">{status.emoji}</div>
          <div className="text-3xl font-bold font-mono mb-1 number-pop">{disciplineScore}/10</div>
          <Badge variant="secondary" className={cn('text-xs', status.color)}>
            {status.label}
          </Badge>
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold font-mono">
              {(disciplineScore * 10).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Quick AI Insight */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              {disciplineScore >= 8
                ? t.dashboard.disciplineTopTier
                : t.dashboard.disciplineImprovement}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={() => navigate('/psychology')}
        >
          <Target className="h-4 w-4 mr-2" />
          {t.dashboard.viewFullAnalysis}
        </Button>
      </CardContent>
    </Card>
  );
}
