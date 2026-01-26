import { cn } from '@/lib/utils';
import { Flame, Trophy, Brain, Calendar, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Achievement {
  id: string;
  titleKey: 'streak3Days' | 'weekOfFire' | 'reflective' | 'consistentOperator';
  subtitleKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'locked' | 'in-progress' | 'completed';
  progress?: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    titleKey: 'streak3Days',
    subtitleKey: 'streak3DaysDesc',
    icon: Flame,
    status: 'completed',
  },
  {
    id: '2',
    titleKey: 'weekOfFire',
    icon: Trophy,
    status: 'in-progress',
    progress: '1/7',
  },
  {
    id: '3',
    titleKey: 'reflective',
    icon: Brain,
    status: 'completed',
  },
  {
    id: '4',
    titleKey: 'consistentOperator',
    subtitleKey: 'consistentOperatorDesc',
    icon: Calendar,
    status: 'locked',
  },
];

export function AchievementBadges() {
  const { t } = useLanguage();

  const getStatusStyles = (status: Achievement['status']) => {
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

  const getSubtitle = (achievement: Achievement) => {
    if (achievement.status === 'in-progress' && achievement.progress) {
      return `${t.common.inProgress}: ${achievement.progress}`;
    }
    if (achievement.status === 'completed') {
      return t.common.completed;
    }
    if (achievement.subtitleKey) {
      return t.achievements[achievement.subtitleKey as keyof typeof t.achievements];
    }
    return '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {achievements.map((achievement) => {
        const styles = getStatusStyles(achievement.status);
        const Icon = achievement.icon;

        return (
          <div
            key={achievement.id}
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
                {t.achievements[achievement.titleKey]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {achievement.status === 'in-progress' ? (
                  <span className="text-primary">{getSubtitle(achievement)}</span>
                ) : achievement.status === 'completed' ? (
                  <span className="text-success">{t.common.completed}</span>
                ) : (
                  getSubtitle(achievement)
                )}
              </p>
            </div>
            {achievement.status === 'completed' && (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
