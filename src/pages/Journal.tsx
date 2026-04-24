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
  TrendingUp,
  BarChart3,
  DollarSign,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExportTrades } from '@/hooks/useExportTrades';
import { useImportTrades } from '@/hooks/useImportTrades';
import { useTrades, Trade } from '@/hooks/useTrades';
import { toast } from 'sonner';
import { ImportPreviewModal } from '@/components/journal/ImportPreviewModal';

// Types for import preview
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

export default function Journal() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Import preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTrades, setPreviewTrades] = useState<ImportedTrade[]>([]);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [previewFileName, setPreviewFileName] = useState('');

  // Form state
  const emptyForm = {
    symbol: '',
    direction: '' as 'long' | 'short' | '',
    entry_price: '',
    quantity: '',
    stop_loss: '',
    take_profit: '',
    strategy: '',
    entry_date: '',
    exit_price: '',
    exit_date: '',
    pnl: '',
    pnl_percentage: '',
    status: 'open' as 'open' | 'closed',
    notes: '',
  };
  const [formData, setFormData] = useState(emptyForm);

  const { exportToExcel, exportToPDF, exportToHTML } = useExportTrades();
  const { importFromFile } = useImportTrades();
  const { trades, isLoading, createTrade, updateTrade, deleteTrade, importTrades } = useTrades();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingTrade(null);
  };

  const openEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    const toLocal = (iso?: string | null) =>
      iso ? new Date(iso).toISOString().slice(0, 16) : '';
    setFormData({
      symbol: trade.symbol ?? '',
      direction: (trade.direction as 'long' | 'short') ?? '',
      entry_price: trade.entry_price?.toString() ?? '',
      quantity: trade.quantity?.toString() ?? '',
      stop_loss: trade.stop_loss?.toString() ?? '',
      take_profit: trade.take_profit?.toString() ?? '',
      strategy: trade.strategy ?? '',
      entry_date: toLocal(trade.entry_date),
      exit_price: trade.exit_price?.toString() ?? '',
      exit_date: toLocal(trade.exit_date),
      pnl: trade.pnl?.toString() ?? '',
      pnl_percentage: trade.pnl_percentage?.toString() ?? '',
      status: (trade.status as 'open' | 'closed') ?? 'open',
      notes: trade.notes ?? '',
    });
    setIsAddTradeOpen(true);
  };

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
  const losingTrades = closedTrades.filter((tr) => (tr.pnl ?? 0) < 0).length;
  const winRate = closedTrades.length > 0 
    ? (winningTrades / closedTrades.length * 100).toFixed(1)
    : '0.0';

  const handleExport = (format: 'excel' | 'pdf' | 'html') => {
    const filename = `trading-journal-${new Date().toISOString().split('T')[0]}`;
    
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

  // Handle file selection - opens preview modal
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importFromFile(file);
      
      if (result.trades.length > 0 || result.errors.length > 0) {
        setPreviewTrades(result.trades);
        setPreviewErrors(result.errors);
        setPreviewFileName(file.name);
        setPreviewOpen(true);
      } else {
        toast.warning(t.journal.importError ?? 'No trades found in file');
      }
    } catch (error) {
      toast.error(t.journal.importError ?? 'Import failed');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Confirm import from preview modal
  const handleConfirmImport = async (selectedTrades: ImportedTrade[]) => {
    if (selectedTrades.length === 0) return;

    setIsImporting(true);

    try {
      const dbTrades = selectedTrades.map(trade => ({
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
      toast.success(t.journal.tradesImported?.replace('{count}', String(selectedTrades.length)) ?? `${selectedTrades.length} trades imported`);
      setPreviewOpen(false);
      setPreviewTrades([]);
      setPreviewErrors([]);
    } catch (error) {
      toast.error(t.journal.importError ?? 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol || !formData.direction || !formData.entry_price || !formData.quantity) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const num = (v: string) => (v.trim() === '' ? null : parseFloat(v));
    const exitDateIso = formData.exit_date ? new Date(formData.exit_date).toISOString() : null;
    const status: 'open' | 'closed' = formData.status || (exitDateIso ? 'closed' : 'open');

    const payload = {
      symbol: formData.symbol.toUpperCase(),
      direction: formData.direction as 'long' | 'short',
      entry_price: parseFloat(formData.entry_price),
      quantity: parseFloat(formData.quantity),
      stop_loss: num(formData.stop_loss),
      take_profit: num(formData.take_profit),
      strategy: formData.strategy || null,
      entry_date: formData.entry_date
        ? new Date(formData.entry_date).toISOString()
        : new Date().toISOString(),
      exit_price: num(formData.exit_price),
      exit_date: exitDateIso,
      pnl: num(formData.pnl),
      pnl_percentage: num(formData.pnl_percentage),
      notes: formData.notes || null,
      status,
    };

    try {
      if (editingTrade) {
        await updateTrade.mutateAsync({ id: editingTrade.id, ...payload });
      } else {
        await createTrade.mutateAsync(payload);
      }
      setIsAddTradeOpen(false);
      resetForm();
    } catch (error) {
      // handled by mutation
    }
  };

  const handleDeleteTrade = async (id: string) => {
    if (confirm('¿Eliminar esta operación?')) {
      await deleteTrade.mutateAsync(id);
    }
  };

  function TradeRow({ trade, index }: { trade: Trade; index: number }) {
    const isProfit = (trade.pnl ?? 0) >= 0;

    return (
      <div 
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-card border border-border",
          "trade-row stagger-item group"
        )}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center h-11 w-11 rounded-lg shrink-0 transition-transform hover:scale-105',
              trade.direction === 'long' ? 'bg-success/10' : 'bg-destructive/10'
            )}
          >
            {trade.direction === 'long' ? (
              <ArrowUpRight className="h-5 w-5 text-success" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-destructive" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{trade.symbol}</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] h-5 uppercase font-medium',
                  trade.status === 'open'
                    ? 'border-primary/50 text-primary bg-primary/5'
                    : 'border-muted-foreground/30 text-muted-foreground bg-muted/50'
                )}
              >
                {trade.status === 'open' ? 'Open' : 'Closed'}
              </Badge>
              {trade.strategy && (
                <Badge variant="secondary" className="text-[10px] h-5 hidden sm:inline-flex">
                  {trade.strategy}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
              <span className="font-mono-numbers">
                Entry: ${Number(trade.entry_price).toLocaleString()}
              </span>
              {trade.exit_price && (
                <span className="font-mono-numbers hidden sm:inline">
                  Exit: ${Number(trade.exit_price).toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(trade.entry_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0 pl-15 sm:pl-0">
          {trade.rating && (
            <div className="hidden md:flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < trade.rating!
                      ? 'fill-warning text-warning'
                      : 'text-muted-foreground/20'
                  )}
                />
              ))}
            </div>
          )}

          <div className="text-right min-w-[90px]">
            <p
              className={cn(
                'text-lg font-bold font-mono-numbers',
                isProfit ? 'text-profit' : 'text-loss'
              )}
            >
              {trade.pnl !== null ? `${isProfit ? '+' : ''}$${Number(trade.pnl).toFixed(2)}` : '-'}
            </p>
            {trade.pnl_percentage !== null && (
              <p
                className={cn(
                  'text-xs font-mono-numbers',
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Eye className="h-4 w-4" />
                {t.journal.viewDetails}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Pencil className="h-4 w-4" />
                {t.journal.editTrade}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Image className="h-4 w-4" />
                {t.journal.addScreenshot}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive gap-2"
                onClick={() => handleDeleteTrade(trade.id)}
              >
                <Trash2 className="h-4 w-4" />
                {t.common.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.journal.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t.journal.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 btn-press"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {t.journal.import ?? 'Import'}
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 btn-press" disabled={trades.length === 0}>
                <Download className="h-4 w-4" />
                {t.journal.export ?? 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
                <FileSpreadsheet className="h-4 w-4 text-success" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                <FileText className="h-4 w-4 text-destructive" />
                PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')} className="gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                HTML (.html)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Trade Dialog */}
          <Dialog open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 btn-press">
                <Plus className="h-4 w-4" />
                {t.journal.addTrade}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.journal.addNewTrade}</DialogTitle>
                <DialogDescription>
                  {t.journal.logNewTrade}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTrade} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.symbol} *</Label>
                    <Input 
                      placeholder="EUR/USD" 
                      className="bg-muted/30"
                      value={formData.symbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.direction} *</Label>
                    <Select
                      value={formData.direction}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value as 'long' | 'short' }))}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder={t.journal.selectDirection} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">{t.journal.long}</SelectItem>
                        <SelectItem value="short">{t.journal.short}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.entryPrice} *</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/30"
                      value={formData.entry_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_price: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.quantity} *</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0" 
                      className="bg-muted/30"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.stopLoss}</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/30"
                      value={formData.stop_loss}
                      onChange={(e) => setFormData(prev => ({ ...prev, stop_loss: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.takeProfit}</Label>
                    <Input 
                      type="number" 
                      step="any" 
                      placeholder="0.00" 
                      className="bg-muted/30"
                      value={formData.take_profit}
                      onChange={(e) => setFormData(prev => ({ ...prev, take_profit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.strategy}</Label>
                    <Input 
                      placeholder="e.g., Breakout" 
                      className="bg-muted/30"
                      value={formData.strategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.journal.entryDate}</Label>
                    <Input 
                      type="datetime-local" 
                      className="bg-muted/30"
                      value={formData.entry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t.journal.notes}</Label>
                  <Textarea
                    placeholder={t.journal.addNotesPlaceholder}
                    className="bg-muted/30 min-h-[80px] resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTradeOpen(false)}
                  >
                    {t.common.cancel}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTrade.isPending}
                    className="btn-press"
                  >
                    {createTrade.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {t.journal.addTrade}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Preview Modal */}
      <ImportPreviewModal
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewTrades([]);
          setPreviewErrors([]);
        }}
        trades={previewTrades}
        errors={previewErrors}
        fileName={previewFileName}
        onConfirm={handleConfirmImport}
        isImporting={isImporting}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-card border border-border stat-card hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {t.journal.totalTrades}
            </span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers">{filteredTrades.length}</p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border stat-card hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {t.journal.winRate}
            </span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers text-success">{winRate}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {winningTrades}W / {losingTrades}L
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border stat-card hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-1.5 rounded-md", totalPnl >= 0 ? "bg-profit/10" : "bg-loss/10")}>
              <DollarSign className={cn("h-4 w-4", totalPnl >= 0 ? "text-profit" : "text-loss")} />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {t.journal.totalPnl}
            </span>
          </div>
          <p className={cn(
            'text-2xl font-bold font-mono-numbers',
            totalPnl >= 0 ? 'text-profit' : 'text-loss'
          )}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border stat-card hover-lift">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Open Positions
            </span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers">
            {filteredTrades.filter(t => t.status === 'open').length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.journal.searchSymbol}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-muted/30">
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
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading trades...</p>
          </div>
        ) : filteredTrades.length > 0 ? (
          filteredTrades.map((trade, index) => (
            <TradeRow key={trade.id} trade={trade} index={index} />
          ))
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{t.journal.noTradesFound}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Import a CSV/Excel file or add your first trade to get started tracking your performance.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import File
              </Button>
              <Button
                size="sm"
                onClick={() => setIsAddTradeOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.journal.addFirstTrade}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
