import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Hash,
  Scissors,
  Rows,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { ParseMetadata } from '../hooks/useImportTrades';

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

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: ImportedTrade[];
  errors: string[];
  metadata?: ParseMetadata | null;
  rawRows?: string[][];
  fileName: string;
  fileHash?: string;
  duplicatePositionIds?: string[];
  onConfirm: (selectedTrades: ImportedTrade[]) => void;
  isImporting: boolean;
}

export function ImportPreviewModal({
  isOpen,
  onClose,
  trades,
  errors,
  metadata,
  rawRows = [],
  fileName,
  fileHash,
  duplicatePositionIds = [],
  onConfirm,
  isImporting,
}: ImportPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'trades' | 'raw'>('trades');
  const dupSet = new Set(duplicatePositionIds);
  const tradePositionIds = trades.map(
    (t) => t.notes?.match(/cTrader Position #(\d+)/)?.[1] ?? null,
  );
  const isDuplicateRow = (i: number) => {
    const id = tradePositionIds[i];
    return id !== null && dupSet.has(id);
  };
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(trades.map((_, i) => i).filter((i) => !isDuplicateRow(i)))
  );

  const toggleAll = () => {
    if (selectedIndices.size === trades.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(trades.map((_, i) => i)));
    }
  };

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const handleConfirm = () => {
    const selectedTrades = trades.filter((_, i) => selectedIndices.has(i));
    onConfirm(selectedTrades);
  };

  const totalPnl = trades
    .filter((_, i) => selectedIndices.has(i))
    .reduce((sum, t) => sum + (t.pnl ?? 0), 0);

  const winningTrades = trades.filter(
    (t, i) => selectedIndices.has(i) && (t.pnl ?? 0) > 0
  ).length;
  const losingTrades = trades.filter(
    (t, i) => selectedIndices.has(i) && (t.pnl ?? 0) < 0
  ).length;

  // Reset selection when trades change
  if (trades.length > 0 && selectedIndices.size === 0) {
    setSelectedIndices(new Set(trades.map((_, i) => i)));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-5xl w-screen sm:w-auto h-[100dvh] sm:h-auto sm:max-h-[95vh] flex flex-col p-0 rounded-none sm:rounded-xl border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-2xl">
        <DialogHeader className="px-4 sm:px-6 pt-5 pb-5 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 shadow-inner">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-white">
                  Vista Previa de Importación
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-400 font-medium">
                  {fileName}
                </DialogDescription>
              </div>
            </div>

            {/* Header Metadata Summary */}
            {metadata && (
              <div className="flex items-center gap-4 bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                <div className="flex flex-col px-3 border-r border-slate-700">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Delimitador</span>
                  <span className="text-sm font-mono text-emerald-400">"{metadata.delimiter || ','}"</span>
                </div>
                <div className="flex flex-col px-3 border-r border-slate-700">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fila Encabezado</span>
                  <span className="text-sm font-mono text-emerald-400">#{metadata.headerRowIndex !== undefined ? metadata.headerRowIndex + 1 : 1}</span>
                </div>
                <div className="flex flex-col px-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Calidad</span>
                  <span className="text-sm font-mono text-emerald-400">{metadata.validRows}/{metadata.totalRows} filas</span>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Anti-duplicate validation panel — file hash + Position ID cross-check */}
        {(fileHash || duplicatePositionIds.length > 0) && (
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/40">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {fileHash && (
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                      Hash SHA-256 del archivo (verificado)
                    </p>
                    <p className="text-[11px] font-mono text-emerald-300 truncate" title={fileHash}>
                      {fileHash.slice(0, 16)}…{fileHash.slice(-8)}
                    </p>
                  </div>
                </div>
              )}
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-1.5',
                  duplicatePositionIds.length > 0
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'border-emerald-500/30 bg-emerald-500/5'
                )}
              >
                {duplicatePositionIds.length > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
                <span
                  className={cn(
                    'text-xs font-semibold',
                    duplicatePositionIds.length > 0 ? 'text-amber-300' : 'text-emerald-300'
                  )}
                >
                  {duplicatePositionIds.length > 0
                    ? `${duplicatePositionIds.length} Position ID ya existen — desmarcados`
                    : 'Position IDs verificados sin duplicados'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Missing Columns Warning */}
        {metadata && metadata.missingColumns.length > 0 && (
          <div className="px-6 py-4 bg-amber-500/10 border-b border-amber-500/30">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-amber-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-500 uppercase tracking-wide">
                  Columnas Faltantes Detectadas
                </p>
                <p className="text-xs text-amber-500/90 leading-relaxed">
                  Para un análisis completo, se recomienda incluir: <span className="font-bold">{metadata.missingColumns.join(', ')}</span>. 
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {Object.entries(metadata.columnMapping).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {key}: <span className="text-amber-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p className="text-2xl font-bold text-white font-mono-numbers leading-tight">
                {selectedIndices.size}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">
                Seleccionados
              </p>
            </div>
            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-400 font-mono-numbers leading-tight">{winningTrades}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-500/70 mt-1">
                Ganadores
              </p>
            </div>
            <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/20 text-center">
              <p className="text-2xl font-bold text-rose-400 font-mono-numbers leading-tight">{losingTrades}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-rose-500/70 mt-1">
                Perdedores
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
              <p
                className={cn(
                  'text-2xl font-bold font-mono-numbers leading-tight',
                  totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-1">
                P&L Total
              </p>
            </div>
          </div>
        </div>

        {/* Ignored Rows Summary */}
        {metadata && metadata.ignoredRows > 0 && (
          <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-slate-400 shrink-0" />
                <p className="text-xs text-slate-400">
                  Se ignoraron <span className="font-bold text-slate-200">{metadata.ignoredRows}</span> filas (sumarios, vacías o inválidas).
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('raw')}
                className="text-[10px] uppercase font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Ver Estructura Original
              </button>
            </div>
          </div>
        )}

        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="px-6 py-3 bg-rose-500/5 border-b border-rose-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-500 uppercase tracking-wide">
                  Errores de Importación
                </p>
                <ul className="text-xs text-rose-400 space-y-1">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 bg-rose-500 rounded-full" />
                      {error}
                    </li>
                  ))}
                  {errors.length > 5 && (
                    <li className="font-bold pl-2.5">
                      +{errors.length - 5} errores más
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/50">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 h-9 p-1">
              <TabsTrigger value="trades" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Trades Validados ({trades.length})
              </TabsTrigger>
              <TabsTrigger value="raw" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Estructura CSV (Raw)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="trades" className="flex-1 m-0 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="min-w-full inline-block align-middle px-6">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 shadow-sm">
                    <TableRow className="hover:bg-transparent border-slate-700">
                      <TableHead className="w-12 bg-slate-900">
                        <Checkbox
                          checked={selectedIndices.size === trades.length}
                          onCheckedChange={toggleAll}
                          aria-label="Select all"
                          className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900">Símbolo</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900">Dirección</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 text-right">Entrada</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 text-right">Salida</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 text-right">Volumen</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900 text-right">P&L</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-slate-900/50">
                    {trades.map((trade, index) => {
                      const isSelected = selectedIndices.has(index);
                      const isProfit = (trade.pnl ?? 0) >= 0;

                      return (
                        <TableRow
                          key={index}
                          className={cn(
                            'cursor-pointer transition-colors border-slate-800/50',
                            !isSelected ? 'opacity-40 grayscale-[0.5]' : 'hover:bg-slate-800/60'
                          )}
                          onClick={() => toggleRow(index)}
                        >
                          <TableCell className="px-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleRow(index)}
                              onClick={(e) => e.stopPropagation()}
                              className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                          </TableCell>
                          <TableCell className="font-bold text-white tracking-tight">{trade.symbol}</TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                                trade.direction === 'long'
                                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                  : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                              )}
                            >
                              {trade.direction === 'long' ? (
                                <ArrowUpRight className="h-2.5 w-2.5 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-2.5 w-2.5 mr-1" />
                              )}
                              {trade.direction}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-slate-300">
                            ${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-mono text-slate-300">
                            {trade.exitPrice
                              ? `$${trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : <span className="text-slate-600">—</span>}
                          </TableCell>
                          <TableCell className="text-right font-mono text-slate-300">
                            {trade.quantity}
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-mono font-bold',
                              trade.pnl !== undefined
                                ? isProfit
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                                : 'text-slate-600'
                            )}
                          >
                            {trade.pnl !== undefined
                              ? `${isProfit ? '+' : ''}$${trade.pnl.toFixed(2)}`
                              : '—'}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 font-mono">
                            {new Date(trade.entryDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="raw" className="flex-1 m-0 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="min-w-full inline-block align-middle px-6 py-4">
                <Table className="border-collapse">
                  <TableBody>
                    {rawRows.map((row, idx) => {
                      const isHeader = metadata?.headerRowIndex === idx;
                      const rowNum = idx + 1;
                      const ignoredRow = metadata?.ignoredDetails.find(d => d.row === rowNum);
                      const isIgnored = !!ignoredRow && !isHeader;

                      return (
                        <TableRow 
                          key={idx} 
                          className={cn(
                            'border-slate-800/50 hover:bg-slate-800/30 transition-colors',
                            isHeader && 'bg-slate-800 border-y-2 border-slate-700 shadow-sm z-20',
                            isIgnored && 'bg-rose-500/5 hover:bg-rose-500/10'
                          )}
                          title={ignoredRow?.reason}
                        >
                          <TableCell className="w-10 text-[10px] text-slate-600 font-mono text-center border-r border-slate-800">
                            {rowNum}
                          </TableCell>
                          {row.map((cell, cIdx) => (
                            <TableCell 
                              key={cIdx} 
                              className={cn(
                                'px-3 py-2 text-xs font-mono whitespace-nowrap',
                                isHeader ? 'font-bold text-white uppercase' : 'text-slate-400',
                                !isHeader && cell === '' && 'bg-slate-800/20',
                                isIgnored && 'text-rose-400/70'
                              )}
                            >
                              {cell}
                            </TableCell>
                          ))}
                          {isIgnored && (
                            <TableCell className="text-[10px] text-rose-500 font-medium px-4 italic whitespace-nowrap">
                              {ignoredRow.reason}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-4 sm:px-6 py-4 border-t border-slate-800 bg-slate-900/80 shrink-0 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-slate-400 font-medium">
                <span className="text-white font-bold">{selectedIndices.size}</span> trades listos para procesar
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                disabled={isImporting}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedIndices.size === 0 || isImporting}
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/20 px-6 h-11 rounded-xl"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar Importación
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

