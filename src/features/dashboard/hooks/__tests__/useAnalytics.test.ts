import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

describe('useAnalytics — mathematical and behavioral metrics logic', () => {
  it('correctly calculates metrics for closed trades', () => {
    const mockTrades = [
      {
        status: 'closed',
        pnl: 1000,
        stop_size: 500,
        entry_date: '2025-06-01T10:00:00',
        exit_date: '2025-06-01T12:00:00',
        asset_class: 'forex',
        symbol: 'EURUSD',
      },
      {
        status: 'closed',
        pnl: -500,
        stop_size: 500,
        entry_date: '2025-06-02T15:00:00',
        exit_date: '2025-06-02T16:00:00',
        asset_class: 'stocks',
        symbol: 'AAPL',
      },
    ] as any[];

    const { result } = renderHook(() => useAnalytics(mockTrades, [], 10000));
    const { stats, equityCurve, performanceByHour } = result.current;

    // 1. Profit & Loss calculations
    expect(stats.totalPnl).toBe(500);
    expect(stats.winRate).toBe(50);
    expect(stats.totalTrades).toBe(2);
    expect(stats.winningTrades).toBe(1);
    expect(stats.losingTrades).toBe(1);

    // 2. Max Drawdown % (with peak 11000 and current 10500, drawdown is 500 / 11000 = 4.545%)
    expect(stats.maxDrawdown).toBeCloseTo(4.545, 2);
    expect(stats.maxDrawdownAbsolute).toBe(500);

    // 3. Mathematical Expectancy: (0.5 * 1000) - (0.5 * 500) = 250
    expect(stats.expectancy).toBe(250);

    // 4. Average Risk/Reward Ratio: (2 + 1) / 2 = 1.5
    expect(stats.avgRR).toBe(1.5);

    // 5. Equity Curve
    expect(equityCurve).toHaveLength(2);
    expect(equityCurve[0].equity).toBe(11000);
    expect(equityCurve[1].equity).toBe(10500);

    // 6. 24h block hourly performance distribution
    const block10 = performanceByHour.find(p => p.hour === '08-12');
    const block15 = performanceByHour.find(p => p.hour === '12-16');

    expect(block10?.trades).toBe(1);
    expect(block10?.winRate).toBe(100);
    expect(block15?.trades).toBe(1);
    expect(block15?.winRate).toBe(0);
  });

  it('correctly maps daily psychology check-ins to trading performance', () => {
    const d1 = new Date('2025-06-01T10:00:00');
    const d1Str = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;

    const mockTrades = [
      {
        status: 'closed',
        pnl: 2000,
        stop_size: 1000,
        entry_date: '2025-06-01T10:00:00',
        exit_date: '2025-06-01T12:00:00',
        symbol: 'BTCUSD',
      },
    ] as any[];

    const mockPsychologyEntries = [
      {
        entry_date: d1Str,
        pre_trade_emotion: 'confident',
      },
    ] as any[];

    const { result } = renderHook(() => useAnalytics(mockTrades, mockPsychologyEntries, 10000));
    const { performanceByEmotion } = result.current;

    const confidentEmotion = performanceByEmotion.find(p => p.emotion === 'confident');
    expect(confidentEmotion).toBeDefined();
    expect(confidentEmotion?.trades).toBe(1);
    expect(confidentEmotion?.winRate).toBe(100);
    expect(confidentEmotion?.pnl).toBe(2000);
  });
});
