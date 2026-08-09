import { useMemo, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useBrainSamples } from './hooks/useBrainSamples';
import { BrainSampleForm } from './components/BrainSampleForm';
import { BrainSampleCard } from './components/BrainSampleCard';
import { BrainSampleDetailModal } from './components/BrainSampleDetailModal';
import { BrainSummary } from './components/BrainSummary';
import { BRAIN_SESSIONS, type BrainSample } from './types';
import { sessionLabel } from './utils/labels';
import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/components/ui/card';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';

const Brain3D = createIcon3DComponent('brain', true);

export default function MarketBrain() {
  const { t } = useLanguage();
  const { samples, isLoading, createSample, deleteSample, analyzeSample } = useBrainSamples();

  const [sessionFilter, setSessionFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<BrainSample | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return samples.filter((s) => {
      if (sessionFilter !== 'all' && s.session !== sessionFilter) return false;
      if (outcomeFilter !== 'all' && s.outcome !== outcomeFilter) return false;
      if (!q) return true;
      const haystack = [
        s.symbol,
        s.setup_type ?? '',
        s.notes ?? '',
        s.ai_summary ?? '',
        ...(s.ai_patterns ?? []),
        ...(s.structure_tags ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [samples, sessionFilter, outcomeFilter, search]);

  const current = selected ? samples.find((s) => s.id === selected.id) ?? selected : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0">
          <Brain3D className="h-full w-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t.brain.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t.brain.subtitle}</p>
        </div>
      </div>

      <BrainSummary samples={samples} />

      <BrainSampleForm
        isSubmitting={createSample.isPending}
        onSubmit={(input) =>
          createSample.mutate(input, {
            onSuccess: () => toast.success(t.brain.saved),
          })
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.brain.searchPlaceholder}
            className="sm:max-w-xs"
          />
          <Select value={sessionFilter} onValueChange={setSessionFilter}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder={t.brain.filterSession} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.brain.all}</SelectItem>
              {BRAIN_SESSIONS.map((s) => (
                <SelectItem key={s} value={s}>{sessionLabel(t, s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder={t.brain.filterOutcome} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.brain.all}</SelectItem>
              <SelectItem value="win">{t.brain.outcomeWin}</SelectItem>
              <SelectItem value="stop">{t.brain.outcomeStop}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.common.loading}</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center text-center gap-2">
              <div className="h-12 w-12"><Brain3D className="h-full w-full opacity-70" /></div>
              <p className="text-sm font-medium">{t.brain.empty}</p>
              <p className="text-xs text-muted-foreground">{t.brain.emptyDesc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((sample) => (
              <BrainSampleCard
                key={sample.id}
                sample={sample}
                onClick={() => setSelected(sample)}
              />
            ))}
          </div>
        )}
      </div>

      <BrainSampleDetailModal
        sample={current}
        open={!!current}
        onOpenChange={(open) => !open && setSelected(null)}
        isAnalyzing={analyzeSample.isPending}
        onReanalyze={(id) => analyzeSample.mutate(id)}
        onDelete={(sample) =>
          deleteSample.mutate(sample, { onSuccess: () => toast.success(t.brain.deleted) })
        }
      />
    </div>
  );
}
