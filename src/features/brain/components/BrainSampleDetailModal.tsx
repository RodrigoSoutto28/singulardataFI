import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Loader2, RefreshCw, Trash2, Sparkles, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useSignedImage } from '../hooks/useBrainSamples';
import { outcomeLabel, sessionLabel, tagLabel } from '../utils/labels';
import type { BrainSample } from '../types';
import { cn } from '@/shared/lib/utils';

interface Props {
  sample: BrainSample | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReanalyze: (id: string) => void;
  onDelete: (sample: BrainSample) => void;
  isAnalyzing: boolean;
}

export function BrainSampleDetailModal({
  sample,
  open,
  onOpenChange,
  onReanalyze,
  onDelete,
  isAnalyzing,
}: Props) {
  const { t } = useLanguage();
  const { data: url } = useSignedImage(sample?.image_path);
  const [zoomed, setZoomed] = useState(false);

  if (!sample) return null;

  const score = sample.ai_quality_score ?? null;

  const facts = [
    { label: t.brain.session, value: sessionLabel(t, sample.session) },
    { label: t.brain.timeframe, value: sample.timeframe ?? '—' },
    {
      label: t.brain.rMultiple,
      value: sample.r_multiple != null ? `${sample.r_multiple}R` : '—',
      mono: true,
    },
    { label: t.brain.setupType, value: sample.setup_type ?? '—' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-lg">{sample.symbol}</span>
            <Badge variant={sample.outcome === 'win' ? 'default' : 'destructive'}>
              {outcomeLabel(t, sample.outcome)}
            </Badge>
            <span className="text-xs font-normal text-muted-foreground">
              {sessionLabel(t, sample.session)}
              {sample.timeframe ? ` · ${sample.timeframe}` : ''}
            </span>
            {score != null && (
              <span className="ml-auto rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-mono font-bold text-primary">
                {score}/100
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          {url && (
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className="group relative block w-full overflow-hidden rounded-lg border border-border"
              aria-label={t.brain.zoomHint}
            >
              <img
                src={url}
                alt={`${sample.symbol} — ${sessionLabel(t, sample.session)}`}
                className={cn(
                  'w-full transition-transform duration-300',
                  zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                )}
              />
              {!zoomed && (
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" /> {t.brain.zoomHint}
                </span>
              )}
            </button>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
                <p className={cn('text-sm font-semibold truncate', f.mono && 'font-mono')}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>

          {/* Análisis IA */}
          <section className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                {t.brain.aiAnalysis}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReanalyze(sample.id)}
                disabled={isAnalyzing}
                className="gap-1.5"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {t.brain.reanalyze}
              </Button>
            </div>

            {sample.ai_status === 'done' ? (
              <>
                {score != null && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.brain.qualityScore}</span>
                      <span className="font-mono font-bold">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                )}

                {sample.ai_patterns?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">{t.brain.patterns}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sample.ai_patterns.map((p) => (
                        <Badge key={p} variant="secondary">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{sample.ai_summary}</p>
              </>
            ) : sample.ai_status === 'error' ? (
              <p className="text-sm text-destructive">{t.brain.aiError}</p>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {sample.ai_status === 'analyzing' ? t.brain.analyzing : t.brain.aiPending}
              </p>
            )}
          </section>

          {/* Contexto del operador */}
          {(sample.structure_tags?.length > 0 || sample.notes) && (
            <section className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-sm font-semibold">{t.brain.contextBlock}</p>

              {sample.structure_tags?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{t.brain.structure}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sample.structure_tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tagLabel(t, tag)}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {sample.notes && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{t.brain.notes}</p>
                  <p className="text-sm whitespace-pre-wrap">{sample.notes}</p>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="flex justify-end border-t border-border/60 bg-muted/20 px-6 py-3">
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              if (window.confirm(t.brain.deleteConfirm)) {
                onDelete(sample);
                onOpenChange(false);
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.common.delete}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
