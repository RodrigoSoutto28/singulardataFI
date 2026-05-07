import type { BrokerParseResult } from '@/features/journal/types';

/** cTrader CSV/HTML statement parser. Real implementation moves here in prompt 03. */
export function parseCtrader(_input: string | ArrayBuffer): BrokerParseResult {
  return { broker: 'ctrader', rows: [], warnings: ['ctrader parser not implemented yet'] };
}
