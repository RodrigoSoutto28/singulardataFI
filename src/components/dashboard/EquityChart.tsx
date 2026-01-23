import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface EquityDataPoint {
  date: string;
  equity: number;
  pnl?: number;
}

interface EquityChartProps {
  data: EquityDataPoint[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold font-mono-numbers">
          ${payload[0].value.toLocaleString()}
        </p>
        {payload[0].payload.pnl !== undefined && (
          <p
            className={cn(
              'text-xs font-mono-numbers mt-1',
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
  const isPositiveTrend = data.length > 1 && data[data.length - 1].equity >= data[0].equity;

  return (
    <div className={cn('chart-container p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Equity Curve</h3>
          <p className="text-sm text-muted-foreground">
            Portfolio performance over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium">
            1M
          </button>
          <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted">
            3M
          </button>
          <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted">
            6M
          </button>
          <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted">
            1Y
          </button>
          <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted">
            All
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositiveTrend ? 'hsl(142, 76%, 45%)' : 'hsl(0, 72%, 55%)'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositiveTrend ? 'hsl(142, 76%, 45%)' : 'hsl(0, 72%, 55%)'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke={isPositiveTrend ? 'hsl(142, 76%, 45%)' : 'hsl(0, 72%, 55%)'}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
