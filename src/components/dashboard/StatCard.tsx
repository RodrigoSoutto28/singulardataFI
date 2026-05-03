import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  color?: 'primary' | 'teal' | 'purple' | 'orange' | 'green';
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
  color = 'primary',
  className,
}: StatCardProps) {
  const colorVariants = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', glow: 'hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.4)]' },
    teal:    { bg: 'bg-[hsl(173_80%_40%/0.1)]', icon: 'text-[hsl(173_80%_40%)]', glow: 'hover:shadow-[0_0_24px_-4px_hsl(173_80%_40%/0.4)]' },
    purple:  { bg: 'bg-[hsl(265_84%_60%/0.1)]', icon: 'text-[hsl(265_84%_60%)]', glow: 'hover:shadow-[0_0_24px_-4px_hsl(265_84%_60%/0.4)]' },
    orange:  { bg: 'bg-[hsl(28_95%_55%/0.1)]', icon: 'text-[hsl(28_95%_55%)]', glow: 'hover:shadow-[0_0_24px_-4px_hsl(28_95%_55%/0.4)]' },
    green:   { bg: 'bg-success/10', icon: 'text-success', glow: 'hover:shadow-[0_0_24px_-4px_hsl(var(--success)/0.4)]' },
  } as const;
  const v = colorVariants[color];

  return (
    <Card className={cn('relative overflow-hidden transition-all duration-300', v.glow, className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2 rounded-lg', v.bg, v.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          {change !== undefined && (
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={cn(
                'text-xs font-mono',
                trend === 'up' && 'bg-success/15 text-success hover:bg-success/20'
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 pointer-events-none" />
    </Card>
  );
}
