import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2, ImageOff, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useSignedImage } from '../hooks/useBrainSamples';
import { outcomeLabel, sessionLabel } from '../utils/labels';
import type { BrainSample } from '../types';

interface Props {
  sample: BrainSample;
  onClick: () => void;
}

export function BrainSampleCard({ sample, onClick }: Props) {
  const { t } = useLanguage();
  const { data: url } = useSignedImage(sample.image_path);

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer transition-colors hover:border-primary/40"
    >
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        {url ? (
          <img
            src={url}
            alt={`${sample.symbol} — ${sessionLabel(t, sample.session)}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        )}
        <Badge
          variant={sample.outcome === 'win' ? 'default' : 'destructive'}
          className="absolute top-2 left-2"
        >
          {outcomeLabel(t, sample.outcome)}
        </Badge>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-bold truncate">{sample.symbol}</span>
          <span className="text-xs text-muted-foreground">
            {sessionLabel(t, sample.session)}
            {sample.timeframe ? ` · ${sample.timeframe}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {sample.ai_status === 'analyzing' || sample.ai_status === 'pending' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {sample.ai_status === 'analyzing' ? t.brain.analyzing : t.brain.aiPending}
            </>
          ) : sample.ai_status === 'error' ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              {t.brain.aiError}
            </>
          ) : (
            <span>
              {t.brain.qualityScore}: {sample.ai_quality_score ?? '—'}/100
            </span>
          )}
        </div>

        {sample.ai_patterns?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sample.ai_patterns.slice(0, 3).map((p) => (
              <Badge key={p} variant="outline" className="text-[10px]">
                {p}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
