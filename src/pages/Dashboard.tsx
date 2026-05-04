import { useState } from 'react';
import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { StatCard } from '@/components/dashboard/StatCard';
import { MentalStateCard } from '@/components/dashboard/MentalStateCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { EquityChart } from '@/components/dashboard/EquityChart';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { TaxometerWidget } from '@/components/psychology/TaxometerWidget';
import { AccountSetupModal } from '@/components/dashboard/AccountSetupModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Wallet, Target, Brain, Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTrades } from '@/hooks/useTrades';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { usePsychologyEntries } from '@/hooks/usePsychologyEntries';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

function getGreeting(t: ReturnType<typeof useLanguage>['t']) {
  const hour = new Date().getHours();
  if (hour < 12) return t.dashboard.goodMorning;
  if (hour < 18) return t.dashboard.goodAfternoon;
  return t.dashboard.goodEvening;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
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
    profile?.full_name || profile?.email?.split('@')[0] || 'Trader';

  return (
    <div className="space-y-4 md:space-y-6" data-tour="dashboard">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8 animate-slide-up-fade">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting(t)}, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            {hasCheckedInToday
              ? t.dashboard.planActive
              : t.dashboard.completeCheckIn}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 [&>*]:stagger-item">
        <div className="relative group">
          <StatCard
            label="Balance"
            value={formatCurrency(balance)}
            change={balanceChange}
            icon={Wallet}
            trend={balanceChange >= 0 ? 'up' : 'down'}
            negative={balance < 0}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setAccountModalOpen(true)}
            aria-label="Editar balance de la cuenta"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 hover:text-primary z-10"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
        <StatCard
          label="P&L Hoy"
          value={formatCurrency(todayPnL)}
          change={todayPnLPercent}
          icon={TrendingUp}
          trend={todayPnL >= 0 ? 'up' : 'down'}
          negative={todayPnL < 0}
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
        <div className="lg:col-span-2 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t.dashboard.equityCurve}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <EquityChart data={equityCurve} className="border-0 bg-transparent p-0" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6 [&>*]:stagger-item">
          <MentalStateCard disciplineScore={disciplineScore} />
          <TaxometerWidget />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.dashboard.noTrades}
            </p>
          ) : (
            <RecentTrades trades={recentTrades} className="border-0 bg-transparent p-0" />
          )}
        </CardContent>
      </Card>

      <AccountSetupModal open={accountModalOpen} onOpenChange={setAccountModalOpen} />
    </div>
  );
}
