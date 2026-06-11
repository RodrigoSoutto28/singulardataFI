import { useNavigate } from 'react-router-dom';
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
}

const actions: ActionItem[] = [
  { icon: Plus3D, labelKey: 'quickActionNewTrade', path: '/journal' },
  { icon: BookOpen3D, labelKey: 'quickActionJournal', path: '/journal' },
  { icon: Brain3D, labelKey: 'quickActionCheckIn', path: '/psychology' },
  { icon: BarChart3D, labelKey: 'quickActionAnalytics', path: '/analytics' },
];

export function QuickActionsCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="overflow-visible">
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
        {actions.map((action) => (
          <Button
            key={action.labelKey}
            variant="outline"
            className="h-32 flex-col items-center justify-end pb-3 pt-2 gap-1.5 group relative overflow-visible hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 rounded-xl"
            onClick={() => navigate(action.path)}
          >
            {/* Icon centered-top, slightly overflowing the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-16 h-16 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1/3 group-hover:rotate-3 pointer-events-none">
              <action.icon className="h-full w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]" aria-hidden />
            </div>
            <span className="text-xs font-semibold tracking-tight text-foreground/80 text-center leading-tight mt-auto">
              {t.dashboard[action.labelKey]}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
