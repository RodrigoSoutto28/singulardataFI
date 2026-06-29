import { useState, useMemo } from 'react';
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
import { useTradingAccounts } from '@/features/dashboard/hooks/useTradingAccounts';
import { usePsychologyEntries } from '@/features/behavioral/hooks/usePsychologyEntries';
import { Language } from '@/shared/lib/i18n/translations';

interface TooltipEntry {
  name: string;
  value: number | string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: TooltipEntry, index: number) => (
          <p key={index} className="text-sm font-semibold font-mono-numbers" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && (entry.name.includes('$') || entry.name.includes('P&L'))
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
  const { trades, isLoading: tradesLoading } = useTrades();
  const { selectedAccount, isLoading: accountsLoading } = useTradingAccounts();
  const { entries: psychologyEntries, isLoading: psychologyLoading } = usePsychologyEntries();
  const [dateRange, setDateRange] = useState<'30' | '90' | '180' | 'all'>('30');

  const filteredTrades = useMemo(() => {
    if (dateRange === 'all') return trades;
    const cutoff = new Date();
    const days = parseInt(dateRange);
    cutoff.setDate(cutoff.getDate() - days);
    return trades.filter(t => t.entry_date && new Date(t.entry_date) >= cutoff);
  }, [trades, dateRange]);

  const initialBalance = selectedAccount?.initial_balance ?? 10000;

  const { 
    stats, 
    monthlyPnl, 
    winLossDistribution, 
    assetDistribution,
    performanceByDay,
    performanceByHour,
    performanceByEmotion
  } = useAnalytics(filteredTrades, psychologyEntries, initialBalance);

  const hasData = filteredTrades.length > 0;

  const localT = useMemo(() => {
    const dict = {
      ES: {
        expectancy: 'Esperanza Matemática',
        expectancyDesc: 'Retorno esperado por operación',
        avgRR: 'R:R Promedio',
        avgRRDesc: 'Ratio Riesgo/Recompensa promedio',
        maxDrawdown: 'Drawdown Máx',
        maxDrawdownDesc: 'Drawdown máximo registrado',
        psychologyCorrelation: 'Correlación Emocional',
        emotionAnalysis: 'Análisis de Rendimiento por Emoción',
        winRateByEmotion: 'Win Rate por Emoción',
        pnlByEmotion: 'P&L por Emoción',
        noPsychologyData: 'No hay suficientes datos emocionales registrados.',
        allSessions: 'Sesiones 24 Horas',
        hours24Desc: 'Distribución en bloques de 4 horas',
        emotion: 'Emoción',
      },
      EN: {
        expectancy: 'Math Expectancy',
        expectancyDesc: 'Expected return per trade',
        avgRR: 'Average R:R',
        avgRRDesc: 'Average Risk/Reward ratio',
        maxDrawdown: 'Max Drawdown',
        maxDrawdownDesc: 'Maximum drawdown recorded',
        psychologyCorrelation: 'Emotional Correlation',
        emotionAnalysis: 'Performance Analysis by Emotion',
        winRateByEmotion: 'Win Rate by Emotion',
        pnlByEmotion: 'P&L by Emotion',
        noPsychologyData: 'Not enough emotional data recorded.',
        allSessions: '24-Hour Sessions',
        hours24Desc: 'Distribution in 4-hour blocks',
        emotion: 'Emotion',
      },
      PT: {
        expectancy: 'Expectativa Matemática',
        expectancyDesc: 'Retorno esperado por operação',
        avgRR: 'R:R Médio',
        avgRRDesc: 'Rácio Risco/Retorno médio',
        maxDrawdown: 'Drawdown Máx',
        maxDrawdownDesc: 'Drawdown máximo registrado',
        psychologyCorrelation: 'Correlação Emocional',
        emotionAnalysis: 'Análise de Desempenho por Emoção',
        winRateByEmotion: 'Taxa de Acerto por Emoção',
        pnlByEmotion: 'P&L por Emoção',
        noPsychologyData: 'Não há dados emocionais suficientes registrados.',
        allSessions: 'Sessões 24 Horas',
        hours24Desc: 'Distribuição em blocos de 4 horas',
        emotion: 'Emoção',
      }
    };
    return dict[language as Language] ?? dict.EN;
  }, [language]);

  const getEmotionLabel = useMemo(() => {
    return (emotionKey: string) => {
      const key = emotionKey.toLowerCase();
      const translations = t.psychology?.emotions as Record<string, string> | undefined;
      if (translations && translations[key]) {
        return translations[key];
      }
      const fallback: Record<string, string> = {
        confident: language === 'ES' ? 'Confiado' : language === 'PT' ? 'Confiante' : 'Confident',
        calm: language === 'ES' ? 'Calmado' : language === 'PT' ? 'Calmo' : 'Calm',
        neutral: 'Neutral',
        excited: language === 'ES' ? 'Emocionado' : language === 'PT' ? 'Excitado' : 'Excited',
        anxious: language === 'ES' ? 'Ansioso' : language === 'PT' ? 'Ansioso' : 'Anxious',
        fearful: language === 'ES' ? 'Temeroso' : language === 'PT' ? 'Com Medo' : 'Fearful',
        greedy: language === 'ES' ? 'Codicioso' : language === 'PT' ? 'Ganancioso' : 'Greedy',
        frustrated: language === 'ES' ? 'Frustrado' : language === 'PT' ? 'Frustrado' : 'Frustrated',
        fomo: 'FOMO',
        vengeful: language === 'ES' ? 'Vengativo' : language === 'PT' ? 'Vingativo' : 'Vengeful',
        desconocido: language === 'ES' ? 'Sin Registrar' : language === 'PT' ? 'Não Registrado' : 'Unregistered',
        unknown: language === 'ES' ? 'Sin Registrar' : language === 'PT' ? 'Não Registrado' : 'Unregistered',
      };
      return fallback[key] ?? emotionKey;
    };
  }, [t.psychology?.emotions, language]);

  const translatedPerformanceByEmotion = useMemo(() => {
    return performanceByEmotion.map(item => ({
      ...item,
      emotion: getEmotionLabel(item.emotion),
    }));
  }, [performanceByEmotion, getEmotionLabel]);

  const getSessionLabel = useMemo(() => {
    return (hourBlock: string) => {
      const labels: Record<string, Record<string, string>> = {
        '00-04': { ES: 'Tokio/Asia', EN: 'Tokyo/Asia', PT: 'Tóquio/Ásia' },
        '04-08': { ES: 'Londres Open', EN: 'London Open', PT: 'Londres Open' },
        '08-12': { ES: 'Londres/NY', EN: 'London/NY', PT: 'Londres/NY' },
        '12-16': { ES: 'Nueva York', EN: 'New York', PT: 'Nova York' },
        '16-20': { ES: 'Cierre NY', EN: 'NY Close', PT: 'NY Close' },
        '20-24': { ES: 'Asia Open', EN: 'Asia Open', PT: 'Ásia Open' },
      };
      return labels[hourBlock]?.[language] ?? labels[hourBlock]?.EN ?? '';
    };
  }, [language]);

  const isLoading = tradesLoading || accountsLoading || psychologyLoading;

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
          <Button 
            variant={dateRange === '30' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateRange('30')}
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {t.analytics.last30Days}
          </Button>
          <Button 
            variant={dateRange === '90' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateRange('90')}
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {t.analytics.last90Days}
          </Button>
          <Button 
            variant={dateRange === '180' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateRange('180')}
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {t.analytics.sixMonths}
          </Button>
          <Button 
            variant={dateRange === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setDateRange('all')}
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {t.analytics.allTime}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total PnL */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{t.analytics.totalPnl}</p>
                <p className={cn(
                  'text-2xl font-bold font-mono-numbers mt-1',
                  stats.totalPnl >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  Bal: ${initialBalance.toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-profit" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{t.analytics.winRate}</p>
                <p className="text-2xl font-bold font-mono-numbers text-primary mt-1">{stats.winRate.toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  {stats.winningTrades} W - {stats.losingTrades} L
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{t.analytics.profitFactor}</p>
                <p className="text-2xl font-bold font-mono-numbers text-accent mt-1">
                  {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  {stats.profitFactor >= 1 ? 'Rentable' : 'No Rentable'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Max Drawdown */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{localT.maxDrawdown}</p>
                <p className="text-2xl font-bold font-mono-numbers text-loss mt-1">
                  {stats.maxDrawdown.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  -${Math.round(stats.maxDrawdownAbsolute).toLocaleString()}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5 text-loss" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Math Expectancy */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{localT.expectancy}</p>
                <p className={cn(
                  'text-2xl font-bold font-mono-numbers mt-1',
                  stats.expectancy >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {stats.expectancy >= 0 ? '+' : ''}${stats.expectancy.toFixed(1)}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  {localT.expectancyDesc}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average R:R */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{localT.avgRR}</p>
                <p className="text-2xl font-bold font-mono-numbers text-primary mt-1">
                  1:{stats.avgRR.toFixed(1)}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  {localT.avgRRDesc}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Trades */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground truncate">{t.analytics.totalTrades}</p>
                <p className="text-2xl font-bold font-mono-numbers mt-1">{stats.totalTrades}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                  Operaciones totales
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
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
                        <defs>
                          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--profit))" stopOpacity={0.95}/>
                            <stop offset="100%" stopColor="hsl(var(--profit))" stopOpacity={0.65}/>
                          </linearGradient>
                          <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--loss))" stopOpacity={0.95}/>
                            <stop offset="100%" stopColor="hsl(var(--loss))" stopOpacity={0.65}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar
                          dataKey="pnl"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={45}
                        >
                          {monthlyPnl.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.pnl >= 0 ? 'url(#profitGrad)' : 'url(#lossGrad)'}
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
                      <div className="w-24 flex flex-col shrink-0">
                        <span className="text-sm font-medium font-mono-numbers">{time.hour}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{getSessionLabel(time.hour)}</span>
                      </div>
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
                      <span className="w-16 text-right text-xs text-muted-foreground font-mono-numbers">
                        {time.trades} {t.analytics.trades}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Psychology Correlation / Emociones */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {localT.psychologyCorrelation}
              </CardTitle>
              <CardDescription>{localT.emotionAnalysis}</CardDescription>
            </CardHeader>
            <CardContent>
              {translatedPerformanceByEmotion.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Win Rate by Emotion */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4 text-center">{localT.winRateByEmotion}</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={translatedPerformanceByEmotion}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="emotion" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey="winRate"
                            radius={[4, 4, 0, 0]}
                            fill="hsl(var(--primary))"
                            name="Win Rate (%)"
                            maxBarSize={45}
                          >
                            {translatedPerformanceByEmotion.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.winRate >= 50 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PnL by Emotion */}
                  <div>
                    <h4 className="text-sm font-semibold mb-4 text-center">{localT.pnlByEmotion}</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={translatedPerformanceByEmotion}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="emotion" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar
                            dataKey="pnl"
                            radius={[4, 4, 0, 0]}
                            fill="hsl(var(--primary))"
                            name="P&L ($)"
                            maxBarSize={45}
                          >
                            {translatedPerformanceByEmotion.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                  <Activity className="h-12 w-12 text-muted-foreground/30 mb-2" />
                  <p>{localT.noPsychologyData}</p>
                </div>
              )}
            </CardContent>
          </Card>

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


