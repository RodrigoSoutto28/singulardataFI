import { useState, useRef, useEffect } from 'react';
import { useInfiniteTrades } from '@/features/journal/hooks/useInfiniteTrades';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Progress } from '@/shared/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { cn } from '@/shared/lib/utils';
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
} from '@/shared/components/ui/dropdown-menu';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useExportTrades } from '@/features/journal/hooks/useExportTrades';
import { useImportTrades, type ParseMetadata, type FileParseResult } from '@/features/journal/hooks/useImportTrades';
import { useTrades, Trade, type TradeInsert } from '@/features/journal/hooks/useTrades';
import { toast } from 'sonner';
import { ImportPreviewModal } from '@/features/journal/components/ImportPreviewModal';
import { ImportHistorySection } from '@/features/journal/components/ImportHistorySection';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { UpgradeModal, useUpgradeModal } from '@/shared/components/ui/UpgradeModal';
import { tradeFormSchema } from '@/shared/lib/validation';
import { ProcessValidatorModal } from '@/features/journal/components/ProcessValidatorModal';
import { hasValidation } from '@/features/journal/hooks/useProcessValidation';
import { TradeScreenshotModal } from '@/features/journal/components/TradeScreenshotModal';
import { useTradeScreenshots } from '@/features/journal/hooks/useTradeScreenshots';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useTradingAccounts } from '@/features/dashboard/hooks/useTradingAccounts';
import { TaxometerAlert } from '@/features/behavioral/components/TaxometerAlert';
import {
  detectPsychologicalErrors,
  type DetectedError,
} from '@/features/journal/utils/error-detection';
import { useTaxometer } from '@/features/behavioral/hooks/useTaxometer';
import { usePreMarketCheckIn } from '@/features/behavioral/hooks/usePreMarketCheckIn';
import {
  hashFile,
  hashRow,
  findActiveBatchByFileHash,
  findExistingPositionIds,
  createImportBatch,
  getLastActiveBatch,
  undoImportBatch,
} from '@/features/journal/hooks/useImportBatches';
import { Undo2 } from 'lucide-react';

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [validatorTrade, setValidatorTrade] = useState<Trade | null>(null);
  const [screenshotTrade, setScreenshotTrade] = useState<Trade | null>(null);

  // Alert Dialog states
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const [isUndoAlertOpen, setIsUndoAlertOpen] = useState(false);

  // Taxometer alert state
  const { todayCheckIn } = usePreMarketCheckIn();
  const { logError } = useTaxometer();
  const [pendingErrors, setPendingErrors] = useState<DetectedError[]>([]);
  const [pendingPayload, setPendingPayload] = useState<Omit<TradeInsert, 'user_id'> | null>(null);
  const [taxometerOpen, setTaxometerOpen] = useState(false);

  // Server-side paginated list (50 per page) with infinite scroll
  const {
    trades: paginatedTrades,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteTrades({
    pageSize: 50,
    search: debouncedSearch,
    status: statusFilter,
  });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Import preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTrades, setPreviewTrades] = useState<ImportedTrade[]>([]);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [previewMetadata, setPreviewMetadata] = useState<ParseMetadata | null>(null);
  const [previewRawRows, setPreviewRawRows] = useState<string[][]>([]);
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewFileHash, setPreviewFileHash] = useState('');
  const [previewPerFileReports, setPreviewPerFileReports] = useState<FileParseResult[] | undefined>(undefined);
  const [isUndoing, setIsUndoing] = useState(false);
  const [duplicatePositionIds, setDuplicatePositionIds] = useState<string[]>([]);
  const [duplicateInfo, setDuplicateInfo] = useState<{
    fileName: string;
    previousName: string;
    date: string;
    count: number;
    fileHash: string;
  } | null>(null);

  // Form state
  const nowLocalIso = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };
  const emptyForm = {
    symbol: '',
    direction: '' as 'long' | 'short' | '',
    entry_price: '',
    quantity: '',
    stop_size: '',
    take_profit: '',
    commission: '',
    strategy: '',
    entry_date: nowLocalIso(),
    exit_price: '',
    exit_date: '',
    pnl: '',
    pnl_percentage: '',
    status: 'closed' as 'open' | 'closed',
    notes: '',
  };
  const [formData, setFormData] = useState(emptyForm);

  // Payload readiness (drives progress bar + Register button disabled state)
  const FIELD_LABEL_ES: Record<string, string> = {
    symbol: 'Símbolo',
    direction: 'Dirección',
    entry_price: 'Precio entrada',
    quantity: 'Cantidad',
    entry_date: 'Fecha entrada',
    exit_price: 'Precio salida',
    exit_date: 'Fecha salida',
    pnl: 'Resultado (P&L)',
  };
  const requiredChecks = [
    { key: 'symbol', ok: formData.symbol.trim().length > 0 },
    { key: 'direction', ok: formData.direction === 'long' || formData.direction === 'short' },
    { key: 'entry_price', ok: parseFloat(formData.entry_price) > 0 },
    { key: 'quantity', ok: parseFloat(formData.quantity) > 0 },
    { key: 'entry_date', ok: formData.entry_date.trim().length > 0 },
    ...(formData.status === 'closed'
      ? [
          { key: 'exit_price', ok: parseFloat(formData.exit_price) > 0 },
          { key: 'exit_date', ok: formData.exit_date.trim().length > 0 },
          { key: 'pnl', ok: Number.isFinite(parseFloat(formData.pnl)) },
        ]
      : []),
  ];
  const recommendedChecks = [
    { key: 'stop_size', ok: !isNaN(parseFloat(formData.stop_size)) && parseFloat(formData.stop_size) !== 0 },
    { key: 'take_profit', ok: parseFloat(formData.take_profit) > 0 },
    { key: 'strategy', ok: formData.strategy.trim().length > 0 },
  ];
  const requiredDone = requiredChecks.filter((c) => c.ok).length;
  const recommendedDone = recommendedChecks.filter((c) => c.ok).length;
  const totalChecks = requiredChecks.length + recommendedChecks.length;
  const progressPct = Math.round(((requiredDone + recommendedDone) / totalChecks) * 100);
  const isPayloadReady = requiredDone === requiredChecks.length;
  const missingRequired = requiredChecks.filter((c) => !c.ok).map((c) => c.key);

  const { exportToExcel, exportToPDF, exportToHTML } = useExportTrades();
  const { importFromFile, importFromFiles } = useImportTrades();
  const { canUseFeature } = useSubscription();
  const { upgradeModalOpen, featureMessage, recommendedPlan, openUpgradeModal, closeUpgradeModal } = useUpgradeModal();
  const { trades, isLoading, createTrade, updateTrade, deleteTrade, importTrades, refetch, invalidateAndSyncBalance, isCreatePending, isUpdatePending } = useTrades();
  const { selectedAccount } = useTradingAccounts();
  const accountCurrency = selectedAccount?.currency ?? 'USD';
  const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', ARS: '$', BRL: 'R$', MXN: '$', CLP: '$', COP: '$', PEN: 'S/', UYU: '$U',
  };
  const currencySymbol = CURRENCY_SYMBOLS[accountCurrency] ?? '$';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Imagen adjunta al alta de la operación (preview antes de guardar) ──
  const tradeImageInputRef = useRef<HTMLInputElement>(null);
  const [tradeImageFile, setTradeImageFile] = useState<File | null>(null);
  const [tradeImageUrl, setTradeImageUrl] = useState<string | null>(null);
  const [tradeImageZoom, setTradeImageZoom] = useState(false);
  const { uploadScreenshot } = useTradeScreenshots();

  const clearTradeImage = () => {
    setTradeImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setTradeImageFile(null);
    if (tradeImageInputRef.current) tradeImageInputRef.current.value = '';
  };

  const handleTradeImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedExt.includes(ext) || !allowedMime.includes(file.type)) {
      toast.error('Formato no permitido. Usá PNG, JPG, WEBP o GIF.');
      if (tradeImageInputRef.current) tradeImageInputRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB.');
      if (tradeImageInputRef.current) tradeImageInputRef.current.value = '';
      return;
    }
    if (tradeImageUrl) URL.revokeObjectURL(tradeImageUrl);
    setTradeImageFile(file);
    setTradeImageUrl(URL.createObjectURL(file));
    if (tradeImageInputRef.current) tradeImageInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingTrade(null);
    setFormErrors({});
    clearTradeImage();
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
      stop_size: trade.stop_size?.toString() ?? '',
      take_profit: trade.take_profit?.toString() ?? '',
      commission: trade.commission?.toString() ?? '',
      strategy: trade.strategy ?? '',
      entry_date: toLocal(trade.entry_date),
      exit_price: trade.exit_price?.toString() ?? '',
      exit_date: toLocal(trade.exit_date),
      pnl: trade.pnl?.toString() ?? '',
      pnl_percentage: trade.pnl_percentage?.toString() ?? '',
      status: (trade.status as 'open' | 'closed') ?? 'open',
      notes: trade.notes ?? '',
    });
    setFormErrors({});
    // Defer para que el DropdownMenu termine de cerrarse y restaurar foco antes de abrir el Dialog
    setTimeout(() => setIsAddTradeOpen(true), 0);
  };

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.symbol
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
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
    // Gate export behind Pro plan
    if (!canUseFeature('export_reports')) {
      openUpgradeModal({ feature: 'Exportar reportes en Excel, PDF y HTML', plan: 'pro' });
      return;
    }

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

  const buildImportTradeKey = (trade: ImportedTrade) => {
    const normalize = (value: unknown) =>
      value === undefined || value === null ? '' : String(value).trim();

    return [
      normalize(trade.symbol).toUpperCase(),
      normalize(trade.direction),
      normalize(trade.entryPrice),
      normalize(trade.exitPrice),
      normalize(trade.quantity),
      normalize(trade.entryDate),
      normalize(trade.exitDate),
      normalize(trade.pnl),
      normalize(trade.pnlPercentage),
      normalize(trade.strategy),
      normalize(trade.notes),
      normalize(trade.stopLoss),
      normalize(trade.takeProfit),
      normalize(trade.assetClass),
    ].join('|');
  };

  const tradeHasExitData = (trade: ImportedTrade) =>
    trade.exitDate !== undefined ||
    trade.exitPrice !== undefined ||
    trade.pnl !== undefined ||
    trade.pnlPercentage !== undefined;

  // Handle file selection - opens preview modal
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      // Single-file flow keeps duplicate-batch detection
      if (files.length === 1) {
        const file = files[0];
        const fileHash = await hashFile(file);
        if (user?.id) {
          const existing = await findActiveBatchByFileHash(user.id, fileHash);
          if (existing) {
            setDuplicateInfo({
              fileName: file.name,
              previousName: existing.file_name,
              date: new Date(existing.created_at).toLocaleString(),
              count: existing.imported_count ?? 0,
              fileHash,
            });
            return;
          }
        }

        const result = await importFromFile(file);
        let dupIds: string[] = [];
        if (user?.id && result.trades.length > 0) {
          try {
            const existingIds = await findExistingPositionIds(user.id);
            dupIds = result.trades
              .map((t) => t.notes?.match(/cTrader Position #(\d+)/)?.[1])
              .filter((id): id is string => !!id && existingIds.has(id));
          } catch (e) {
            console.warn('[ImportTrades] Position ID validation skipped:', e);
          }
        }
        setDuplicatePositionIds(dupIds);

        setPreviewTrades(result.trades);
        setPreviewMetadata(result.metadata);
        setPreviewRawRows(result.rawRows || []);
        setPreviewErrors(
          result.errors.length > 0
            ? result.errors
            : result.trades.length === 0
              ? ['No se reconocieron operaciones en el archivo. Verifica que las columnas incluyan al menos: símbolo, dirección, precio de entrada y cantidad.']
              : []
        );
        setPreviewFileName(file.name);
        setPreviewFileHash(fileHash);
        setPreviewPerFileReports(undefined);
        setPreviewOpen(true);
      } else {
        // Multi-file flow
        const multi = await importFromFiles(files);
        setDuplicatePositionIds([]);
        setPreviewTrades(multi.trades);
        setPreviewMetadata(multi.files[0]?.metadata);
        setPreviewRawRows([]);
        const errs = [...multi.errors];
        if (multi.trades.length === 0) {
          errs.push('No se reconocieron operaciones en ninguno de los archivos.');
        }
        setPreviewErrors(errs);
        setPreviewFileName(`${multi.files.length} archivos`);
        setPreviewFileHash('');
        setPreviewPerFileReports(multi.files);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('[ImportTrades] Unexpected error:', error);
      toast.error(t.journal.importError ?? 'No se pudo importar el archivo. Verifica el formato e inténtalo de nuevo.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUndoLastImport = async () => {
    if (!user?.id) return;
    setIsUndoAlertOpen(false);
    setIsUndoing(true);
    try {
      const last = await getLastActiveBatch(user.id);
      if (!last) {
        toast.info('No hay importaciones para deshacer.');
        return;
      }
      const removed = await undoImportBatch(user.id, last.id);
      await invalidateAndSyncBalance();
      await refetch();
      toast.success(`Importación deshecha (${last.file_name}). ${removed} operación(es) eliminada(s).`);
    } catch (error) {
      console.error('[ImportTrades] Undo failed:', error);
      toast.error('No se pudo deshacer la última importación.');
    } finally {
      setIsUndoing(false);
    }
  };

  // Confirm import from preview modal
  const handleConfirmImport = async (selectedTrades: ImportedTrade[]) => {
    if (selectedTrades.length === 0) return;

    setIsImporting(true);

    try {
      await refetch();
    } catch (error) {
      console.warn('[ImportTrades] No se pudo refrescar el registro antes de importar:', error);
    }

    const importedKeys = new Set<string>();
    const existingKeys = new Set<string>(
      trades.map((trade) =>
        buildImportTradeKey({
          symbol: trade.symbol ?? '',
          direction: trade.direction as 'long' | 'short',
          entryPrice: Number(trade.entry_price ?? 0),
          exitPrice: trade.exit_price ?? undefined,
          quantity: Number(trade.quantity ?? 0),
          entryDate: trade.entry_date ?? '',
          exitDate: trade.exit_date ?? undefined,
          pnl: trade.pnl ?? undefined,
          pnlPercentage: trade.pnl_percentage ?? undefined,
          strategy: trade.strategy ?? undefined,
          notes: trade.notes ?? undefined,
          stopLoss: trade.stop_loss ?? undefined,
          takeProfit: trade.take_profit ?? undefined,
          assetClass: trade.asset_class ?? undefined,
        })
      )
    );

    const dbTrades: Array<Omit<Parameters<typeof importTrades>[0][number], never> & { _importKey: string }> = [];
    const validationErrors: string[] = [];
    let skippedDuplicates = 0;

    selectedTrades.forEach((trade, i) => {
      const row = i + 1;
      const key = buildImportTradeKey(trade);
      if (importedKeys.has(key) || existingKeys.has(key)) {
        skippedDuplicates += 1;
        importedKeys.add(key);
        return;
      }

      if (!trade.symbol) {
        validationErrors.push(`Operación #${row}: falta símbolo`);
        return;
      }
      if (typeof trade.entryPrice !== 'number' || isNaN(trade.entryPrice)) {
        validationErrors.push(`Operación #${row} (${trade.symbol}): precio de entrada inválido`);
        return;
      }
      if (typeof trade.quantity !== 'number' || isNaN(trade.quantity) || trade.quantity <= 0) {
        validationErrors.push(`Operación #${row} (${trade.symbol}): cantidad inválida`);
        return;
      }

      importedKeys.add(key);
      const isClosed = tradeHasExitData(trade);
      const exitDateIso = trade.exitDate ?? (isClosed ? trade.entryDate : null);

      dbTrades.push({
        // Guardamos la key junto al trade para evitar desalineamiento de índices
        _importKey: key,
        symbol: trade.symbol,
        direction: trade.direction,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice ?? null,
        quantity: trade.quantity,
        pnl: trade.pnl ?? null,
        pnl_percentage: trade.pnlPercentage ?? null,
        entry_date: trade.entryDate,
        exit_date: exitDateIso,
        strategy: trade.strategy ?? null,
        notes: trade.notes ?? null,
        stop_loss: trade.stopLoss ?? null,
        take_profit: trade.takeProfit ?? null,
        asset_class: trade.assetClass ?? 'forex',
        status: isClosed ? 'closed' as const : 'open' as const,
      });
    });

    if (dbTrades.length === 0) {
      if (validationErrors.length > 0) {
        toast.error(`Ninguna operación válida para importar. ${validationErrors[0] ?? ''}`);
      } else if (skippedDuplicates > 0) {
        toast.warning('No se importaron operaciones porque ya existían en tu registro.');
      }
      setIsImporting(false);
      return;
    }

    try {
      if (!user?.id) throw new Error('User not authenticated');

      // Create the import batch first so each trade can reference it
      const batchId = await createImportBatch({
        userId: user.id,
        fileName: previewFileName || 'imported-file',
        fileHash: previewFileHash || `manual-${Date.now()}`,
        importedCount: dbTrades.length,
        skippedDuplicates,
      });

      // Attach batch + per-row hash to every trade usando la key guardada
      const tradesWithBatch = await Promise.all(
        dbTrades.map(async ({ _importKey, ...t }) => ({
          ...t,
          import_batch_id: batchId,
          import_row_hash: await hashRow(user.id, _importKey),
        })),
      );


      const inserted = await importTrades(tradesWithBatch);
      const insertedCount = inserted.length;
      const dbSkipped = dbTrades.length - insertedCount;
      const totalSkipped = skippedDuplicates + dbSkipped;

      if (insertedCount === 0) {
        toast.warning('No se importaron operaciones porque ya existían en tu registro.');
      } else if (validationErrors.length > 0) {
        toast.warning(`${insertedCount} operación(es) importada(s). ${validationErrors.length} fallaron en validación.`);
      } else if (totalSkipped > 0) {
        toast.success(`${insertedCount} operación(es) importada(s). ${totalSkipped} duplicada(s) omitida(s).`);
      } else {
        toast.success(`${insertedCount} operación(es) importada(s).`);
      }

      setPreviewOpen(false);
      setPreviewTrades([]);
      setPreviewErrors([]);
      setPreviewMetadata(null);
      setPreviewRawRows([]);
      setPreviewFileHash('');
      setPreviewFileName('');
    } catch (error) {
      console.error('[ImportTrades] Insert failed:', error);
      toast.error('No se pudieron guardar las operaciones. Inténtalo de nuevo.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsed = tradeFormSchema.safeParse(formData);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!errs[k]) errs[k] = i.message;
      });
      setFormErrors(errs);
      const labelMap: Record<string, string> = {
        symbol: 'Símbolo', direction: 'Dirección', entry_price: 'Precio entrada',
        quantity: 'Cantidad', exit_price: 'Precio salida', exit_date: 'Fecha cierre',
        stop_loss: 'Stop Loss', stop_size: 'Tamaño del Stop', take_profit: 'Take Profit', commission: 'Comisión',
        pnl: 'Resultado (P&L)', pnl_percentage: 'Resultado %',
        strategy: 'Estrategia', entry_date: 'Fecha apertura', notes: 'Notas',
      };
      const names = Object.keys(errs).map((k) => labelMap[k] ?? k).join(', ');
      toast.error(`Revisa: ${names}`);
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        el?.focus?.();
      }, 0);
      return;
    }

    const num = (v: string) => (v.trim() === '' ? null : parseFloat(v));
    const entry = parseFloat(formData.entry_price);
    const exit = formData.status === 'open' ? null : num(formData.exit_price);
    const qty = parseFloat(formData.quantity);
    const exitDateIso = formData.status === 'open'
      ? null
      : formData.exit_date ? new Date(formData.exit_date).toISOString() : null;
    const isClosed = formData.status === 'closed';
    const status: 'open' | 'closed' = isClosed ? 'closed' : 'open';

    // P&L 100% manual — sin cálculo automático a partir de precios/cantidad
    const pnl: number | null = isClosed ? num(formData.pnl) : null;
    const pnlPct: number | null = isClosed ? num(formData.pnl_percentage) : null;

    const payload = {
      symbol: formData.symbol.toUpperCase(),
      direction: formData.direction as 'long' | 'short',
      entry_price: entry,
      quantity: qty,
      stop_loss: null,
      stop_size: num(formData.stop_size),
      take_profit: num(formData.take_profit),
      commission: num(formData.commission) ?? 0,
      strategy: formData.strategy.trim() || null,
      entry_date: formData.entry_date
        ? new Date(formData.entry_date).toISOString()
        : new Date().toISOString(),
      exit_price: exit,
      exit_date: isClosed ? (exitDateIso ?? new Date().toISOString()) : null,
      pnl,
      pnl_percentage: pnlPct,
      notes: formData.notes || null,
      status,
    };

    // Detect psychological errors before saving
    const detected = detectPsychologicalErrors(
      {
        entry_price: payload.entry_price,
        stop_loss: payload.stop_loss,
        stop_size: payload.stop_size,
        quantity: payload.quantity,
        entry_date: payload.entry_date,
        notes: payload.notes,
        status: payload.status,
      },
      trades.filter((t) => !editingTrade || t.id !== editingTrade.id),
      todayCheckIn
        ? {
            max_daily_trades: todayCheckIn.max_daily_trades,
            max_risk_per_trade: Number(todayCheckIn.max_risk_per_trade),
          }
        : null,
    );

    const highErrors = detected.filter((e) => e.confidence === 'high');
    if (highErrors.length > 0 && !editingTrade) {
      setPendingErrors(detected);
      setPendingPayload(payload);
      // Cerrar el diálogo primero para que la alerta se vea limpia
      setIsAddTradeOpen(false);
      setTaxometerOpen(true);
      return;
    }

    await commitTrade(payload, detected);
  };

  const commitTrade = async (payload: Omit<TradeInsert, 'user_id'>, detected: DetectedError[] = []) => {
    try {
      const wasOpen = !editingTrade || editingTrade.status !== 'closed';
      let savedTrade: Trade | null = null;
      if (editingTrade) {
        savedTrade = await updateTrade({ id: editingTrade.id, ...payload });
      } else {
        savedTrade = await createTrade(payload);
      }
      // Subir la imagen adjunta (requiere el id de la operación ya guardada)
      const pendingImage = tradeImageFile;
      setIsAddTradeOpen(false);
      resetForm();

      if (savedTrade && pendingImage) {
        try {
          const uploaded = await uploadScreenshot(savedTrade.id, pendingImage);
          if (!uploaded) {
            toast.error(t.journal.imageUploadFailed ?? 'La operación se guardó, pero la imagen no se pudo subir.');
          }
        } catch {
          toast.error(t.journal.imageUploadFailed ?? 'La operación se guardó, pero la imagen no se pudo subir.');
        }
      }



      // Log psychological errors that were not prevented
      if (savedTrade && detected.length > 0 && user?.id) {
        for (const err of detected) {
          await logError({
            trade_id: savedTrade.id,
            error_type: err.type,
            confidence: err.confidence,
            reason: err.reason,
            cost_dollars:
              savedTrade.status === 'closed' && (savedTrade.pnl ?? 0) < 0
                ? Math.abs(savedTrade.pnl ?? 0)
                : err.costEstimate ?? 0,
            was_prevented: false,
          }).catch(() => {});
        }
      }

      // Trigger Process Validator when a trade transitions to closed
      if (savedTrade && savedTrade.status === 'closed' && wasOpen && user?.id) {
        const already = await hasValidation(savedTrade.id, user.id);
        if (!already) {
          setValidatorTrade(savedTrade);
        }
      }
    } catch (error) {
      // handled by mutation
    }
  };

  const handleTaxometerCancel = async () => {
    // User cancelled the trade — log prevented errors
    if (user?.id) {
      for (const err of pendingErrors.filter((e) => e.confidence === 'high')) {
        await logError({
          trade_id: null,
          error_type: err.type,
          confidence: err.confidence,
          reason: err.reason,
          cost_dollars: 0,
          was_prevented: true,
        }).catch(() => {});
      }
    }
    toast.success('Trade cancelado. Buena decisión.');
    setTaxometerOpen(false);
    setPendingErrors([]);
    setPendingPayload(null);
  };

  const handleTaxometerContinue = async () => {
    setTaxometerOpen(false);
    if (pendingPayload) {
      await commitTrade(pendingPayload, pendingErrors);
    }
    setPendingErrors([]);
    setPendingPayload(null);
  };

  const handleDeleteTrade = async () => {
    if (tradeToDelete) {
      await deleteTrade(tradeToDelete);
      setTradeToDelete(null);
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
              <DropdownMenuItem className="gap-2" onSelect={(e) => { e.preventDefault(); openEditTrade(trade); }}>
                <Pencil className="lucide lucide-pencil h-3.5 w-3.5 text-justify" />
                {t.journal.editTrade}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onSelect={(e) => { e.preventDefault(); setScreenshotTrade(trade); }}
              >
                <Image className="h-4 w-4" />
                {t.journal.addScreenshot}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive gap-2"
                onClick={() => setTradeToDelete(trade.id)}
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.journal.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t.journal.subtitle}</p>
        </div>

        {/* Mobile: actions menu */}
        <div className="sm:hidden flex items-center justify-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsm,.xlsb,.ods,.json,.html,.htm,.xml,.pdf"
            multiple
            className="hidden"
          />
          <Button
            size="sm"
            className="gap-1.5 btn-press flex-1"
            onClick={() => { resetForm(); setIsAddTradeOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            {t.journal.addTrade}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label="Más acciones">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="gap-2"
              >
                {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {t.journal.import ?? 'Import'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleUndoLastImport}
                disabled={isUndoing}
                className="gap-2"
              >
                {isUndoing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
                Deshacer último proceso
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2" disabled={trades.length === 0}>
                <FileSpreadsheet className="h-4 w-4 text-success" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2" disabled={trades.length === 0}>
                <FileText className="h-4 w-4 text-destructive" />
                PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')} className="gap-2" disabled={trades.length === 0}>
                <FileCode className="h-4 w-4 text-primary" />
                HTML (.html)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tablet/Desktop: full button row */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {/* Import Button (file input lives in the mobile block above and is shared via ref) */}
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

          <Button
            variant="outline"
            size="sm"
            className="gap-2 btn-press"
            onClick={handleUndoLastImport}
            disabled={isUndoing}
            title="Elimina las operaciones de la última importación"
          >
            {isUndoing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
            Deshacer último proceso
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
          <Dialog
            open={isAddTradeOpen}
            onOpenChange={(open) => {
              setIsAddTradeOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-2 btn-press"
                onClick={() => resetForm()}
                data-tour="add-trade"
              >
                <Plus className="h-4 w-4" />
                {t.journal.addTrade}
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0 max-w-[100vw] sm:max-w-md w-screen sm:w-auto h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-none sm:rounded-lg">
              <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-border shrink-0">
                <DialogTitle>
                  {editingTrade
                    ? (t.journal.editTrade ?? 'Edit Trade')
                    : (t.journal.registerTrade ?? 'Nueva operación')}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {editingTrade ? 'Edit Trade' : 'Nueva operación'}
                </DialogDescription>
              </DialogHeader>
              <div className="px-4 sm:px-6 pt-2 pb-3 border-b border-border shrink-0 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={cn(
                      'uppercase tracking-wider',
                      Object.keys(formErrors).length > 0
                        ? 'text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {Object.keys(formErrors).length > 0
                      ? 'Hay campos con error'
                      : isPayloadReady
                        ? 'Listo para registrar'
                        : 'Completando datos'}
                  </span>
                  <span
                    className={cn(
                      'tabular-nums',
                      Object.keys(formErrors).length > 0
                        ? 'text-destructive'
                        : isPayloadReady
                          ? 'text-emerald-400'
                          : 'text-muted-foreground',
                    )}
                  >
                    {progressPct}%
                  </span>
                </div>
                <Progress
                  value={progressPct}
                  className={cn('h-1', Object.keys(formErrors).length > 0 && '[&>div]:bg-destructive')}
                />
                {!isPayloadReady && missingRequired.length > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    Faltan: {missingRequired.map((k) => FIELD_LABEL_ES[k] ?? k).join(', ')}
                  </p>
                )}
              </div>
              <form onSubmit={handleAddTrade} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                {(
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.symbol} *</Label>
                    <Input
                      placeholder="EUR/USD, AAPL, BTC..."
                      className="bg-muted/30 font-mono uppercase"
                      value={formData.symbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                      aria-invalid={!!formErrors.symbol}
                      required
                      autoFocus
                    />
                    {formErrors.symbol && <p className="text-xs text-destructive">{formErrors.symbol}</p>}
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.direction} *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, direction: 'long' }))}
                        className={cn(
                          'flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-all',
                          formData.direction === 'long'
                            ? 'bg-success/10 border-success text-success'
                            : 'bg-muted/30 border-border text-muted-foreground hover:border-success/40'
                        )}
                      >
                        <ArrowUpRight className="h-4 w-4" /> {t.journal.long}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, direction: 'short' }))}
                        className={cn(
                          'flex items-center justify-center gap-2 h-10 rounded-md border text-sm font-medium transition-all',
                          formData.direction === 'short'
                            ? 'bg-destructive/10 border-destructive text-destructive'
                            : 'bg-muted/30 border-border text-muted-foreground hover:border-destructive/40'
                        )}
                      >
                        <ArrowDownRight className="h-4 w-4" /> {t.journal.short}
                      </button>
                    </div>
                    {formErrors.direction && <p className="text-xs text-destructive">{formErrors.direction}</p>}
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.entryPrice} *</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      className="bg-muted/30 font-mono"
                      value={formData.entry_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_price: e.target.value }))}
                      aria-invalid={!!formErrors.entry_price}
                      required
                    />
                    {formErrors.entry_price && <p className="text-xs text-destructive">{formErrors.entry_price}</p>}
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.quantity} *</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0"
                      className="bg-muted/30 font-mono"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      aria-invalid={!!formErrors.quantity}
                      required
                    />
                    {formErrors.quantity && <p className="text-xs text-destructive">{formErrors.quantity}</p>}
                  </div>
                </div>
                )}

                {(
                <>
                <div className="grid grid-cols-2 gap-3">
                  {/* Exit Price */}
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.exitPrice}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder={t.journal.optional ?? 'opcional'}
                      className="bg-muted/30 font-mono"
                      value={formData.exit_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, exit_price: e.target.value }))}
                      disabled={formData.status === 'open'}
                      aria-invalid={!!formErrors.exit_price}
                    />
                    {formErrors.exit_price && <p className="text-xs text-destructive">{formErrors.exit_price}</p>}
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.tradeStatus ?? 'Estado'} *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status: 'closed' }))}
                        className={cn(
                          'h-10 rounded-md border text-sm font-medium transition-all',
                          formData.status === 'closed'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted/30 border-border text-muted-foreground'
                        )}
                      >{t.journal.closedStatus ?? 'Cerrada'}</button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status: 'open', exit_price: '', exit_date: '' }))}
                        className={cn(
                          'h-10 rounded-md border text-sm font-medium transition-all',
                          formData.status === 'open'
                            ? 'bg-warning/10 border-warning text-warning'
                            : 'bg-muted/30 border-border text-muted-foreground'
                        )}
                      >{t.journal.openStatus ?? 'Abierta'}</button>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.openDateTime ?? 'Apertura'} *</Label>
                    <Input
                      type="datetime-local"
                      className="bg-muted/30 font-mono"
                      value={formData.entry_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
                      required
                      aria-invalid={!!formErrors.entry_date}
                    />
                    {formErrors.entry_date && <p className="text-xs text-destructive">{formErrors.entry_date}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.closeDateTime ?? 'Cierre'}</Label>
                    <Input
                      type="datetime-local"
                      className="bg-muted/30 font-mono"
                      value={formData.exit_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, exit_date: e.target.value }))}
                      disabled={formData.status === 'open'}
                      aria-invalid={!!formErrors.exit_date}
                    />
                    {formErrors.exit_date && <p className="text-xs text-destructive">{formErrors.exit_date}</p>}
                  </div>

                  {/* Stop Size (en moneda de la cuenta) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {(t.journal.stopSize ?? 'Tamaño del Stop')} ({accountCurrency})
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-mono text-muted-foreground">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        placeholder="ej. -50.00"
                        className="bg-muted/30 font-mono pl-7"
                        value={formData.stop_size}
                        onChange={(e) => setFormData(prev => ({ ...prev, stop_size: e.target.value }))}
                        aria-invalid={!!formErrors.stop_size}
                      />
                    </div>
                    {formErrors.stop_size
                      ? <p className="text-xs text-destructive">{formErrors.stop_size}</p>
                      : <p className="text-[10px] text-muted-foreground">{t.journal.stopSizeHint ?? 'Cuánto dinero estás dispuesto a perder si se ejecuta el stop (valor negativo)'}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.takeProfit}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="ej. 100.00"
                      className="bg-muted/30 font-mono"
                      value={formData.take_profit}
                      onChange={(e) => setFormData(prev => ({ ...prev, take_profit: e.target.value }))}
                      aria-invalid={!!formErrors.take_profit}
                    />
                    {formErrors.take_profit && <p className="text-xs text-destructive">{formErrors.take_profit}</p>}
                  </div>

                  {/* Commission */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.commission ?? 'Comisión'}</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0"
                      className="bg-muted/30 font-mono"
                      value={formData.commission}
                      onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                      aria-invalid={!!formErrors.commission}
                    />
                    {formErrors.commission && <p className="text-xs text-destructive">{formErrors.commission}</p>}
                  </div>

                  {/* Strategy */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.strategy}</Label>
                    <Input
                      type="text"
                      placeholder={t.journal.optional ?? 'opcional'}
                      className="bg-muted/30"
                      value={formData.strategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                      aria-invalid={!!formErrors.strategy}
                    />
                    {formErrors.strategy && <p className="text-xs text-destructive">{formErrors.strategy}</p>}
                  </div>
                </div>

                {/* Panel de resultados reales (sólo visible al editar si el trade tiene datos) */}
                {editingTrade && (() => {
                  const realPnl = editingTrade.pnl;
                  const realPct = editingTrade.pnl_percentage;
                  const realStop = editingTrade.stop_loss;
                  const realTp = editingTrade.take_profit;
                  const stopSize = parseFloat(formData.stop_size);
                  const tp = parseFloat(formData.take_profit);
                  const hasRR = !isNaN(stopSize) && stopSize !== 0 && !isNaN(tp) && tp !== 0;
                  const rr = hasRR ? Math.abs(tp) / Math.abs(stopSize) : 0;

                  const hasAnything = realPnl !== null || realStop !== null || realTp !== null || hasRR;
                  if (!hasAnything) return null;

                  return (
                    <div className="space-y-2">
                      {/* P&L real del trade */}
                      {realPnl !== null && (
                        <div className={cn(
                          'flex items-center justify-between rounded-md px-3 py-2.5 border',
                          realPnl >= 0 ? 'bg-profit/5 border-profit/20' : 'bg-loss/5 border-loss/20'
                        )}>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                            P&amp;L Real
                          </span>
                          <span className={cn('font-mono font-bold text-sm', realPnl >= 0 ? 'text-profit' : 'text-loss')}>
                            {realPnl >= 0 ? '+' : ''}{currencySymbol}{realPnl.toFixed(2)}
                            {realPct !== null && (
                              <span className="ml-1.5 text-xs font-normal opacity-70">
                                ({realPct >= 0 ? '+' : ''}{realPct.toFixed(2)}%)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      {/* Stop Loss real registrado */}
                      {realStop !== null && (
                        <div className="flex items-center justify-between rounded-md px-3 py-2.5 border bg-loss/5 border-loss/20">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Stop Loss</span>
                          <span className="font-mono font-bold text-sm text-loss">{currencySymbol}{Number(realStop).toFixed(2)}</span>
                        </div>
                      )}
                      {/* Take Profit real registrado */}
                      {realTp !== null && (
                        <div className="flex items-center justify-between rounded-md px-3 py-2.5 border bg-profit/5 border-profit/20">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Take Profit</span>
                          <span className="font-mono font-bold text-sm text-profit">{currencySymbol}{Number(realTp).toFixed(2)}</span>
                        </div>
                      )}
                      {/* R:R calculado desde los campos manuales */}
                      {hasRR && rr > 0 && (
                        <div className="flex items-center justify-between rounded-md px-3 py-2.5 border bg-muted/30 border-border">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">R:R</span>
                          <span className="font-mono font-bold text-foreground">1 : {rr.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Optional notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.journal.notes}</Label>
                  <Textarea
                    placeholder={t.journal.addNotesPlaceholder}
                    className="bg-muted/30 min-h-[60px] resize-none text-sm"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                </>
                )}

                </div>
                {/* Sticky footer */}
                <div className="shrink-0 flex justify-between gap-2 px-4 sm:px-6 py-3 border-t border-border bg-background/95 backdrop-blur-sm">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddTradeOpen(false)}
                  >
                    {t.common.cancel}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!isPayloadReady || isCreatePending || isUpdatePending}
                    title={!isPayloadReady ? `Faltan: ${missingRequired.map((k) => FIELD_LABEL_ES[k] ?? k).join(', ')}` : undefined}
                    className="btn-press"
                  >
                    {(isCreatePending || isUpdatePending) && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    {editingTrade ? (t.common.save ?? 'Save') : t.journal.registerTrade}
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
          setPreviewMetadata(null);
          setDuplicatePositionIds([]);
        }}
        trades={previewTrades}
        errors={previewErrors}
        metadata={previewMetadata}
        rawRows={previewRawRows}
        fileName={previewFileName}
        fileHash={previewFileHash}
        duplicatePositionIds={duplicatePositionIds}
        perFileReports={previewPerFileReports}
        onConfirm={handleConfirmImport}
        isImporting={isImporting}
      />

      {/* Duplicate file alert */}
      <Dialog
        open={duplicateInfo !== null}
        onOpenChange={(open) => {
          if (!open) setDuplicateInfo(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-warn" />
              {t.journal.duplicateFileTitle}
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-2">
              <span className="block">
                {t.journal.duplicateFileBody
                  .replace('{name}', duplicateInfo?.previousName ?? '')
                  .replace('{date}', duplicateInfo?.date ?? '')
                  .replace('{count}', String(duplicateInfo?.count ?? 0))}
              </span>
              <span className="block text-muted-foreground">
                {t.journal.duplicateFileHint}
              </span>
              {duplicateInfo?.fileHash && (
                <span className="block mt-2 rounded-md border border-warn/30 bg-warn/5 p-2 text-[11px] font-mono text-warn break-all">
                  <span className="block text-[10px] uppercase tracking-wider opacity-70 mb-1">SHA-256 coincidente</span>
                  {duplicateInfo.fileHash}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDuplicateInfo(null)}>
              {t.journal.duplicateFileUnderstood}
            </Button>
            <Button
              onClick={async () => {
                setDuplicateInfo(null);
                setIsUndoAlertOpen(true);
              }}
              disabled={isUndoing}
            >
              <Undo2 className="h-4 w-4 mr-2" />
              {t.journal.duplicateFileUndo}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="trades" className="w-full space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <TabsList className="bg-muted/60 border border-border h-10 p-1 rounded-lg w-max sm:w-auto inline-flex">
            <TabsTrigger
              value="trades"
              className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 h-8 whitespace-nowrap"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{t.journal.allTrades}</span>
            </TabsTrigger>
            <TabsTrigger
              value="imports"
              className="gap-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md px-3 sm:px-4 h-8 whitespace-nowrap"
            >
              <Upload className="h-4 w-4" />
              <span>{t.extra?.importHistoryTitle ?? 'Historial de importaciones'}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trades" className="mt-6 space-y-6 outline-none">
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
                  {t.journal.openPositions}
                </span>
              </div>
              <p className="text-2xl font-bold font-mono-numbers">
                {filteredTrades.filter(tr => tr.status === 'open').length}
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
                <SelectItem value="closed">{t.journal.closed}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trades List */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="space-y-2" aria-busy="true" aria-live="polite">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : paginatedTrades.length > 0 ? (
              <>
                {paginatedTrades.map((trade, index) => (
                  <TradeRow key={trade.id} trade={trade} index={index} />
                ))}
                <div ref={sentinelRef} aria-hidden="true" className="h-1" />
                {isFetchingNextPage && (
                  <div className="flex justify-center pt-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {hasNextPage && !isFetchingNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchNextPage()}
                      className="gap-2"
                    >
                      Cargar más
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={BarChart3}
                title={t.journal.noTradesFound}
                description={t.journal.importEmptyHint}
                actionLabel={t.journal.addFirstTrade}
                actionIcon={Plus}
                onAction={() => setIsAddTradeOpen(true)}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="imports" className="mt-6 outline-none">
          <ImportHistorySection />
        </TabsContent>
      </Tabs>

      <TaxometerAlert
        open={taxometerOpen}
        errors={pendingErrors}
        onContinue={handleTaxometerContinue}
        onCancel={handleTaxometerCancel}
      />

      {validatorTrade && (
        <ProcessValidatorModal
          open={!!validatorTrade}
          onClose={() => setValidatorTrade(null)}
          trade={{
            id: validatorTrade.id,
            pnl: validatorTrade.pnl ?? 0,
            pnl_percentage: validatorTrade.pnl_percentage ?? 0,
            symbol: validatorTrade.symbol,
            direction: validatorTrade.direction as 'long' | 'short',
          }}
        />
      )}

      {/* Screenshot Modal */}
      {screenshotTrade && (
        <TradeScreenshotModal
          open={!!screenshotTrade}
          onClose={() => setScreenshotTrade(null)}
          trade={screenshotTrade}
        />
      )}

      {/* Delete Trade Alert */}
      <AlertDialog open={tradeToDelete !== null} onOpenChange={(open) => !open && setTradeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta operación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la operación permanentemente de tu registro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTrade} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Undo Import Alert */}
      <AlertDialog open={isUndoAlertOpen} onOpenChange={setIsUndoAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshacer la última importación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán permanentemente las operaciones cargadas en ese proceso. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUndoLastImport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deshacer importación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Modal for Pro features */}
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={closeUpgradeModal}
        featureMessage={featureMessage}
        recommendedPlan={recommendedPlan}
      />
    </div>
  );
}



