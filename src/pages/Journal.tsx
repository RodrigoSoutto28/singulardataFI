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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExportTrades } from '@/hooks/useExportTrades';
import { useImportTrades } from '@/hooks/useImportTrades';
import { toast } from 'sonner';

interface Trade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  status: 'open' | 'closed';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercentage?: number;
  entryDate: string;
  exitDate?: string;
  strategy?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
}

// Mock data
const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'EUR/USD',
    direction: 'long',
    status: 'closed',
    entryPrice: 1.0850,
    exitPrice: 1.0920,
    quantity: 100000,
    pnl: 700,
    pnlPercentage: 0.65,
    entryDate: '2025-01-22T14:30:00',
    exitDate: '2025-01-22T18:45:00',
    strategy: 'Breakout',
    notes: 'Strong momentum after news release',
    rating: 4,
    tags: ['forex', 'breakout', 'news'],
  },
  {
    id: '2',
    symbol: 'BTC/USD',
    direction: 'short',
    status: 'closed',
    entryPrice: 42500,
    exitPrice: 41800,
    quantity: 0.5,
    pnl: 350,
    pnlPercentage: 1.65,
    entryDate: '2025-01-21T10:15:00',
    exitDate: '2025-01-21T16:30:00',
    strategy: 'Trend Following',
    rating: 5,
    tags: ['crypto', 'trend'],
  },
  {
    id: '3',
    symbol: 'AAPL',
    direction: 'long',
    status: 'closed',
    entryPrice: 178.50,
    exitPrice: 176.20,
    quantity: 100,
    pnl: -230,
    pnlPercentage: -1.29,
    entryDate: '2025-01-20T09:35:00',
    exitDate: '2025-01-20T15:50:00',
    strategy: 'Support Bounce',
    notes: 'Should have waited for confirmation',
    rating: 2,
    tags: ['stocks', 'support'],
  },
  {
    id: '4',
    symbol: 'GBP/JPY',
    direction: 'long',
    status: 'open',
    entryPrice: 188.45,
    quantity: 50000,
    pnl: 125,
    pnlPercentage: 0.28,
    entryDate: '2025-01-23T09:00:00',
    strategy: 'Range Trade',
    tags: ['forex', 'range'],
  },
  {
    id: '5',
    symbol: 'TSLA',
    direction: 'short',
    status: 'closed',
    entryPrice: 245.00,
    exitPrice: 252.30,
    quantity: 50,
    pnl: -365,
    pnlPercentage: -2.98,
    entryDate: '2025-01-19T11:20:00',
    exitDate: '2025-01-19T14:45:00',
    strategy: 'Reversal',
    notes: 'Bad timing, trend continued up',
    rating: 1,
    tags: ['stocks', 'reversal'],
  },
];

export default function Journal() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const { exportToExcel, exportToPDF, exportToHTML } = useExportTrades();
  const { importFromFile } = useImportTrades();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTrades = mockTrades.filter((trade) => {
    const matchesSearch = trade.symbol
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPnl = filteredTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0);
  const winningTrades = filteredTrades.filter((tr) => (tr.pnl ?? 0) > 0).length;
  const winRate = filteredTrades.length > 0 
    ? (winningTrades / filteredTrades.length * 100).toFixed(1)
    : '0';

  const handleExport = (format: 'excel' | 'pdf' | 'html') => {
    const filename = `trading-journal-${new Date().toISOString().split('T')[0]}`;
    
    try {
      switch (format) {
        case 'excel':
          exportToExcel(filteredTrades, filename);
          toast.success(t.journal.exportSuccess?.replace('{format}', 'Excel') ?? 'Exported to Excel');
          break;
        case 'pdf':
          exportToPDF(filteredTrades, filename);
          toast.success(t.journal.exportSuccess?.replace('{format}', 'PDF') ?? 'Exported to PDF');
          break;
        case 'html':
          exportToHTML(filteredTrades, filename);
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

    try {
      const result = await importFromFile(file);
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => toast.error(error));
      }
      
      if (result.trades.length > 0) {
        toast.success(t.journal.tradesImported?.replace('{count}', String(result.trades.length)) ?? `${result.trades.length} trades imported`);
        // In a real app, you would save these trades to the database
        console.log('Imported trades:', result.trades);
      } else if (result.errors.length === 0) {
        toast.warning(t.journal.importError ?? 'No trades found in file');
      }
    } catch (error) {
      toast.error(t.journal.importError ?? 'Import failed');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  function TradeRow({ trade }: { trade: Trade }) {
    const isProfit = (trade.pnl ?? 0) >= 0;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Direction Icon */}
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl shrink-0',
              trade.direction === 'long' ? 'bg-success/10' : 'bg-destructive/10'
            )}
          >
            {trade.direction === 'long' ? (
              <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
            ) : (
              <ArrowDownRight className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
            )}
          </div>

          {/* Trade Info */}
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
                {t.journal.entry}: ${trade.entryPrice.toLocaleString()}
              </span>
              {trade.exitPrice && (
                <span className="font-mono-numbers hidden xs:inline">
                  {t.journal.exit}: ${trade.exitPrice.toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(trade.entryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
          {/* Rating - Hidden on mobile */}
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

          {/* P&L */}
          <div className="text-right min-w-[80px] sm:min-w-[100px]">
            <p
              className={cn(
                'text-base sm:text-lg font-bold font-mono-numbers',
                isProfit ? 'text-profit' : 'text-loss'
              )}
            >
              {isProfit ? '+' : ''}${(trade.pnl ?? 0).toFixed(2)}
            </p>
            <p
              className={cn(
                'text-[10px] sm:text-xs font-mono-numbers',
                isProfit ? 'text-profit' : 'text-loss'
              )}
            >
              {isProfit ? '+' : ''}
              {(trade.pnlPercentage ?? 0).toFixed(2)}%
            </p>
          </div>

          {/* Actions */}
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
              <DropdownMenuItem className="text-destructive">
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
              <Button variant="outline" className="gap-2 w-full xs:w-auto">
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
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">{t.journal.import ?? 'Import'}</span>
            <span className="sm:hidden">Import</span>
          </Button>

          <Dialog open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen}>
            <DialogTrigger asChild>
              <Button variant="glow" className="gap-2 w-full xs:w-auto">
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
              <form className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.journal.symbol}</Label>
                    <Input placeholder="EUR/USD" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.direction}</Label>
                    <Select>
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
                    <Label>{t.journal.entryPrice}</Label>
                    <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.quantity}</Label>
                    <Input type="number" step="any" placeholder="0" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.stopLoss}</Label>
                    <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.takeProfit}</Label>
                    <Input type="number" step="any" placeholder="0.00" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.strategy}</Label>
                    <Input placeholder="e.g., Breakout" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.journal.entryDate}</Label>
                    <Input type="datetime-local" className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.journal.notes}</Label>
                  <Textarea
                    placeholder={t.journal.addNotesPlaceholder}
                    className="bg-muted/50 min-h-[100px]"
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
                  <Button type="submit" variant="glow" className="w-full sm:w-auto">
                    {t.journal.addTrade}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
        {filteredTrades.map((trade) => (
          <TradeRow key={trade.id} trade={trade} />
        ))}

        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.journal.noTradesFound}</p>
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