import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Clock,
  Repeat,
  Zap,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'warning' | 'opportunity' | 'pattern' | 'edge' | 'overtrading';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  details: string;
  actionLabel: string;
  isNew: boolean;
  confidence?: number;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'overtrading',
    severity: 'high',
    title: 'Overtrading Alert',
    description: 'You made 15 trades this week, 67% above your 6-month average of 9 trades.',
    details: 'Historical data shows your win rate drops by 18% when trading more than 12 times per week. Consider slowing down to maintain quality over quantity.',
    actionLabel: 'View Trading Frequency',
    isNew: true,
    confidence: 94,
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'medium',
    title: 'Recurring Loss Pattern: Friday Afternoon',
    description: 'Your trades on Friday after 14:00 show a 23% lower win rate.',
    details: 'Analysis of 47 Friday afternoon trades shows a 41% win rate vs 64% overall. Consider avoiding new positions during this window.',
    actionLabel: 'Analyze Friday Trades',
    isNew: true,
    confidence: 87,
  },
  {
    id: '3',
    type: 'edge',
    severity: 'low',
    title: 'Statistical Edge: EUR/USD London Session',
    description: 'Long positions during London session (08:00-10:00 GMT) show a 73% win rate.',
    details: 'Based on 34 trades over 6 months. Average R:R of 1.8:1. This represents a significant edge worth exploiting.',
    actionLabel: 'View Strategy Details',
    isNew: false,
    confidence: 91,
  },
  {
    id: '4',
    type: 'warning',
    severity: 'medium',
    title: 'Risk Management Issue',
    description: 'Average loss size increased by 34% this month compared to last month.',
    details: 'Your average loss went from $87 to $117. Review your stop-loss placement and position sizing.',
    actionLabel: 'Review Risk Settings',
    isNew: false,
    confidence: 96,
  },
  {
    id: '5',
    type: 'opportunity',
    severity: 'low',
    title: 'Untapped Potential: Crypto Markets',
    description: 'Your crypto trades show a 78% win rate but represent only 12% of your portfolio.',
    details: 'Consider increasing allocation to crypto markets where you demonstrate consistent edge.',
    actionLabel: 'Portfolio Analysis',
    isNew: false,
    confidence: 82,
  },
];

const insightIcons = {
  warning: AlertTriangle,
  opportunity: TrendingUp,
  pattern: Repeat,
  edge: Target,
  overtrading: Clock,
};

const insightColors = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: 'text-warning',
  },
  opportunity: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    icon: 'text-success',
  },
  pattern: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    icon: 'text-primary',
  },
  edge: {
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    icon: 'text-accent',
  },
  overtrading: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    icon: 'text-destructive',
  },
};

const severityColors = {
  low: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-destructive/20 text-destructive',
};

function InsightCard({ insight }: { insight: Insight }) {
  const Icon = insightIcons[insight.type];
  const colors = insightColors[insight.type];

  return (
    <Card className={cn('border transition-all hover:shadow-lg', colors.bg, colors.border)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={cn('flex items-center justify-center h-12 w-12 rounded-xl shrink-0', colors.bg)}>
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{insight.title}</h3>
              {insight.isNew && (
                <Badge className="bg-primary/20 text-primary text-[10px] h-5">NEW</Badge>
              )}
              <Badge className={cn('text-[10px] h-5', severityColors[insight.severity])}>
                {insight.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
            <p className="text-xs text-muted-foreground/80 mb-4">{insight.details}</p>
            
            {insight.confidence && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-medium font-mono-numbers">{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-1.5" />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="gap-2">
                {insight.actionLabel}
                <ChevronRight className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Insights() {
  const newInsights = mockInsights.filter((i) => i.isNew);
  const allInsights = mockInsights;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">AI Insights</h1>
            <Badge className="bg-primary/20 text-primary">Powered by AI</Badge>
          </div>
          <p className="text-muted-foreground">
            Machine learning analysis of your trading patterns
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patterns Detected</p>
                <p className="text-2xl font-bold font-mono-numbers">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-success/20">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Edges Found</p>
                <p className="text-2xl font-bold font-mono-numbers">7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold font-mono-numbers">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/20">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actions Taken</p>
                <p className="text-2xl font-bold font-mono-numbers">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Categories */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm">All Insights</Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4 text-destructive" />
          Overtrading
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Repeat className="h-4 w-4 text-primary" />
          Patterns
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="h-4 w-4 text-accent" />
          Edges
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Warnings
        </Button>
      </div>

      {/* New Insights */}
      {newInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            New Insights
            <Badge className="bg-destructive text-destructive-foreground text-xs">
              {newInsights.length}
            </Badge>
          </h2>
          <div className="grid gap-4">
            {newInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* All Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Insights</h2>
        <div className="grid gap-4">
          {allInsights
            .filter((i) => !i.isNew)
            .map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
        </div>
      </div>

      {/* AI Capabilities */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis Capabilities
          </CardTitle>
          <CardDescription>What our AI engine analyzes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Overtrading Detection</p>
                <p className="text-xs text-muted-foreground">Monitors trade frequency and quality</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Pattern Recognition</p>
                <p className="text-xs text-muted-foreground">Finds recurring errors and patterns</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Edge Discovery</p>
                <p className="text-xs text-muted-foreground">Identifies statistical advantages</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Risk Analysis</p>
                <p className="text-xs text-muted-foreground">Monitors risk management behavior</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Time Analysis</p>
                <p className="text-xs text-muted-foreground">Best and worst trading times</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">Psychology Correlation</p>
                <p className="text-xs text-muted-foreground">Links emotions to performance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
