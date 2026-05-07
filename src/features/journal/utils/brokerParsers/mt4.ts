import type { BrokerParseResult } from '@/features/journal/types';

/** MetaTrader 4 statement parser. Real implementation moves here in prompt 03. */
export function parseMt4(_input: string | ArrayBuffer): BrokerParseResult {
  return { broker: 'mt4', rows: [], warnings: ['mt4 parser not implemented yet'] };
}
