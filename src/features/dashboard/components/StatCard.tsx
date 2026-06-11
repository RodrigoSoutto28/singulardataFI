import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
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
        'relative overflow-hidden group cursor-default min-h-[140px]',
        'transition-all duration-300',
        v.glow,
        className,
      )}
    >
      {/* Hero 3D icon — fusionado en esquina superior derecha */}
      <div className="icon3d-hero">
        <Icon className="h-full w-full object-contain" />
      </div>

      <CardContent className="pt-6 relative z-10 flex flex-col justify-between h-full min-h-[120px] pr-20">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold truncate">
          {label}
        </p>
        <div className="flex items-end gap-2 mt-2 flex-wrap">
          <p className={cn('text-2xl md:text-3xl font-bold font-mono tracking-tight', negative && 'text-loss')}>
            {value}
          </p>
          {change !== undefined && (
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={cn(
                'text-xs font-mono shrink-0',
                trend === 'up' && 'bg-success/15 text-success hover:bg-success/20',
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Subtle gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-transparent pointer-events-none z-0',
          'transition-opacity duration-300 opacity-100 group-hover:opacity-80',
          v.gradient,
        )}
      />
    </Card>
  );
}

