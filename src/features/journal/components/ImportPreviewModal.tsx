import { useState, useEffect } from 'react';
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
  Building2,
  Link2,
  XCircle,
  Files,
  ChevronDown,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import type { ParseMetadata, FileParseResult } from '../hooks/useImportTrades';
import { FIELD_LABELS } from '../hooks/useImportTrades';

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
  sourceFile?: string;
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
  perFileReports?: FileParseResult[];
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
  perFileReports,
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

  // Reset selection when trades change (proper effect — no setState during render)
  useEffect(() => {
    if (trades.length > 0 && selectedIndices.size === 0) {
      setSelectedIndices(new Set(trades.map((_, i) => i)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades]);

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

            {metadata?.brokerDetected && (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-2 rounded-lg">
                <Building2 className="h-4 w-4 text-primary" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Broker detectado</span>
                  <span className="text-sm font-bold text-primary uppercase tracking-wide">
                    {metadata.brokerDetected === 'generic' ? 'Genérico' : metadata.brokerDetected}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* ───── Detection Report ───── */}
        {metadata && (
          <div className="px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                Reporte de Detección
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Delimitador</p>
                <p className="text-sm font-mono text-emerald-400 mt-0.5">"{metadata.delimiter || ','}"</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fila Encabezado</p>
                <p className="text-sm font-mono text-emerald-400 mt-0.5">#{metadata.headerRowIndex !== undefined ? metadata.headerRowIndex + 1 : 1}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Filas Válidas</p>
                <p className="text-sm font-mono text-emerald-400 mt-0.5">{metadata.validRows}/{metadata.totalRows}</p>
              </div>
              <div className={cn(
                "border rounded-lg p-2.5",
                duplicatePositionIds.length > 0
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : 'border-emerald-500/30 bg-emerald-500/5'
              )}>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Duplicados</p>
                <p className={cn(
                  "text-sm font-mono mt-0.5",
                  duplicatePositionIds.length > 0 ? 'text-amber-300' : 'text-emerald-300'
                )}>
                  {duplicatePositionIds.length > 0 ? `${duplicatePositionIds.length} encontrados` : 'Ninguno'}
                </p>
              </div>
            </div>
            {fileHash && (
              <div className="flex items-center gap-2 mt-3 text-[11px]">
                <Hash className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="text-slate-500 font-bold uppercase tracking-wider">SHA-256:</span>
                <span className="font-mono text-emerald-300 truncate" title={fileHash}>
                  {fileHash.slice(0, 16)}…{fileHash.slice(-8)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ───── Field Mapping ───── */}
        {metadata && (Object.keys(metadata.columnMapping).length > 0 || metadata.missingColumns.length > 0) && (
          <Collapsible defaultOpen className="border-b border-slate-800">
            <CollapsibleTrigger className="w-full px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                  Mapeo de Campos
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({Object.keys(metadata.columnMapping).length} mapeados
                  {metadata.missingColumns.length > 0 && `, ${metadata.missingColumns.length} faltantes`})
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-6 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.entries(metadata.columnMapping).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-md px-2.5 py-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-slate-300 font-medium">
                        {FIELD_LABELS[key as keyof typeof FIELD_LABELS] ?? key}
                      </span>
                      <span className="text-slate-600 text-[10px]">←</span>
                      <span className="text-[11px] font-mono text-emerald-300 truncate" title={value}>
                        "{value}"
                      </span>
                    </div>
                  ))}
                  {metadata.missingColumns.map((field) => (
                    <div key={field} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-md px-2.5 py-1.5">
                      <XCircle className="h-3 w-3 text-amber-400 shrink-0" />
                      <span className="text-[11px] text-amber-200 font-medium">{field}</span>
                      <span className="text-[10px] text-amber-500/70 italic ml-auto">no encontrado</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ───── Unmapped Headers ───── */}
        {metadata && (
          <Collapsible className="border-b border-slate-800">
            <CollapsibleTrigger className="w-full px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                  Encabezados Sin Mapear
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({metadata.unmappedHeaders?.length ?? 0})
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-6 pb-4">
                {metadata.unmappedHeaders && metadata.unmappedHeaders.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {metadata.unmappedHeaders.map((h) => (
                      <Badge key={h} variant="outline" className="border-slate-700 bg-slate-800/60 text-slate-400 font-mono text-[10px]">
                        {h}
                      </Badge>
                    ))}
                    <p className="w-full text-[10px] text-slate-500 italic mt-2">
                      Estas columnas existen en el archivo pero no se importaron al diario.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-400/80">Todos los encabezados fueron reconocidos.</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ───── Per-File Report (multi-file mode) ───── */}
        {perFileReports && perFileReports.length > 1 && (
          <Collapsible defaultOpen className="border-b border-slate-800">
            <CollapsibleTrigger className="w-full px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
              <div className="flex items-center gap-2">
                <Files className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                  Reporte por Archivo
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({perFileReports.length} archivos)
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-6 pb-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Archivo</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Broker</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Trades</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Válidas/Total</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Ignoradas</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Faltantes</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Sin mapear</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perFileReports.map((f) => {
                      const m = f.metadata;
                      const broker = m?.brokerDetected ?? 'generic';
                      const missing = m?.missingColumns ?? [];
                      const unmapped = m?.unmappedHeaders ?? [];
                      const hasErrors = f.errors.length > 0;
                      return (
                        <TableRow key={f.fileName} className="border-slate-800/50 hover:bg-slate-800/40">
                          <TableCell className="font-medium text-slate-200 text-xs truncate max-w-[180px]" title={f.fileName}>
                            {hasErrors && <AlertCircle className="h-3 w-3 text-rose-400 inline mr-1" />}
                            {f.fileName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-mono text-[10px] uppercase">
                              {broker === 'generic' ? 'Genérico' : broker}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-white">{f.trades.length}</TableCell>
                          <TableCell className="text-right font-mono text-xs text-emerald-400">
                            {m ? `${m.validRows}/${m.totalRows}` : '—'}
                          </TableCell>
                          <TableCell className={cn(
                            "text-right font-mono text-xs",
                            (m?.ignoredRows ?? 0) > 0 ? 'text-amber-400' : 'text-slate-500'
                          )}>
                            {m?.ignoredRows ?? 0}
                          </TableCell>
                          <TableCell className="text-[10px] text-amber-300/90">
                            {missing.length > 0 ? missing.join(', ') : <span className="text-slate-600">—</span>}
                          </TableCell>
                          <TableCell className="text-[10px] text-slate-400 font-mono max-w-[160px] truncate" title={unmapped.join(', ')}>
                            {unmapped.length > 0 ? unmapped.slice(0, 3).join(', ') + (unmapped.length > 3 ? ` +${unmapped.length - 3}` : '') : <span className="text-slate-600">—</span>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'trades' | 'raw')} className="flex-1 flex flex-col overflow-hidden">
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
                      {perFileReports && perFileReports.length > 1 && (
                        <TableHead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-900">Origen</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-slate-900/50">
                    {trades.map((trade, index) => {
                      const isSelected = selectedIndices.has(index);
                      const isProfit = (trade.pnl ?? 0) >= 0;
                      const isDup = isDuplicateRow(index);

                      return (
                        <TableRow
                          key={index}
                          className={cn(
                            'cursor-pointer transition-colors border-slate-800/50',
                            isDup && 'bg-amber-500/5',
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
                          <TableCell className="font-bold text-white tracking-tight">
                            <div className="flex items-center gap-2">
                              {trade.symbol}
                              {isDup && (
                                <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-[9px] uppercase tracking-wider">
                                  Duplicado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
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
                          {perFileReports && perFileReports.length > 1 && (
                            <TableCell className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" title={trade.sourceFile}>
                              {trade.sourceFile ? (
                                <Badge variant="outline" className="border-slate-700 bg-slate-800/60 text-slate-300 font-mono text-[9px]">
                                  {trade.sourceFile}
                                </Badge>
                              ) : <span className="text-slate-600">—</span>}
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

