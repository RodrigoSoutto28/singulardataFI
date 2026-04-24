import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  CheckSquare,
  Settings,
  LogOut,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  titleKey: 'dashboard' | 'journal' | 'analytics' | 'psychology' | 'insights';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { titleKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { titleKey: 'journal', href: '/journal', icon: BookOpen },
  { titleKey: 'analytics', href: '/analytics', icon: BarChart3 },
  { titleKey: 'psychology', href: '/psychology', icon: CheckSquare },
  { titleKey: 'insights', href: '/insights', icon: TrendingUp },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={item.href}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-lg transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {t.nav[item.titleKey]}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <aside className="flex flex-col items-center w-[70px] glass-sidebar h-screen sticky top-0 py-4">
      {/* Logo - SINGULAR dataFI */}
      <div className="flex flex-col items-center justify-center mb-8 gap-1">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
          <LineChart className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-foreground tracking-tight">SINGULAR</span>
          <span className="text-[8px] font-medium text-primary">dataFI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t.nav.settings}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t.nav.logout}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
