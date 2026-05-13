import { describe, it, expect } from 'vitest';
import { useImportTrades } from '../useImportTrades';

// Tiny shim: invoke the hook's `importFromFile` outside React by calling the
// module-level parsers indirectly via a constructed File. The hook returns a
// stable callback the first render, but for tests we just need to call it.
function getImporter() {
  // useCallback with [] deps + no React state — safe to call outside renderer
  // because it doesn't touch any React APIs.
  // We invoke the hook function directly; the returned callback is plain.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useImportTrades().importFromFile;
}

function makeFile(content: string, name: string, type = 'text/csv'): File {
  return new File([content], name, { type });
}

describe('useImportTrades — CSV recognition', () => {
  it('parses a generic CSV with standard headers', async () => {
    const csv = [
      'symbol,direction,entry price,exit price,quantity,pnl,entry date,exit date',
      'EURUSD,buy,1.1000,1.1050,1,50,2025-01-15 10:00,2025-01-15 12:00',
      'GBPUSD,sell,1.2500,1.2450,1,50,2025-01-16 09:00,2025-01-16 11:00',
    ].join('\n');
    const result = await getImporter()(makeFile(csv, 'trades.csv'));
    expect(result.trades).toHaveLength(2);
    expect(result.trades[0].symbol).toBe('EURUSD');
    expect(result.trades[0].direction).toBe('long');
    expect(result.trades[1].direction).toBe('short');
    expect(result.trades[1].pnl).toBe(50);
  });

  it('handles UTF-8 BOM and metadata lines before the header', async () => {
    const csv = '\uFEFF' + [
      'Account: 123456',
      'Statement period: 2025-01-01 - 2025-01-31',
      '',
      'symbol,direction,entry price,exit price,quantity,pnl,entry date',
      'AAPL,buy,150,155,10,50,2025-01-10 09:30',
    ].join('\n');
    const result = await getImporter()(makeFile(csv, 'mt4-export.csv'));
    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].symbol).toBe('AAPL');
    expect(result.trades[0].pnl).toBe(50);
  });

  it('autodetects cTrader format', async () => {
    const csv = [
      'Position ID,Symbol,Direction,Volume,Open Price,Close Price,Open Time,Close Time,Net Profit',
      '1001,EURUSD,Buy,1,1.1000,1.1050,2025-01-15 10:00,2025-01-15 12:00,50',
    ].join('\n');
    const result = await getImporter()(makeFile(csv, 'ctrader.csv'));
    // Broker detection emits an info message in errors[]
    expect(result.errors.some((e) => /CTRADER/.test(e))).toBe(true);
    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].symbol).toBe('EURUSD');
    expect(result.trades[0].direction).toBe('long');
    expect(result.trades[0].pnl).toBe(50);
  });

  it('parses CSV with semicolon delimiter', async () => {
    const csv = [
      'symbol;direction;entry price;exit price;quantity;pnl;entry date',
      'BTCUSD;sell;50000;49500;0.1;50;2025-01-15 10:00',
    ].join('\n');
    const result = await getImporter()(makeFile(csv, 'eu.csv'));
    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].direction).toBe('short');
    expect(result.trades[0].quantity).toBe(0.1);
  });

  it('ignores summary/total footer rows', async () => {
    const csv = [
      'symbol,direction,entry price,exit price,quantity,pnl,entry date',
      'EURUSD,buy,1.1,1.11,1,100,2025-01-15 10:00',
      'GBPUSD,sell,1.25,1.24,1,100,2025-01-16 10:00',
      'Total,,,,,200,',
    ].join('\n');
    const result = await getImporter()(makeFile(csv, 'with-total.csv'));
    expect(result.trades).toHaveLength(2);
  });
});
