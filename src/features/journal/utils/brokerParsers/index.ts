import type { BrokerId, BrokerParseResult } from '@/features/journal/types';
import { parseCtrader } from './ctrader';
import { parseMt4 } from './mt4';
import { parseMt5 } from './mt5';
import { parseTradingview } from './tradingview';

export { parseCtrader, parseMt4, parseMt5, parseTradingview };

/** Heuristic broker detection by filename and a sample of the file content. */
export function detectBroker(filename: string, sample = ''): BrokerId {
  const name = filename.toLowerCase();
  const head = sample.slice(0, 2000).toLowerCase();

  if (name.includes('ctrader') || head.includes('ctrader')) return 'ctrader';
  if (name.includes('mt5') || head.includes('metatrader 5')) return 'mt5';
  if (name.includes('mt4') || head.includes('metatrader 4')) return 'mt4';
  if (name.includes('tradingview') || head.includes('tradingview')) return 'tradingview';
  return 'unknown';
}

export function parseByBroker(
  broker: BrokerId,
  input: string | ArrayBuffer,
): BrokerParseResult {
  switch (broker) {
    case 'ctrader': return parseCtrader(input);
    case 'mt4': return parseMt4(input);
    case 'mt5': return parseMt5(input);
    case 'tradingview': return parseTradingview(input);
    default: return { broker: 'unknown', rows: [], warnings: ['unknown broker'] };
  }
}
