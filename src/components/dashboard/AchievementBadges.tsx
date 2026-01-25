import { cn } from '@/lib/utils';
import { Flame, Trophy, Brain, Calendar, CheckCircle2 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'locked' | 'in-progress' | 'completed';
  progress?: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'Racha de 3 Días',
    subtitle: '3 días seguidos de ritual.',
    icon: Flame,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Semana de Fuego',
    subtitle: 'En Progreso: 1/7',
    icon: Trophy,
    status: 'in-progress',
    progress: '1/7',
  },
  {
    id: '3',
    title: 'Reflexivo',
    subtitle: 'Completado',
    icon: Brain,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Operador Constante',
    subtitle: 'Operaste 3+ días esta semana.',
    icon: Calendar,
    status: 'locked',
  },
];

export function AchievementBadges() {
  const getStatusStyles = (status: Achievement['status']) => {
    switch (status) {
      case 'completed':
        return {
          container: 'border-success/30 bg-success/5',
          icon: 'bg-success/20 text-success',
          text: 'text-foreground',
        };
      case 'in-progress':
        return {
          container: 'border-primary/30 bg-primary/5',
          icon: 'bg-primary/20 text-primary',
          text: 'text-foreground',
        };
      default:
        return {
          container: 'border-border bg-card',
          icon: 'bg-muted text-muted-foreground',
          text: 'text-muted-foreground',
        };
    }
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
                {achievement.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {achievement.status === 'in-progress' ? (
                  <span className="text-primary">{achievement.subtitle}</span>
                ) : achievement.status === 'completed' ? (
                  <span className="text-success">Completado</span>
                ) : (
                  achievement.subtitle
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
