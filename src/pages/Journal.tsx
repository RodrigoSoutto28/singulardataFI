import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Image,
  Star,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Upload,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExportTrades } from '@/hooks/useExportTrades';
import { useImportTrades } from '@/hooks/useImportTrades';
import { useTrades, Trade } from '@/hooks/useTrades';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export default function Journal() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    symbol: '',
    direction: '' as 'long' | 'short' | '',
    entry_price: '',
    quantity: '',
    stop_loss: '',
    take_profit: '',
    strategy: '',
    entry_date: '',
    notes: '',
  });
  
  const { exportToExcel, exportToPDF, exportToHTML } = useExportTrades();
  const { importFromFile } = useImportTrades();
  const { trades, isLoading, createTrade, deleteTrade, importTrades } = useTrades();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.symbol
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPnl = filteredTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0);
  const closedTrades = filteredTrades.filter(t => t.status === 'closed');
  const winningTrades = closedTrades.filter((tr) => (tr.pnl ?? 0) > 0).length;
  const winRate = closedTrades.length > 0 
    ? (winningTrades / closedTrades.length * 100).toFixed(1)
    : '0';

  const handleExport = (format: 'excel' | 'pdf' | 'html') => {
    const filename = `trading-journal-${new Date().toISOString().split('T')[0]}`;
    
    // Convert trades to export format
    const exportData = filteredTrades.map(trade => ({
      id: trade.id,
      symbol: trade.symbol,
      direction: trade.direction,
      status: (trade.status === 'open' || trade.status === 'closed' ? trade.status : 'open') as 'open' | 'closed',
      entryPrice: Number(trade.entry_price),
      exitPrice: trade.exit_price ? Number(trade.exit_price) : undefined,
      quantity: Number(trade.quantity),
      pnl: trade.pnl ? Number(trade.pnl) : undefined,
      pnlPercentage: trade.pnl_percentage ? Number(trade.pnl_percentage) : undefined,
      entryDate: trade.entry_date,
      exitDate: trade.exit_date ?? undefined,
      strategy: trade.strategy ?? undefined,
      notes: trade.notes ?? undefined,
      rating: trade.rating ?? undefined,
      tags: trade.tags ?? undefined,
    }));
    
    try {
      switch (format) {
        case 'excel':
          exportToExcel(exportData, filename);
          toast.success(t.journal.exportSuccess?.replace('{format}', 'Excel') ?? 'Exported to Excel');
          break;
        case 'pdf':
          exportToPDF(exportData, filename);
          toast.success(t.journal.exportSuccess?.replace('{format}', 'PDF') ?? 'Exported to PDF');
          break;
        case 'html':
          exportToHTML(exportData, filename);
          toast.success(t.journal.exportSuccess?.replace('{format}', 'HTML') ?? 'Exported to HTML');
          break;
      }
    } catch (error) {
      toast.error(t.journal.exportError ?? 'Export failed');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(10);

    try {
      const result = await importFromFile(file);
      setImportProgress(50);
      
      if (result.errors.length > 0) {
        result.errors.slice(0, 3).forEach(error => toast.error(error));
      }
      
      if (result.trades.length > 0) {
        setImportProgress(70);
        
        // Convert imported trades to database format
        const dbTrades = result.trades.map(trade => ({
          symbol: trade.symbol,
          direction: trade.direction as 'long' | 'short',
          entry_price: trade.entryPrice,
          exit_price: trade.exitPrice ?? null,
          quantity: trade.quantity,
          pnl: trade.pnl ?? null,
          pnl_percentage: trade.pnlPercentage ?? null,
          entry_date: trade.entryDate,
          exit_date: trade.exitDate ?? null,
          strategy: trade.strategy ?? null,
          notes: trade.notes ?? null,
          stop_loss: trade.stopLoss ?? null,
          take_profit: trade.takeProfit ?? null,
          status: trade.exitDate ? 'closed' as const : 'open' as const,
        }));

        await importTrades.mutateAsync(dbTrades);
        setImportProgress(100);
        toast.success(t.journal.tradesImported?.replace('{count}', String(result.trades.length)) ?? `${result.trades.length} trades imported`);
      } else if (result.errors.length === 0) {
        toast.warning(t.journal.importError ?? 'No trades found in file');
      }
    } catch (error) {
      toast.error(t.journal.importError ?? 'Import failed');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.direction || !formData.entry_price || !formData.quantity) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    try {
      await createTrade.mutateAsync({
        symbol: formData.symbol.toUpperCase(),
        direction: formData.direction as 'long' | 'short',
        entry_price: parseFloat(formData.entry_price),
        quantity: parseFloat(formData.quantity),
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
        take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
        strategy: formData.strategy || null,
        entry_date: formData.entry_date || new Date().toISOString(),
        notes: formData.notes || null,
        status: 'open',
      });
      
      setIsAddTradeOpen(false);
      setFormData({
        symbol: '',
        direction: '',
        entry_price: '',
        quantity: '',
        stop_loss: '',
        take_profit: '',
        strategy: '',
        entry_date: '',
        notes: '',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteTrade = async (id: string) => {
    if (confirm('¿Eliminar esta operación?')) {
      await deleteTrade.mutateAsync(id);
    }
  };

  function TradeRow({ trade }: { trade: Trade }) {
    const isProfit = (trade.pnl ?? 0) >= 0;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors group gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg shrink-0',
              trade.direction === 'long' ? 'bg-success/10' : 'bg-destructive/10'
            )}
          >
            {trade.direction === 'long' ? (
              <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
            ) : (
              <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-base sm:text-lg">{trade.symbol}</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] h-5',
                  trade.status === 'open'
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground/50 text-muted-foreground'
                )}
              >
                {trade.status === 'open' ? t.journal.open.toUpperCase() : 'CLOSED'}
              </Badge>
              {trade.strategy && (
                <Badge variant="secondary" className="text-[10px] h-5 hidden sm:inline-flex">
                  {trade.strategy}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-1 flex-wrap">
              <span className="font-mono-numbers">
                {t.journal.entry}: ${Number(trade.entry_price).toLocaleString()}
              </span>
              {trade.exit_price && (
                <span className="font-mono-numbers hidden xs:inline">
                  {t.journal.exit}: ${Number(trade.exit_price).toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(trade.entry_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
          {trade.rating && (
            <div className="hidden md:flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3 sm:h-4 sm:w-4',
                    i < trade.rating!
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
          )}

          <div className="text-right min-w-[80px] sm:min-w-[100px]">
            <p
              className={cn(
                'text-base sm:text-lg font-bold font-mono-numbers',
                isProfit ? 'text-profit' : 'text-loss'
              )}
            >
              {trade.pnl !== null ? `${isProfit ? '+' : ''}$${Number(trade.pnl).toFixed(2)}` : '-'}
            </p>
            {trade.pnl_percentage !== null && (
              <p
                className={cn(
                  'text-[10px] sm:text-xs font-mono-numbers',
                  isProfit ? 'text-profit' : 'text-loss'
                )}
              >
                {isProfit ? '+' : ''}
                {Number(trade.pnl_percentage).toFixed(2)}%
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                {t.journal.viewDetails}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                {t.journal.editTrade}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image className="h-4 w-4 mr-2" />
                {t.journal.addScreenshot}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteTrade(trade.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.common.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{t.journal.title}</h1>
          <p className="text-sm text-muted-foreground">{t.journal.subtitle}</p>
        </div>

        <div className="flex flex-col xs:flex-row gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full xs:w-auto" disabled={trades.length === 0}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t.journal.export ?? 'Export'}</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2 text-success" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2 text-destructive" />
                PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')}>
                <FileCode className="h-4 w-4 mr-2 text-primary" />
                HTML (.html)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="gap-2 w-full xs:w-auto"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{t.journal.import ?? 'Import'}</span>
            <span className="sm:hidden">Import</span>
          </Button>

          <Dialog open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full xs:w-auto">
                <Plus className="h-4 w-4" />
                {t.journal.addTrade}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.journal.addNewTrade}</DialogTitle>
                <DialogDescription>
                  {t.journal.logNewTrade}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTrade} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.journal.symbol} *</Label>
                    <Input 
                      placeholder="EUR/USD" 
                      className="bg-muted/50"
                      value={formData.symbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.direction} *</Label>
                    <Select
                      value={formData.direction}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value as 'long' | 'short' }))}
                    >
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder={t.journal.selectDirection} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">{t.journal.long}</SelectItem>
                        <SelectItem value="short">{t.journal.short}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.entryPrice} *</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/50"
                      value={formData.entry_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_price: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.quantity} *</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0" 
                      className="bg-muted/50"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.stopLoss}</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/50"
                      value={formData.stop_loss}
                      onChange={(e) => setFormData(prev => ({ ...prev, stop_loss: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.takeProfit}</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/50"
                      value={formData.take_profit}
                      onChange={(e) => setFormData(prev => ({ ...prev, take_profit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.strategy}</Label>
                    <Input 
                      placeholder="e.g., Breakout" 
                      className="bg-muted/50"
                      value={formData.strategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.entryDate}</Label>
                    <Input 
                      type="datetime-local" 
                      className="bg-muted/50"
                      value={formData.entry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.journal.notes}</Label>
                  <Textarea
                    placeholder={t.journal.addNotesPlaceholder}
                    className="bg-muted/50 min-h-[100px]"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTradeOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    {t.common.cancel}
                  </Button>
                  <Button 
                    type="submit" 
                    variant="glow" 
                    className="w-full sm:w-auto"
                    disabled={createTrade.isPending}
                  >
                    {createTrade.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {t.journal.addTrade}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Progress */}
      {isImporting && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Importando operaciones...</p>
          <Progress value={importProgress} className="h-2" />
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border">
          <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{t.journal.totalTrades}</p>
          <p className="text-lg sm:text-2xl font-bold font-mono-numbers">{filteredTrades.length}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border">
          <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{t.journal.winRate}</p>
          <p className="text-lg sm:text-2xl font-bold font-mono-numbers text-primary">{winRate}%</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border">
          <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{t.journal.totalPnl}</p>
          <p className={cn(
            'text-lg sm:text-2xl font-bold font-mono-numbers',
            totalPnl >= 0 ? 'text-profit' : 'text-loss'
          )}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.journal.searchSymbol}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-muted/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t.journal.filterStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.journal.allTrades}</SelectItem>
            <SelectItem value="open">{t.journal.open}</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades List */}
      <div className="space-y-2 sm:space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeRow key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.journal.noTradesFound}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Importa un archivo CSV/Excel o agrega tu primera operación
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsAddTradeOpen(true)}
            >
              {t.journal.addFirstTrade}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
