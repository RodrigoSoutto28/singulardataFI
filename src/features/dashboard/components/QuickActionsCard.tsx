import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const Plus3D = createIcon3DComponent('newTrade');
const BookOpen3D = createIcon3DComponent('journal');
const Brain3D = createIcon3DComponent('checkin');
const BarChart3D = createIcon3DComponent('analytics');

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: 'quickActionNewTrade' | 'quickActionJournal' | 'quickActionCheckIn' | 'quickActionAnalytics';
  path: string;
  color: string;
}

const actions: ActionItem[] = [
  { icon: Plus3D, labelKey: 'quickActionNewTrade', path: '/journal', color: 'text-primary' },
  { icon: BookOpen3D, labelKey: 'quickActionJournal', path: '/journal', color: 'text-accent' },
  { icon: Brain3D, labelKey: 'quickActionCheckIn', path: '/psychology', color: 'text-success' },
  { icon: BarChart3D, labelKey: 'quickActionAnalytics', path: '/analytics', color: 'text-warning' },
];

export function QuickActionsCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-card to-accent/5 border-primary/20">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 [&>*]:stagger-item">
        {actions.map((action) => (
          <Button
            key={action.labelKey}
            variant="outline"
            className="h-20 flex-col gap-2 group"
            onClick={() => navigate(action.path)}
          >
            <action.icon className={cn('h-5 w-5 icon-spring', action.color)} aria-hidden />
            <span className="text-xs">{t.dashboard[action.labelKey]}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

