import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { CapitalCard } from '@/components/dashboard/CapitalCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { MentalStateCard } from '@/components/dashboard/MentalStateCard';
import { EquityChart } from '@/components/dashboard/EquityChart';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { TrendingUp, BarChart3 } from 'lucide-react';

// Mock data - will be replaced with real data from the database
const mockEquityData = [{
  date: 'Jan 1',
  equity: 100,
  pnl: 0
}, {
  date: 'Jan 8',
  equity: 102,
  pnl: 2
}, {
  date: 'Jan 15',
  equity: 98,
  pnl: -4
}, {
  date: 'Jan 22',
  equity: 105,
  pnl: 7
}, {
  date: 'Jan 29',
  equity: 108,
  pnl: 3
}, {
  date: 'Feb 5',
  equity: 103,
  pnl: -5
}, {
  date: 'Feb 12',
  equity: 112,
  pnl: 9
}, {
  date: 'Feb 19',
  equity: 118,
  pnl: 6
}, {
  date: 'Feb 26',
  equity: 110,
  pnl: -8
}, {
  date: 'Mar 4',
  equity: 120,
  pnl: 10
}, {
  date: 'Mar 11',
  equity: 115,
  pnl: -5
}, {
  date: 'Mar 18',
  equity: 108,
  pnl: -7
}];
export default function Dashboard() {
  return <div className="space-y-6 animate-fade-in">
      {/* Achievement Badges */}
      <AchievementBadges />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mental State */}
        <div className="lg:col-span-1">
          <MentalStateCard disciplineScore={45} />
        </div>

        {/* Right Column - Capital & Performance */}
        <div className="lg:col-span-2 space-y-6 px-0 mx-[25px] my-0 border-2">
          {/* Section Header */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Capital & Riesgo
          </h3>

          {/* Capital Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CapitalCard title="Balance de Cuenta" value={83} change={12.5} variant="balance" />
            <CapitalCard title="P&L" value={-17} change={-2.1} variant="pnl" />
          </div>

          {/* Performance Section */}
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Rendimiento Operativo
          </h3>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard title="Win Rate" value="49.2%" icon={TrendingUp} iconColor="teal" />
            <MetricCard title="Total Trades" value="59" subtitle="Cerrados" icon={BarChart3} iconColor="primary" />
          </div>
        </div>
      </div>

      {/* Bottom Row - Charts & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EquityChart data={mockEquityData} className="lg:col-span-2" />
        <TasksCard />
      </div>
    </div>;
}