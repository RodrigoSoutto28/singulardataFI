import { useMemo } from 'react';
import { Trade } from '@/features/journal/hooks/useTrades';
import { Tables } from '@/shared/types/database';

type PsychologyEntry = Tables<'psychology_entries'>;

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
  maxDrawdown: number;          // Drawdown máximo en porcentaje (%)
  maxDrawdownAbsolute: number;  // Drawdown máximo en valor absoluto ($)
  expectancy: number;           // Esperanza matemática ($)
  avgRR: number;                // Ratio de Riesgo/Recompensa promedio obtenido
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
  pnl: number;
}

interface AssetDistribution {
  name: string;
  value: number;
  color: string;
}

interface PerformanceByEmotion {
  emotion: string;
  winRate: number;
  pnl: number;
  trades: number;
}

const assetColors: Record<string, string> = {
  forex: 'hsl(187, 85%, 53%)',
  stocks: 'hsl(142, 76%, 45%)',
  crypto: 'hsl(38, 92%, 50%)',
  futures: 'hsl(262, 83%, 58%)',
  options: 'hsl(330, 81%, 60%)',
  commodities: 'hsl(22, 90%, 52%)',
};

export function useAnalytics(
  trades: Trade[], 
  psychologyEntries: PsychologyEntry[] = [], 
  initialBalance = 10000
) {
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
        maxDrawdownAbsolute: 0,
        expectancy: 0,
        avgRR: 0,
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

    // 1. Cálculo del Max Drawdown (en porcentaje y absoluto) basado en la curva de equidad
    const sortedClosedTrades = [...closedTrades]
      .map(t => ({ ...t, _ref: t.exit_date ?? t.entry_date }))
      .filter(t => !!t._ref)
      .sort((a, b) => new Date(a._ref!).getTime() - new Date(b._ref!).getTime());

    let peak = initialBalance;
    let maxDrawdownAbsolute = 0;
    let maxDrawdownPercent = 0;
    let cumulativeBalance = initialBalance;

    sortedClosedTrades.forEach(t => {
      cumulativeBalance += t.pnl ?? 0;
      if (cumulativeBalance > peak) peak = cumulativeBalance;
      
      const drawdownAbs = peak - cumulativeBalance;
      if (drawdownAbs > maxDrawdownAbsolute) {
        maxDrawdownAbsolute = drawdownAbs;
      }

      const drawdownPct = peak > 0 ? (drawdownAbs / peak) * 100 : 0;
      if (drawdownPct > maxDrawdownPercent) {
        maxDrawdownPercent = drawdownPct;
      }
    });

    // 2. Esperanza matemática (Expectancy)
    // Expectancy = (Win Rate * Avg Win) - (Loss Rate * Avg Loss)
    const totalTradesCount = closedTrades.length;
    const winRateFraction = totalTradesCount ? wins.length / totalTradesCount : 0;
    const lossRateFraction = totalTradesCount ? losses.length / totalTradesCount : 0;
    const expectancy = (winRateFraction * avgWin) - (lossRateFraction * avgLoss);

    // 3. Ratio de Riesgo/Recompensa (R:R) promedio obtenido
    // Evaluado sobre operaciones con stop_size (pérdida definida) y pnl no nulo
    const tradesWithRR = closedTrades.filter(t => {
      const stopVal = Math.abs(t.stop_size ?? 0);
      return stopVal > 0 && t.pnl !== null;
    });
    const avgRR = tradesWithRR.length
      ? tradesWithRR.reduce((sum, t) => sum + (Math.abs(t.pnl ?? 0) / Math.abs(t.stop_size ?? 1)), 0) / tradesWithRR.length
      : 0;

    return {
      totalPnl,
      winRate: totalTradesCount ? (wins.length / totalTradesCount) * 100 : 0,
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      avgWin,
      avgLoss,
      largestWin,
      largestLoss,
      maxDrawdown: maxDrawdownPercent,
      maxDrawdownAbsolute,
      expectancy,
      avgRR,
    };
  }, [trades, initialBalance]);

  // Curva de Equidad basada en Balance Inicial Real
  const equityCurve = useMemo<EquityPoint[]>(() => {
    if (!trades.length) return [];

    const closedTrades = trades
      .filter(t => t.status === 'closed' && t.pnl !== null)
      .map(t => ({ ...t, _ref: t.exit_date ?? t.entry_date }))
      .filter(t => !!t._ref)
      .sort((a, b) => new Date(a._ref!).getTime() - new Date(b._ref!).getTime());

    let cumulative = initialBalance;
    return closedTrades.map(t => {
      const pnl = t.pnl ?? 0;
      cumulative += pnl;
      return {
        date: new Date(t._ref!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: cumulative,
        pnl,
      };
    });
  }, [trades, initialBalance]);

  const monthlyPnl = useMemo(() => {
    if (!trades.length) return [];

    const closedTrades = trades.filter(t => t.status === 'closed' && (t.exit_date || t.entry_date));
    const monthlyData: Record<string, { pnl: number; trades: number }> = {};

    closedTrades.forEach(t => {
      const ref = t.exit_date ?? t.entry_date;
      const month = new Date(ref!).toLocaleDateString('en-US', { month: 'short' });
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

  // Distribución de 24 horas cubriendo las sesiones del mercado mundial en bloques de 4 horas
  const performanceByHour = useMemo<PerformanceByHour[]>(() => {
    const hours = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'];
    const hourData: Record<string, { wins: number; total: number; pnl: number }> = {};

    hours.forEach(h => {
      hourData[h] = { wins: 0, total: 0, pnl: 0 };
    });

    trades.filter(t => t.status === 'closed' && t.entry_date).forEach(t => {
      const hour = new Date(t.entry_date).getHours();
      let bucket = '';
      if (hour >= 0 && hour < 4) bucket = '00-04';
      else if (hour >= 4 && hour < 8) bucket = '04-08';
      else if (hour >= 8 && hour < 12) bucket = '08-12';
      else if (hour >= 12 && hour < 16) bucket = '12-16';
      else if (hour >= 16 && hour < 20) bucket = '16-20';
      else if (hour >= 20 && hour < 24) bucket = '20-24';

      if (bucket && hourData[bucket]) {
        hourData[bucket].total += 1;
        hourData[bucket].pnl += t.pnl ?? 0;
        if ((t.pnl ?? 0) > 0) hourData[bucket].wins += 1;
      }
    });

    return hours.map(hour => ({
      hour,
      winRate: hourData[hour].total > 0 ? Math.round((hourData[hour].wins / hourData[hour].total) * 100) : 0,
      trades: hourData[hour].total,
      pnl: Math.round(hourData[hour].pnl),
    }));
  }, [trades]);

  // Correlación de Psicología (Emociones) con resultados
  const performanceByEmotion = useMemo<PerformanceByEmotion[]>(() => {
    if (!psychologyEntries.length) return [];

    // Mapear fecha local (YYYY-MM-DD) -> emoción
    const emotionMap: Record<string, string> = {};
    psychologyEntries.forEach(entry => {
      if (entry.entry_date && entry.pre_trade_emotion) {
        emotionMap[entry.entry_date] = entry.pre_trade_emotion;
      }
    });

    const emotionData: Record<string, { wins: number; total: number; pnl: number }> = {};

    trades.filter(t => t.status === 'closed' && t.entry_date).forEach(t => {
      const dateObj = new Date(t.entry_date);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      
      const emotion = emotionMap[dateStr] ?? 'Desconocido';

      if (!emotionData[emotion]) {
        emotionData[emotion] = { wins: 0, total: 0, pnl: 0 };
      }

      emotionData[emotion].total += 1;
      emotionData[emotion].pnl += t.pnl ?? 0;
      if ((t.pnl ?? 0) > 0) {
        emotionData[emotion].wins += 1;
      }
    });

    return Object.entries(emotionData).map(([emotion, data]) => ({
      emotion,
      winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 0,
      pnl: Math.round(data.pnl),
      trades: data.total,
    }));
  }, [trades, psychologyEntries]);

  return {
    stats,
    equityCurve,
    monthlyPnl,
    winLossDistribution,
    assetDistribution,
    performanceByDay,
    performanceByHour,
    performanceByEmotion,
  };
}
