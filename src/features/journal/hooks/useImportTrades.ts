import { useCallback } from 'react';
import { parseXLSXBuffer } from '@/features/journal/utils/xlsx-adapter';

interface ImportedTrade {
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
  assetClass?: 'forex' | 'stocks' | 'crypto' | 'futures' | 'options' | 'commodities';
}

interface ParseResult {
  trades: ImportedTrade[];
  errors: string[];
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

function parseDate(dateStr: string | number | Date | null | undefined, dayFirstHint = true): string | null {
  if (dateStr === null || dateStr === undefined || dateStr === '') return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr.toISOString();

  const str = String(dateStr).trim();
  if (!str) return null;

  if (str.includes('T')) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  const numDate = parseFloat(str);
  if (!isNaN(numDate) && numDate > 25569 && numDate < 60000 && /^\d+(\.\d+)?$/.test(str)) {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + numDate * 86400000).toISOString();
  }

  // DD/MM/YYYY HH:MM[:SS] or MM/DD/YYYY HH:MM[:SS]
  const m = str.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    const [, a, b, y, h = '0', mi = '0', s = '0'] = m;
    const year = y.length === 2 ? 2000 + +y : +y;
    // If first part > 12 it MUST be day. Otherwise rely on hint.
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

// Detect delimiter for CSV-like content
function detectDelimiter(line: string): string {
  const candidates = [',', ';', '\t', '|'];
  let best = ',', max = 0;
  for (const d of candidates) {
    const count = (line.match(new RegExp(`\\${d}`, 'g')) ?? []).length;
    if (count > max) { max = count; best = d; }
  }
  return best;
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

const FIELD_ALIASES = {
  symbol: ['symbol', 'símbolo', 'simbolo', 'par', 'pair', 'asset', 'activo', 'ticker', 'instrument', 'instrumento', 'security', 'item', 'market', 'mercado', 'currency pair', 'forex pair', 'stock', 'crypto', 'product'],
  direction: ['direction', 'dirección', 'direccion', 'tipo', 'type', 'side', 'action', 'acción', 'accion', 'buy/sell', 'compra/venta', 'order type', 'trade type', 'position', 'b/s', 'long/short', 'cmd', 'comando', 'trade side'],
  entryPrice: ['entry price', 'entry_price', 'entry', 'entrada', 'precio_entrada', 'precio entrada', 'open price', 'open', 'apertura', 'precio apertura', 'price', 'precio', 'fill price', 'exec price', 'avg price', 'average price', 'price of open', 'opening price', 'entry @', 'open @'],
  exitPrice: ['exit price', 'exit_price', 'exit', 'salida', 'precio_salida', 'precio salida', 'close price', 'close', 'cierre', 'precio cierre', 'closing price', 'price of close', 'exit @', 'close @'],
  quantity: ['quantity', 'cantidad', 'size', 'tamaño', 'tamano', 'lots', 'lotes', 'volume', 'volumen', 'volume (lots)', 'shares', 'acciones', 'units', 'unidades', 'contracts', 'contratos', 'amount', 'qty', 'position size', 'lot size'],
  pnl: ['pnl', 'p&l', 'p/l', 'profit', 'ganancia', 'resultado', 'result', 'profit_loss', 'profit/loss', 'net profit', 'beneficio', 'realized pnl', 'realized p/l', 'gross pnl', 'net usd', 'net p/l', 'net', 'gross profit', 'profit (usd)', 'profit usd'],
  pnlPercentage: ['pnl%', 'pnl_percentage', 'pnl percentage', 'porcentaje', 'return', 'retorno', '% return', 'return %', 'percentage', 'roi', '% profit', 'profit %'],
  entryDate: ['entry date', 'entry_date', 'fecha_entrada', 'fecha entrada', 'date', 'fecha', 'open date', 'open_date', 'fecha_apertura', 'fecha apertura', 'time', 'datetime', 'trade date', 'execution date', 'opened', 'start date', 'time of open', 'opening time', 'open time', 'entry time'],
  exitDate: ['exit date', 'exit_date', 'fecha_salida', 'fecha salida', 'close date', 'close_date', 'fecha_cierre', 'fecha cierre', 'closed', 'end date', 'closing date', 'time of close', 'closing time', 'close time', 'exit time'],
  strategy: ['strategy', 'estrategia', 'setup', 'system', 'sistema', 'method', 'trading system', 'approach', 'pattern'],
  notes: ['notes', 'notas', 'comment', 'comentario', 'observation', 'observación', 'observacion', 'remarks', 'description', 'descripción', 'descripcion', 'details', 'memo', 'label', 'etiqueta'],
  stopLoss: ['stop loss', 'stop_loss', 'sl', 'stop', 'stoploss', 'stop price', 'stop level', 'protective stop', 's / l', 's/l'],
  takeProfit: ['take profit', 'take_profit', 'tp', 'target', 'objetivo', 'profit target', 'target price', 'limit', 'take_profit_price', 't / p', 't/p'],
};

function buildRowGetter(headers: string[], values: unknown[]) {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim().replace(/\s+/g, ' '));
  return (key: keyof typeof FIELD_ALIASES): unknown => {
    for (const alias of FIELD_ALIASES[key]) {
      const idx = norm.findIndex(h => h === alias || h.includes(alias) || alias.includes(h) && h.length > 2);
      if (idx !== -1 && values[idx] !== undefined && values[idx] !== '') return values[idx];
    }
    return '';
  };
}

// ─── Broker-specific exact mappings ─────────────────────────────────────────

type BrokerFormat = 'ctrader' | 'mt4' | 'mt5' | 'tradingview' | 'generic';

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
};

