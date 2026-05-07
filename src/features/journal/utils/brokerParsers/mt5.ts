import type { BrokerParseResult } from '@/features/journal/types';

/** MetaTrader 5 statement parser. Real implementation moves here in prompt 03. */
export function parseMt5(_input: string | ArrayBuffer): BrokerParseResult {
  return { broker: 'mt5', rows: [], warnings: ['mt5 parser not implemented yet'] };
}
