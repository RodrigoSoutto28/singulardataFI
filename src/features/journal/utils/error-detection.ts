import type { Trade } from '@/features/journal/hooks/useTrades';

export type ErrorType =
  | 'revenge_trading'
  | 'fomo'
  | 'overtrading'
  | 'risk_exceeded'
  | 'no_stop_loss'
  | 'holding_losers';

export interface DetectedError {
  type: ErrorType;
  detected: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  costEstimate?: number;
}

export interface TodayCheckInRef {
  max_daily_trades: number;
  max_risk_per_trade: number;
}

export interface CurrentTradeShape {
  entry_price?: number | null;
  stop_loss?: number | null;
  stop_size?: number | null;
  quantity?: number | null;
  entry_date?: string | null;
  notes?: string | null;
  status?: string | null;
}

export const ERROR_LABELS: Record<ErrorType, string> = {
  revenge_trading: 'Revenge Trading',
  fomo: 'FOMO',
  overtrading: 'Overtrading',
  risk_exceeded: 'Riesgo Excedido',
  no_stop_loss: 'Sin Stop Loss',
  holding_losers: 'Mantener Perdedores',
};

export function detectPsychologicalErrors(
  currentTrade: CurrentTradeShape,
  recentTrades: Trade[],
  todayCheckIn?: TodayCheckInRef | null,
): DetectedError[] {
  const errors: DetectedError[] = [];
  const lastClosed = recentTrades.find((t) => t.status === 'closed' && t.exit_date);

  // 1. Revenge trading
  if (lastClosed && (lastClosed.pnl ?? 0) < 0 && lastClosed.exit_date) {
    const refDate = currentTrade.entry_date ? new Date(currentTrade.entry_date) : new Date();
    const minutes =
      (refDate.getTime() - new Date(lastClosed.exit_date).getTime()) / 60000;
    if (minutes >= 0 && minutes < 15) {
      errors.push({
        type: 'revenge_trading',
        detected: true,
        confidence: minutes < 5 ? 'high' : minutes < 10 ? 'medium' : 'low',
        reason: `Trade abierto ${minutes.toFixed(0)} min después de una pérdida`,
        costEstimate: Math.abs(lastClosed.pnl ?? 0),
      });
    }
  }

  // 2. Overtrading
  if (todayCheckIn) {
    const today = new Date().toDateString();
    const todayCount = recentTrades.filter(
      (t) => new Date(t.entry_date).toDateString() === today,
    ).length;
    if (todayCount >= todayCheckIn.max_daily_trades) {
      errors.push({
        type: 'overtrading',
        detected: true,
        confidence: 'high',
        reason: `Ya alcanzaste tu límite de ${todayCheckIn.max_daily_trades} trades hoy`,
      });
    }
  }

  // 3. Risk exceeded
  if (
    todayCheckIn &&
    currentTrade.entry_price &&
    currentTrade.stop_loss &&
    currentTrade.entry_price !== 0
  ) {
    const riskPct = Math.abs(
      ((currentTrade.stop_loss - currentTrade.entry_price) / currentTrade.entry_price) * 100,
    );
    if (riskPct > todayCheckIn.max_risk_per_trade) {
      errors.push({
        type: 'risk_exceeded',
        detected: true,
        confidence: 'high',
        reason: `Riesgo de ${riskPct.toFixed(2)}% excede tu límite de ${todayCheckIn.max_risk_per_trade}%`,
      });
    }
  }

  // 4. No stop loss (either price-based stop_loss or money-based stop_size counts)
  const hasRiskDefined =
    (currentTrade.stop_loss ?? 0) > 0 || (currentTrade.stop_size ?? 0) > 0;
  if (!hasRiskDefined) {
    errors.push({
      type: 'no_stop_loss',
      detected: true,
      confidence: 'high',
      reason: 'Trade sin Stop Loss definido',
    });
  }

  // 5. FOMO heuristic
  if (currentTrade.notes && /fomo/i.test(currentTrade.notes)) {
    errors.push({
      type: 'fomo',
      detected: true,
      confidence: 'medium',
      reason: 'Posible entrada por FOMO (detectado en notas)',
    });
  }

  return errors;
}

export function calculateErrorCost(
  errorType: ErrorType,
  trade: Trade | null,
  historicalData?: { avgLoss: number },
): number {
  if (trade && (trade.pnl ?? 0) < 0) return Math.abs(trade.pnl ?? 0);
  if (!historicalData) return 0;
  const m: Record<ErrorType, number> = {
    revenge_trading: 1.5,
    fomo: 1.3,
    overtrading: 0.8,
    risk_exceeded: 2.0,
    no_stop_loss: 2.5,
    holding_losers: 1.2,
  };
  return historicalData.avgLoss * m[errorType];
}

