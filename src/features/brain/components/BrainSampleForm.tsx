import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { toast } from 'sonner';
import { ImagePlus, Loader2, X, Check } from 'lucide-react';
import {
  BRAIN_SESSIONS,
  BRAIN_STRUCTURE_TAGS,
  type BrainOutcome,
  type BrainSampleInput,
  type BrainSession,
} from '../types';
import { validateImage } from '../hooks/useBrainSamples';
import { sessionLabel, tagLabel } from '../utils/labels';
import { cn } from '@/shared/lib/utils';

interface Props {
  onSubmit: (input: BrainSampleInput) => void;
  isSubmitting: boolean;
}

function nowLocalInput() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BrainSampleForm({ onSubmit, isSubmitting }: Props) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [session, setSession] = useState<BrainSession>('london');
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [occurredAt, setOccurredAt] = useState(nowLocalInput());
  const [tags, setTags] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<BrainOutcome>('win');
  const [rMultiple, setRMultiple] = useState('');
  const [setupType, setSetupType] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = !!file && symbol.trim().length > 0 && !isSubmitting;

  const handleFile = (f: File | null) => {
    if (!f) return;
    const error = validateImage(f);
    if (error) {
      toast.error(error);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Pegar captura desde el portapapeles
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/')
      );
      const f = item?.getAsFile();
      if (f) handleFile(f);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  const reset = () => {
    setFile(null);
    setPreview(null);
    setSymbol('');
    setTimeframe('');
    setTags([]);
    setRMultiple('');
    setSetupType('');
    setNotes('');
    setOccurredAt(nowLocalInput());
  };

  const completion = useMemo(() => {
    const checks = [
      !!file,
      symbol.trim().length > 0,
      timeframe.trim().length > 0,
      tags.length > 0,
      rMultiple.trim().length > 0,
      setupType.trim().length > 0,
      notes.trim().length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [file, symbol, timeframe, tags, rMultiple, setupType, notes]);

  const submit = () => {
    if (!file) {
      toast.error(t.brain.errorImage);
      return;
    }
    if (!symbol.trim()) {
      toast.error(t.brain.errorRequired);
      return;
    }
    const parsedR = rMultiple.trim() === '' ? null : Number(rMultiple);
    onSubmit({
      file,
      session,
      symbol: symbol.trim().toUpperCase(),
      timeframe: timeframe.trim(),
      occurred_at: new Date(occurredAt).toISOString(),
      structure_tags: tags,
      outcome,
      r_multiple: Number.isFinite(parsedR as number) ? (parsedR as number) : null,
      setup_type: setupType.trim(),
      notes: notes.trim(),
    });
    reset();
  };

  const tagOptions = useMemo(() => BRAIN_STRUCTURE_TAGS, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">{t.brain.addSample}</CardTitle>
          <div className="flex items-center gap-2 min-w-[160px]">
            <Progress value={completion} className="h-1.5 flex-1" />
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
              {completion}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* Columna imagen */}
          <div className="p-4 lg:border-r border-border/60 space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.brain.sampleImage} *
            </Label>
            {preview ? (
              <div className="relative w-full">
                <img
                  src={preview}
                  alt={t.brain.sampleImage}
                  className="w-full rounded-lg border border-border object-cover aspect-video"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  aria-label={t.common.delete}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 aspect-video rounded-lg border-2 border-dashed bg-muted/30 cursor-pointer transition-colors text-center px-4',
                  dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                )}
              >
                <ImagePlus className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm font-medium">{t.brain.dropImage}</span>
                <span className="text-xs text-muted-foreground">{t.brain.dropHint}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {/* Columna campos */}
          <div className="p-4 space-y-5">
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.brain.sectionCapture}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>{t.brain.session}</Label>
                  <Select value={session} onValueChange={(v) => setSession(v as BrainSession)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BRAIN_SESSIONS.map((s) => (
                        <SelectItem key={s} value={s}>{sessionLabel(t, s)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.brain.symbol} *</Label>
                  <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="EURUSD"
                    className="font-mono uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.brain.timeframe}</Label>
                  <Input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="M15" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.brain.occurredAt}</Label>
                  <Input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.brain.sectionResult}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>{t.brain.outcome}</Label>
                  <Select value={outcome} onValueChange={(v) => setOutcome(v as BrainOutcome)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="win">{t.brain.outcomeWin}</SelectItem>
                      <SelectItem value="stop">{t.brain.outcomeStop}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.brain.rMultiple}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={rMultiple}
                    onChange={(e) => setRMultiple(e.target.value)}
                    placeholder="2.5"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t.brain.setupType}</Label>
                  <Input value={setupType} onChange={(e) => setSetupType(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>{t.brain.structure}</Label>
                  {tags.length > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      {tags.length} {t.brain.tagsSelected}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => {
                    const active = tags.includes(tag);
                    return (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                        <Badge
                          variant={active ? 'default' : 'outline'}
                          className="cursor-pointer gap-1 transition-colors"
                        >
                          {active && <Check className="h-3 w-3" />}
                          {tagLabel(t, tag)}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t.brain.notes}</Label>
                <Textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.brain.notesPlaceholder}
                />
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {isSubmitting ? t.brain.uploading : `${t.brain.formProgress}: ${completion}%`}
          </p>
          <Button onClick={submit} disabled={!canSubmit}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting ? t.brain.saving : t.brain.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
