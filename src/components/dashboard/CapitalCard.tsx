import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface CapitalCardProps {
  title: string;
  value: string | number;
  change?: number;
  variant?: 'balance' | 'pnl';
  className?: string;
}

export function CapitalCard({
  title,
  value,
  change,
  variant = 'balance',
  className,
}: CapitalCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const displayValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <div className={cn('p-5 rounded-xl glass-card', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'p-3 rounded-xl',
          variant === 'balance' ? 'bg-primary/10' : 'bg-muted'
        )}>
          {variant === 'balance' ? (
            <Wallet className="h-6 w-6 text-primary" />
          ) : isPositive ? (
            <TrendingUp className="h-6 w-6 text-profit" />
          ) : (
            <TrendingDown className="h-6 w-6 text-loss" />
          )}
        </div>
        {change !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            isPositive 
              ? 'bg-success/10 text-success' 
              : 'bg-destructive/10 text-destructive'
          )}>
            {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className={cn(
        'text-3xl font-bold font-mono tracking-tight',
        variant === 'pnl' && !isPositive && 'text-loss'
      )}>
        {displayValue}
      </p>
    </div>
  );
}
