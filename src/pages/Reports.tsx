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
} from 'lucide-react';

interface ReportSummary {
  title: string;
  period: string;
  generatedAt: string;
  metrics: {
    totalPnl: number;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    bestTrade: number;
    worstTrade: number;
  };
}

const currentReport: ReportSummary = {
  title: 'Monthly Performance Report',
  period: 'January 2025',
  generatedAt: '2025-01-23T10:30:00',
  metrics: {
    totalPnl: 2800,
    winRate: 64.5,
    totalTrades: 21,
    profitFactor: 1.87,
    avgWin: 187.50,
    avgLoss: 98.20,
    bestTrade: 680,
    worstTrade: -240,
  },
};

const previousReports = [
  { id: '1', title: 'December 2024 Report', period: 'Dec 2024', pnl: 890, status: 'ready' },
  { id: '2', title: 'November 2024 Report', period: 'Nov 2024', pnl: 1800, status: 'ready' },
  { id: '3', title: 'October 2024 Report', period: 'Oct 2024', pnl: 2100, status: 'ready' },
  { id: '4', title: 'September 2024 Report', period: 'Sep 2024', pnl: -450, status: 'ready' },
  { id: '5', title: 'Q4 2024 Summary', period: 'Q4 2024', pnl: 4790, status: 'ready' },
];

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
  const { metrics } = currentReport;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export performance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="glow" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Current Report */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{currentReport.title}</h2>
                <Badge className="bg-success/20 text-success">Latest</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {currentReport.period}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Generated {new Date(currentReport.generatedAt).toLocaleString()}
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
              value={`${metrics.totalPnl >= 0 ? '+' : ''}$${metrics.totalPnl.toLocaleString()}`}
              icon={DollarSign}
              variant={metrics.totalPnl >= 0 ? 'profit' : 'loss'}
            />
            <MetricCard
              label="Win Rate"
              value={`${metrics.winRate}%`}
              icon={Target}
              variant="primary"
            />
            <MetricCard
              label="Total Trades"
              value={metrics.totalTrades}
              icon={BarChart3}
              variant="default"
            />
            <MetricCard
              label="Profit Factor"
              value={metrics.profitFactor}
              icon={TrendingUp}
              variant="default"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <MetricCard
              label="Average Win"
              value={`+$${metrics.avgWin.toFixed(2)}`}
              icon={ArrowUpRight}
              variant="profit"
            />
            <MetricCard
              label="Average Loss"
              value={`-$${metrics.avgLoss.toFixed(2)}`}
              icon={ArrowDownRight}
              variant="loss"
            />
            <MetricCard
              label="Best Trade"
              value={`+$${metrics.bestTrade.toFixed(2)}`}
              icon={TrendingUp}
              variant="profit"
            />
            <MetricCard
              label="Worst Trade"
              value={`$${metrics.worstTrade.toFixed(2)}`}
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

      {/* Previous Reports */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Previous Reports</CardTitle>
          <CardDescription>Access and download your historical reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.period}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={cn(
                    'font-semibold font-mono-numbers',
                    report.pnl >= 0 ? 'text-profit' : 'text-loss'
                  )}>
                    {report.pnl >= 0 ? '+' : ''}${report.pnl.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {report.status.toUpperCase()}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Choose your preferred export format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="font-medium">PDF Report</span>
              <span className="text-xs text-muted-foreground">Full formatted report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-8 w-8 text-success" />
              <span className="font-medium">CSV Data</span>
              <span className="text-xs text-muted-foreground">Raw trade data export</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Share2 className="h-8 w-8 text-accent" />
              <span className="font-medium">Share Link</span>
              <span className="text-xs text-muted-foreground">Generate shareable report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
