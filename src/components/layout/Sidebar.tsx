import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  LineChart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  titleKey: 'dashboard' | 'journal' | 'analytics' | 'psychology';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { titleKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { titleKey: 'journal', href: '/journal', icon: BookOpen },
  { titleKey: 'analytics', href: '/analytics', icon: BarChart3 },
  { titleKey: 'psychology', href: '/psychology', icon: Brain },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const NavRow = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link to={item.href} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 h-10 px-3 rounded-md text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary hover:bg-primary/15'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{t.nav[item.titleKey]}</span>
        </Button>
      </Link>
    );
  };

  return (
    <aside className="flex flex-col w-[230px] h-screen sticky top-0 glass-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-primary">
          <LineChart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-bold tracking-wider text-foreground">SINGULAR</span>
          <span className="text-[10px] font-medium text-primary tracking-wide">dataFI</span>
        </div>
      </div>

      <div className="px-3">
        <div className="h-px bg-border" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavRow key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border flex flex-col gap-1">
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-10 px-3 rounded-md text-sm font-medium',
              location.pathname === '/settings'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Settings className="h-4 w-4" />
            <span>{t.nav.settings}</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 h-10 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>{t.nav.logout}</span>
        </Button>
      </div>
    </aside>
  );
}
