import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useSignedImage } from '../hooks/useBrainSamples';
import { outcomeLabel, sessionLabel, tagLabel } from '../utils/labels';
import type { BrainSample } from '../types';

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

  if (!sample) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono">{sample.symbol}</span>
            <Badge variant={sample.outcome === 'win' ? 'default' : 'destructive'}>
              {outcomeLabel(t, sample.outcome)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {url && (
            <img
              src={url}
              alt={`${sample.symbol} — ${sessionLabel(t, sample.session)}`}
              className="w-full rounded-lg border border-border"
            />
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t.brain.session}</p>
              <p className="font-medium">{sessionLabel(t, sample.session)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.brain.timeframe}</p>
              <p className="font-medium">{sample.timeframe ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.brain.rMultiple}</p>
              <p className="font-medium font-mono">{sample.r_multiple ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.brain.setupType}</p>
              <p className="font-medium">{sample.setup_type ?? '—'}</p>
            </div>
          </div>

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

          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{t.brain.aiAnalysis}</p>
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
                <p className="text-xs text-muted-foreground">
                  {t.brain.qualityScore}: {sample.ai_quality_score ?? '—'}/100
                </p>
                {sample.ai_patterns?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {sample.ai_patterns.map((p) => (
                      <Badge key={p} variant="secondary">{p}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{sample.ai_summary}</p>
              </>
            ) : sample.ai_status === 'error' ? (
              <p className="text-sm text-destructive">{t.brain.aiError}</p>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {sample.ai_status === 'analyzing' ? t.brain.analyzing : t.brain.aiPending}
              </p>
            )}
          </div>

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
