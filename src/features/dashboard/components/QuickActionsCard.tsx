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
    <Card className="bg-gradient-to-r from-primary/5 via-card/40 to-accent/5 border-primary/20 overflow-hidden backdrop-blur-md">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 [&>*]:stagger-item">
        {actions.map((action) => (
          <Button
            key={action.labelKey}
            variant="outline"
            className="h-24 flex-col items-start justify-end p-4 gap-1 group relative overflow-hidden bg-card/25 backdrop-blur-lg border-white/5 hover:bg-card/45 hover:border-primary/50 transition-all duration-300 shadow-md"
            onClick={() => navigate(action.path)}
          >
            <div className="absolute right-1 bottom-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 pointer-events-none opacity-90">
              <action.icon className="h-14 w-14 md:h-16 md:w-16 object-contain" aria-hidden />
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-tight text-foreground/90 max-w-[65%] text-left self-start mt-1">{t.dashboard[action.labelKey]}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

