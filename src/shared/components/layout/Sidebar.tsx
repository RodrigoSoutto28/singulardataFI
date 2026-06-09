import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';
import {
  Settings,
  LogOut,
  Power,
  Shield,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
} from 'lucide-react';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const LayoutDashboard = createIcon3DComponent('dashboard', true);
const BookOpen = createIcon3DComponent('journal', true);
const BarChart3 = createIcon3DComponent('analytics', true);
const Brain = createIcon3DComponent('brain', true);
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useTheme } from '@/shared/lib/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { LogoMindOn } from '@/shared/components/ui/logo-mindon';


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
  /** Force-collapsed (icon-only) view. When undefined, controlled by parent state on tablet. */
  collapsed?: boolean;
  /** Toggle handler for the collapse button (only shown when provided). */
  onToggleCollapsed?: () => void;
  /** Called when a nav item is selected (used to close mobile drawer). */
  onItemClick?: () => void;
  /** Show quick toggles inside the sidebar (used in mobile drawer). */
  showQuickToggles?: boolean;
}

export function Sidebar({
  collapsed: collapsedProp = false,
  onToggleCollapsed,
  onItemClick,
  showQuickToggles = false,
}: SidebarProps) {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Hover-to-expand: when the parent has collapsed the sidebar, expanding on hover
  // gives instant access to labels without changing the persisted collapsed state.
  const [isHovering, setIsHovering] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (collapsedProp) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setIsHovering(false), 180);
  };

  const collapsed = collapsedProp && !isHovering;


  const NavRow = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const tourTag =
      item.href === '/analytics'
        ? 'analytics'
        : item.href === '/psychology'
        ? 'psychology'
        : undefined;
    const content = (
      <Link
        to={item.href}
        className="block group"
        onClick={onItemClick}
        data-tour={tourTag}
      >
        <div
          className={cn(
            'relative flex items-center h-10 rounded-md text-sm font-medium transition-all duration-200',
            collapsed ? 'justify-center px-0 mx-1' : 'gap-3 px-3',
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
              'h-[26px] w-[26px] transition-transform duration-200 group-hover:scale-110 shrink-0',
              isActive && 'text-primary'
            )}
          />
          {!collapsed && <span className="tracking-tight truncate">{t.nav[item.titleKey]}</span>}
        </div>
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {t.nav[item.titleKey]}
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        data-tour="sidebar"
        aria-label="Navegación principal"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'flex flex-col h-full sticky top-0 glass-sidebar transition-[width] duration-500 ease-in-out z-30',
          collapsed ? 'w-[64px]' : 'w-[230px]',
          collapsedProp && isHovering && 'shadow-xl shadow-black/20'
        )}
      >

        {/* Brand */}
        <div className={cn('flex items-center h-16', collapsed ? 'justify-center px-0' : 'gap-2.5 px-4')}>
          {collapsed ? (
            /* Colapsado: solo el ícono power */
            <div className="relative flex items-center justify-center h-9 w-9 rounded-md bg-primary shadow-sm shadow-primary/30 shrink-0">
              <Power className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.5} />
            </div>
          ) : (
            /* Expandido: logo React con font rendering preciso */
            <LogoMindOn size="md" showSubtitle={false} />
          )}
        </div>

        <div className={cn(collapsed ? 'px-2' : 'px-5')}>
          <div className="h-px bg-border" />
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/70 uppercase">
              Workspace
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className={cn('flex-1 flex flex-col gap-0.5 overflow-y-auto scrollbar-none', collapsed ? 'px-2 pt-3' : 'px-3')}>
          {navItems.map((item) => (
            <NavRow key={item.href} item={item} />
          ))}
        </nav>


        {/* Theme toggle (mobile drawer) */}
        {showQuickToggles && !collapsed && (
          <div className="px-3 pb-3">
            <div className="px-2 pb-1.5">
              <span className="text-[10px] font-semibold tracking-[0.15em] text-muted-foreground/70 uppercase">
                Tema
              </span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="w-full flex items-center justify-between gap-2 h-9 px-3 rounded-md border border-border/60 bg-muted/60 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-primary" />
                ) : (
                  <Sun className="h-4 w-4 text-warning" />
                )}
                <span className="font-medium">
                  {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Cambiar
              </span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={cn('py-3 border-t border-border flex flex-col gap-0.5 mt-auto shrink-0', collapsed ? 'px-2' : 'px-3')}>
          {profile?.role === 'admin' && (
            <Link to="/admin/study" className="block group" onClick={onItemClick}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'flex items-center justify-center h-10 rounded-md text-sm font-medium transition-all',
                        location.pathname.startsWith('/admin')
                          ? 'text-primary bg-primary/8'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      )}
                    >
                      <Shield className="h-[18px] w-[18px]" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">Admin · Estudio</TooltipContent>
                </Tooltip>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-all',
                    location.pathname.startsWith('/admin')
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Shield className="h-[18px] w-[18px]" />
                  <span className="tracking-tight truncate">Admin · Estudio</span>
                </div>
              )}
            </Link>
          )}

          <Link to="/settings" className="block group" onClick={onItemClick}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'flex items-center justify-center h-10 rounded-md text-sm font-medium transition-all',
                      location.pathname === '/settings'
                        ? 'text-primary bg-primary/8'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    <Settings className="h-[18px] w-[18px]" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{t.nav.settings}</TooltipContent>
              </Tooltip>
            ) : (
              <div
                className={cn(
                  'flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-all',
                  location.pathname === '/settings'
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Settings className="h-[18px] w-[18px] group-hover:rotate-45 transition-transform" />
                <span className="tracking-tight truncate">{t.nav.settings}</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => { onItemClick?.(); signOut(); }}
            className={cn(
              'group flex items-center h-10 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all w-full',
              collapsed ? 'justify-center' : 'gap-3 px-3'
            )}
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <LogOut className="h-[18px] w-[18px]" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{t.nav.logout}</TooltipContent>
              </Tooltip>
            ) : (
              <>
                <LogOut className="h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
                <span className="tracking-tight truncate">{t.nav.logout}</span>
              </>
            )}
          </button>

          {/* Collapse toggle (tablet/desktop) */}
          {onToggleCollapsed && (
            <button
              onClick={onToggleCollapsed}
              className={cn(
                'mt-1 flex items-center h-9 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all w-full',
                collapsed ? 'justify-center' : 'gap-2 px-3'
              )}
              aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  <span>Colapsar</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

