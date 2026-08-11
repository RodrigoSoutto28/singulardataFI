import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ImageOff, Info } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useSignedImage } from '../hooks/useBrainSamples';
import { sessionLabel } from '../utils/labels';
import { buildSessionPatternGroups, type ConfidenceLevel } from '../utils/pattern-stats';
import type { BrainSample } from '../types';

function ExampleThumb({ sample, onClick }: { sample: BrainSample; onClick: () => void }) {
  const { t } = useLanguage();
  const { data: url } = useSignedImage(sample.image_path);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${sample.symbol} · ${sessionLabel(t, sample.session)}`}
      className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted transition-colors hover:border-primary/60"
    >
      {url ? (
        <img
          src={url}
          alt={`${sample.symbol} — ${sessionLabel(t, sample.session)}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground" />
      )}
      <span className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 text-[10px] font-mono truncate">
        {sample.symbol}
      </span>
    </button>
  );
}

const CONFIDENCE_VARIANT: Record<ConfidenceLevel, 'success' | 'default' | 'warning' | 'outline'> = {
  high: 'success',
  medium: 'default',
  low: 'warning',
  insufficient: 'outline',
};

export function BrainPatternInsights({
  samples,
  onSelectSample,
}: {
  samples: BrainSample[];
  onSelectSample: (sample: BrainSample) => void;
}) {
  const { t } = useLanguage();
  const [outcome, setOutcome] = useState<'all' | 'win' | 'stop'>('all');
  const [minOccurrences, setMinOccurrences] = useState('1');

  const confidenceLabel: Record<ConfidenceLevel, string> = {
    high: t.brain.confidenceHigh,
    medium: t.brain.confidenceMedium,
    low: t.brain.confidenceLow,
    insufficient: t.brain.confidenceInsufficient,
  };

  const groups = useMemo(
    () =>
      buildSessionPatternGroups(samples, {
        outcome,
        minOccurrences: Number(minOccurrences) || 1,
      }),
    [samples, outcome, minOccurrences],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t.brain.patternsTitle}</h2>
        <p className="text-sm text-muted-foreground">{t.brain.patternsSubtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={outcome} onValueChange={(v) => setOutcome(v as 'all' | 'win' | 'stop')}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder={t.brain.filterOutcome} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.brain.all}</SelectItem>
            <SelectItem value="win">{t.brain.outcomeWin}</SelectItem>
            <SelectItem value="stop">{t.brain.outcomeStop}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={minOccurrences} onValueChange={setMinOccurrences}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder={t.brain.minOccurrences} />
          </SelectTrigger>
          <SelectContent>
            {['1', '2', '3', '5'].map((v) => (
              <SelectItem key={v} value={v}>
                {t.brain.minOccurrences}: {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center gap-2">
            <p className="text-sm font-medium">{t.brain.patternsEmpty}</p>
            <p className="text-xs text-muted-foreground">{t.brain.patternsEmptyDesc}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card key={group.session}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">{sessionLabel(t, group.session)}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {group.sampleCount} {t.brain.sessionSamples} · {group.winRate}%{' '}
                    {t.brain.winRateShort.toLowerCase()}
                    {group.avgR != null ? ` · ${group.avgR.toFixed(2)}R` : ''}
                  </p>
                </div>

                <div className="space-y-4">
                  {group.patterns.map((p) => (
                    <div key={p.pattern} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate" title={p.pattern}>
                          {p.pattern}
                        </p>
                        <Badge variant={CONFIDENCE_VARIANT[p.confidence]} className="shrink-0">
                          {t.brain.confidence}: {confidenceLabel[p.confidence]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Progress value={p.winRate} className="h-1.5" />
                        <span className="shrink-0 font-mono text-xs">{p.winRate}%</span>
                      </div>

                      <p className="text-[11px] font-mono text-muted-foreground">
                        {p.count} {t.brain.occurrences}
                        {p.avgR != null ? ` · ${t.brain.avgR} ${p.avgR.toFixed(2)}R` : ''}
                        {p.avgQuality != null
                          ? ` · ${t.brain.avgQuality} ${Math.round(p.avgQuality)}/100`
                          : ''}
                      </p>

                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          {t.brain.featuredExamples}
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {p.examples.map((sample) => (
                            <ExampleThumb
                              key={sample.id}
                              sample={sample}
                              onClick={() => onSelectSample(sample)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        {t.brain.confidenceNote}
      </p>
    </div>
  );
}
