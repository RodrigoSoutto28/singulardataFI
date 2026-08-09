import { Card, CardContent } from '@/shared/components/ui/card';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { sessionLabel } from '../utils/labels';
import type { BrainSample } from '../types';

export function BrainSummary({ samples }: { samples: BrainSample[] }) {
  const { t } = useLanguage();

  const wins = samples.filter((s) => s.outcome === 'win').length;
  const stops = samples.length - wins;

  const bySession = samples.reduce<Record<string, number>>((acc, s) => {
    acc[s.session] = (acc[s.session] ?? 0) + 1;
    return acc;
  }, {});
  const topSession = Object.entries(bySession).sort((a, b) => b[1] - a[1])[0];

  const patternCount = samples.reduce<Record<string, number>>((acc, s) => {
    (s.ai_patterns ?? []).forEach((p) => {
      acc[p] = (acc[p] ?? 0) + 1;
    });
    return acc;
  }, {});
  const topPatterns = Object.entries(patternCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const items = [
    { label: t.brain.totalSamples, value: String(samples.length) },
    { label: t.brain.winsVsStops, value: `${wins} / ${stops}` },
    {
      label: t.brain.bySession,
      value: topSession ? `${sessionLabel(t, topSession[0])} (${topSession[1]})` : '—',
    },
    {
      label: t.brain.topPatterns,
      value: topPatterns.length ? topPatterns.map(([p]) => p).join(', ') : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-bold truncate" title={item.value}>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
