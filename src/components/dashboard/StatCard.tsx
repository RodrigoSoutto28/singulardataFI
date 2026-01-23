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
    default: 'bg-card',
    profit: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    loss: 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    profit: 'bg-success/20 text-success',
    loss: 'bg-destructive/20 text-destructive',
    primary: 'bg-primary/20 text-primary',
  };

  return (
    <div
      className={cn(
        'stat-card rounded-xl border p-5 shadow-card',
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
            'flex items-center justify-center h-12 w-12 rounded-xl',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
