import { useCallback } from 'react';
import { parseXLSXBuffer } from '@/features/journal/utils/xlsx-adapter';

export interface ImportedTrade {
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercentage?: number;
  entryDate: string;
  exitDate?: string;
  strategy?: string;
  notes?: string;
  stopLoss?: number;
  takeProfit?: number;
  commission?: number;
  swap?: number;
  assetClass?: 'forex' | 'stocks' | 'crypto' | 'futures' | 'options' | 'commodities';
  sourceFile?: string;
}

export interface ParseMetadata {
  delimiter?: string;
  headerRowIndex?: number;
  totalRows: number;
  validRows: number;
  ignoredRows: number;
  missingColumns: string[];
  columnMapping: Record<string, string>; // internal field -> CSV header
  unmappedHeaders?: string[];
  ignoredDetails: { row: number; reason: string; data?: string[] }[];
  brokerDetected?: string;
}

export interface ParseResult {
  trades: ImportedTrade[];
  errors: string[];
  metadata?: ParseMetadata;
  rawRows?: string[][];
}

export interface FileParseResult extends ParseResult {
  fileName: string;
  fileSize: number;
}

export interface MultiParseResult {
  files: FileParseResult[];
  trades: ImportedTrade[];
  errors: string[];
  crossFileDuplicates: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function detectAssetClass(symbol: string): ImportedTrade['assetClass'] {
  const s = symbol.toUpperCase();
  if (/BTC|ETH|XRP|LTC|ADA|DOT|SOL|DOGE|SHIB|MATIC|AVAX|LINK|UNI|USDT|USDC|BNB/.test(s)) return 'crypto';
  if (/EUR|USD|GBP|JPY|CHF|AUD|NZD|CAD/.test(s) && (s.includes('/') || /^[A-Z]{6}$/.test(s))) return 'forex';
  if (/^(ES|NQ|YM|CL|GC|SI|ZB|ZN|ZC|ZS|ZW|NG|HO|RB)\d*/.test(s) || s.includes('FUT')) return 'futures';
  if (/GOLD|SILVER|OIL|XAUUSD|XAGUSD|USOIL|UKOIL/.test(s)) return 'commodities';
  if (/CALL|PUT|C\d|P\d/.test(s)) return 'options';
  return 'stocks';
}

const MONTH_MAP: Record<string, number> = {
  jan: 1, ene: 1, feb: 2, mar: 3, apr: 4, abr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, ago: 8, sep: 9, set: 9, oct: 10, nov: 11, dec: 12, dic: 12,
};

function parseDate(dateStr: string | number | Date | null | undefined, dayFirstHint = true): string | null {
  if (dateStr === null || dateStr === undefined || dateStr === '') return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr.toISOString();

  if (typeof dateStr === 'number') {
    const ms = dateStr > 1e12 ? dateStr : dateStr > 1e9 ? dateStr * 1000 : NaN;
    if (!isNaN(ms)) {
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }

  const str = String(dateStr).trim();
  if (!str) return null;

  if (str.includes('T')) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  if (/^\d{10,13}$/.test(str)) {
    const n = parseInt(str, 10);
    const ms = str.length === 13 ? n : n * 1000;
    const d = new Date(ms);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  const numDate = parseFloat(str);
  if (!isNaN(numDate) && numDate > 25569 && numDate < 60000 && /^\d+(\.\d+)?$/.test(str)) {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + numDate * 86400000).toISOString();
  }

  // YYYY.MM.DD or YYYY-MM-DD or YYYY/MM/DD with optional time (MT4/MT5)
  let m = str.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    const [, y, mo, da, h = '0', mi = '0', s = '0'] = m;
    const d = new Date(Date.UTC(+y, +mo - 1, +da, +h, +mi, +s));
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  // DD/MM/YYYY HH:MM[:SS] or MM/DD/YYYY HH:MM[:SS]
  m = str.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    const [, a, b, y, h = '0', mi = '0', s = '0'] = m;
    const year = y.length === 2 ? 2000 + +y : +y;
    let day: number, month: number;
    if (+a > 12) { day = +a; month = +b; }
    else if (+b > 12) { day = +b; month = +a; }
    else { day = dayFirstHint ? +a : +b; month = dayFirstHint ? +b : +a; }
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(Date.UTC(year, month - 1, day, +h, +mi, +s));
    if (!isNaN(d.getTime()) && d.getUTCDate() === day && d.getUTCMonth() === month - 1) {
      return d.toISOString();
    }
  }

  // DD-MMM-YYYY [HH:MM[:SS]]
  m = str.match(/^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{2,4})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    const [, da, monStr, y, h = '0', mi = '0', s = '0'] = m;
    const month = MONTH_MAP[monStr.slice(0, 3).toLowerCase()];
    if (month) {
      const year = y.length === 2 ? 2000 + +y : +y;
      const d = new Date(Date.UTC(year, month - 1, +da, +h, +mi, +s));
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }

  // MMM DD, YYYY
  m = str.match(/^([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{2,4})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    const [, monStr, da, y, h = '0', mi = '0', s = '0'] = m;
    const month = MONTH_MAP[monStr.slice(0, 3).toLowerCase()];
    if (month) {
      const year = y.length === 2 ? 2000 + +y : +y;
      const d = new Date(Date.UTC(year, month - 1, +da, +h, +mi, +s));
      if (!isNaN(d.getTime())) return d.toISOString();
    }
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString();
  return null;
}

function parseNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'number') return isNaN(value) ? undefined : value;
  const cleaned = String(value)
    .replace(/[$€£¥₹\s]/g, '')
    .replace(/,(\d{3})/g, '$1')          // thousands separator: 1,234 → 1234
    .replace(/(\d),(\d{1,2})$/, '$1.$2') // EU decimal: 1234,56 → 1234.56
    .replace(/\(([^)]+)\)/, '-$1');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

// Normalize symbol: strip broker suffixes (.a, .r, -PRO, _ECN, .m, .pro, #), keep base ticker.
function normalizeSymbol(raw: string): { symbol: string; suffix?: string } {
  const cleaned = String(raw).trim().toUpperCase().replace(/\s+/g, '');
  const m = cleaned.match(/^([A-Z0-9/]+?)([.\-_#][A-Z0-9]{1,5})$/);
  if (m && m[1].length >= 3) return { symbol: m[1], suffix: m[2] };
  return { symbol: cleaned };
}

// Cheap Levenshtein for fuzzy header matching on short strings.
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = new Array(n + 1).fill(0).map((_, i) => i);
  let cur = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

// Detect delimiter for CSV-like content. Picks the candidate that yields the
// most consistent column count across the first non-empty rows.
function detectDelimiter(lines: string[]): string {
  const candidates = [',', ';', '\t', '|'];
  const sample = lines.slice(0, Math.min(10, lines.length)).filter((l) => l.trim());
  if (sample.length === 0) return ',';
  let bestDelim = ',';
  let bestScore = -1;
  for (const d of candidates) {
    const counts = sample.map((l) => splitCSVLine(l, d).length);
    const max = Math.max(...counts);
    if (max < 2) continue;
    // score = avg cols, penalized by inconsistency between rows
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((a, b) => a + (b - avg) ** 2, 0) / counts.length;
    const score = avg - variance;
    if (score > bestScore) {
      bestScore = score;
      bestDelim = d;
    }
  }
  return bestDelim;
}

// Detect a row that looks like a totals/summary footer.
function isSummaryRow(values: unknown[]): boolean {
  const first = String(values[0] ?? '').toLowerCase().trim();
  if (!first) return false;
  return /^(total|totals|summary|resumen|subtotal|grand total|closed p\/l|balance)\b/.test(first);
}

// Robust CSV row split (supports quoted fields with embedded delimiters)
function splitCSVLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === delim && !inQuotes) {
      out.push(cur); cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out.map(v => v.trim().replace(/^"|"$/g, ''));
}

// ─── Field mapping ──────────────────────────────────────────────────────────


const FIELD_LABELS: Record<keyof typeof FIELD_ALIASES, string> = {
  symbol: 'Activo',
  direction: 'Tipo (Compra/Venta)',
  entryPrice: 'Precio Entrada',
  exitPrice: 'Precio Salida',
  quantity: 'Volumen',
  pnl: 'P&L',
  pnlPercentage: 'P&L %',
  entryDate: 'Fecha',
  exitDate: 'Fecha Cierre',
  strategy: 'Estrategia',
  notes: 'Notas',
  stopLoss: 'Stop Loss',
  takeProfit: 'Take Profit',
  commission: 'Comisión',
  swap: 'Swap',
};

const FIELD_ALIASES = {
  symbol: ['symbol', 'símbolo', 'simbolo', 'par', 'pair', 'asset', 'activo', 'ticker', 'instrument', 'instrumento', 'instrumento financiero', 'security', 'item', 'market', 'mercado', 'currency pair', 'forex pair', 'stock', 'crypto', 'product', 'produto', 'produit', 'contract', 'underlying'],
  direction: ['direction', 'dirección', 'direccion', 'tipo', 'type', 'side', 'action', 'acción', 'accion', 'buy/sell', 'compra/venta', 'order type', 'trade type', 'position', 'b/s', 'long/short', 'cmd', 'comando', 'trade side', 'market pos.', 'market pos', 'sentido', 'sens', 'lado'],
  entryPrice: ['entry price', 'entry_price', 'entry', 'entrada', 'precio_entrada', 'precio entrada', 'open price', 'open', 'apertura', 'precio apertura', 'price', 'precio', 'prezzo', 'prix', 'preco', 'preço', 'fill price', 'exec price', 'avg price', 'average price', 'price of open', 'opening price', 'entry @', 'open @', 't. price', 'trade price', 'executed price'],
  exitPrice: ['exit price', 'exit_price', 'exit', 'salida', 'precio_salida', 'precio salida', 'close price', 'close', 'cierre', 'precio cierre', 'closing price', 'price of close', 'exit @', 'close @', 'prix sortie', 'preco saida'],
  quantity: ['quantity', 'quantidade', 'quantité', 'cantidad', 'size', 'tamaño', 'tamano', 'lots', 'lotes', 'volume', 'volumen', 'volume (lots)', 'shares', 'acciones', 'units', 'unidades', 'contracts', 'contratos', 'amount', 'qty', 'position size', 'lot size', 'executed', 'filled', 'trade volume lots'],
  pnl: ['pnl', 'p&l', 'p/l', 'profit', 'ganancia', 'resultado', 'result', 'profit_loss', 'profit/loss', 'net profit', 'beneficio', 'realized pnl', 'realized p/l', 'realized profit', 'gross pnl', 'net usd', 'net p/l', 'net', 'gross profit', 'profit (usd)', 'profit usd', 'closed p&l', 'closed p/l', 'closed pnl', 'realized p&l', 'lucro', 'beneficio neto'],
  pnlPercentage: ['pnl%', 'pnl_percentage', 'pnl percentage', 'porcentaje', 'return', 'retorno', '% return', 'return %', 'percentage', 'roi', '% profit', 'profit %', 'rendement %'],
  entryDate: ['entry date', 'entry_date', 'fecha_entrada', 'fecha entrada', 'date', 'fecha', 'data', 'open date', 'open_date', 'fecha_apertura', 'fecha apertura', 'time', 'datetime', 'date time', 'date/time', 'trade date', 'execution date', 'opened', 'start date', 'time of open', 'opening time', 'open time', 'entry time', 'date(utc)', 'transact time', 'hora apertura'],
  exitDate: ['exit date', 'exit_date', 'fecha_salida', 'fecha salida', 'close date', 'close_date', 'fecha_cierre', 'fecha cierre', 'closed', 'end date', 'closing date', 'time of close', 'closing time', 'close time', 'exit time', 'hora cierre'],
  strategy: ['strategy', 'estrategia', 'estratégia', 'setup', 'system', 'sistema', 'method', 'trading system', 'approach', 'pattern', 'stratégie'],
  notes: ['notes', 'notas', 'comment', 'comments', 'comentario', 'observation', 'observación', 'observacion', 'remarks', 'description', 'descripción', 'descripcion', 'details', 'memo', 'label', 'etiqueta', 'tag', 'tags'],
  stopLoss: ['stop loss', 'stop_loss', 'sl', 'stop', 'stoploss', 'stop price', 'stop level', 'protective stop', 's / l', 's/l', 'sl price'],
  takeProfit: ['take profit', 'take_profit', 'tp', 'target', 'objetivo', 'profit target', 'target price', 'limit', 'take_profit_price', 't / p', 't/p', 'tp price'],
  commission: ['commission', 'comisión', 'comision', 'comissao', 'comissão', 'commissione', 'fee', 'fees', 'comm/fee', 'comm', 'cost', 'broker fee', 'trading fee', 'commission usd'],
  swap: ['swap', 'rollover', 'financing', 'overnight', 'interest', 'swap usd'],
};

const MANDATORY_FIELDS: (keyof typeof FIELD_ALIASES)[] = ['symbol', 'direction', 'entryPrice', 'exitPrice', 'quantity', 'entryDate'];

function buildRowGetter(headers: string[], values: unknown[]) {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim().replace(/\s+/g, ' '));
  return (key: keyof typeof FIELD_ALIASES): unknown => {
    const aliases = FIELD_ALIASES[key];
    // Pass 1: exact / substring match
    for (const alias of aliases) {
      const idx = norm.findIndex(h => h === alias || h.includes(alias) || (alias.includes(h) && h.length > 2));
      if (idx !== -1 && values[idx] !== undefined && values[idx] !== '') return values[idx];
    }
    // Pass 2: fuzzy (Levenshtein) for short headers, tolerate typos / accents
    for (let i = 0; i < norm.length; i++) {
      const h = norm[i];
      if (h.length < 3 || h.length > 30) continue;
      if (aliases.some(a => a.length >= 3 && Math.abs(a.length - h.length) <= 2 && levenshtein(a, h) <= 2)) {
        if (values[i] !== undefined && values[i] !== '') return values[i];
      }
    }
    return '';
  };
}

// ─── Broker-specific exact mappings ─────────────────────────────────────────

type BrokerFormat = 'ctrader' | 'mt4' | 'mt5' | 'tradingview' | 'binance' | 'bybit' | 'ibkr' | 'ninjatrader' | 'generic';

interface BrokerMap {
  format: BrokerFormat;
  // exact header → field mapping (case-insensitive, exact match)
  fields: Partial<Record<keyof typeof FIELD_ALIASES, string[]>>;
}

const BROKER_MAPS: Record<Exclude<BrokerFormat, 'generic'>, BrokerMap> = {
  ctrader: {
    format: 'ctrader',
    fields: {
      symbol: ['symbol'],
      direction: ['direction', 'side', 'type'],
      entryPrice: ['open price', 'entry price'],
      exitPrice: ['close price', 'exit price'],
      quantity: ['volume', 'quantity', 'lots', 'volume (lots)'],
      pnl: ['net profit', 'profit', 'net p/l', 'net usd'],
      entryDate: ['open time', 'opened'],
      exitDate: ['close time', 'closed'],
      stopLoss: ['stop loss', 'sl'],
      takeProfit: ['take profit', 'tp'],
      strategy: ['comment', 'label'],
      commission: ['commission', 'commissions'],
      swap: ['swap'],
    },
  },
  mt5: {
    format: 'mt5',
    fields: {
      symbol: ['symbol'],
      direction: ['type'],
      entryPrice: ['price', 'open price'],
      exitPrice: ['price.1', 'close price'],
      quantity: ['volume'],
      pnl: ['profit'],
      entryDate: ['time', 'open time'],
      exitDate: ['time.1', 'close time'],
      stopLoss: ['s / l', 's/l'],
      takeProfit: ['t / p', 't/p'],
      commission: ['commission'],
      swap: ['swap'],
    },
  },
  mt4: {
    format: 'mt4',
    fields: {
      symbol: ['symbol', 'item'],
      direction: ['type'],
      entryPrice: ['price'],
      exitPrice: ['close price'],
      quantity: ['size', 'volume'],
      pnl: ['profit'],
      entryDate: ['open time'],
      exitDate: ['close time'],
      stopLoss: ['s / l'],
      takeProfit: ['t / p'],
      commission: ['commission'],
      swap: ['swap'],
    },
  },
  tradingview: {
    format: 'tradingview',
    fields: {
      symbol: ['symbol'],
      direction: ['type'],
      entryPrice: ['entry price', 'price'],
      exitPrice: ['exit price'],
      quantity: ['quantity', 'contracts'],
      pnl: ['p&l', 'profit', 'net p&l'],
      entryDate: ['date/time', 'entry time'],
      exitDate: ['exit time'],
    },
  },
  binance: {
    format: 'binance',
    fields: {
      symbol: ['pair', 'symbol'],
      direction: ['side'],
      entryPrice: ['price'],
      quantity: ['executed', 'amount', 'filled', 'quantity'],
      pnl: ['realized profit', 'realized pnl', 'realized p&l'],
      entryDate: ['date(utc)', 'date', 'time'],
      commission: ['fee'],
    },
  },
  bybit: {
    format: 'bybit',
    fields: {
      symbol: ['contracts', 'symbol'],
      direction: ['side'],
      entryPrice: ['entry price', 'avg entry price'],
      exitPrice: ['exit price', 'avg exit price'],
      quantity: ['qty', 'closed qty'],
      pnl: ['closed p&l', 'closed pnl', 'realized p&l'],
      entryDate: ['create time', 'open time', 'time'],
      exitDate: ['close time'],
      commission: ['fee', 'trading fee'],
    },
  },
  ibkr: {
    format: 'ibkr',
    fields: {
      symbol: ['symbol'],
      direction: ['buy/sell', 'side'],
      entryPrice: ['t. price', 'trade price', 'price'],
      quantity: ['quantity'],
      pnl: ['realized p/l', 'realized pnl'],
      entryDate: ['date/time', 'datetime', 'trade date'],
      commission: ['comm/fee', 'commission'],
    },
  },
  ninjatrader: {
    format: 'ninjatrader',
    fields: {
      symbol: ['instrument'],
      direction: ['market pos.', 'market pos', 'side'],
      entryPrice: ['entry price'],
      exitPrice: ['exit price'],
      quantity: ['qty', 'quantity'],
      pnl: ['profit', 'p&l'],
      entryDate: ['entry time'],
      exitDate: ['exit time'],
      strategy: ['strategy'],
      commission: ['commission'],
    },
  },
};

function detectBroker(headers: string[]): BrokerFormat | 'ctrader-position-history' {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim());
  const has = (s: string) => norm.includes(s);
  // cTrader "Position History List" export: rows are individual transactions (Trade Buy / Trade Sell)
  // paired by the Position column. Needs aggregation, not row-by-row mapping.
  if (has('position') && has('transaction type') && has('date time') && (has('trade volume lots') || has('volume'))) {
    return 'ctrader-position-history';
  }
  if (has('position id') && (has('open price') || has('open time'))) return 'ctrader';
  if (has('ticket') && (has('open time') || has('s / l') || has('symbol'))) {
    return norm.includes('time.1') || norm.includes('price.1') ? 'mt5' : 'mt4';
  }
  if (has('instrument') && (has('market pos.') || has('market pos')) && has('entry price')) return 'ninjatrader';
  if ((has('date(utc)') || (has('pair') && has('side'))) && (has('executed') || has('price'))) return 'binance';
  if ((has('contracts') || has('symbol')) && (has('closed p&l') || has('closed pnl'))) return 'bybit';
  if ((has('t. price') || has('trade price')) && has('symbol') && (has('quantity') || has('comm/fee'))) return 'ibkr';
  if ((has('trade #') || has('trade')) && has('entry price')) return 'tradingview';
  return 'generic';
}

// ─── cTrader Position History aggregator ────────────────────────────────────
// Each Position has 2 transaction rows (open + close). We group by Position ID
// and merge them into a single trade.
function aggregateCtraderPositionHistory(
  headers: string[],
  rows: unknown[][],
  metadata: ParseMetadata,
): { trades: ImportedTrade[]; errors: string[] } {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim());
  const col = (name: string) => norm.indexOf(name);
  const cSymbol = col('symbol');
  const cPosition = col('position');
  const cDate = col('date time');
  const cType = col('transaction type');
  const cVolume = col('trade volume lots') !== -1 ? col('trade volume lots') : col('volume');
  const cOpenPrice = col('open price');
  const cProfit = col('profit') !== -1 ? col('profit') : col('net profit');
  const cStatus = col('position status');

