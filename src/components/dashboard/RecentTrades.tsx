import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  pnl: number;
  pnlPercentage: number;
  entryDate: string;
  status: 'open' | 'closed';
}

interface RecentTradesProps {
  trades: Trade[];
  className?: string;
}

export function RecentTrades({ trades, className }: RecentTradesProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Trades</h3>
          <p className="text-sm text-muted-foreground">Your latest trading activity</p>
        </div>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-lg',
                  trade.direction === 'long'
                    ? 'bg-success/20'
                    : 'bg-destructive/20'
                )}
              >
                {trade.direction === 'long' ? (
                  <ArrowUpRight className="h-5 w-5 text-success" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{trade.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] h-5',
                      trade.status === 'open'
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground text-muted-foreground'
                    )}
                  >
                    {trade.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{trade.entryDate}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p
                className={cn(
                  'font-semibold font-mono-numbers',
                  trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                )}
              >
                {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
              </p>
              <p
                className={cn(
                  'text-xs font-mono-numbers',
                  trade.pnlPercentage >= 0 ? 'text-profit' : 'text-loss'
                )}
              >
                {trade.pnlPercentage >= 0 ? '+' : ''}
                {trade.pnlPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
