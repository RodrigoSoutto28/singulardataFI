import { useCallback } from 'react';
import * as XLSX from 'xlsx';

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

// Common date formats
const dateFormats = [
  /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
  /^\d{2}\/\d{2}\/\d{4}/, // DD/MM/YYYY or MM/DD/YYYY
  /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
  /^\d{2}\.\d{2}\.\d{4}/, // DD.MM.YYYY
];

// Asset class detection based on symbol
function detectAssetClass(symbol: string): ImportedTrade['assetClass'] {
  const upperSymbol = symbol.toUpperCase();
  
  // Crypto patterns
  if (/BTC|ETH|XRP|LTC|ADA|DOT|SOL|DOGE|SHIB|MATIC|AVAX|LINK|UNI|USDT|USDC|BNB/.test(upperSymbol)) {
    return 'crypto';
  }
  
  // Forex patterns
  if (/EUR|USD|GBP|JPY|CHF|AUD|NZD|CAD/.test(upperSymbol) && upperSymbol.includes('/')) {
    return 'forex';
  }
  if (/^[A-Z]{6}$/.test(upperSymbol) && /EUR|USD|GBP|JPY|CHF|AUD|NZD|CAD/.test(upperSymbol)) {
    return 'forex';
  }
  
  // Futures patterns
  if (/^(ES|NQ|YM|CL|GC|SI|ZB|ZN|ZC|ZS|ZW|NG|HO|RB)\d*/.test(upperSymbol)) {
    return 'futures';
  }
  if (upperSymbol.includes('FUTURES') || upperSymbol.includes('FUT')) {
    return 'futures';
  }
  
  // Commodities
  if (/GOLD|SILVER|OIL|XAUUSD|XAGUSD|USOIL|UKOIL/.test(upperSymbol)) {
    return 'commodities';
  }
  
  // Options
  if (/CALL|PUT|C\d|P\d/.test(upperSymbol)) {
    return 'options';
  }
  
  // Default to stocks
  return 'stocks';
}

// Parse various date formats
function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  // If it's already ISO format
  if (dateStr.includes('T')) {
    return new Date(dateStr).toISOString();
  }
  
  // Try parsing as number (Excel serial date)
  const numDate = parseFloat(dateStr);
  if (!isNaN(numDate) && numDate > 25569) { // Excel dates start from 1900
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + numDate * 86400000);
    return date.toISOString();
  }
  
  // Try common date formats
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch {
    // Continue to fallback
  }
  
  return new Date().toISOString();
}

// Parse number with various formats
function parseNumber(value: string | number): number | undefined {
  if (typeof value === 'number') return value;
  if (!value || value === '') return undefined;
  
  // Remove currency symbols and spaces
  const cleaned = String(value)
    .replace(/[$€£¥₹,\s]/g, '')
    .replace(/\(([^)]+)\)/, '-$1'); // Handle (123) as -123
  
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

