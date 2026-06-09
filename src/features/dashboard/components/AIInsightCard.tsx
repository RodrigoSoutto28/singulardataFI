import { cn } from '@/shared/lib/utils';
import { Sparkles, AlertTriangle, TrendingUp, Brain } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

interface Insight {
  id: string;
  type: 'warning' | 'opportunity' | 'pattern' | 'tip';
  title: string;
  description: string;
  actionLabel?: string;
}

interface AIInsightCardProps {
  insights: Insight[];
  className?: string;
}

const insightIcons = {
  warning: AlertTriangle,
  opportunity: TrendingUp,
  pattern: Brain,
  tip: Sparkles,
};

const insightStyles = {
  warning: 'border-warning/30 bg-warning/5',
  opportunity: 'border-success/30 bg-success/5',
  pattern: 'border-primary/30 bg-primary/5',
  tip: 'border-accent/30 bg-accent/5',
};

const iconStyles = {
  warning: 'text-warning',
  opportunity: 'text-success',
  pattern: 'text-primary',
  tip: 'text-accent',
};

export function AIInsightCard({ insights, className }: AIInsightCardProps) {
  const { t } = useLanguage();
  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t.extra?.aiInsightsTitle ?? 'AI Insights'}</h3>
            <p className="text-xs text-muted-foreground">{t.extra?.poweredByML ?? 'Powered by machine learning'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          {t.extra?.viewAll ?? 'View all'}
        </Button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insightIcons[insight.type];
          return (
            <div
              key={insight.id}
              className={cn(
                'p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer',
                insightStyles[insight.type]
              )}
            >
              <div className="flex items-start gap-4">
                <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconStyles[insight.type])} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                  {insight.actionLabel && (
                    <Button
                      variant="link"
                      size="sm"
                      className={cn('h-auto p-0 mt-2 text-xs', iconStyles[insight.type])}
                    >
                      {insight.actionLabel} →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

