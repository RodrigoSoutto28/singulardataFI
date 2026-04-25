import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  TrendingUp,
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
      <Link to={item.href} className="block group">
        <div
          className={cn(
            'relative flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-all duration-200',
            isActive
              ? 'text-primary bg-primary/8'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          )}
        >
          {/* Active indicator bar */}
          <span
            className={cn(
              'absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary transition-all duration-300',
              isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            )}
          />
          <item.icon
            className={cn(
              'h-[18px] w-[18px] transition-transform duration-200',
              'group-hover:scale-110',
              isActive && 'text-primary'
            )}
          />
          <span className="tracking-tight">{t.nav[item.titleKey]}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside className="flex flex-col w-[230px] h-screen sticky top-0 glass-sidebar">
      {/* Brand — clean monogram */}
      <div className="flex items-center gap-2.5 px-5 h-16">
        <div className="relative flex items-center justify-center h-9 w-9 rounded-md bg-primary shadow-sm shadow-primary/30">
          <TrendingUp className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="text-[13px] font-semibold tracking-[0.18em] text-foreground uppercase">
          Singular
        </span>
      </div>

      <div className="px-5">
        <div className="h-px bg-border" />
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/70 uppercase">
          Workspace
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavRow key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border flex flex-col gap-0.5">
        <Link to="/settings" className="block group">
          <div
            className={cn(
              'flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-all duration-200',
              location.pathname === '/settings'
                ? 'text-primary bg-primary/8'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Settings className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-45" />
            <span className="tracking-tight">{t.nav.settings}</span>
          </div>
        </Link>
        <button
          onClick={signOut}
          className="group flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 w-full"
        >
          <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="tracking-tight">{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
}
