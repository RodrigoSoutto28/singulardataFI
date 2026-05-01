import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';

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
  fileName: string;
  onConfirm: (selectedTrades: ImportedTrade[]) => void;
  isImporting: boolean;
}

export function ImportPreviewModal({
  isOpen,
  onClose,
  trades,
  errors,
  fileName,
  onConfirm,
  isImporting,
}: ImportPreviewModalProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(trades.map((_, i) => i))
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
      <DialogContent className="max-w-[100vw] sm:max-w-4xl w-screen sm:w-auto h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 rounded-none sm:rounded-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                Vista Previa de Importación
              </DialogTitle>
              <DialogDescription className="text-sm">
                {fileName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {selectedIndices.size}
              </p>
              <p className="text-xs text-muted-foreground">
                Trades Seleccionados
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{winningTrades}</p>
              <p className="text-xs text-muted-foreground">
                Ganadores
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{losingTrades}</p>
              <p className="text-xs text-muted-foreground">
                Perdedores
              </p>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  'text-2xl font-bold font-mono-numbers',
                  totalPnl >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                P&L Total
              </p>
            </div>
          </div>
        </div>

        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="px-6 py-3 bg-destructive/5 border-b border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Errores de Importación
                </p>
                <ul className="text-xs text-destructive/80 space-y-0.5">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li className="font-medium">
                      +{errors.length - 5} errores más
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Trades Table */}
        <ScrollArea className="flex-1 px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIndices.size === trades.length}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">
                  Entrada
                </TableHead>
                <TableHead className="text-right">
                  Salida
                </TableHead>
                <TableHead className="text-right">
                  Cantidad
                </TableHead>
                <TableHead className="text-right">
                  P&L
                </TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, index) => {
                const isSelected = selectedIndices.has(index);
                const isProfit = (trade.pnl ?? 0) >= 0;

                return (
                  <TableRow
                    key={index}
                    className={cn(
                      'cursor-pointer transition-colors',
                      !isSelected && 'opacity-50'
                    )}
                    onClick={() => toggleRow(index)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          trade.direction === 'long'
                            ? 'border-success/50 text-success bg-success/5'
                            : 'border-destructive/50 text-destructive bg-destructive/5'
                        )}
                      >
                        {trade.direction === 'long' ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {trade.direction.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono-numbers">
                      ${trade.entryPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono-numbers">
                      {trade.exitPrice
                        ? `$${trade.exitPrice.toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono-numbers">
                      {trade.quantity}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono-numbers font-medium',
                        trade.pnl !== undefined
                          ? isProfit
                            ? 'text-success'
                            : 'text-destructive'
                          : 'text-muted-foreground'
                      )}
                    >
                      {trade.pnl !== undefined
                        ? `${isProfit ? '+' : ''}$${trade.pnl.toFixed(2)}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(trade.entryDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between w-full gap-4">
            <p className="text-sm text-muted-foreground">
              {selectedIndices.size} de {trades.length} trades seleccionados
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isImporting}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedIndices.size === 0 || isImporting}
                className="gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importando...
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
