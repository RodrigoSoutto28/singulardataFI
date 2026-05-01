import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Brain,
  Moon,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Plus,
  BookOpen,
  Shield,
  Leaf,
  Minus,
  Zap,
  AlertCircle,
  ShieldAlert,
  Flame,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePsychologyEntries, PsychologyEntry } from '@/hooks/usePsychologyEntries';
import { toast } from 'sonner';

type Emotion = 'confident' | 'fearful' | 'greedy' | 'calm' | 'anxious' | 'frustrated' | 'excited' | 'neutral' | 'fomo' | 'vengeful';

interface EmotionOption {
  value: Emotion;
  color: string;
  Icon: LucideIcon;
  negative?: boolean;
}

const emotions: EmotionOption[] = [
  // Positive / neutral
  { value: 'confident', color: 'bg-success/20 text-success border-success/30', Icon: Shield },
  { value: 'calm', color: 'bg-primary/20 text-primary border-primary/30', Icon: Leaf },
  { value: 'neutral', color: 'bg-muted text-muted-foreground border-border', Icon: Minus },
  { value: 'excited', color: 'bg-accent/20 text-accent border-accent/30', Icon: Zap },
  // Negative (warning/destructive tones)
  { value: 'fomo', color: 'bg-warning/20 text-warning border-warning/40', Icon: AlertCircle, negative: true },
  { value: 'anxious', color: 'bg-warning/20 text-warning border-warning/40', Icon: ShieldAlert, negative: true },
  { value: 'frustrated', color: 'bg-destructive/20 text-destructive border-destructive/40', Icon: Flame, negative: true },
  { value: 'vengeful', color: 'bg-destructive/20 text-destructive border-destructive/40', Icon: TrendingUp, negative: true },
];

