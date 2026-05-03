import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
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
    return (
      <div className="rounded-lg bg-popover border border-border p-3 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold font-mono">
          ${payload[0].value.toLocaleString()}
        </p>
        {payload[0].payload.pnl !== undefined && (
          <p
            className={cn(
              'text-xs font-mono mt-1',
              payload[0].payload.pnl >= 0 ? 'text-profit' : 'text-loss'
            )}
          >
            {payload[0].payload.pnl >= 0 ? '+' : ''}$
            {payload[0].payload.pnl.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function EquityChart({ data, className }: EquityChartProps) {
  const { t } = useLanguage();
  const isPositiveTrend = data.length > 1 && data[data.length - 1].equity >= data[0].equity;
  const trendColor = isPositiveTrend ? 'hsl(var(--profit))' : 'hsl(var(--loss))';
  const axisColor = 'hsl(var(--muted-foreground))';

  return (
    <div className={cn('p-6 pb-4 rounded-lg bg-card border border-border', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className={cn('h-5 w-5', isPositiveTrend ? 'text-success' : 'text-destructive')} />
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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
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
                tickFormatter={(value) => `$${value}`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
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
