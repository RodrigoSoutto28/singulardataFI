import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CapitalCardProps {
  title: string;
  value: string | number;
  change?: number;
  variant?: 'balance' | 'pnl';
  className?: string;
  onEdit?: () => void;
  showEdit?: boolean;
}

export function CapitalCard({
  title,
  value,
  change,
  variant = 'balance',
  className,
  onEdit,
  showEdit = false,
}: CapitalCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const displayValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <div className={cn('p-5 rounded-lg bg-card border border-border relative group', className)}>
      {showEdit && onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'p-2.5 rounded-lg',
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
            'text-xs font-medium px-2 py-1 rounded-md',
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
