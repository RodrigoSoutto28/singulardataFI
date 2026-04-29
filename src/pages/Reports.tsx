import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrades } from '@/hooks/useTrades';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  const { t } = useLanguage();
  const { trades, isLoading } = useTrades();
  const { stats } = useAnalytics(trades);

  const hasData = trades.length > 0;
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
            <SelectValue placeholder="Tipo de reporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" className="gap-2" disabled={!hasData}>
          <FileText className="h-4 w-4" />
          Generar Reporte
        </Button>
      </div>

      {!hasData ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No hay datos para generar reportes</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Agrega operaciones en el diario para generar reportes de rendimiento
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current Report */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">Monthly Performance Report</h2>
                    <Badge className="bg-success/20 text-success">Latest</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {currentMonth}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Generated {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="default" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard
                  label="Total P&L"
                  value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toLocaleString()}`}
                  icon={DollarSign}
                  variant={stats.totalPnl >= 0 ? 'profit' : 'loss'}
                />
                <MetricCard
                  label="Win Rate"
                  value={`${stats.winRate.toFixed(1)}%`}
                  icon={Target}
                  variant="primary"
                />
                <MetricCard
                  label="Total Trades"
                  value={stats.totalTrades}
                  icon={BarChart3}
                  variant="default"
                />
                <MetricCard
                  label="Profit Factor"
                  value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                  icon={TrendingUp}
                  variant="default"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <MetricCard
                  label="Average Win"
                  value={`+$${stats.avgWin.toFixed(2)}`}
                  icon={ArrowUpRight}
                  variant="profit"
                />
                <MetricCard
                  label="Average Loss"
                  value={`-$${stats.avgLoss.toFixed(2)}`}
                  icon={ArrowDownRight}
                  variant="loss"
                />
                <MetricCard
                  label="Best Trade"
                  value={`+$${stats.largestWin.toFixed(2)}`}
                  icon={TrendingUp}
                  variant="profit"
                />
                <MetricCard
                  label="Worst Trade"
                  value={`$${stats.largestLoss.toFixed(2)}`}
                  icon={TrendingDown}
                  variant="loss"
                />
              </div>

              {/* Report Sections Preview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">Report Sections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">Executive Summary</h4>
                    <p className="text-xs text-muted-foreground">
                      High-level overview of your trading performance
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">Trade Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Detailed breakdown of all trades with statistics
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium mb-1">Psychology Insights</h4>
                    <p className="text-xs text-muted-foreground">
                      Emotional patterns and discipline tracking
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Export Options */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>Opciones de Exportación</CardTitle>
          <CardDescription>Elegí el formato de exportación que preferís</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <FileText className="h-8 w-8 text-primary" />
              <span className="font-medium">Reporte PDF</span>
              <span className="text-xs text-muted-foreground">Reporte completo con formato</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <BarChart3 className="h-8 w-8 text-success" />
              <span className="font-medium">Datos CSV</span>
              <span className="text-xs text-muted-foreground">Exportación de datos sin procesar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" disabled={!hasData}>
              <Share2 className="h-8 w-8 text-accent" />
              <span className="font-medium">Link para compartir</span>
              <span className="text-xs text-muted-foreground">Generar reporte compartible</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
