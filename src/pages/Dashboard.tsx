import { useState } from 'react';
import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { CapitalCard } from '@/components/dashboard/CapitalCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MentalStateCard } from '@/components/dashboard/MentalStateCard';
import { EquityChart } from '@/components/dashboard/EquityChart';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { AccountSetupModal } from '@/components/dashboard/AccountSetupModal';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrades } from '@/hooks/useTrades';
import { useTradingAccount } from '@/hooks/useTradingAccount';
import { usePsychologyEntries } from '@/hooks/usePsychologyEntries';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Dashboard() {
  const { t } = useLanguage();
  const { trades } = useTrades();
  const { account, updateInitialBalance, isUpdatingInitialBalance } = useTradingAccount();
  const { latestEntry } = usePsychologyEntries();
  const { stats, equityCurve } = useAnalytics(trades);
  
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Calculate real values
  const balance = account?.current_balance ?? 0;
  const initialBalance = account?.initial_balance ?? 0;
  const totalPnl = stats.totalPnl;
  const pnlPercentage = initialBalance > 0 ? ((totalPnl / initialBalance) * 100) : 0;
  const balanceChange = initialBalance > 0 ? (((balance - initialBalance) / initialBalance) * 100) : 0;
  
  const closedTrades = trades.filter(t => t.status === 'closed').length;
  const winRate = stats.winRate;
  const disciplineScore = latestEntry?.discipline_score ?? 0;

  const handleSaveInitialBalance = async (newValue: number) => {
    if (!account?.id) {
      // No account yet → open the full setup modal so the user can create one
      setShowAccountModal(true);
      return;
    }
    await updateInitialBalance({ accountId: account.id, initialBalance: newValue });
  };

  return (
    <div className="space-y-6 animate-fade-in" data-tour="dashboard">
      {/* Achievement Badges */}
      <AchievementBadges />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Mental State */}
        <div className="lg:col-span-1">
          <MentalStateCard disciplineScore={disciplineScore} />
        </div>

        {/* Right Column - Capital & Performance */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Section Header */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.capitalRisk}
          </h3>

          {/* Capital Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapitalCard
              title={t.dashboard.accountBalance}
              value={initialBalance}
              change={balanceChange}
              variant="balance"
              showEdit={true}
              onEdit={() => setShowAccountModal(true)}
              editable={true}
              onSaveValue={handleSaveInitialBalance}
              isSaving={isUpdatingInitialBalance}
            />
            <CapitalCard
              title="P&L"
              value={totalPnl}
              change={pnlPercentage}
              variant="pnl"
            />
          </div>

          {/* Performance Section */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.operativePerformance}
          </h3>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard 
              title="Win Rate" 
              value={`${winRate.toFixed(1)}%`} 
              icon={TrendingUp} 
              iconColor="teal" 
            />
            <MetricCard 
              title={t.dashboard.totalTrades} 
              value={String(closedTrades)} 
              subtitle={t.dashboard.closed} 
              icon={BarChart3} 
              iconColor="primary" 
            />
          </div>
        </div>
      </div>

      {/* Bottom Row - Charts & Tasks (chart full-width on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <EquityChart data={equityCurve} className="lg:col-span-2" />
        <TasksCard />
      </div>

      {/* Account Setup Modal */}
      <AccountSetupModal 
        open={showAccountModal} 
        onOpenChange={setShowAccountModal} 
      />
    </div>
  );
}