  const groups = new Map<string, unknown[][]>();
  rows.forEach((r, idx) => {
    if (!Array.isArray(r) || r.every(v => v === '' || v == null)) {
      metadata.ignoredRows++;
      return;
    }
    if (isSummaryRow(r)) {
      metadata.ignoredRows++;
      metadata.ignoredDetails.push({ row: idx + 2, reason: 'Sumario/pie' });
      return;
    }
    const posId = String(r[cPosition] ?? '').trim();
    if (!posId) {
      metadata.ignoredRows++;
      return;
    }
    if (!groups.has(posId)) groups.set(posId, []);
    groups.get(posId)!.push(r);
  });

  const trades: ImportedTrade[] = [];
  const errors: string[] = [];

  groups.forEach((legs, posId) => {
    // Sort chronologically by Date Time
    const sorted = [...legs].sort((a, b) => {
      const da = parseDate(a[cDate] as string, false) ?? '';
      const db = parseDate(b[cDate] as string, false) ?? '';
      return da < db ? -1 : da > db ? 1 : 0;
    });
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const symbol = String(first[cSymbol] ?? '').trim().toUpperCase().replace(/\s+/g, '');
    if (!symbol) {
      metadata.ignoredRows += sorted.length;
      return;
    }

    const firstType = String(first[cType] ?? '').toLowerCase();
    const direction: 'long' | 'short' = firstType.includes('sell') ? 'short' : 'long';

    const entryDate = parseDate(first[cDate] as string, false);
    if (!entryDate) {
      metadata.ignoredRows += sorted.length;
      metadata.ignoredDetails.push({ row: 0, reason: `Position ${posId}: fecha apertura inválida` });
      return;
    }

    // If only one leg → still open. Skip with note (closed-only flow for now).
    const statusStr = String(first[cStatus] ?? '').toLowerCase();
    if (sorted.length < 2 && statusStr !== 'closed') {
      metadata.ignoredRows++;
      metadata.ignoredDetails.push({ row: 0, reason: `Position ${posId}: posición abierta sin cierre` });
      return;
    }

    const exitDate = sorted.length > 1 ? (parseDate(last[cDate] as string, false) ?? undefined) : undefined;
    const quantity = parseNumber(first[cVolume]) ?? parseNumber(last[cVolume]) ?? 1;
    const pnl = sorted.reduce((sum, r) => sum + (parseNumber(r[cProfit]) ?? 0), 0);
    const openPx = cOpenPrice !== -1 ? parseNumber(first[cOpenPrice]) : undefined;
    const closePx = cOpenPrice !== -1 && sorted.length > 1 ? parseNumber(last[cOpenPrice]) : undefined;
    const entryPrice = openPx && openPx > 0 ? openPx : 0;
    const exitPrice = closePx && closePx > 0 ? closePx : undefined;

    trades.push({
      symbol,
      direction,
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      entryDate,
      exitDate,
      notes: `cTrader Position #${posId}${entryPrice === 0 ? ' (precios no incluidos en el export)' : ''}`,
      assetClass: detectAssetClass(symbol),
    });
    metadata.validRows++;
  });

