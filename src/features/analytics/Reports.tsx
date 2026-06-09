import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Share2,
  Eye,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useTrades } from '@/features/journal/hooks/useTrades';
import { useAnalytics } from '@/features/dashboard/hooks/useAnalytics';

function MetricCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  variant?: 'default' | 'profit' | 'loss' | 'primary';
}) {
  const variantStyles = {
    default: 'bg-muted/30',
    profit: 'bg-success/10 border-success/20',
    loss: 'bg-destructive/10 border-destructive/20',
    primary: 'bg-primary/10 border-primary/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    profit: 'text-success',
    loss: 'text-destructive',
    primary: 'text-primary',
  };

  return (
    <div className={cn('p-4 rounded-xl border', variantStyles[variant])}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className={cn(
        'text-xl font-bold font-mono-numbers',
        variant === 'profit' && 'text-profit',
        variant === 'loss' && 'text-loss',
        variant === 'primary' && 'text-primary'
      )}>
        {value}
      </p>
    </div>
  );
}

export default function Reports() {
  const { t, language } = useLanguage();
  const { trades, isLoading } = useTrades();
  const { stats } = useAnalytics(trades);

  const hasData = trades.length > 0;
  const localeMap = { ES: 'es-ES', EN: 'en-US', PT: 'pt-BR' } as const;
  const currentMonth = new Date().toLocaleDateString(localeMap[language] ?? 'en-US', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-end gap-2">
        <Select defaultValue="monthly">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t.extra?.reportTypePlaceholder ?? 'Report type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">{t.extra?.weekly ?? 'Weekly'}</SelectItem>
            <SelectItem value="monthly">{t.extra?.monthly ?? 'Monthly'}</SelectItem>
            <SelectItem value="quarterly">{t.extra?.quarterly ?? 'Quarterly'}</SelectItem>
            <SelectItem value="yearly">{t.extra?.yearly ?? 'Yearly'}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" className="gap-2" disabled={!hasData}>
          <FileText className="h-4 w-4" />
          {t.extra?.generateReport ?? 'Generate Report'}
        </Button>
      </div>

      {!hasData ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.extra?.noDataReports ?? 'No data to generate reports'}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {t.extra?.addTradesForReports ?? 'Add trades to generate reports'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-card border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{t.extra?.monthlyPerformanceReport ?? 'Monthly Performance Report'}</h2>
                    <Badge className="bg-success/20 text-success">{t.extra?.latest ?? 'Latest'}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {currentMonth}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {t.extra?.generated ?? 'Generated'} {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    {t.extra?.preview ?? 'Preview'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Printer className="h-4 w-4" />
                    {t.extra?.print ?? 'Print'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    {t.extra?.share ?? 'Share'}
                  </Button>
                  <Button variant="default" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t.extra?.exportPdf ?? 'Export PDF'}
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard
                  label={t.extra?.totalPnl ?? 'Total P&L'}
                  value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toLocaleString()}`}
                  icon={DollarSign}
                  variant={stats.totalPnl >= 0 ? 'profit' : 'loss'}
                />
                <MetricCard
                  label={t.extra?.winRate ?? 'Win Rate'}
                  value={`${stats.winRate.toFixed(1)}%`}
                  icon={Target}
                  variant="primary"
                />
                <MetricCard
                  label={t.extra?.totalTrades ?? 'Total Trades'}
                  value={stats.totalTrades}
                  icon={BarChart3}
                  variant="default"
                />
                <MetricCard
                  label={t.extra?.profitFactor ?? 'Profit Factor'}
                  value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                  icon={TrendingUp}
                  variant="default"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <MetricCard
                  label={t.extra?.averageWin ?? 'Average Win'}
                  value={`+$${stats.avgWin.toFixed(2)}`}
                  icon={ArrowUpRight}
                  variant="profit"
                />
                <MetricCard
                  label={t.extra?.averageLoss ?? 'Average Loss'}
                  value={`-$${stats.avgLoss.toFixed(2)}`}
                  icon={ArrowDownRight}
                  variant="loss"
                />
                <MetricCard
                  label={t.extra?.bestTrade ?? 'Best Trade'}
                  value={`+$${stats.largestWin.toFixed(2)}`}
                  icon={TrendingUp}
                  variant="profit"
                />
                <MetricCard
                  label={t.extra?.worstTrade ?? 'Worst Trade'}
                  value={`$${stats.largestLoss.toFixed(2)}`}
                  icon={TrendingDown}
                  variant="loss"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">{t.extra?.reportSections ?? 'Report Sections'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">{t.extra?.executiveSummary ?? 'Executive Summary'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t.extra?.executiveSummaryDesc ?? 'High-level overview'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">{t.extra?.tradeAnalysis ?? 'Trade Analysis'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t.extra?.tradeAnalysisDesc ?? 'Detailed breakdown'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">{t.extra?.psychologyInsights ?? 'Psychology Insights'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t.extra?.psychologyInsightsDesc ?? 'Emotional patterns'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>{t.extra?.exportOptions ?? 'Export Options'}</CardTitle>
          <CardDescription>{t.extra?.exportOptionsDesc ?? 'Choose export format'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <FileText className="h-8 w-8 text-primary" />
              <span className="font-medium">{t.extra?.pdfReport ?? 'PDF Report'}</span>
              <span className="text-xs text-muted-foreground">{t.extra?.pdfReportDesc ?? 'Full report'}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <BarChart3 className="h-8 w-8 text-success" />
              <span className="font-medium">{t.extra?.csvData ?? 'CSV Data'}</span>
              <span className="text-xs text-muted-foreground">{t.extra?.csvDataDesc ?? 'Raw data'}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <Share2 className="h-8 w-8 text-accent" />
              <span className="font-medium">{t.extra?.shareLink ?? 'Share Link'}</span>
              <span className="text-xs text-muted-foreground">{t.extra?.shareLinkDesc ?? 'Shareable report'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


