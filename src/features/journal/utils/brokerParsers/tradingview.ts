import type { BrokerParseResult } from '@/features/journal/types';

/** TradingView export parser. Real implementation moves here in prompt 03. */
export function parseTradingview(_input: string | ArrayBuffer): BrokerParseResult {
  return { broker: 'tradingview', rows: [], warnings: ['tradingview parser not implemented yet'] };
}