  if (trades.length > 0) {
    errors.unshift(`Formato detectado: CTRADER Position History — ${trades.length} operación(es) agregada(s) desde ${rows.length} transacción(es)`);
  }
  return { trades, errors };
}

function buildExactGetter(headers: string[], values: unknown[], map: BrokerMap['fields']) {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim());
  return (key: keyof typeof FIELD_ALIASES): unknown => {
    const candidates = map[key];
    if (!candidates) return '';
    for (const candidate of candidates) {
      const idx = norm.findIndex(h => h === candidate);
      if (idx !== -1 && values[idx] !== undefined && values[idx] !== '') return values[idx];
    }
    return '';
  };
}

function mapRowWithBroker(
  headers: string[],
  values: unknown[],
  broker: BrokerMap,
  rowNumber: number,
): { trade: ImportedTrade | null; error?: string } {
  const get = buildExactGetter(headers, values, broker.fields);
  const symbol = String(get('symbol') ?? '').trim();
  if (!symbol) return { trade: null };

  const entryRaw = get('entryPrice');
  if (entryRaw === '' || entryRaw === null || entryRaw === undefined) {
    return { trade: null, error: `Fila ${rowNumber}: falta precio de entrada para ${symbol}` };
  }
  const entryPrice = parseNumber(entryRaw);
  if (entryPrice === undefined || isNaN(entryPrice)) {
    return { trade: null, error: `Fila ${rowNumber}: precio de entrada inválido (${entryRaw}) para ${symbol}` };
  }

  const dirRaw = String(get('direction') ?? '').toLowerCase().trim();
  const isLong = ['long', 'buy', 'compra', 'largo', 'l', 'b', 'bought', '0'].includes(dirRaw);
  const isShort = ['short', 'sell', 'venta', 'corto', 's', 'sold', '1'].includes(dirRaw);
  const direction: 'long' | 'short' = isShort ? 'short' : isLong ? 'long' : 'long';

  const exitPrice = parseNumber(get('exitPrice'));
  const entryDate = parseDate(get('entryDate') as string, true);
  if (!entryDate) {
    return { trade: null, error: `Fila ${rowNumber}: fecha de apertura inválida para ${symbol}` };
  }
  const exitDate = parseDate(get('exitDate') as string, true) ?? undefined;

  return {
    trade: {
      symbol: symbol.toUpperCase().replace(/\s+/g, ''),
      direction,
      entryPrice,
      exitPrice,
      quantity: parseNumber(get('quantity')) ?? 1,
      pnl: parseNumber(get('pnl')),
      pnlPercentage: parseNumber(get('pnlPercentage')),
      entryDate,
      exitDate,
      strategy: (get('strategy') as string) || undefined,
      notes: (get('notes') as string) || undefined,
      stopLoss: parseNumber(get('stopLoss')),
      takeProfit: parseNumber(get('takeProfit')),
      assetClass: detectAssetClass(symbol),
    },
  };
}