export default function Psychology() {
  const { t } = useLanguage();
  const { entries, isLoading, stats, createEntry } = usePsychologyEntries();
  
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [disciplineScore, setDisciplineScore] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([4]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [goals, setGoals] = useState('');

  const getEmotionLabel = (emotion: Emotion) => {
    return t.psychology.emotions[emotion];
  };

  const handleSaveEntry = async () => {
    if (!selectedEmotion) {
      toast.error('Selecciona tu estado emocional');
      return;
    }

    try {
      await createEntry.mutateAsync({
        pre_trade_emotion: selectedEmotion,
        discipline_score: disciplineScore[0],
        sleep_quality: sleepQuality[0],
        stress_level: stressLevel[0],
        lessons_learned: lessonsLearned || null,
        goals_for_tomorrow: goals || null,
        followed_rules: disciplineScore[0] >= 7,
      });

      // Reset form
      setSelectedEmotion(null);
      setDisciplineScore([7]);
      setSleepQuality([4]);
      setStressLevel([3]);
      setLessonsLearned('');
      setGoals('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  function EmotionBadge({ emotion }: { emotion: Emotion }) {
    const emotionData = emotions.find((e) => e.value === emotion);
    if (!emotionData) return null;

    const IconComponent = emotionData.Icon;
    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1', emotionData.color)}>
        <IconComponent className="h-3 w-3" />
        {getEmotionLabel(emotion)}
      </span>
    );
  }

  function MetricBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
    const percentage = (value / max) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{value}/{max}</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all', color)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  function EntryCard({ entry }: { entry: PsychologyEntry }) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(entry.entry_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {entry.pre_trade_emotion && <EmotionBadge emotion={entry.pre_trade_emotion as Emotion} />}
            {entry.post_trade_emotion && (
              <>
                <span className="text-muted-foreground">→</span>
                <EmotionBadge emotion={entry.post_trade_emotion as Emotion} />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricBar
            value={entry.discipline_score ?? 0}
            max={10}
            label={t.psychology.disciplineScore}
            color={(entry.discipline_score ?? 0) >= 7 ? 'bg-success' : (entry.discipline_score ?? 0) >= 5 ? 'bg-warning' : 'bg-destructive'}
          />
          <MetricBar
            value={entry.sleep_quality ?? 0}
            max={5}
            label={t.psychology.sleepQuality}
            color={(entry.sleep_quality ?? 0) >= 4 ? 'bg-success' : (entry.sleep_quality ?? 0) >= 3 ? 'bg-warning' : 'bg-destructive'}
          />
          <MetricBar
            value={entry.stress_level ?? 0}
            max={5}
            label={t.psychology.stressLevel}
            color={(entry.stress_level ?? 0) <= 2 ? 'bg-success' : (entry.stress_level ?? 0) <= 3 ? 'bg-warning' : 'bg-destructive'}
          />
        </div>

        {entry.lessons_learned && (
          <div className="flex items-start gap-2">
            {entry.followed_rules ? (
              <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            )}
            <p className="text-sm text-muted-foreground">{entry.lessons_learned}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.psychology.title}</h1>
          <p className="text-muted-foreground">{t.psychology.subtitle}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.psychology.avgDiscipline}</p>
                <p className="text-2xl font-bold font-mono-numbers">{stats.avgDiscipline.toFixed(1)}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.psychology.rulesFollowed}</p>
                <p className="text-2xl font-bold font-mono-numbers">{stats.rulesFollowed}/{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/20">
                <Moon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.psychology.avgSleep}</p>
                <p className="text-2xl font-bold font-mono-numbers">{stats.avgSleep.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-warning/20">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.psychology.entriesThisWeek}</p>
                <p className="text-2xl font-bold font-mono-numbers">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Entry Form */}
        <Card className="lg:col-span-1 bg-card border-border flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {t.psychology.todaysCheckin}
            </CardTitle>
            <CardDescription>{t.psychology.howAreYou}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            {/* Emotion Selection — 8 options, negatives styled distinctly */}
            <div className="space-y-3">
              <Label>{t.psychology.currentEmotion}</Label>
              <div className="grid grid-cols-2 gap-2">
                {emotions.map((emotion) => {
                  const isSelected = selectedEmotion === emotion.value;
                  const baseUnselected = emotion.negative
                    ? 'bg-warning/5 border-warning/20 hover:border-warning/40 text-foreground'
                    : 'bg-muted/30 border-border hover:border-primary/30';
                  return (
                    <button
                      key={emotion.value}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        isSelected ? emotion.color : baseUnselected
                      )}
                    >
                      <emotion.Icon className="h-5 w-5" />
                      <p className="text-sm font-medium mt-1">{getEmotionLabel(emotion.value)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discipline Score */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{t.psychology.disciplineScore}</Label>
                <span className="text-sm font-medium font-mono-numbers">{disciplineScore[0]}/10</span>
              </div>
              <Slider
                value={disciplineScore}
                onValueChange={setDisciplineScore}
                max={10}
                min={1}
                step={1}
                className="py-2"
              />
            </div>

            {/* Sleep Quality */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{t.psychology.sleepQuality}</Label>
                <span className="text-sm font-medium font-mono-numbers">{sleepQuality[0]}/5</span>
              </div>
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={5}
                min={1}
                step={1}
                className="py-2"
              />
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{t.psychology.stressLevel}</Label>
                <span className="text-sm font-medium font-mono-numbers">{stressLevel[0]}/5</span>
              </div>
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                max={5}
                min={1}
                step={1}
                className="py-2"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>{t.psychology.lessonsLearned}</Label>
              <Textarea
                placeholder={t.psychology.whatDidYouLearn}
                className="bg-muted/50 min-h-[80px]"
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
              />
            </div>
          </CardContent>

          {/* Sticky footer — save button always visible */}
          <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-card/95 backdrop-blur-sm rounded-b-lg">
            <Button
              className="w-full"
              onClick={handleSaveEntry}
              disabled={createEntry.isPending}
            >
              {createEntry.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t.psychology.saveEntry}
            </Button>
          </div>
        </Card>
        {/* Recent Entries */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t.psychology.recentEntries}
            </CardTitle>
            <CardDescription>{t.psychology.journalHistory}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No hay entradas psicológicas aún</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Completa tu primer check-in del día para comenzar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
