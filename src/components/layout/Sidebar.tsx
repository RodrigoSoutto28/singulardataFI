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
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebarState } from '@/contexts/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const { collapsed, toggle } = useSidebarState();

  // On mobile sheet, never collapse
  const isCollapsed = !mobile && collapsed;

  const NavRow = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const content = (
      <Link to={item.href} className="block group" onClick={onNavigate}>
        <div
          className={cn(
            'relative flex items-center h-10 rounded-md text-sm font-medium transition-all duration-200',
            isCollapsed ? 'justify-center px-0 mx-1' : 'gap-3 px-3',
            isActive
              ? 'text-primary bg-primary/8'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          )}
        >
          <span
            className={cn(
              'absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary transition-all duration-300',
              isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            )}
          />
          <item.icon
            className={cn(
              'h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 shrink-0',
              isActive && 'text-primary'
            )}
          />
          <span
            className={cn(
              'tracking-tight whitespace-nowrap transition-[opacity,width] duration-200 overflow-hidden',
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            )}
          >
            {t.nav[item.titleKey]}
          </span>
        </div>
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {t.nav[item.titleKey]}
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  const settingsActive = location.pathname === '/settings';

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 glass-sidebar transition-[width] duration-300 ease-out',
        isCollapsed ? 'w-[68px]' : 'w-[230px]'
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex items-center h-16 transition-all duration-300',
          isCollapsed ? 'justify-center px-0' : 'gap-2.5 px-5'
        )}
      >
        <div className="relative flex items-center justify-center h-9 w-9 rounded-md bg-primary shadow-sm shadow-primary/30 shrink-0">
          <TrendingUp className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span
          className={cn(
            'text-[13px] font-semibold tracking-[0.18em] text-foreground uppercase whitespace-nowrap transition-[opacity,width] duration-200 overflow-hidden',
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          )}
        >
          Singular
        </span>
      </div>

      <div className={cn('transition-all duration-300', isCollapsed ? 'px-3' : 'px-5')}>
        <div className="h-px bg-border" />
      </div>

      {/* Section label */}
      {!isCollapsed && (
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/70 uppercase">
            Workspace
          </span>
        </div>
      )}
      {isCollapsed && <div className="pt-4" />}

      {/* Nav */}
      <nav className="flex-1 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavRow key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-border flex flex-col gap-0.5">
        {(() => {
          const settingsLink = (
            <Link to="/settings" className="block group" onClick={onNavigate}>
              <div
                className={cn(
                  'flex items-center h-10 rounded-md text-sm font-medium transition-all duration-200',
                  isCollapsed ? 'justify-center px-0 mx-1' : 'gap-3 px-3',
                  settingsActive
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Settings className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-45 shrink-0" />
                <span
                  className={cn(
                    'tracking-tight whitespace-nowrap transition-[opacity,width] duration-200 overflow-hidden',
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  )}
                >
                  {t.nav.settings}
                </span>
              </div>
            </Link>
          );
          return isCollapsed ? (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>{settingsLink}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {t.nav.settings}
              </TooltipContent>
            </Tooltip>
          ) : (
            settingsLink
          );
        })()}

        {(() => {
          const logoutBtn = (
            <button
              onClick={signOut}
              className={cn(
                'group flex items-center h-10 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 w-full',
                isCollapsed ? 'justify-center px-0 mx-1' : 'gap-3 px-3'
              )}
            >
              <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
              <span
                className={cn(
                  'tracking-tight whitespace-nowrap transition-[opacity,width] duration-200 overflow-hidden',
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                )}
              >
                {t.nav.logout}
              </span>
            </button>
          );
          return isCollapsed ? (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>{logoutBtn}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {t.nav.logout}
              </TooltipContent>
            </Tooltip>
          ) : (
            logoutBtn
          );
        })()}

        {/* Collapse toggle (desktop only) */}
        {!mobile && (
          <>
            <div className="h-px bg-border my-1.5 mx-2" />
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  className={cn(
                    'group flex items-center h-9 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 w-full',
                    isCollapsed ? 'justify-center px-0 mx-1' : 'gap-3 px-3'
                  )}
                >
                  {isCollapsed ? (
                    <PanelLeft className="h-4 w-4 shrink-0" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4 shrink-0" />
                  )}
                  <span
                    className={cn(
                      'tracking-tight whitespace-nowrap transition-[opacity,width] duration-200 overflow-hidden',
                      isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                    )}
                  >
                    Collapse
                  </span>
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="font-medium">
                  Expand sidebar
                </TooltipContent>
              )}
            </Tooltip>
          </>
        )}
      </div>
    </aside>
  );
}
