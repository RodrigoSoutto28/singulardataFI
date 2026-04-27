import { useMemo } from 'react';
import { Trade } from './useTrades';

interface AnalyticsStats {
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  maxDrawdown: number;
}

interface EquityPoint {
  date: string;
  equity: number;
  pnl: number;
}

interface PerformanceByDay {
  day: string;
  winRate: number;
  pnl: number;
  trades: number;
}

interface PerformanceByHour {
  hour: string;
  winRate: number;
  trades: number;
}

interface AssetDistribution {
  name: string;
  value: number;
  color: string;
}

const assetColors: Record<string, string> = {
  forex: 'hsl(187, 85%, 53%)',
  stocks: 'hsl(142, 76%, 45%)',
  crypto: 'hsl(38, 92%, 50%)',
  futures: 'hsl(262, 83%, 58%)',
  options: 'hsl(330, 81%, 60%)',
  commodities: 'hsl(22, 90%, 52%)',
};

export function useAnalytics(trades: Trade[], initialBalance: number = 0) {
  const stats = useMemo<AnalyticsStats>(() => {
    if (!trades.length) {
      return {
        totalPnl: 0,
        winRate: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        profitFactor: 0,
        avgWin: 0,
        avgLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        maxDrawdown: 0,
      };
    }

    const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== null);
    const wins = closedTrades.filter(t => (t.pnl ?? 0) > 0);
    const losses = closedTrades.filter(t => (t.pnl ?? 0) < 0);

    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    const totalWins = wins.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + (t.pnl ?? 0), 0));

    const avgWin = wins.length ? totalWins / wins.length : 0;
    const avgLoss = losses.length ? totalLosses / losses.length : 0;

    const pnlValues = closedTrades.map(t => t.pnl ?? 0);
    const largestWin = pnlValues.length ? Math.max(...pnlValues, 0) : 0;
    const largestLoss = pnlValues.length ? Math.min(...pnlValues, 0) : 0;

    // Calculate max drawdown based on peak equity (starting from initialBalance)
    let peak = initialBalance;
    let currentEquity = initialBalance;
    let maxDrawdown = 0;
    
    closedTrades.forEach(t => {
      currentEquity += t.pnl ?? 0;
      if (currentEquity > peak) peak = currentEquity;
      const drawdown = peak - currentEquity;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      totalPnl,
      winRate: closedTrades.length ? (wins.length / closedTrades.length) * 100 : 0,
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      avgWin,
      avgLoss,
      largestWin,
      largestLoss,
      maxDrawdown,
    };
  }, [trades, initialBalance]);

  const equityCurve = useMemo<EquityPoint[]>(() => {
    if (!trades.length) return [];

    const closedTrades = trades
      .filter(t => t.status === 'closed' && t.exit_date)
      .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime());

    let cumulative = initialBalance;
    
    // Add starting point
    const firstTradeDate = closedTrades.length > 0 
      ? new Date(new Date(closedTrades[0].exit_date!).getTime() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Start';

    const curve: EquityPoint[] = [{
      date: firstTradeDate,
      equity: initialBalance,
      pnl: 0
    }];

    closedTrades.forEach(t => {
      const pnl = t.pnl ?? 0;
      cumulative += pnl;
      curve.push({
        date: new Date(t.exit_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: cumulative,
        pnl,
      });
    });

    return curve;
  }, [trades, initialBalance]);

  const monthlyPnl = useMemo(() => {
    if (!trades.length) return [];

    const closedTrades = trades.filter(t => t.status === 'closed' && t.exit_date);
    const monthlyData: Record<string, { pnl: number; trades: number }> = {};

    closedTrades.forEach(t => {
      const month = new Date(t.exit_date!).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { pnl: 0, trades: 0 };
      }
      monthlyData[month].pnl += t.pnl ?? 0;
      monthlyData[month].trades += 1;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [trades]);

  const winLossDistribution = useMemo(() => {
    const wins = trades.filter(t => t.status === 'closed' && (t.pnl ?? 0) > 0).length;
    const losses = trades.filter(t => t.status === 'closed' && (t.pnl ?? 0) < 0).length;

    return [
      { name: 'Winning', value: wins, color: 'hsl(142, 76%, 45%)' },
      { name: 'Losing', value: losses, color: 'hsl(0, 72%, 55%)' },
    ];
  }, [trades]);

  const assetDistribution = useMemo<AssetDistribution[]>(() => {
    if (!trades.length) return [];

    const distribution: Record<string, number> = {};
    trades.forEach(t => {
      const asset = t.asset_class ?? 'forex';
      distribution[asset] = (distribution[asset] ?? 0) + 1;
    });

    const total = trades.length;
    return Object.entries(distribution).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / total) * 100),
      color: assetColors[name] ?? 'hsl(215, 20%, 55%)',
    }));
  }, [trades]);

  const performanceByDay = useMemo<PerformanceByDay[]>(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const dayData: Record<string, { wins: number; total: number; pnl: number }> = {};

    days.forEach(day => {
      dayData[day] = { wins: 0, total: 0, pnl: 0 };
    });

    trades.filter(t => t.status === 'closed' && t.entry_date).forEach(t => {
      const day = new Date(t.entry_date).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayData[day]) {
        dayData[day].total += 1;
        dayData[day].pnl += t.pnl ?? 0;
        if ((t.pnl ?? 0) > 0) dayData[day].wins += 1;
      }
    });

    return days.map(day => ({
      day,
      winRate: dayData[day].total > 0 ? Math.round((dayData[day].wins / dayData[day].total) * 100) : 0,
      pnl: Math.round(dayData[day].pnl),
      trades: dayData[day].total,
    }));
  }, [trades]);

  const performanceByHour = useMemo<PerformanceByHour[]>(() => {
    const hours = ['8-10', '10-12', '12-14', '14-16', '16-18'];
    const hourData: Record<string, { wins: number; total: number }> = {};

    hours.forEach(h => {
      hourData[h] = { wins: 0, total: 0 };
    });

    trades.filter(t => t.status === 'closed' && t.entry_date).forEach(t => {
      const hour = new Date(t.entry_date).getHours();
      let bucket = '';
      if (hour >= 8 && hour < 10) bucket = '8-10';
      else if (hour >= 10 && hour < 12) bucket = '10-12';
      else if (hour >= 12 && hour < 14) bucket = '12-14';
      else if (hour >= 14 && hour < 16) bucket = '14-16';
      else if (hour >= 16 && hour < 18) bucket = '16-18';

      if (bucket && hourData[bucket]) {
        hourData[bucket].total += 1;
        if ((t.pnl ?? 0) > 0) hourData[bucket].wins += 1;
      }
    });

    return hours.map(hour => ({
      hour,
      winRate: hourData[hour].total > 0 ? Math.round((hourData[hour].wins / hourData[hour].total) * 100) : 0,
      trades: hourData[hour].total,
    }));
  }, [trades]);

  return {
    stats,
    equityCurve,
    monthlyPnl,
    winLossDistribution,
    assetDistribution,
    performanceByDay,
    performanceByHour,
  };
}