function detectBroker(headers: string[]): BrokerFormat {
  const norm = headers.map(h => String(h ?? '').toLowerCase().trim());
  const has = (s: string) => norm.includes(s);
  if (has('position id') && (has('open price') || has('open time'))) return 'ctrader';
  if (has('ticket') && (has('open time') || has('s / l') || has('symbol'))) {
    return norm.includes('time.1') || norm.includes('price.1') ? 'mt5' : 'mt4';
  }
  if ((has('trade #') || has('trade')) && has('entry price')) return 'tradingview';
  return 'generic';
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
  ctx: { source: string },
): ParseResult {
  const trades: ImportedTrade[] = [];
  const errors: string[] = [];
  const broker = detectBroker(headers);
  const brokerMap = broker !== 'generic' ? BROKER_MAPS[broker] : null;

  rows.forEach((values, idx) => {
    if (!Array.isArray(values) || values.every(v => v === '' || v === null || v === undefined)) return;
    const rowNum = idx + 2; // +1 for header, +1 for 1-indexed
    try {
      if (brokerMap) {
        const result = mapRowWithBroker(headers, values, brokerMap, rowNum);
        if (result.trade) trades.push(result.trade);
        else if (result.error) errors.push(result.error);
      } else {
        const trade = mapRowToTrade(headers, values);
        if (trade) trades.push(trade);
      }
    } catch (e) {
      errors.push(`${ctx.source} fila ${rowNum}: ${(e as Error)?.message ?? e}`);
    }
  });

  if (broker !== 'generic' && trades.length > 0) {
    errors.unshift(`Formato detectado: ${broker.toUpperCase()} — ${trades.length} operación(es) interpretada(s)`);
  }
  return { trades, errors };
}

function parseCSV(content: string): ParseResult {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return { trades: [], errors: ['El archivo está vacío o no tiene datos'] };

  const delim = detectDelimiter(lines[0]);
  const headers = splitCSVLine(lines[0], delim).map(h => h.toLowerCase().trim());
  const rows = lines.slice(1).map(l => splitCSVLine(l, delim));
  return processRows(headers, rows, { source: 'CSV' });
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

async function parseExcelBuffer(buffer: ArrayBuffer): Promise<ParseResult> {
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