function mapRowToTrade(headers: string[], values: unknown[]): ImportedTrade | null {
  const get = buildRowGetter(headers, values);
  const symbol = String(get('symbol') ?? '').trim();
  const entryPriceRaw = get('entryPrice');
  if (!symbol || entryPriceRaw === '' || entryPriceRaw === undefined) return null;

  const entryPrice = parseNumber(entryPriceRaw);
  if (entryPrice === undefined) return null;

  const directionRaw = String(get('direction') ?? '').toLowerCase().trim();
  const isLong = ['long', 'buy', 'compra', 'largo', 'l', 'b', 'bought', 'comprar', '0'].includes(directionRaw);
  const isShort = ['short', 'sell', 'venta', 'corto', 's', 'sold', 'vender', '1'].includes(directionRaw);

  let finalDirection: 'long' | 'short' = isShort ? 'short' : 'long';
  if (!isLong && !isShort) {
    const exit = parseNumber(get('exitPrice'));
    const profit = parseNumber(get('pnl'));
    if (exit !== undefined && profit !== undefined) {
      if ((exit < entryPrice && profit > 0) || (exit > entryPrice && profit < 0)) finalDirection = 'short';
    }
  }

  const entryDate = parseDate(get('entryDate') as string) ?? new Date().toISOString();
  const exitDate = parseDate(get('exitDate') as string) ?? undefined;

  return {
    symbol: symbol.toUpperCase().replace(/\s+/g, ''),
    direction: finalDirection,
    entryPrice,
    exitPrice: parseNumber(get('exitPrice')),
    quantity: parseNumber(get('quantity')) ?? 1,
    pnl: parseNumber(get('pnl')),
    pnlPercentage: parseNumber(get('pnlPercentage')),
    entryDate,
    exitDate,
    strategy: (get('strategy') as string) || undefined,
    notes: (get('notes') as string) || undefined,
    stopLoss: parseNumber(get('stopLoss')),
    takeProfit: parseNumber(get('takeProfit')),
    assetClass: detectAssetClass(symbol),
  };
}

