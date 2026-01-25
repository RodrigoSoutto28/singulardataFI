import { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Journal', href: '/journal', icon: BookOpen },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Psychology', href: '/psychology', icon: CheckSquare },
  { title: 'Insights', href: '/insights', icon: TrendingUp },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;

    return (
      <Link to={item.href}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-11 w-11 rounded-xl transition-all duration-200',
            isActive 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          <item.icon className="h-5 w-5" />
        </Button>
      </Link>
    );
  };

  return (
    <aside className="flex flex-col items-center w-[70px] border-r border-border bg-sidebar h-screen sticky top-0 py-4">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
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
        <Link to="/settings">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  );
}
