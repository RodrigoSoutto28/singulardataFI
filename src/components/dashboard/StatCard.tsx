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
  negative?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
  color = 'primary',
  negative,
  className,
}: StatCardProps) {
  const colorVariants = {
    primary: {
      bg: 'bg-primary/10 hover:bg-primary/15',
      icon: 'text-primary',
      glow: 'hover:shadow-[0_0_24px_-4px] hover:shadow-primary/40',
      gradient: 'to-primary/5',
    },
    teal: {
      bg: 'bg-[hsl(173_80%_40%/0.1)] hover:bg-[hsl(173_80%_40%/0.15)]',
      icon: 'text-[hsl(173_80%_40%)]',
      glow: 'hover:shadow-[0_0_24px_-4px] hover:shadow-[hsl(173_80%_40%/0.4)]',
      gradient: 'to-[hsl(173_80%_40%/0.05)]',
    },
    purple: {
      bg: 'bg-[hsl(265_84%_60%/0.1)] hover:bg-[hsl(265_84%_60%/0.15)]',
      icon: 'text-[hsl(265_84%_60%)]',
      glow: 'hover:shadow-[0_0_24px_-4px] hover:shadow-[hsl(265_84%_60%/0.4)]',
      gradient: 'to-[hsl(265_84%_60%/0.05)]',
    },
    orange: {
      bg: 'bg-[hsl(28_95%_55%/0.1)] hover:bg-[hsl(28_95%_55%/0.15)]',
      icon: 'text-[hsl(28_95%_55%)]',
      glow: 'hover:shadow-[0_0_24px_-4px] hover:shadow-[hsl(28_95%_55%/0.4)]',
      gradient: 'to-[hsl(28_95%_55%/0.05)]',
    },
    green: {
      bg: 'bg-success/10 hover:bg-success/15',
      icon: 'text-success',
      glow: 'hover:shadow-[0_0_24px_-4px] hover:shadow-success/40',
      gradient: 'to-success/5',
    },
  } as const;
  const v = colorVariants[color];

  return (
    <Card
      className={cn(
        'relative overflow-hidden group cursor-default',
        'transition-all duration-300',
        v.glow,
        className,
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          {/* Icon with spring animation on group hover */}
          <div
            className={cn(
              'p-2 rounded-lg transition-all duration-300',
              'group-hover:scale-110 group-hover:rotate-[-6deg]',
              v.bg,
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                v.icon,
              )}
            />
          </div>

          {/* Trend badge */}
          {change !== undefined && (
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={cn(
                'text-xs font-mono',
                trend === 'up' && 'bg-success/15 text-success hover:bg-success/20',
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
          {label}
        </p>

        <p className={cn('text-2xl font-bold font-mono tracking-tight', negative && 'text-loss')}>
          {value}
        </p>
      </CardContent>

      {/* Subtle gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-transparent pointer-events-none',
          'transition-opacity duration-300 opacity-100 group-hover:opacity-80',
          v.gradient,
        )}
      />
    </Card>
  );
}
