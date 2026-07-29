import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { cn, formatCurrency } from '@/shared/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

interface EquityDataPoint {
  date: string;
  equity: number;
  pnl?: number;
}

interface EquityChartProps {
  data: EquityDataPoint[];
  initialBalance?: number;
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

export function EquityChart({ data, initialBalance, className }: EquityChartProps) {
  const { t } = useLanguage();

  const chartData = data.length && initialBalance !== undefined
    ? [{ date: 'Inicio', equity: initialBalance, pnl: 0 }, ...data]
    : data;

  const currentEquity = data.length ? data[data.length - 1].equity : (initialBalance ?? 0);
  const startEquity = initialBalance !== undefined ? initialBalance : (data.length ? data[0].equity : 0);
  const minEquity = chartData.length ? Math.min(...chartData.map((d) => d.equity)) : 0;
  const maxEquity = chartData.length ? Math.max(...chartData.map((d) => d.equity)) : 0;
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
      {/* Trend indicator (sin título, el contenedor padre ya lo provee) */}
      <div className="flex items-center justify-end mb-1">
        <HeaderIcon className={cn('h-4 w-4', headerColor)} aria-label={t.dashboard.equityCurve} />
      </div>

      {/* Chart - altura adaptativa según haya datos o no */}
      <div className={cn(chartData.length === 0 ? 'h-[120px] sm:h-[140px]' : 'h-[200px] sm:h-[240px]')}>

        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 rounded-md bg-muted/40 border border-dashed border-border">
            <TrendingUp className="h-7 w-7 text-muted-foreground/50 mb-1.5" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">{t.dashboard.noTrades}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                tickFormatter={(value) => {
                  const n = Number(value);
                  const abs = Math.abs(n);
                  const sign = n < 0 ? '-' : '';
                  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
                  return `${sign}$${abs.toFixed(0)}`;
                }}
                width={60}
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

