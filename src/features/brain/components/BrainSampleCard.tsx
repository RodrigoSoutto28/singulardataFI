import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Loader2, ImageOff, AlertTriangle, Sparkles } from 'lucide-react';
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
      className="group overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {url ? (
          <img
            src={url}
            alt={`${sample.symbol} — ${sessionLabel(t, sample.session)}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

        <Badge
          variant={sample.outcome === 'win' ? 'default' : 'destructive'}
          className="absolute top-2 left-2"
        >
          {outcomeLabel(t, sample.outcome)}
        </Badge>

        {sample.r_multiple != null && (
          <span className="absolute top-2 right-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-mono font-bold">
            {sample.r_multiple > 0 ? '+' : ''}
            {sample.r_multiple}R
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-sm font-bold truncate">{sample.symbol}</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {sessionLabel(t, sample.session)}
              {sample.timeframe ? ` · ${sample.timeframe}` : ''}
            </p>
          </div>
          {sample.ai_status === 'done' && sample.ai_quality_score != null && (
            <span className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[11px] font-mono font-bold text-primary">
              {sample.ai_quality_score}/100
            </span>
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {sample.ai_status === 'analyzing' || sample.ai_status === 'pending' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {sample.ai_status === 'analyzing' ? t.brain.analyzing : t.brain.aiPending}
            </>
          ) : sample.ai_status === 'error' ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">{t.brain.aiError}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{sample.ai_summary ?? t.brain.aiAnalysis}</span>
            </>
          )}
        </div>

        {sample.ai_patterns?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sample.ai_patterns.slice(0, 2).map((p) => (
              <Badge key={p} variant="outline" className="text-[10px] font-normal">
                {p}
              </Badge>
            ))}
            {sample.ai_patterns.length > 2 && (
              <Badge variant="outline" className="text-[10px] font-normal">
                +{sample.ai_patterns.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
