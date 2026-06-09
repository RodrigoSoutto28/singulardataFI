import { useState } from 'react';
import { AchievementBadges } from '@/features/dashboard/components/AchievementBadges';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { MentalStateCard } from '@/features/dashboard/components/MentalStateCard';
import { QuickActionsCard } from '@/features/dashboard/components/QuickActionsCard';
import { EquityChart } from '@/features/dashboard/components/EquityChart';
import { RecentTrades } from '@/features/dashboard/components/RecentTrades';
import { TaxometerWidget } from '@/features/behavioral/components/TaxometerWidget';
import { AccountSetupModal } from '@/features/dashboard/components/AccountSetupModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const TrendingUp3D = createIcon3DComponent('equityCurve');
const Wallet3D = createIcon3DComponent('balance');
const Target3D = createIcon3DComponent('winrate');
const Brain3D = createIcon3DComponent('brain');
const BookOpen3D = createIcon3DComponent('activity');
const PnL3D = createIcon3DComponent('pnl');
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useTrades } from '@/features/journal/hooks/useTrades';
import { useTradingAccount } from '@/features/dashboard/hooks/useTradingAccount';
import { usePsychologyEntries } from '@/features/behavioral/hooks/usePsychologyEntries';
import { useAnalytics } from '@/features/dashboard/hooks/useAnalytics';
import { formatCurrency } from '@/shared/lib/utils';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

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
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-primary/15 to-accent/10 border border-primary/40 p-6 md:p-8 animate-slide-up-fade">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {getGreeting(t)}, {userName} 👋
            </h1>
            <p className="text-muted-foreground">
              {hasCheckedInToday
                ? t.dashboard.planActive
                : t.dashboard.completeCheckIn}
            </p>
          </div>
          {!hasCheckedInToday && (
            <Button
              asChild
              size="lg"
              className="border-glow-pulse hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shrink-0 self-start sm:self-auto"
            >
              <Link to="/psychology">
                <Brain3D className="h-5 w-5 animate-pulse" />
                {t.dashboard.completeCheckInCTA}
              </Link>
            </Button>
          )}
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 [&>*]:stagger-item">
        <div className="relative group">
          <StatCard
            label="Balance"
            value={formatCurrency(balance)}
            change={balanceChange}
            icon={Wallet3D}
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
          icon={PnL3D}
          trend={todayPnL >= 0 ? 'up' : 'down'}
          negative={todayPnL < 0}
        />
        <StatCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Target3D}
          color="teal"
        />
        <StatCard
          label="Disciplina"
          value={`${disciplineScore}/10`}
          icon={Brain3D}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        <div className="lg:col-span-2 space-y-4 md:space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp3D className="h-5 w-5" />
                {t.dashboard.equityCurve}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <EquityChart data={equityCurve} className="border-0 bg-transparent p-0" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen3D className="h-5 w-5" />
                {t.dashboard.recentActivity}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {recentTrades.length === 0 ? (
                <div className="rounded-md bg-muted/40 border border-dashed border-border px-4 py-6 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen3D className="h-5 w-5 opacity-70" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {t.dashboard.noTrades}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.dashboard.completeCheckIn}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="gap-1.5 mt-1">
                    <Link to="/journal">
                      <Plus className="h-3.5 w-3.5" />
                      {t.dashboard.quickActionNewTrade}
                    </Link>
                  </Button>
                </div>
              ) : (
                <RecentTrades trades={recentTrades} className="border-0 bg-transparent p-0" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 lg:h-full [&>*]:stagger-item">
          <MentalStateCard disciplineScore={disciplineScore} className="h-auto" />
          <div className="lg:flex-1 lg:[&>*]:h-full">
            <TaxometerWidget />
          </div>
        </div>
      </div>

      {/* Disciplina — barra horizontal full-width */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target3D className="h-5 w-5" />
            {t.dashboard.discipline}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <AchievementBadges />
        </CardContent>
      </Card>


      <AccountSetupModal open={accountModalOpen} onOpenChange={setAccountModalOpen} />
    </div>
  );
}


