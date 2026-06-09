import { useState, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Brain,
  Target,
  Clock,
  Repeat,
  Zap,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useInsights } from '@/features/analytics/hooks/useInsights';
import { useTrades } from '@/features/journal/hooks/useTrades';

const insightIcons: Record<string, any> = {
  warning: AlertTriangle,
  opportunity: TrendingUp,
  pattern: Repeat,
  edge: Target,
  overtrading: Clock,
};

const insightColors: Record<string, { bg: string; border: string; icon: string }> = {
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

const severityColors: Record<string, string> = {
  info: 'bg-primary/20 text-primary',
  warn: 'bg-warning/20 text-warning',
  error: 'bg-destructive/20 text-destructive',
};

export default function Insights() {
  const { t, language } = useLanguage();
  const { insights, newInsights, readInsights, stats, isLoading, markAsRead, refetch } = useInsights();
  const { trades } = useTrades();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredNewInsights = useMemo(() => {
    if (categoryFilter === 'all') return newInsights;
    return newInsights.filter(i => i.insight_type === categoryFilter);
  }, [newInsights, categoryFilter]);

  const filteredReadInsights = useMemo(() => {
    if (categoryFilter === 'all') return readInsights;
    return readInsights.filter(i => i.insight_type === categoryFilter);
  }, [readInsights, categoryFilter]);

  const hasData = trades.length >= 5;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header actions only */}
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => refetch()}
        >
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
                <p className="text-2xl font-bold font-mono-numbers">{stats.patternsDetected}</p>
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
                <p className="text-2xl font-bold font-mono-numbers">{stats.edgesFound}</p>
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
                <p className="text-2xl font-bold font-mono-numbers">{stats.warnings}</p>
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
                <p className="text-2xl font-bold font-mono-numbers">{stats.actionsTaken}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Categories */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={categoryFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setCategoryFilter('all')}
        >
          {t.insights.allInsights}
        </Button>
        <Button 
          variant={categoryFilter === 'overtrading' ? 'default' : 'outline'} 
          size="sm" 
          className="gap-2"
          onClick={() => setCategoryFilter('overtrading')}
        >
          <Clock className="h-4 w-4 text-destructive" />
          {t.insights.overtrading}
        </Button>
        <Button 
          variant={categoryFilter === 'pattern' ? 'default' : 'outline'} 
          size="sm" 
          className="gap-2"
          onClick={() => setCategoryFilter('pattern')}
        >
          <Repeat className="h-4 w-4 text-primary" />
          {t.insights.patterns}
        </Button>
        <Button 
          variant={categoryFilter === 'edge' ? 'default' : 'outline'} 
          size="sm" 
          className="gap-2"
          onClick={() => setCategoryFilter('edge')}
        >
          <Target className="h-4 w-4 text-accent" />
          {t.insights.edges}
        </Button>
        <Button 
          variant={categoryFilter === 'warning' ? 'default' : 'outline'} 
          size="sm" 
          className="gap-2"
          onClick={() => setCategoryFilter('warning')}
        >
          <AlertTriangle className="h-4 w-4 text-warning" />
          {t.insights.warnings}
        </Button>
      </div>

      {!hasData ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="text-center">
              <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.extra?.startLoggingTrades ?? 'Start logging trades'}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {t.extra?.needFiveTrades ?? 'You need at least 5 trades'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : insights.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.extra?.noInsightsYet ?? 'No insights yet'}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {t.extra?.insightsGeneratedAuto ?? 'Insights will appear automatically'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* New Insights */}
          {filteredNewInsights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t.insights.newInsights}
                <Badge className="bg-destructive text-destructive-foreground text-xs">
                  {filteredNewInsights.length}
                </Badge>
              </h2>
              <div className="grid gap-4">
                {filteredNewInsights.map((insight) => {
                  const Icon = insightIcons[insight.insight_type] || Brain;
                  const colors = insightColors[insight.insight_type] || insightColors.pattern;
                  
                  return (
                    <Card key={insight.id} className={cn('border transition-colors', colors.bg, colors.border)}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={cn('flex items-center justify-center h-12 w-12 rounded-lg shrink-0', colors.bg)}>
                            <Icon className={cn('h-6 w-6', colors.icon)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              <Badge className="bg-primary/20 text-primary text-[10px] h-5">{t.common.new}</Badge>
                              {insight.severity && (
                                <Badge className={cn('text-[10px] h-5', severityColors[insight.severity])}>
                                  {insight.severity.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{insight.content}</p>

                            <div className="flex items-center gap-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => markAsRead.mutate(insight.id)}
                              >
                                {{ ES: 'Marcar como leído', EN: 'Mark as read', PT: 'Marcar como lido' }[language]}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Read Insights */}
          {readInsights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.insights.allInsights}</h2>
              <div className="grid gap-4">
                {readInsights.map((insight) => {
                  const Icon = insightIcons[insight.insight_type] || Brain;
                  const colors = insightColors[insight.insight_type] || insightColors.pattern;
                  
                  return (
                    <Card key={insight.id} className={cn('border transition-colors opacity-70', colors.bg, colors.border)}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={cn('flex items-center justify-center h-12 w-12 rounded-lg shrink-0', colors.bg)}>
                            <Icon className={cn('h-6 w-6', colors.icon)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              {insight.severity && (
                                <Badge className={cn('text-[10px] h-5', severityColors[insight.severity])}>
                                  {insight.severity.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Capabilities */}
      <Card className="bg-card border-primary/20">
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


