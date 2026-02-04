import { cn } from '@/lib/utils';
import { Target, TrendingUp, Brain, Calendar, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DisciplineMetric {
  id: string;
  titleKey: 'streak3Days' | 'weeklyTarget' | 'analyticalMindset' | 'operationalConsistency';
  subtitleKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'locked' | 'in-progress' | 'completed';
  progress?: string;
}

const metrics: DisciplineMetric[] = [
  {
    id: '1',
    titleKey: 'streak3Days',
    subtitleKey: 'streak3DaysDesc',
    icon: Target,
    status: 'completed',
  },
  {
    id: '2',
    titleKey: 'weeklyTarget',
    icon: TrendingUp,
    status: 'in-progress',
    progress: '1/7',
  },
  {
    id: '3',
    titleKey: 'analyticalMindset',
    icon: Brain,
    status: 'completed',
  },
  {
    id: '4',
    titleKey: 'operationalConsistency',
    subtitleKey: 'operationalConsistencyDesc',
    icon: Calendar,
    status: 'locked',
  },
];

export function AchievementBadges() {
  const { t } = useLanguage();

  const getStatusStyles = (status: DisciplineMetric['status']) => {
    switch (status) {
      case 'completed':
        return {
          container: 'border-success/30 bg-success/5 backdrop-blur-sm',
          icon: 'bg-success/20 text-success',
          text: 'text-foreground',
        };
      case 'in-progress':
        return {
          container: 'border-primary/30 bg-primary/5 backdrop-blur-sm',
          icon: 'bg-primary/20 text-primary',
          text: 'text-foreground',
        };
      default:
        return {
          container: 'border-border/40 bg-card/50 backdrop-blur-sm',
          icon: 'bg-muted/50 text-muted-foreground',
          text: 'text-muted-foreground',
        };
    }
  };

  const getSubtitle = (metric: DisciplineMetric) => {
    if (metric.status === 'in-progress' && metric.progress) {
      return `${t.common.inProgress}: ${metric.progress}`;
    }
    if (metric.status === 'completed') {
      return t.common.completed;
    }
    if (metric.subtitleKey) {
      return t.disciplineMetrics[metric.subtitleKey as keyof typeof t.disciplineMetrics];
    }
    return '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric) => {
        const styles = getStatusStyles(metric.status);
        const Icon = metric.icon;

        return (
          <div
            key={metric.id}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]',
              styles.container
            )}
          >
            <div className={cn('p-2.5 rounded-lg', styles.icon)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium truncate', styles.text)}>
                {t.disciplineMetrics[metric.titleKey]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {metric.status === 'in-progress' ? (
                  <span className="text-primary">{getSubtitle(metric)}</span>
                ) : metric.status === 'completed' ? (
                  <span className="text-success">{t.common.completed}</span>
                ) : (
                  getSubtitle(metric)
                )}
              </p>
            </div>
            {metric.status === 'completed' && (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
