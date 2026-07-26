import { describe, it, expect } from 'vitest';
import { detectPsychologicalErrors, calculateErrorCost, type ErrorType } from '../error-detection';
import type { Trade } from '@/features/journal/hooks/useTrades';

describe('error-detection', () => {
  const mockRecentTrades: Trade[] = [
    {
      id: 'trade-1',
      user_id: 'user-1',
      account_id: 'acc-1',
      symbol: 'EURUSD',
      asset_class: 'forex',
      direction: 'long',
      status: 'closed',
      entry_price: 1.1000,
      exit_price: 1.0950,
      quantity: 1,
      stop_loss: 1.0950,
      stop_size: null,
      take_profit: 1.1100,
      entry_date: '2025-06-01T10:00:00Z',
      exit_date: '2025-06-01T10:10:00Z',
      pnl: -50,
      pnl_percentage: -4.5,
      commission: 0,
      swap: 0,
      timeframe: 'M15',
      strategy: 'Breakout',
      setup_type: null,
      notes: 'Bad entry',
      tags: [],
      rating: 2,
      import_batch_id: null,
      import_row_hash: null,
      created_at: '',
      updated_at: '',
    },
  ];

  describe('detectPsychologicalErrors', () => {
    it('detects revenge trading if opened quickly after a loss', () => {
      const currentTrade = {
        entry_date: '2025-06-01T10:14:00Z', // 4 mins after exit_date of loss trade
        symbol: 'EURUSD',
      };

      const result = detectPsychologicalErrors(currentTrade, mockRecentTrades);
      const revengeError = result.find((e) => e.type === 'revenge_trading');

      expect(revengeError).toBeDefined();
      expect(revengeError?.detected).toBe(true);
      expect(revengeError?.confidence).toBe('high');
      expect(revengeError?.costEstimate).toBe(50);
    });

    it('does not detect revenge trading if previous trade was a win', () => {
      const winningRecentTrades = [
        {
          ...mockRecentTrades[0],
          pnl: 100, // profit
        },
      ];
      const currentTrade = {
        entry_date: '2025-06-01T10:15:00Z',
        symbol: 'EURUSD',
      };

      const result = detectPsychologicalErrors(currentTrade, winningRecentTrades);
      const revengeError = result.find((e) => e.type === 'revenge_trading');

      expect(revengeError).toBeUndefined();
    });

    it('detects overtrading if trade limit for today is reached', () => {
      const today = new Date().toDateString();
      const todayTrades: Trade[] = [
        {
          ...mockRecentTrades[0],
          entry_date: new Date().toISOString(), // today
        },
        {
          ...mockRecentTrades[0],
          id: 'trade-2',
          entry_date: new Date().toISOString(), // today
        },
      ];

      const checkIn = {
        max_daily_trades: 2,
        max_risk_per_trade: 1,
      };

      const currentTrade = {
        entry_date: '2025-06-01T10:00:00Z',
      };

      const result = detectPsychologicalErrors(currentTrade, todayTrades, checkIn);
      const overtradingError = result.find((e) => e.type === 'overtrading');

      expect(overtradingError).toBeDefined();
      expect(overtradingError?.detected).toBe(true);
      expect(overtradingError?.confidence).toBe('high');
    });

    it('detects risk exceeded if stop loss risk percentage is higher than limit', () => {
      const checkIn = {
        max_daily_trades: 5,
        max_risk_per_trade: 2, // 2% limit
      };

      const currentTrade = {
        entry_price: 100,
        stop_loss: 95, // 5% risk
        symbol: 'AAPL',
      };

      const result = detectPsychologicalErrors(currentTrade, [], checkIn);
      const riskError = result.find((e) => e.type === 'risk_exceeded');

      expect(riskError).toBeDefined();
      expect(riskError?.detected).toBe(true);
      expect(riskError?.reason).toContain('Riesgo de 5.00% excede tu límite de 2%');
    });

    it('does not detect risk exceeded if stop loss risk is within limits', () => {
      const checkIn = {
        max_daily_trades: 5,
        max_risk_per_trade: 2, // 2% limit
      };

      const currentTrade = {
        entry_price: 100,
        stop_loss: 99, // 1% risk
        symbol: 'AAPL',
      };

      const result = detectPsychologicalErrors(currentTrade, [], checkIn);
      const riskError = result.find((e) => e.type === 'risk_exceeded');

      expect(riskError).toBeUndefined();
    });

    it('detects no stop loss if stop loss and stop size are missing', () => {
      const currentTrade = {
        symbol: 'EURUSD',
      };

      const result = detectPsychologicalErrors(currentTrade, []);
      const noSlError = result.find((e) => e.type === 'no_stop_loss');

      expect(noSlError).toBeDefined();
      expect(noSlError?.detected).toBe(true);
    });

    it('does not detect no stop loss if stop loss is defined', () => {
      const currentTrade = {
        symbol: 'EURUSD',
        stop_loss: 1.0950,
      };

      const result = detectPsychologicalErrors(currentTrade, []);
      const noSlError = result.find((e) => e.type === 'no_stop_loss');

      expect(noSlError).toBeUndefined();
    });

    it('detects FOMO if notes mention fomo (case insensitive)', () => {
      const currentTrade = {
        symbol: 'EURUSD',
        notes: 'I had fomo and jumped in',
      };

      const result = detectPsychologicalErrors(currentTrade, []);
      const fomoError = result.find((e) => e.type === 'fomo');

      expect(fomoError).toBeDefined();
      expect(fomoError?.detected).toBe(true);
      expect(fomoError?.confidence).toBe('medium');
    });
  });

  describe('calculateErrorCost', () => {
    it('returns trade negative PnL if trade has loss', () => {
      const trade: Trade = {
        ...mockRecentTrades[0],
        pnl: -150,
      };

      const cost = calculateErrorCost('revenge_trading', trade);
      expect(cost).toBe(150);
    });

    it('uses historical average loss multiplier if trade is winner or null', () => {
      const historical = { avgLoss: 100 };

      expect(calculateErrorCost('revenge_trading', null, historical)).toBe(150); // 1.5 * 100
      expect(calculateErrorCost('fomo', null, historical)).toBe(130); // 1.3 * 100
      expect(calculateErrorCost('no_stop_loss', null, historical)).toBe(250); // 2.5 * 100
    });
  });
});