export function useImportTrades() {
  const parseCSV = useCallback((content: string): ParseResult => {
    const lines = content.trim().split('\n');
    const trades: ImportedTrade[] = [];
    const errors: string[] = [];
    
    if (lines.length < 2) {
      return { trades: [], errors: ['El archivo está vacío o no tiene datos'] };
    }

    // Handle different delimiters
    let delimiter = ',';
    if (lines[0].includes(';') && !lines[0].includes(',')) {
      delimiter = ';';
    } else if (lines[0].includes('\t')) {
      delimiter = '\t';
    }

    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(delimiter).map(v => v.trim().replace(/['"]/g, ''));
      
      try {
        const trade = mapRowToTrade(headers, values);
        if (trade) {
          trades.push(trade);
        }
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar - ${error}`);
      }
    }

    return { trades, errors };
  }, []);

  const parseExcel = useCallback((buffer: ArrayBuffer): ParseResult => {
    const trades: ImportedTrade[] = [];
    const errors: string[] = [];

    try {
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });

      if (data.length < 2) {
        return { trades: [], errors: ['El archivo está vacío o no tiene datos'] };
      }

      const headerRow = data[0];
      if (!Array.isArray(headerRow)) {
        return { trades: [], errors: ['No se encontraron encabezados válidos'] };
      }
      
      const headers = headerRow.map(h => String(h ?? '').toLowerCase().trim());

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row) || row.length === 0) continue;
        
        try {
          const values = row.map(v => String(v ?? '').trim());
          const trade = mapRowToTrade(headers, values);
          if (trade) {
            trades.push(trade);
          }
        } catch (error) {
          errors.push(`Fila ${i + 1}: Error al procesar - ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Error al leer el archivo Excel: ${error}`);
    }

    return { trades, errors };
  }, []);

  const mapRowToTrade = (headers: string[], values: string[]): ImportedTrade | null => {
    const getValue = (possibleNames: string[]): string => {
      for (const name of possibleNames) {
        const index = headers.findIndex(h => h.includes(name) || name.includes(h));
        if (index !== -1 && values[index]) {
          return values[index];
        }
      }
      return '';
    };

    // Extended column mappings for different broker formats
    const symbol = getValue([
      'symbol', 'símbolo', 'par', 'pair', 'asset', 'activo', 'ticker', 
      'instrument', 'instrumento', 'security', 'item', 'market', 'mercado',
      'currency pair', 'forex pair', 'stock', 'crypto'
    ]);
    
    const direction = getValue([
      'direction', 'dirección', 'tipo', 'type', 'side', 'action', 'acción',
      'buy/sell', 'compra/venta', 'order type', 'trade type', 'position',
      'b/s', 'long/short'
    ]);
    
    const entryPrice = getValue([
      'entry', 'entrada', 'entry_price', 'entry price', 'precio_entrada', 'precio entrada',
      'open', 'apertura', 'open price', 'precio apertura', 'price', 'precio',
      'fill price', 'exec price', 'avg price', 'average price'
    ]);
    
    const exitPrice = getValue([
      'exit', 'salida', 'exit_price', 'exit price', 'precio_salida', 'precio salida',
      'close', 'cierre', 'close price', 'precio cierre', 'closing price'
    ]);
    
    const quantity = getValue([
      'quantity', 'cantidad', 'size', 'tamaño', 'lots', 'lotes', 'volume', 'volumen',
      'shares', 'acciones', 'units', 'unidades', 'contracts', 'contratos',
      'amount', 'qty', 'position size'
    ]);

    const pnl = getValue([
      'pnl', 'p&l', 'p/l', 'profit', 'ganancia', 'resultado', 'result', 
      'profit_loss', 'profit/loss', 'net profit', 'beneficio', 'return',
      'realized pnl', 'realized p/l', 'gross pnl'
    ]);
    
    const pnlPercentage = getValue([
      'pnl%', 'pnl_percentage', 'pnl percentage', 'porcentaje', 'return', 'retorno',
      '% return', 'return %', 'percentage', 'roi', '% profit', 'profit %'
    ]);
    
    const entryDate = getValue([
      'entry_date', 'entry date', 'fecha_entrada', 'fecha entrada', 'date', 'fecha',
      'open_date', 'open date', 'fecha_apertura', 'fecha apertura', 'time', 'datetime',
      'trade date', 'execution date', 'opened', 'start date'
    ]);
    
    const exitDate = getValue([
      'exit_date', 'exit date', 'fecha_salida', 'fecha salida', 
      'close_date', 'close date', 'fecha_cierre', 'fecha cierre',
      'closed', 'end date', 'closing date'
    ]);
    
    const strategy = getValue([
      'strategy', 'estrategia', 'setup', 'system', 'sistema', 'method',
      'trading system', 'approach', 'technique', 'pattern'
    ]);
    
    const notes = getValue([
      'notes', 'notas', 'comment', 'comentario', 'observation', 'observación',
      'remarks', 'description', 'descripción', 'details', 'memo'
    ]);
    
    const stopLoss = getValue([
      'stop_loss', 'stop loss', 'sl', 'stop', 'stoploss', 
      'stop price', 'stop level', 'protective stop'
    ]);
    
    const takeProfit = getValue([
      'take_profit', 'take profit', 'tp', 'target', 'objetivo',
      'profit target', 'target price', 'limit', 'take_profit_price'
    ]);

    // Validate required fields
    if (!symbol || !entryPrice) {
      return null;
    }

    // Determine direction
    const normalizedDirection = direction.toLowerCase();
    const isLong = ['long', 'buy', 'compra', 'largo', 'l', 'b', 'bought', 'comprar'].includes(normalizedDirection);
    const isShort = ['short', 'sell', 'venta', 'corto', 's', 'sold', 'vender'].includes(normalizedDirection);

    // If no direction specified, try to infer from P&L and prices
    let finalDirection: 'long' | 'short' = 'long';
    if (isShort) {
      finalDirection = 'short';
    } else if (!isLong && !isShort) {
      const entry = parseNumber(entryPrice);
      const exit = parseNumber(exitPrice);
      const profit = parseNumber(pnl);
      
      if (entry && exit && profit !== undefined) {
        // If profit is positive when exit > entry, it's long
        // If profit is positive when exit < entry, it's short
        if ((exit > entry && profit > 0) || (exit < entry && profit < 0)) {
          finalDirection = 'long';
        } else if ((exit < entry && profit > 0) || (exit > entry && profit < 0)) {
          finalDirection = 'short';
        }
      }
    }

    const parsedEntryPrice = parseNumber(entryPrice);
    if (!parsedEntryPrice) return null;

    return {
      symbol: symbol.toUpperCase().replace(/\s+/g, ''),
      direction: finalDirection,
      entryPrice: parsedEntryPrice,
      exitPrice: parseNumber(exitPrice),
      quantity: parseNumber(quantity) ?? 1,
      pnl: parseNumber(pnl),
      pnlPercentage: parseNumber(pnlPercentage),
      entryDate: parseDate(entryDate),
      exitDate: exitDate ? parseDate(exitDate) : undefined,
      strategy: strategy || undefined,
      notes: notes || undefined,
      stopLoss: parseNumber(stopLoss),
      takeProfit: parseNumber(takeProfit),
      assetClass: detectAssetClass(symbol),
    };
  };

  const importFromFile = useCallback(async (file: File): Promise<ParseResult> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv' || extension === 'txt') {
      const content = await file.text();
      return parseCSV(content);
    }

    if (extension === 'xlsx' || extension === 'xls') {
      const buffer = await file.arrayBuffer();
      return parseExcel(buffer);
    }

    return {
      trades: [],
      errors: [`Formato no soportado: .${extension}. Use CSV o Excel (.xlsx/.xls)`],
    };
  }, [parseCSV, parseExcel]);

  return { importFromFile };
}
