import { Sun, Moon, Menu, User as UserIcon, Settings as SettingsIcon, CreditCard, LogOut } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useTheme } from '@/shared/lib/ThemeContext';
import { AccountSwitcher } from './AccountSwitcher';
import { LogoMindOn } from '@/shared/components/ui/logo-mindon';
// LanguageSelector removed: language preference is managed in Settings + auto-detection


interface TopBarProps {
  onMenuClick?: () => void;
  sectionTitle?: string;
}

export function TopBar({ onMenuClick, sectionTitle }: TopBarProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const initials =
    profile?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'T';

  

  return (
    <header className="sticky top-0 z-40 h-16 glass-topbar">
      <div className="flex items-center justify-between h-full px-3 md:px-6 gap-3">
        {/* Left: hamburger (mobile) + brand */}
        <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 shrink-0"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile brand — logo real */}
          <div className="flex md:hidden items-center min-w-0">
            <LogoMindOn size="sm" showSubtitle={false} />
          </div>

          {/* Desktop brand line */}
          <h1 className="hidden md:block text-sm font-light text-muted-foreground tracking-[0.08em] truncate">
            {t.topbar.title}
          </h1>
        </div>

        {/* Center: section title (mobile only) */}
        {sectionTitle && (
          <div className="md:hidden flex items-center justify-center min-w-0 flex-1">
            <span className="text-sm font-semibold text-foreground truncate">
              {sectionTitle}
            </span>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">

          <AccountSwitcher />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted/60 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>



          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 h-10 px-1 md:px-2">
                <span className="hidden lg:block text-sm font-medium truncate max-w-[140px]">
                  {profile?.full_name || t.topbar.defaultTraderName}
                </span>
                <Avatar className="h-8 w-8 border-2 border-border">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <DropdownMenuLabel>{t.topbar.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer gap-2">
                <UserIcon className="h-4 w-4" />
                {t.topbar.profile}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer gap-2">
                <CreditCard className="h-4 w-4" />
                {t.topbar.billing}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer gap-2">
                <SettingsIcon className="h-4 w-4" />
                {t.topbar.settings}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer gap-2">
                <LogOut className="h-4 w-4" />
                {t.topbar.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

