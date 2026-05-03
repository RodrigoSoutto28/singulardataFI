import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { StatCard } from '@/components/dashboard/StatCard';
import { MentalStateCard } from '@/components/dashboard/MentalStateCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { EquityChart } from '@/components/dashboard/EquityChart';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { TaxometerWidget } from '@/components/psychology/TaxometerWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, Target, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { usePsychologyEntries } from '@/hooks/usePsychologyEntries';
import { useAnalytics } from '@/hooks/useAnalytics';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { trades } = useTrades();
  const { account } = useTradingAccount();
  const { latestEntry } = usePsychologyEntries();
  const { stats, equityCurve } = useAnalytics(trades);

  const balance = account?.current_balance ?? 0;
  const initialBalance = account?.initial_balance ?? 0;
  const balanceChange = initialBalance > 0 ? ((balance - initialBalance) / initialBalance) * 100 : 0;

  // Today's P&L from closed trades
  const today = new Date().toDateString();
  const closedToday = trades.filter(
    (t) => t.status === 'closed' && t.exit_date && new Date(t.exit_date).toDateString() === today
  );
  const todayPnL = closedToday.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const todayPnLPercent = initialBalance > 0 ? (todayPnL / initialBalance) * 100 : 0;

  const winRate = stats.winRate;
  const disciplineScore = latestEntry?.discipline_score ?? 0;
  const hasCheckedInToday =
    latestEntry?.entry_date
      ? new Date(latestEntry.entry_date).toDateString() === today
      : false;

  // Map for RecentTrades
  const recentTrades = trades.slice(0, 5).map((t) => ({
    id: t.id,
    symbol: t.symbol,
    direction: (t.direction as 'long' | 'short') ?? 'long',
    pnl: t.pnl ?? 0,
    pnlPercentage: t.pnl_percentage ?? 0,
    entryDate: t.entry_date ? new Date(t.entry_date).toLocaleDateString('es-ES') : '',
    status: (t.status as 'open' | 'closed') ?? 'closed',
  }));

  const userName =
    (profile as any)?.full_name || (profile as any)?.email?.split('@')[0] || 'Trader';

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in" data-tour="dashboard">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            {hasCheckedInToday
              ? 'Tu plan de hoy está activo. Mantén la disciplina.'
              : 'Completa tu check-in pre-mercado para comenzar.'}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsCard />

      {/* Achievement Badges */}
      <AchievementBadges />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          change={balanceChange}
          icon={Wallet}
          trend={balanceChange >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="P&L Hoy"
          value={formatCurrency(todayPnL)}
          change={todayPnLPercent}
          icon={TrendingUp}
          trend={todayPnL >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Target}
          color="teal"
        />
        <StatCard
          label="Disciplina"
          value={`${disciplineScore}/10`}
          icon={Brain}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Curva de Equity
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <EquityChart data={equityCurve} className="border-0 bg-transparent p-0" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          <MentalStateCard disciplineScore={disciplineScore} />
          <TaxometerWidget />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aún no tienes operaciones registradas.
            </p>
          ) : (
            <RecentTrades trades={recentTrades} className="border-0 bg-transparent p-0" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
