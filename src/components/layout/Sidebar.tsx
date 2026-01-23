import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Sparkles, 
  BarChart3, 
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wallet,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Trade Journal', href: '/journal', icon: BookOpen },
  { title: 'Psychology', href: '/psychology', icon: Brain },
  { title: 'AI Insights', href: '/insights', icon: Sparkles, badge: 'AI' },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Reports', href: '/reports', icon: FileText },
];

const secondaryNavItems: NavItem[] = [
  { title: 'Accounts', href: '/accounts', icon: Wallet },
  { title: 'Strategies', href: '/strategies', icon: Target },
  { title: 'Backtesting', href: '/backtesting', icon: TrendingUp, badge: 'Pro' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;

    return (
      <Link to={item.href}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 h-11 px-3 transition-all duration-200',
            isActive 
              ? 'bg-primary/10 text-primary hover:bg-primary/15 border-l-2 border-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            collapsed && 'justify-center px-0'
          )}
        >
          <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  item.badge === 'AI' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-warning/20 text-warning'
                )}>
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-foreground">Analítica</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Trading Journal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-sidebar-border">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tools
            </p>
          )}
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground',
              collapsed && 'justify-center px-0'
            )}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span>Settings</span>}
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            'w-full justify-start gap-3 h-10 text-muted-foreground hover:text-destructive',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </Button>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-9 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
