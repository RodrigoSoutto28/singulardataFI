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
}

interface ParseResult {
  trades: ImportedTrade[];
  errors: string[];
}

export function useImportTrades() {
  const parseCSV = useCallback((content: string): ParseResult => {
    const lines = content.trim().split('\n');
    const trades: ImportedTrade[] = [];
    const errors: string[] = [];
    
    if (lines.length < 2) {
      return { trades: [], errors: ['El archivo está vacío o no tiene datos'] };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
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
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: unknown[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

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
        if (!Array.isArray(row)) continue;
        
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
        const index = headers.findIndex(h => h.includes(name));
        if (index !== -1 && values[index]) {
          return values[index];
        }
      }
      return '';
    };

    const symbol = getValue(['symbol', 'símbolo', 'par', 'pair', 'asset', 'activo', 'ticker']);
    const direction = getValue(['direction', 'dirección', 'tipo', 'type', 'side']);
    const entryPrice = getValue(['entry', 'entrada', 'entry_price', 'precio_entrada', 'open', 'apertura']);
    const quantity = getValue(['quantity', 'cantidad', 'size', 'tamaño', 'lots', 'lotes', 'volume', 'volumen']);

    if (!symbol || !entryPrice) {
      return null;
    }

    const normalizedDirection = direction.toLowerCase();
    const isLong = ['long', 'buy', 'compra', 'largo', 'l'].includes(normalizedDirection);
    const isShort = ['short', 'sell', 'venta', 'corto', 's'].includes(normalizedDirection);

    return {
      symbol: symbol.toUpperCase(),
      direction: isShort ? 'short' : 'long',
      entryPrice: parseFloat(entryPrice) || 0,
      exitPrice: parseFloat(getValue(['exit', 'salida', 'exit_price', 'precio_salida', 'close', 'cierre'])) || undefined,
      quantity: parseFloat(quantity) || 1,
      pnl: parseFloat(getValue(['pnl', 'profit', 'ganancia', 'resultado', 'result', 'profit_loss'])) || undefined,
      pnlPercentage: parseFloat(getValue(['pnl%', 'pnl_percentage', 'porcentaje', 'return', 'retorno'])) || undefined,
      entryDate: getValue(['entry_date', 'fecha_entrada', 'date', 'fecha', 'open_date', 'fecha_apertura']) || new Date().toISOString(),
      exitDate: getValue(['exit_date', 'fecha_salida', 'close_date', 'fecha_cierre']) || undefined,
      strategy: getValue(['strategy', 'estrategia', 'setup']) || undefined,
      notes: getValue(['notes', 'notas', 'comment', 'comentario', 'observation', 'observación']) || undefined,
      stopLoss: parseFloat(getValue(['stop_loss', 'sl', 'stop'])) || undefined,
      takeProfit: parseFloat(getValue(['take_profit', 'tp', 'target', 'objetivo'])) || undefined,
    };
  };

  const importFromFile = useCallback(async (file: File): Promise<ParseResult> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
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
