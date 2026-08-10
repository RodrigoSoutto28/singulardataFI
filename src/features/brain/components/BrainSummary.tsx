import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { sessionLabel } from '../utils/labels';
import { BRAIN_SESSIONS, type BrainSample } from '../types';

export function BrainSummary({ samples }: { samples: BrainSample[] }) {
  const { t } = useLanguage();

  const total = samples.length;
  const wins = samples.filter((s) => s.outcome === 'win').length;
  const stops = total - wins;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  const scored = samples.filter((s) => s.ai_quality_score != null);
  const avgQuality = scored.length
    ? Math.round(scored.reduce((a, s) => a + (s.ai_quality_score ?? 0), 0) / scored.length)
    : null;

  const sessionStats = BRAIN_SESSIONS.map((session) => {
    const list = samples.filter((s) => s.session === session);
    const w = list.filter((s) => s.outcome === 'win').length;
    return {
      session,
      count: list.length,
      winRate: list.length ? Math.round((w / list.length) * 100) : 0,
      share: total ? Math.round((list.length / total) * 100) : 0,
    };
  }).filter((s) => s.count > 0);

  const patternMap = new Map<string, { count: number; wins: number }>();
  samples.forEach((s) => {
    (s.ai_patterns ?? []).forEach((p) => {
      const entry = patternMap.get(p) ?? { count: 0, wins: 0 };
      entry.count += 1;
      if (s.outcome === 'win') entry.wins += 1;
      patternMap.set(p, entry);
    });
  });
  const topPatterns = Array.from(patternMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  const kpis = [
    { label: t.brain.totalSamples, value: String(total) },
    { label: t.brain.winsVsStops, value: `${wins} / ${stops}` },
    { label: t.brain.winRateShort, value: `${winRate}%` },
    { label: t.brain.avgQuality, value: avgQuality != null ? `${avgQuality}/100` : '—' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 space-y-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold font-mono truncate" title={item.value}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold">{t.brain.sessionBreakdown}</p>
            {sessionStats.length === 0 ? (
              <p className="text-xs text-muted-foreground">—</p>
            ) : (
              sessionStats.map((s) => (
                <div key={s.session} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{sessionLabel(t, s.session)}</span>
                    <span className="font-mono text-muted-foreground">
                      {s.count} · {s.winRate}% {t.brain.winRateShort.toLowerCase()}
                    </span>
                  </div>
                  <Progress value={s.share} className="h-1.5" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold">{t.brain.patternWinRate}</p>
            {topPatterns.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t.brain.topPatterns}: —</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topPatterns.map(([pattern, stat]) => (
                  <Badge key={pattern} variant="outline" className="gap-1.5 font-normal">
                    <span className="truncate max-w-[160px]">{pattern}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {stat.count} · {Math.round((stat.wins / stat.count) * 100)}%
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
