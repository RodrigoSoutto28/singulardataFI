import type { Tables, TablesInsert, TablesUpdate } from '@/shared/types/database';

export type Trade = Tables<'trades'>;
export type TradeInsert = TablesInsert<'trades'>;
export type TradeUpdate = TablesUpdate<'trades'>;

export type BrokerId = 'ctrader' | 'mt4' | 'mt5' | 'tradingview' | 'unknown';

export interface ParsedTradeRow {
  symbol: string;
  direction: 'long' | 'short';
  entry_price: number;
  exit_price?: number | null;
  quantity: number;
  entry_date: string;
  exit_date?: string | null;
  pnl?: number | null;
  commission?: number;
  swap?: number;
  notes?: string | null;
}

export interface BrokerParseResult {
  broker: BrokerId;
  rows: ParsedTradeRow[];
  warnings: string[];
}
