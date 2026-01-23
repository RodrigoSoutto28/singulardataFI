import { StatCard } from '@/components/dashboard/StatCard';
import { EquityChart } from '@/components/dashboard/EquityChart';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Percent,
  Trophy,
  AlertCircle
} from 'lucide-react';

// Mock data - will be replaced with real data from Supabase
const mockEquityData = [
  { date: 'Jan 1', equity: 10000, pnl: 0 },
  { date: 'Jan 8', equity: 10250, pnl: 250 },
  { date: 'Jan 15', equity: 10180, pnl: -70 },
  { date: 'Jan 22', equity: 10520, pnl: 340 },
  { date: 'Jan 29', equity: 10890, pnl: 370 },
  { date: 'Feb 5', equity: 10650, pnl: -240 },
  { date: 'Feb 12', equity: 11200, pnl: 550 },
  { date: 'Feb 19', equity: 11580, pnl: 380 },
  { date: 'Feb 26', equity: 11420, pnl: -160 },
  { date: 'Mar 4', equity: 12100, pnl: 680 },
  { date: 'Mar 11', equity: 12450, pnl: 350 },
  { date: 'Mar 18', equity: 12800, pnl: 350 },
];

const mockRecentTrades = [
  { id: '1', symbol: 'EUR/USD', direction: 'long' as const, pnl: 234.50, pnlPercentage: 2.34, entryDate: 'Today, 14:32', status: 'closed' as const },
  { id: '2', symbol: 'BTC/USD', direction: 'short' as const, pnl: -89.20, pnlPercentage: -0.89, entryDate: 'Today, 10:15', status: 'closed' as const },
  { id: '3', symbol: 'AAPL', direction: 'long' as const, pnl: 156.80, pnlPercentage: 1.57, entryDate: 'Yesterday', status: 'closed' as const },
  { id: '4', symbol: 'GBP/JPY', direction: 'long' as const, pnl: 0, pnlPercentage: 0.45, entryDate: 'Mar 18, 09:00', status: 'open' as const },
];

const mockInsights = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'Overtrading Detected',
    description: 'You\'ve made 12 trades this week, 40% above your average. Consider slowing down to maintain quality.',
    actionLabel: 'View Analysis',
  },
  {
    id: '2',
    type: 'pattern' as const,
    title: 'Recurring Pattern Found',
    description: 'Your win rate drops 23% on Fridays. Review your Friday trades for potential issues.',
    actionLabel: 'See Details',
  },
  {
    id: '3',
    type: 'opportunity' as const,
    title: 'Statistical Edge Discovered',
    description: 'EUR/USD long trades during London session show 67% win rate vs 52% overall.',
    actionLabel: 'Explore Strategy',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your trading overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total P&L"
          value="$2,800.00"
          change={28.0}
          changeLabel="this month"
          icon={DollarSign}
          variant="profit"
        />
        <StatCard
          title="Win Rate"
          value="64.5%"
          change={3.2}
          changeLabel="vs last month"
          icon={Target}
          variant="primary"
        />
        <StatCard
          title="Profit Factor"
          value="1.87"
          change={0.12}
          changeLabel="improvement"
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title="Total Trades"
          value="156"
          change={12}
          changeLabel="this month"
          icon={Trophy}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <EquityChart data={mockEquityData} className="xl:col-span-2" />
        <AIInsightCard insights={mockInsights} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTrades trades={mockRecentTrades} />
        
        {/* Quick Stats */}
        <div className="chart-container p-5">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Avg Win</p>
              <p className="text-xl font-bold font-mono-numbers text-profit">$187.50</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Avg Loss</p>
              <p className="text-xl font-bold font-mono-numbers text-loss">$98.20</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Largest Win</p>
              <p className="text-xl font-bold font-mono-numbers text-profit">$680.00</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Largest Loss</p>
              <p className="text-xl font-bold font-mono-numbers text-loss">$240.00</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Max Drawdown</p>
              <p className="text-xl font-bold font-mono-numbers text-loss">-5.2%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
              <p className="text-xl font-bold font-mono-numbers">1.42</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