// ─── Parsers ────────────────────────────────────────────────────────────────

function processRows(
  headers: string[],
  rows: unknown[][],
  ctx: { source: string; metadata?: Partial<ParseMetadata> },
): ParseResult {
  const trades: ImportedTrade[] = [];
  const errors: string[] = [];
  const broker = detectBroker(headers);
  const brokerMap = broker !== 'generic' && broker !== 'ctrader-position-history' ? BROKER_MAPS[broker] : null;

  const metadata: ParseMetadata = {
    totalRows: rows.length,
    validRows: 0,
    ignoredRows: 0,
    missingColumns: [],
    columnMapping: {},
    ignoredDetails: [],
    ...ctx.metadata,
  };

  // Special path: cTrader Position History (1 trade = 2 transaction rows)
  if (broker === 'ctrader-position-history') {
    const agg = aggregateCtraderPositionHistory(headers, rows, metadata);
    return { trades: agg.trades, errors: agg.errors, metadata };
  }

  // Identify column mapping

  Object.keys(FIELD_ALIASES).forEach((key) => {
    const fieldKey = key as keyof typeof FIELD_ALIASES;
    const norm = headers.map((h) => String(h ?? '').toLowerCase().trim());
    const aliases = FIELD_ALIASES[fieldKey];
    for (const alias of aliases) {
      const idx = norm.findIndex((h) => h === alias || h.includes(alias) || (alias.length > 3 && alias.includes(h) && h.length > 2));
      if (idx !== -1) {
        metadata.columnMapping[fieldKey] = headers[idx];
        break;
      }
    }
  });

  // Check for missing mandatory columns
  MANDATORY_FIELDS.forEach((field) => {
    if (!metadata.columnMapping[field]) {
      metadata.missingColumns.push(FIELD_LABELS[field]);
    }
  });

  // Surface a clear error when cabeceras don't map any mandatory field
  if (Object.keys(metadata.columnMapping).length === 0) {
    errors.push(`No se reconocieron columnas de operaciones en ${ctx.source}. Cabeceras encontradas: ${headers.filter(Boolean).join(', ') || '(ninguna)'}.`);
  }

  rows.forEach((values, idx) => {
    if (!Array.isArray(values) || values.every((v) => v === '' || v === null || v === undefined)) {
      metadata.ignoredRows++;
      return;
    }
    const rowNum = (metadata.headerRowIndex ?? 0) + idx + 2; // +1 for header, +1 for 1-indexed
    try {
      if (isSummaryRow(values)) {
        metadata.ignoredRows++;
        metadata.ignoredDetails.push({ row: rowNum, reason: 'Fila de sumario/pie de página', data: values.map(String) });
        return;
      }

      let result: { trade: ImportedTrade | null; error?: string };
      if (brokerMap) {
        result = mapRowWithBroker(headers, values, brokerMap, rowNum);
      } else {
        const trade = mapRowToTrade(headers, values);
        result = { trade };
      }

      if (result.trade) {
        trades.push(result.trade);
        metadata.validRows++;
      } else {
        metadata.ignoredRows++;
        metadata.ignoredDetails.push({ 
          row: rowNum, 
          reason: result.error || 'Faltan datos obligatorios o formato inválido',
          data: values.map(String) 
        });
      }
    } catch (e) {
      metadata.ignoredRows++;
      metadata.ignoredDetails.push({ 
        row: rowNum, 
        reason: (e as Error)?.message ?? String(e),
        data: values.map(String) 
      });
      errors.push(`${ctx.source} fila ${rowNum}: ${(e as Error)?.message ?? e}`);
    }
  });

  if (broker !== 'generic' && trades.length > 0) {
    errors.unshift(`Formato detectado: ${broker.toUpperCase()} — ${trades.length} operación(es) interpretada(s)`);
  }

  return { trades, errors, metadata };
}

