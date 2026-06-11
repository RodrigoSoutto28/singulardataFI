import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const Plus3D = createIcon3DComponent('newTrade');
const BookOpen3D = createIcon3DComponent('journal');
const CheckIn3D = createIcon3DComponent('checkin');
const BarChart3D = createIcon3DComponent('analytics');

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: 'quickActionNewTrade' | 'quickActionJournal' | 'quickActionCheckIn' | 'quickActionAnalytics';
  path: string;
}

const actions: ActionItem[] = [
  { icon: Plus3D,     labelKey: 'quickActionNewTrade',   path: '/journal' },
  { icon: BookOpen3D, labelKey: 'quickActionJournal',    path: '/journal' },
  { icon: CheckIn3D,  labelKey: 'quickActionCheckIn',    path: '/psychology' },
  { icon: BarChart3D, labelKey: 'quickActionAnalytics',  path: '/analytics' },
];

export function QuickActionsCard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="overflow-visible">
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3">
        {actions.map((action) => (
          <button
            key={action.labelKey}
            type="button"
            onClick={() => navigate(action.path)}
            className="group relative flex flex-col items-center justify-end gap-2 h-28 rounded-xl border border-border/60 bg-card hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 px-3 pb-3 pt-10 cursor-pointer overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {/* Icon: centered above the text, slightly overflowing top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[30%] w-14 h-14 transition-all duration-350 group-hover:scale-115 group-hover:-translate-y-[40%] group-hover:rotate-3">
              <action.icon className="h-full w-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.28)]" aria-hidden />
            </div>
            <span className="text-xs font-semibold tracking-tight text-foreground/80 text-center leading-tight w-full">
              {t.dashboard[action.labelKey]}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
