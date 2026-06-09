import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const Plus3D = createIcon3DComponent('newTrade', true);
const BookOpen3D = createIcon3DComponent('journal', true);
const Brain3D = createIcon3DComponent('checkin', true);
const BarChart3D = createIcon3DComponent('analytics', true);

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
    <Card className="bg-gradient-to-r from-primary/5 via-card to-accent/5 border-primary/20 overflow-visible">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 overflow-visible [&>*]:stagger-item">
        {actions.map((action) => (
          <Button
            key={action.labelKey}
            variant="outline"
            className="h-28 flex-col justify-end pb-3 gap-2 group relative overflow-visible bg-card/50 border-border/60 hover:bg-card hover:border-primary/45 transition-all duration-300"
            onClick={() => navigate(action.path)}
          >
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:scale-115 group-hover:translate-y-[-6px] pointer-events-none drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]">
              <action.icon className={cn('h-14 w-14 object-contain', action.color)} aria-hidden />
            </div>
            <span className="text-xs font-semibold tracking-tight">{t.dashboard[action.labelKey]}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

