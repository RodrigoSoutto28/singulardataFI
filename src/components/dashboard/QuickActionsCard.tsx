import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Brain, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActionsCard() {
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: 'Nuevo Trade', path: '/journal', color: 'text-primary' },
    { icon: BookOpen, label: 'Mi Journal', path: '/journal', color: 'text-[hsl(173_80%_40%)]' },
    { icon: Brain, label: 'Check-in', path: '/psychology', color: 'text-[hsl(265_84%_60%)]' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', color: 'text-[hsl(28_95%_55%)]' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate(action.path)}
          >
            <action.icon className={cn('h-5 w-5', action.color)} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
