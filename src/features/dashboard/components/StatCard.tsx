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
  const glowMap = {
    primary: 'hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.45)]',
    teal:    'hover:shadow-[0_0_28px_-4px_hsl(173_80%_40%/0.45)]',
    purple:  'hover:shadow-[0_0_28px_-4px_hsl(265_84%_60%/0.45)]',
    orange:  'hover:shadow-[0_0_28px_-4px_hsl(28_95%_55%/0.45)]',
    green:   'hover:shadow-[0_0_28px_-4px_hsl(var(--success)/0.45)]',
  } as const;

  return (
    <Card
      className={cn(
        'relative overflow-hidden group cursor-default min-h-[140px] transition-all duration-300',
        glowMap[color],
        className,
      )}
    >
      {/* 3D icon — anchored top-right, sized to never overlap value */}
      <div className="icon3d-hero">
        <Icon className="h-full w-full" />
      </div>

      <CardContent className="pt-5 pb-4 px-4 relative z-10 flex flex-col justify-between h-full min-h-[120px] pr-[6.5rem] md:pr-[7.5rem]">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold truncate">
          {label}
        </p>
        <div className="flex items-end gap-2 mt-auto flex-wrap">
          <p className={cn(
            'text-xl sm:text-2xl font-bold font-mono tracking-tight leading-none',
            negative && 'text-loss'
          )}>
            {value}
          </p>
          {change !== undefined && (
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={cn(
                'text-[10px] font-mono shrink-0 mb-0.5 px-1.5 py-0.5',
                trend === 'up' && 'bg-success/15 text-success hover:bg-success/20',
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
