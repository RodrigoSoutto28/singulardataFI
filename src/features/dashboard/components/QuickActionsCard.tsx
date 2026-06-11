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
    <Card className="overflow-hidden">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 [&>*]:stagger-item">
        {actions.map((action) => (
          <Button
            key={action.labelKey}
            variant="outline"
            className="h-32 flex-col items-center justify-center p-3 gap-2 group relative overflow-hidden glass-subtle hover:bg-white/10 hover:border-primary/50 transition-all duration-300 rounded-2xl"
            onClick={() => navigate(action.path)}
          >
            <div className="h-16 w-16 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 pointer-events-none opacity-95 drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]">
              <action.icon className="h-full w-full object-contain" aria-hidden />
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-tight text-foreground/90 text-center">{t.dashboard[action.labelKey]}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

