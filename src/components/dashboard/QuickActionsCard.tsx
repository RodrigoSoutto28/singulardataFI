import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Brain, BarChart3, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ActionItem {
  icon: LucideIcon;
  label: string;
  description: string;
  path: string;
  iconBg: string;
  iconColor: string;
}

const actions: ActionItem[] = [
  {
    icon: Plus,
    label: 'Nuevo Trade',
    description: 'Registrar operación',
    path: '/journal',
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
  },
  {
    icon: BookOpen,
    label: 'Mi Journal',
    description: 'Ver historial',
    path: '/journal',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
  },
  {
    icon: Brain,
    label: 'Check-in',
    description: 'Estado mental',
    path: '/psychology',
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    description: 'Ver métricas',
    path: '/analytics',
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
  },
];

export function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-card to-accent/5 border-primary/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-lg',
              'bg-card border border-border',
              'hover:border-primary/40 hover:shadow-lg hover:scale-[1.02]',
              'transition-all duration-200 text-left'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center h-11 w-11 rounded-lg shrink-0',
                action.iconBg
              )}
            >
              <action.icon className={cn('h-5 w-5', action.iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground truncate">
                {action.label}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
