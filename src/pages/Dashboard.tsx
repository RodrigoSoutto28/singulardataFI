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
  const { trades, isLoading: tradesLoading } = useTrades();
  const { account, updateAccount } = useTradingAccount();
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Achievement Badges */}
      <AchievementBadges />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column - Mental State */}
        <div className="md:col-span-2 lg:col-span-1">
          <MentalStateCard disciplineScore={disciplineScore} />
        </div>

        {/* Right Column - Capital & Performance */}
        <div className="md:col-span-2 lg:col-span-2 space-y-6">
          {/* Section Header */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.dashboard.capitalRisk}
          </h3>

          {/* Capital Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapitalCard 
              title={t.dashboard.accountBalance} 
              value={balance} 
              change={balanceChange} 
              variant="balance"
              showEdit={true}
              onSave={async (newBalance) => {
                if (account?.id) {
                  await updateAccount({ 
                    id: account.id, 
                    initial_balance: newBalance,
                    current_balance: newBalance + totalPnl
                  });
                }
              }}
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

      {/* Bottom Row - Charts & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EquityChart data={equityCurve} className="md:col-span-2" />
        <TasksCard className="md:col-span-2 lg:col-span-1" />
      </div>

      {/* Account Setup Modal */}
      <AccountSetupModal 
        open={showAccountModal} 
        onOpenChange={setShowAccountModal} 
      />
    </div>
  );
}