export function parseCSV(content: string): ParseResult {
  // Strip UTF-8 BOM
  const cleaned = content.replace(/^\uFEFF/, '');
  const lines = cleaned
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim());
  if (lines.length < 2) return { trades: [], errors: ['El archivo está vacío o no tiene datos'] };

  const delim = detectDelimiter(lines);

  // Parse all rows once, then auto-detect header row by scoring
  const allRows = lines.map((l) => splitCSVLine(l, delim));
  const scanLimit = Math.min(15, allRows.length);
  let headerIdx = 0;
  let bestScore = scoreHeaderRow(allRows[0]);
  for (let i = 1; i < scanLimit; i++) {
    const s = scoreHeaderRow(allRows[i]);
    if (s > bestScore) {
      bestScore = s;
      headerIdx = i;
    }
  }

  const headers = allRows[headerIdx].map((h) => String(h ?? '').toLowerCase().trim());
  const dataRows = allRows.slice(headerIdx + 1);
  
  const result = processRows(headers, dataRows, { 
    source: 'CSV', 
    metadata: { 
      delimiter: delim, 
      headerRowIndex: headerIdx 
    } 
  });
  
  return { 
    ...result,
    rawRows: allRows.slice(0, 100), // Limit to first 100 rows for preview performance
  };
}

