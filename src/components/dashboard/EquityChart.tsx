import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EquityDataPoint {
  date: string;
  equity: number;
  pnl?: number;
}

interface EquityChartProps {
  data: EquityDataPoint[];
  className?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { pnl?: number } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const pnl = payload[0].payload.pnl;
    return (
      <div className="rounded-lg bg-popover border border-border p-3 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p
          className={cn(
            'text-sm font-semibold font-mono',
            value < 0 ? 'text-loss' : 'text-foreground'
          )}
        >
          {formatCurrency(value)}
        </p>
        {pnl !== undefined && (
          <p
            className={cn(
              'text-xs font-mono mt-1',
              pnl >= 0 ? 'text-profit' : 'text-loss'
            )}
          >
            {pnl >= 0 ? '+' : ''}
            {formatCurrency(pnl)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function EquityChart({ data, className }: EquityChartProps) {
  const { t } = useLanguage();

  const currentEquity = data.length ? data[data.length - 1].equity : 0;
  const startEquity = data.length ? data[0].equity : 0;
  const minEquity = data.length ? Math.min(...data.map((d) => d.equity)) : 0;
  const maxEquity = data.length ? Math.max(...data.map((d) => d.equity)) : 0;
  const isPositiveTrend = currentEquity >= startEquity;
  const isNegativeBalance = currentEquity < 0;

  // Color logic: red if balance negative; green if positive trend; amber if drawdown
  const trendColor = isNegativeBalance
    ? 'hsl(var(--loss))'
    : isPositiveTrend
      ? 'hsl(var(--profit))'
      : 'hsl(var(--warning))';

  const HeaderIcon = isNegativeBalance || !isPositiveTrend ? TrendingDown : TrendingUp;
  const headerColor = isNegativeBalance
    ? 'text-loss'
    : isPositiveTrend
      ? 'text-profit'
      : 'text-warning';

  const axisColor = 'hsl(var(--muted-foreground))';
  const showZeroLine = minEquity < 0 && maxEquity > 0;
  const yDomain: [number | string, number | string] = [
    minEquity < 0 ? Math.floor(minEquity * 1.1) : 'auto',
    'auto',
  ];

  return (
    <div className={cn('p-6 pb-4 rounded-lg bg-card border border-border', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <HeaderIcon className={cn('h-5 w-5', headerColor)} />
        <h3 className="text-sm font-medium">{t.dashboard.equityCurve}</h3>
      </div>

      {/* Chart */}
      <div className="h-[220px] sm:h-[280px]">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground/40 mb-2" aria-hidden />
            <p className="text-sm text-muted-foreground">{t.dashboard.noTrades}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={trendColor}
                    stopOpacity={isNegativeBalance ? 0.45 : 0.3}
                  />
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={yDomain}
                tickFormatter={(value) => formatCurrency(Number(value), { compact: true })}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              {showZeroLine && (
                <ReferenceLine
                  y={0}
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  label={{
                    value: '$0',
                    position: 'insideLeft',
                    fill: axisColor,
                    fontSize: 10,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="equity"
                stroke={trendColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#equityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
