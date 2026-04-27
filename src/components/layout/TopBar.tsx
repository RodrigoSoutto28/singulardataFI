import { Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { Language } from '@/i18n/translations';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T';

  const languages: Language[] = ['ES', 'EN', 'PT'];

  return (
    <header className="sticky top-0 z-40 h-16 glass-topbar">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-sm font-medium text-muted-foreground tracking-wide">
            {t.topbar.title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-muted/60 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-muted/60 rounded-md p-0.5 border border-border/60">
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
              <Button variant="ghost" className="gap-3 h-10 px-2">
                <span className="hidden md:block text-sm font-medium">
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
