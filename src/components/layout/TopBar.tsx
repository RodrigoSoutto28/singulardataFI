import { Sun, Moon, Menu, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { Language } from '@/i18n/translations';
import { useTheme } from '@/contexts/ThemeContext';

interface TopBarProps {
  onMenuClick?: () => void;
  sectionTitle?: string;
}

export function TopBar({ onMenuClick, sectionTitle }: TopBarProps) {
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setCurrentTime] = useState(new Date());
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initials =
    profile?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'T';

  const languages: Language[] = ['ES', 'EN', 'PT'];

  return (
    <header className="sticky top-0 z-40 h-16 glass-topbar">
      <div className="grid grid-cols-[auto_1fr_auto] md:flex md:items-center md:justify-between h-full px-3 md:px-6 gap-2">
        {/* Left: hamburger (mobile) + brand */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile brand monogram */}
          <div className="flex md:hidden items-center gap-1.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary">
              <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase">
              Singular
            </span>
          </div>

          {/* Desktop brand line */}
          <h1 className="hidden md:block text-sm font-light text-muted-foreground tracking-[0.08em]">
            {t.topbar.title}
          </h1>
        </div>

        {/* Center: section title (mobile only) */}
        <div className="md:hidden flex items-center justify-center min-w-0">
          {sectionTitle && (
            <span className="text-sm font-semibold text-foreground truncate">
              {sectionTitle}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 md:gap-2 justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted/60 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language Selector — desktop/tablet only (mobile lives inside drawer) */}
          <div className="hidden md:flex items-center bg-muted/60 rounded-md p-0.5 border border-border/60">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`h-7 px-2.5 rounded text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                  language === lang
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 h-10 px-1 md:px-2">
                <span className="hidden lg:block text-sm font-medium truncate max-w-[140px]">
                  {profile?.full_name || 'Trader Demo'}
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
              <DropdownMenuItem>{t.topbar.profile}</DropdownMenuItem>
              <DropdownMenuItem>{t.topbar.billing}</DropdownMenuItem>
              <DropdownMenuItem>{t.topbar.settings}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                {t.topbar.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
