import { Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
interface TopBarProps {
  onMenuClick?: () => void;
}
export function TopBar({
  onMenuClick
}: TopBarProps) {
  const {
    profile,
    signOut
  } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app-language') || 'ES';
  });

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T';
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
  return <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left - Date & Time */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          
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
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-muted/50 backdrop-blur-sm rounded-full p-0.5 border border-border/30">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeLanguage('ES')}
              className={`h-7 px-3 rounded-full text-xs transition-colors ${
                language === 'ES' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ES
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeLanguage('EN')}
              className={`h-7 px-3 rounded-full text-xs transition-colors ${
                language === 'EN' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeLanguage('PT')}
              className={`h-7 px-3 rounded-full text-xs transition-colors ${
                language === 'PT' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
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
            <DropdownMenuContent align="end" className="w-56 bg-popover/80 backdrop-blur-xl border-border/50">
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
    </header>;
}