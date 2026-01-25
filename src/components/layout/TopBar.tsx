import { Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { profile, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'T';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left - Date & Time */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:block">
            <p className="text-xs text-muted-foreground tracking-wider">
              {formatDate(currentTime)}
            </p>
            <p className="text-sm font-mono text-primary font-medium">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Center - Title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-sm font-medium text-muted-foreground">
            Analítica - Trading Journal & Analytics
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-muted rounded-full p-0.5">
            <Button variant="ghost" size="sm" className="h-7 px-3 rounded-full bg-primary text-primary-foreground text-xs">
              ES
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 rounded-full text-muted-foreground text-xs">
              EN
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 rounded-full text-muted-foreground text-xs">
              PT
            </Button>
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Facturación</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