// Score how "header-like" a row is by counting matches against known field aliases
function scoreHeaderRow(row: unknown[]): number {
  if (!Array.isArray(row)) return 0;
  const cells = row.map(v => String(v ?? '').toLowerCase().trim()).filter(Boolean);
  if (cells.length < 3) return 0;
  let score = 0;
  const allAliases = Object.values(FIELD_ALIASES).flat();
  for (const cell of cells) {
    if (allAliases.some(a => cell === a || cell.includes(a) || (a.length > 3 && a.includes(cell)))) {
      score++;
    }
  }
  return score;
}

export async function parseExcelBuffer(buffer: ArrayBuffer): Promise<ParseResult> {
  const trades: ImportedTrade[] = [];
  const errors: string[] = [];
  try {
    const wb = await parseXLSXBuffer(buffer);
    if (!wb.sheetNames.length) {
      return { trades: [], errors: ['El archivo Excel no contiene hojas'] };
    }

    for (const sheet of wb.sheets) {
      const sheetName = sheet.name;
      const data: unknown[][] = sheet.rows;
      if (data.length < 2) continue;

      // Auto-detect header row by scoring the first 15 rows
      let headerIdx = 0;
      let bestScore = scoreHeaderRow(data[0]);
      const scanLimit = Math.min(15, data.length);
      for (let i = 1; i < scanLimit; i++) {
        const s = scoreHeaderRow(data[i]);
        if (s > bestScore) { bestScore = s; headerIdx = i; }
      }

      if (bestScore < 2) {
        errors.push(`Hoja "${sheetName}": no se encontró una fila de cabecera reconocible`);
        continue;
      }

      const headerRow = (data[headerIdx] as unknown[]).map(v => String(v ?? '').toLowerCase().trim());
      const dataRows = data.slice(headerIdx + 1);
      const sheetResult = processRows(headerRow, dataRows, { source: `Hoja "${sheetName}"` });
      trades.push(...sheetResult.trades);
      errors.push(...sheetResult.errors);
      if (sheetResult.trades.length === 0) {
        errors.push(`Hoja "${sheetName}": cabeceras detectadas pero ninguna fila pudo ser interpretada como operación`);
      }
    }

    if (trades.length === 0 && errors.length === 0) {
      errors.push('No se encontraron operaciones en el archivo Excel');
    }
  } catch (e) {
    errors.push(`Error al leer Excel: ${(e as Error)?.message ?? e}`);
  }
  return { trades, errors };
}

