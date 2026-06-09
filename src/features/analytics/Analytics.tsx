import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  DollarSign,
  Activity,
  Loader2,
} from 'lucide-react';
import {
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
} from 'recharts';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useTrades } from '@/features/journal/hooks/useTrades';
import { useAnalytics } from '@/features/dashboard/hooks/useAnalytics';

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
  const { t, language } = useLanguage();
  const { trades, isLoading } = useTrades();
  const { 
    stats, 
    monthlyPnl, 
    winLossDistribution, 
    assetDistribution,
    performanceByDay,
    performanceByHour 
  } = useAnalytics(trades);

  const hasData = trades.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date range filter — horizontal scroll pills on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 w-max sm:flex-wrap sm:w-auto">
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap shrink-0">{t.analytics.last30Days}</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap shrink-0">{t.analytics.last90Days}</Button>
          <Button variant="default" size="sm" className="rounded-full whitespace-nowrap shrink-0">{t.analytics.sixMonths}</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap shrink-0">{t.analytics.allTime}</Button>
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
                  stats.totalPnl >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toLocaleString()}
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
                <p className="text-2xl font-bold font-mono-numbers text-primary">{stats.winRate.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold font-mono-numbers">
                  {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                </p>
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
                <p className="text-2xl font-bold font-mono-numbers">{stats.totalTrades}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.extra?.notEnoughData ?? 'Not enough data'}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {t.extra?.addTradesToSeeStats ?? 'Add trades to see statistics'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
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
                  {monthlyPnl.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyPnl}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="pnl"
                          radius={[4, 4, 0, 0]}
                          fill="hsl(var(--primary))"
                        >
                          {monthlyPnl.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      {{ ES: 'Sin datos mensuales', EN: 'No monthly data', PT: 'Sem dados mensais' }[language]}
                    </div>
                  )}
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
                        data={winLossDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {winLossDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: winLossDistribution[0]?.color }} />
                    <span className="text-sm text-muted-foreground">{t.analytics.winning}</span>
                    <span className="text-sm font-semibold font-mono-numbers">{winLossDistribution[0]?.value ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: winLossDistribution[1]?.color }} />
                    <span className="text-sm text-muted-foreground">{t.analytics.losing}</span>
                    <span className="text-sm font-semibold font-mono-numbers">{winLossDistribution[1]?.value ?? 0}</span>
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
                  {performanceByDay.map((day) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <span className="w-10 text-sm font-medium">{day.day}</span>
                      <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all flex items-center justify-end px-3',
                            day.winRate >= 65 ? 'bg-success/30' : day.winRate >= 55 ? 'bg-warning/30' : 'bg-destructive/30'
                          )}
                          style={{ width: `${day.winRate || 5}%` }}
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
                  {performanceByHour.map((time) => (
                    <div key={time.hour} className="flex items-center gap-4">
                      <span className="w-16 text-sm font-medium text-muted-foreground">{time.hour}</span>
                      <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all flex items-center justify-end px-3',
                            time.winRate >= 70 ? 'bg-success/30' : time.winRate >= 60 ? 'bg-primary/30' : 'bg-warning/30'
                          )}
                          style={{ width: `${time.winRate || 5}%` }}
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
          {assetDistribution.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {t.analytics.assetDistribution}
                </CardTitle>
                <CardDescription>{t.analytics.breakdownByMarket}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {assetDistribution.map((asset) => (
                    <div key={asset.name} className="p-4 rounded-lg bg-muted/50 text-center">
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
          )}
        </>
      )}
    </div>
  );
}


