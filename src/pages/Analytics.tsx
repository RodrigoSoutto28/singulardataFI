import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Award,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data
const monthlyPnlData = [
  { month: 'Aug', pnl: 1200, trades: 23 },
  { month: 'Sep', pnl: -450, trades: 28 },
  { month: 'Oct', pnl: 2100, trades: 19 },
  { month: 'Nov', pnl: 1800, trades: 22 },
  { month: 'Dec', pnl: 890, trades: 25 },
  { month: 'Jan', pnl: 2800, trades: 21 },
];

const winLossData = [
  { name: 'Winning', value: 101, color: 'hsl(142, 76%, 45%)' },
  { name: 'Losing', value: 55, color: 'hsl(0, 72%, 55%)' },
];

const assetDistribution = [
  { name: 'Forex', value: 45, color: 'hsl(187, 85%, 53%)' },
  { name: 'Stocks', value: 25, color: 'hsl(142, 76%, 45%)' },
  { name: 'Crypto', value: 20, color: 'hsl(38, 92%, 50%)' },
  { name: 'Futures', value: 10, color: 'hsl(262, 83%, 58%)' },
];

const weekdayPerformance = [
  { day: 'Mon', winRate: 68, pnl: 450 },
  { day: 'Tue', winRate: 72, pnl: 620 },
  { day: 'Wed', winRate: 65, pnl: 380 },
  { day: 'Thu', winRate: 70, pnl: 520 },
  { day: 'Fri', winRate: 52, pnl: -120 },
];

const hourlyPerformance = [
  { hour: '8-10', winRate: 73, trades: 28 },
  { hour: '10-12', winRate: 68, trades: 35 },
  { hour: '12-14', winRate: 55, trades: 18 },
  { hour: '14-16', winRate: 71, trades: 42 },
  { hour: '16-18', winRate: 62, trades: 21 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold font-mono-numbers" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name.includes('$') 
              ? `$${entry.value.toLocaleString()}` 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { t } = useLanguage();
  
  const totalPnl = monthlyPnlData.reduce((sum, m) => sum + m.pnl, 0);
  const totalTrades = monthlyPnlData.reduce((sum, m) => sum + m.trades, 0);
  const winRate = ((winLossData[0].value / (winLossData[0].value + winLossData[1].value)) * 100).toFixed(1);
  const profitFactor = 1.87;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.analytics.title}</h1>
          <p className="text-muted-foreground">{t.analytics.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">{t.analytics.last30Days}</Button>
          <Button variant="outline" size="sm">{t.analytics.last90Days}</Button>
          <Button variant="default" size="sm">{t.analytics.sixMonths}</Button>
          <Button variant="outline" size="sm">{t.analytics.allTime}</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.analytics.totalPnl}</p>
                <p className={cn(
                  'text-2xl font-bold font-mono-numbers',
                  totalPnl >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.analytics.winRate}</p>
                <p className="text-2xl font-bold font-mono-numbers text-primary">{winRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.analytics.profitFactor}</p>
                <p className="text-2xl font-bold font-mono-numbers">{profitFactor}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.analytics.totalTrades}</p>
                <p className="text-2xl font-bold font-mono-numbers">{totalTrades}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly P&L Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t.analytics.monthlyPnl}
            </CardTitle>
            <CardDescription>{t.analytics.monthlyPnlDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPnlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pnl"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(187, 85%, 53%)"
                  >
                    {monthlyPnlData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.pnl >= 0 ? 'hsl(142, 76%, 45%)' : 'hsl(0, 72%, 55%)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Win/Loss Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t.analytics.winLossRatio}
            </CardTitle>
            <CardDescription>{t.analytics.distributionOutcomes}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: winLossData[0].color }} />
                <span className="text-sm text-muted-foreground">{t.analytics.winning}</span>
                <span className="text-sm font-semibold font-mono-numbers">{winLossData[0].value}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: winLossData[1].color }} />
                <span className="text-sm text-muted-foreground">{t.analytics.losing}</span>
                <span className="text-sm font-semibold font-mono-numbers">{winLossData[1].value}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekday Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t.analytics.weekdayPerformance}
            </CardTitle>
            <CardDescription>{t.analytics.winRateByDay}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekdayPerformance.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-10 text-sm font-medium">{day.day}</span>
                  <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all flex items-center justify-end px-3',
                        day.winRate >= 65 ? 'bg-success/30' : day.winRate >= 55 ? 'bg-warning/30' : 'bg-destructive/30'
                      )}
                      style={{ width: `${day.winRate}%` }}
                    >
                      <span className="text-xs font-semibold font-mono-numbers">{day.winRate}%</span>
                    </div>
                  </div>
                  <span className={cn(
                    'w-16 text-right text-sm font-mono-numbers',
                    day.pnl >= 0 ? 'text-profit' : 'text-loss'
                  )}>
                    {day.pnl >= 0 ? '+' : ''}${day.pnl}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t.analytics.timeAnalysis}
            </CardTitle>
            <CardDescription>{t.analytics.bestTradingHours}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hourlyPerformance.map((time) => (
                <div key={time.hour} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-medium text-muted-foreground">{time.hour}</span>
                  <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all flex items-center justify-end px-3',
                        time.winRate >= 70 ? 'bg-success/30' : time.winRate >= 60 ? 'bg-primary/30' : 'bg-warning/30'
                      )}
                      style={{ width: `${time.winRate}%` }}
                    >
                      <span className="text-xs font-semibold font-mono-numbers">{time.winRate}%</span>
                    </div>
                  </div>
                  <span className="w-16 text-right text-xs text-muted-foreground">
                    {time.trades} {t.analytics.trades}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Distribution */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {t.analytics.assetDistribution}
          </CardTitle>
          <CardDescription>{t.analytics.breakdownByMarket}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {assetDistribution.map((asset) => (
              <div key={asset.name} className="p-4 rounded-xl bg-muted/30 text-center">
                <div
                  className="h-3 w-full rounded-full mb-3"
                  style={{ backgroundColor: `${asset.color}30` }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${asset.value}%`, backgroundColor: asset.color }}
                  />
                </div>
                <p className="font-semibold">{asset.name}</p>
                <p className="text-2xl font-bold font-mono-numbers">{asset.value}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
