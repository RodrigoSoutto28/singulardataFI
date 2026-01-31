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
import { useLanguage } from '@/contexts/LanguageContext';

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

// Insight data keys for translation lookup
type InsightKey = 'overtradingAlert' | 'fridayPattern' | 'eurUsdEdge' | 'riskManagement' | 'cryptoPotential';
type ActionKey = 'viewTradingFrequency' | 'analyzeFridayTrades' | 'viewStrategyDetails' | 'reviewRiskSettings' | 'portfolioAnalysis';

interface InsightData {
  id: string;
  type: 'warning' | 'opportunity' | 'pattern' | 'edge' | 'overtrading';
  severity: 'low' | 'medium' | 'high';
  titleKey: InsightKey;
  actionKey: ActionKey;
  isNew: boolean;
  confidence?: number;
}

const mockInsightsData: InsightData[] = [
  {
    id: '1',
    type: 'overtrading',
    severity: 'high',
    titleKey: 'overtradingAlert',
    actionKey: 'viewTradingFrequency',
    isNew: true,
    confidence: 94,
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'medium',
    titleKey: 'fridayPattern',
    actionKey: 'analyzeFridayTrades',
    isNew: true,
    confidence: 87,
  },
  {
    id: '3',
    type: 'edge',
    severity: 'low',
    titleKey: 'eurUsdEdge',
    actionKey: 'viewStrategyDetails',
    isNew: false,
    confidence: 91,
  },
  {
    id: '4',
    type: 'warning',
    severity: 'medium',
    titleKey: 'riskManagement',
    actionKey: 'reviewRiskSettings',
    isNew: false,
    confidence: 96,
  },
  {
    id: '5',
    type: 'opportunity',
    severity: 'low',
    titleKey: 'cryptoPotential',
    actionKey: 'portfolioAnalysis',
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

export default function Insights() {
  const { t } = useLanguage();
  const newInsights = mockInsightsData.filter((i) => i.isNew);
  const allInsights = mockInsightsData;

  function InsightCard({ insight }: { insight: InsightData }) {
    const Icon = insightIcons[insight.type];
    const colors = insightColors[insight.type];
    
    const title = t.insights.insightTitles[insight.titleKey];
    const description = t.insights.insightDescriptions[insight.titleKey];
    const details = t.insights.insightDetails[insight.titleKey];
    const actionLabel = t.insights.insightActions[insight.actionKey];

    return (
      <Card className={cn('border transition-all hover:shadow-lg', colors.bg, colors.border)}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={cn('flex items-center justify-center h-12 w-12 rounded-xl shrink-0', colors.bg)}>
              <Icon className={cn('h-6 w-6', colors.icon)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{title}</h3>
                {insight.isNew && (
                  <Badge className="bg-primary/20 text-primary text-[10px] h-5">{t.common.new}</Badge>
                )}
                <Badge className={cn('text-[10px] h-5', severityColors[insight.severity])}>
                  {insight.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              <p className="text-xs text-muted-foreground/80 mb-4">{details}</p>
              
              {insight.confidence && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t.insights.aiConfidence}</span>
                    <span className="font-medium font-mono-numbers">{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-1.5" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" className="gap-2">
                  {actionLabel}
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  {t.common.dismiss}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{t.insights.title}</h1>
            <Badge className="bg-primary/20 text-primary">{t.insights.poweredByAI}</Badge>
          </div>
          <p className="text-muted-foreground">
            {t.insights.subtitle}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {t.insights.refreshAnalysis}
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
                <p className="text-sm text-muted-foreground">{t.insights.patternsDetected}</p>
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
                <p className="text-sm text-muted-foreground">{t.insights.edgesFound}</p>
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
                <p className="text-sm text-muted-foreground">{t.insights.warnings}</p>
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
                <p className="text-sm text-muted-foreground">{t.insights.actionsTaken}</p>
                <p className="text-2xl font-bold font-mono-numbers">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Categories */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm">{t.insights.allInsights}</Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4 text-destructive" />
          {t.insights.overtrading}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Repeat className="h-4 w-4 text-primary" />
          {t.insights.patterns}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="h-4 w-4 text-accent" />
          {t.insights.edges}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          {t.insights.warnings}
        </Button>
      </div>

      {/* New Insights */}
      {newInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t.insights.newInsights}
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
        <h2 className="text-lg font-semibold">{t.insights.allInsights}</h2>
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
            {t.insights.aiCapabilities}
          </CardTitle>
          <CardDescription>{t.insights.whatAiAnalyzes}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.overtradingDetection}</p>
                <p className="text-xs text-muted-foreground">{t.insights.overtradingDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.patternRecognition}</p>
                <p className="text-xs text-muted-foreground">{t.insights.patternDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.edgeDiscovery}</p>
                <p className="text-xs text-muted-foreground">{t.insights.edgeDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.riskAnalysis}</p>
                <p className="text-xs text-muted-foreground">{t.insights.riskDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.timeAnalysis}</p>
                <p className="text-xs text-muted-foreground">{t.insights.timeDesc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.insights.psychologyCorrelation}</p>
                <p className="text-xs text-muted-foreground">{t.insights.psychologyDesc}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
