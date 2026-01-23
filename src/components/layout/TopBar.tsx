import { Bell, Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { profile, signOut } = useAuth();

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const planColors = {
    free: 'bg-muted text-muted-foreground',
    pro: 'bg-primary/20 text-primary',
    power: 'bg-warning/20 text-warning',
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left - Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades, symbols, strategies..."
              className="pl-10 bg-muted/50 border-transparent focus:border-border"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="glow" size="sm" className="hidden sm:flex gap-2">
            <Plus className="h-4 w-4" />
            <span>New Trade</span>
          </Button>
          <Button variant="glow" size="icon" className="sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary pulse-live" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 h-10 px-2">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {profile?.full_name || 'User'}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] h-4 px-1.5 ${planColors[profile?.subscription_plan || 'free']}`}
                  >
                    {(profile?.subscription_plan || 'free').toUpperCase()}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
