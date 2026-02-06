import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'profit' | 'loss' | 'primary';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  const variantStyles = {
    default: 'bg-card border-border',
    profit: 'bg-card border-success/30',
    loss: 'bg-card border-destructive/30',
    primary: 'bg-card border-primary/30',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    profit: 'bg-success/10 text-success',
    loss: 'bg-destructive/10 text-destructive',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <div
      className={cn(
        'stat-card rounded-lg border p-5',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold font-mono-numbers tracking-tight">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'text-xs font-semibold font-mono-numbers',
                  isPositive ? 'text-profit' : 'text-loss'
                )}
              >
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-lg',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
