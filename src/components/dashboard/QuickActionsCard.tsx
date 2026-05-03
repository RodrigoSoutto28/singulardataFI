import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Brain, BarChart3, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActionItem {
  icon: LucideIcon;
  label: string;
  path: string;
  color: string;
}

const actions: ActionItem[] = [
  {
    icon: Plus,
    label: 'Nuevo Trade',
    path: '/journal',
    color: 'text-primary',
  },
  {
    icon: BookOpen,
    label: 'Mi Journal',
    path: '/journal',
    color: 'text-accent',
  },
  {
    icon: Brain,
    label: 'Check-in',
    path: '/psychology',
    color: 'text-success',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    path: '/analytics',
    color: 'text-warning',
  },
];

export function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-card to-accent/5 border-primary/20">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 [&>*]:stagger-item">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-20 flex-col gap-2 group"
            onClick={() => navigate(action.path)}
          >
            <action.icon className={cn('h-5 w-5 icon-spring', action.color)} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