function parseJSON(content: string): ParseResult {
  try {
    const data = JSON.parse(content);
    let rows: Record<string, unknown>[] = [];
    if (Array.isArray(data)) rows = data;
    else if (Array.isArray(data.trades)) rows = data.trades;
    else if (Array.isArray(data.data)) rows = data.data;
    else if (Array.isArray(data.orders)) rows = data.orders;
    else return { trades: [], errors: ['JSON no contiene un array de operaciones reconocible'] };

    if (rows.length === 0) return { trades: [], errors: ['JSON vacío'] };

    const headers = Object.keys(rows[0]).map(h => h.toLowerCase());
    const trades: ImportedTrade[] = [];
    const errors: string[] = [];
    rows.forEach((row, i) => {
      try {
        const values = Object.values(row);
        const trade = mapRowToTrade(headers, values);
        if (trade) trades.push(trade);
      } catch (e) {
        errors.push(`Item ${i + 1}: ${e}`);
      }
    });
    return { trades, errors };
  } catch (e) {
    return { trades: [], errors: [`JSON inválido: ${e}`] };
  }
}

function parseHTML(content: string): ParseResult {
  // Extract the first table from HTML (MT4/MT5 reports come as HTML tables)
  const trades: ImportedTrade[] = [];
  const errors: string[] = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const tables = doc.querySelectorAll('table');
    if (tables.length === 0) return { trades: [], errors: ['No se encontraron tablas en el HTML'] };

    let parsedAny = false;
    tables.forEach(table => {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length < 2) return;

      // Find a header row by looking for one whose cells look like headers
      let headerIdx = 0;
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const cells = Array.from(rows[i].querySelectorAll('th, td')).map(c => c.textContent?.toLowerCase().trim() ?? '');
        if (cells.some(c => /symbol|ticker|item|instrument|símbolo|simbolo|product/.test(c)) &&
            cells.some(c => /price|precio|open|entry/.test(c))) {
          headerIdx = i;
          break;
        }
      }

      const headers = Array.from(rows[headerIdx].querySelectorAll('th, td')).map(c => (c.textContent ?? '').toLowerCase().trim());
      for (let i = headerIdx + 1; i < rows.length; i++) {
        const values = Array.from(rows[i].querySelectorAll('th, td')).map(c => (c.textContent ?? '').trim());
        if (values.every(v => !v)) continue;
        try {
          const trade = mapRowToTrade(headers, values);
          if (trade) { trades.push(trade); parsedAny = true; }
        } catch (e) {
          errors.push(`Fila ${i + 1}: ${e}`);
        }
      }
    });

    if (!parsedAny && trades.length === 0) {
      errors.push('No se pudieron extraer operaciones de las tablas del HTML');
    }
  } catch (e) {
    errors.push(`Error al leer HTML: ${e}`);
  }
  return { trades, errors };
}

// PDF parsing — uses xlsx ability to read text, or falls back to graceful error
async function parsePDF(_file: File): Promise<ParseResult> {
  return {
    trades: [],
    errors: [
      'Los archivos PDF no se pueden leer directamente. Por favor, exporta el reporte de tu broker como CSV, Excel (.xlsx) o HTML para mejores resultados.',
    ],
  };
}

// ─── Public hook ────────────────────────────────────────────────────────────

export function useImportTrades() {
  const importFromFile = useCallback(async (file: File): Promise<ParseResult> => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mime = file.type.toLowerCase();

    try {
      // CSV / TXT / TSV
      if (['csv', 'txt', 'tsv'].includes(ext) || mime.includes('csv') || mime === 'text/plain') {
        const content = await file.text();
        return parseCSV(content);
      }

      // Excel
      if (['xlsx', 'xls', 'xlsm', 'xlsb', 'ods'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel')) {
        const buffer = await file.arrayBuffer();
        return parseExcelBuffer(buffer);
      }

      // JSON
      if (ext === 'json' || mime.includes('json')) {
        const content = await file.text();
        return parseJSON(content);
      }

      // HTML / HTM (MT4/MT5/cTrader reports)
      if (['html', 'htm', 'mhtml', 'xml'].includes(ext) || mime.includes('html') || mime.includes('xml')) {
        const content = await file.text();
        return parseHTML(content);
      }

      // PDF
      if (ext === 'pdf' || mime.includes('pdf')) {
        return await parsePDF(file);
      }

      // Fallback: try to read as text and detect format
      const content = await file.text();
      const trimmed = content.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) return parseJSON(content);
      if (trimmed.toLowerCase().startsWith('<!doctype html') || trimmed.toLowerCase().startsWith('<html')) return parseHTML(content);
      if (trimmed.includes(',') || trimmed.includes(';') || trimmed.includes('\t')) return parseCSV(content);

      return {
        trades: [],
        errors: [`Formato no soportado: .${ext}. Formatos compatibles: CSV, Excel, JSON, HTML, TSV`],
      };
    } catch (e) {
      return { trades: [], errors: [`Error al procesar el archivo: ${e}`] };
    }
  }, []);

  return { importFromFile };
}

