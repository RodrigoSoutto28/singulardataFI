import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/shared/components/ui/alert';
import { cn } from '@/shared/lib/utils';
import {
  Brain,
  Moon,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  BookOpen,
  Shield,
  Leaf,
  Minus,
  Zap,
  AlertCircle,
  ShieldAlert,
  Flame,
  Loader2,
  Sparkles,
  Trophy,
  Clock,
  Target,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';
import { TaxometerDashboard } from '@/features/behavioral/components/TaxometerDashboard';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { usePsychologyEntries, PsychologyEntry } from '@/features/behavioral/hooks/usePsychologyEntries';
import { toast } from 'sonner';
import { psychologyEntrySchema } from '@/shared/lib/validation';

type Emotion =
  | 'confident'
  | 'fearful'
  | 'greedy'
  | 'calm'
  | 'anxious'
  | 'frustrated'
  | 'excited'
  | 'neutral'
  | 'fomo'
  | 'vengeful';

interface EmotionOption {
  value: Emotion;
  emoji: string;
  Icon: LucideIcon;
  negative?: boolean;
}

const emotions: EmotionOption[] = [
  { value: 'confident', emoji: '💪', Icon: Shield },
  { value: 'calm', emoji: '🧘', Icon: Leaf },
  { value: 'neutral', emoji: '😐', Icon: Minus },
  { value: 'excited', emoji: '⚡', Icon: Zap },
  { value: 'fomo', emoji: '😬', Icon: AlertCircle, negative: true },
  { value: 'anxious', emoji: '😰', Icon: ShieldAlert, negative: true },
  { value: 'frustrated', emoji: '😤', Icon: Flame, negative: true },
  { value: 'vengeful', emoji: '🔥', Icon: TrendingUp, negative: true },
];

// ---------- Page ----------
export default function Psychology() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'insights' | 'taxometer'>('today');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.psychology.title}</h1>
        <p className="text-muted-foreground mb-4">
          Tu bienestar mental es tu ventaja competitiva más importante.
        </p>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="today">
              <Calendar className="h-4 w-4 mr-2" />
              Hoy
            </TabsTrigger>
            <TabsTrigger value="history">
              <BookOpen className="h-4 w-4 mr-2" />
              Historial
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Sparkles className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="taxometer">
              <DollarSign className="h-4 w-4 mr-2" />
              Taxímetro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            <TodayCheckInView />
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <HistoryView />
          </TabsContent>
          <TabsContent value="insights" className="mt-6">
            <InsightsView />
          </TabsContent>
          <TabsContent value="taxometer" className="mt-6">
            <TaxometerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ---------- Today View ----------
function TodayCheckInView() {
  const { entries, latestEntry, stats } = usePsychologyEntries();

  const today = new Date().toDateString();
  const todayEntry =
    latestEntry && new Date(latestEntry.entry_date).toDateString() === today ? latestEntry : null;
  const hasCheckedIn = !!todayEntry;

  // Streak calculations
  const { currentStreak, bestStreak, checkedInThisWeek } = useMemo(() => {
    if (!entries.length) return { currentStreak: 0, bestStreak: 0, checkedInThisWeek: 0 };
    const days = new Set(entries.map((e) => new Date(e.entry_date).toDateString()));
    let cur = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) {
      cur++;
      cursor.setDate(cursor.getDate() - 1);
    }
    // best streak across history
    const sorted = [...days]
      .map((d) => new Date(d).getTime())
      .sort((a, b) => a - b);
    let best = 1;
    let run = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i] - sorted[i - 1]) / 86400000;
      if (diff === 1) {
        run++;
        best = Math.max(best, run);
      } else if (diff > 1) {
        run = 1;
      }
    }
    if (sorted.length === 0) best = 0;
    // this week
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const week = entries.filter((e) => new Date(e.entry_date) >= start).length;
    return { currentStreak: cur, bestStreak: best, checkedInThisWeek: Math.min(week, 7) };
  }, [entries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 md:gap-6">
      {/* Left - Stats */}
      <div className="space-y-4 md:space-y-6">

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Disciplina con barra */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Disciplina Promedio</span>
                <span className="font-bold font-mono text-sm">{stats.avgDiscipline.toFixed(1)}/10</span>
              </div>
              <Progress value={(stats.avgDiscipline / 10) * 100} className="h-1.5" />
            </div>

            {/* Rachas en grid de 2 columnas */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted/40 px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                  Racha actual
                </p>
                <p className="font-bold text-sm flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-[hsl(28_95%_55%)]" aria-hidden />
                  {currentStreak} días
                </p>
              </div>
              <div className="rounded-md bg-muted/40 px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                  Mejor racha
                </p>
                <p className="font-bold text-sm font-mono">{bestStreak} días</p>
              </div>
            </div>

            <Separator />

            {/* Tracker semanal con labels de días */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Esta semana
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {checkedInThisWeek}/7
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
                    <div
                      className={cn(
                        'w-full h-6 rounded-sm transition-colors',
                        i < checkedInThisWeek
                          ? 'bg-success/80'
                          : 'bg-muted border border-border/50'
                      )}
                      aria-label={i < checkedInThisWeek ? 'Check-in completado' : 'Sin check-in'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-[hsl(265_84%_60%/0.1)]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AchievementBadge
              Icon={Flame}
              title="Racha de Hierro"
              description="7 días consecutivos"
              unlocked={currentStreak >= 7}
            />
            <AchievementBadge
              Icon={Target}
              title="Disciplinado"
              description="Score promedio > 8"
              unlocked={stats.avgDiscipline >= 8}
            />
            <AchievementBadge
              Icon={BookOpen}
              title="Introspectivo"
              description="20 entradas de journal"
              unlocked={stats.totalEntries >= 20}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right - Form / Summary */}
      <div>
        {hasCheckedIn ? <CheckInSummaryCard entry={todayEntry!} /> : <CheckInFormCard />}
      </div>
    </div>
  );
}

// ---------- Achievement Badge ----------
function AchievementBadge({
  Icon,
  title,
  description,
  unlocked,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 rounded-lg border transition-all',
        unlocked
          ? 'border-primary/30 bg-primary/5'
          : 'border-border opacity-55 hover:opacity-75'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center h-9 w-9 rounded-md shrink-0',
          unlocked ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {unlocked && <CheckCircle className="h-4 w-4 text-success shrink-0" />}
    </div>
  );
}

// ---------- Check-in Summary ----------
function CheckInSummaryCard({ entry }: { entry: PsychologyEntry }) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Check-in Completado
            </CardTitle>
            <CardDescription>
              {new Date(entry.entry_date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-success/15 text-success">
            Hoy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-muted/40">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Disciplina</p>
            <p className="text-3xl font-bold font-mono mt-1">{entry.discipline_score}/10</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Sueño</p>
            <p className="text-3xl font-bold font-mono mt-1">{entry.sleep_quality}/5</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Estrés</p>
            <p className="text-3xl font-bold font-mono mt-1">{entry.stress_level}/5</p>
          </div>
        </div>

        {entry.pre_trade_emotion && (
          <div>
            <p className="text-sm font-medium mb-2">Estado emocional</p>
            <Badge variant="outline" className="text-sm">
              {t.psychology.emotions[entry.pre_trade_emotion as Emotion]}
            </Badge>
          </div>
        )}

        {entry.lessons_learned && (
          <div>
            <p className="text-sm font-medium mb-2">Notas</p>
            <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/40">
              {entry.lessons_learned}
            </p>
          </div>
        )}

        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Vuelve mañana para mantener tu racha y seguir construyendo disciplina.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// ---------- Check-in Form ----------
function CheckInFormCard() {
  const { t } = useLanguage();
  const { createEntry } = usePsychologyEntries();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [disciplineScore, setDisciplineScore] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([4]);
  const [stressLevel, setStressLevel] = useState([3]);
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const negativeSelected = !!emotions.find((e) => e.value === selectedEmotion)?.negative;

  const handleSave = async () => {
    setFormError(null);
    const parsed = psychologyEntrySchema.safeParse({
      emotion: selectedEmotion ?? undefined,
      disciplineScore: disciplineScore[0],
      sleepQuality: sleepQuality[0],
      stressLevel: stressLevel[0],
      lessonsLearned,
      goals: '',
    });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Datos inválidos';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    try {
      await createEntry.mutateAsync({
        pre_trade_emotion: parsed.data.emotion,
        discipline_score: parsed.data.disciplineScore,
        sleep_quality: parsed.data.sleepQuality,
        stress_level: parsed.data.stressLevel,
        lessons_learned: parsed.data.lessonsLearned || null,
        followed_rules: parsed.data.disciplineScore >= 7,
      });
    } catch {
      // handled by mutation
    }
  };

  const stressBadge =
    stressLevel[0] <= 2 ? 'Bajo' : stressLevel[0] <= 3 ? 'Moderado' : 'Alto';
  const stressVariant: 'default' | 'destructive' | 'secondary' =
    stressLevel[0] <= 2 ? 'secondary' : stressLevel[0] <= 3 ? 'default' : 'destructive';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Check-in del Día</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            2-3 min
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Emotion */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">1. ¿Cómo te sientes ahora?</Label>
          <div className="grid grid-cols-4 gap-2">
            {emotions.map((emotion) => {
              const isSelected = selectedEmotion === emotion.value;
              const isNegative = emotion.negative;
              return (
                <button
                  key={emotion.value}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion.value)}
                  className={cn(
                    'group p-2.5 rounded-lg border transition-all text-center',
                    'flex flex-col items-center justify-center gap-1.5 min-h-[78px]',
                    isSelected
                      ? isNegative
                        ? 'border-destructive bg-destructive/10 ring-1 ring-destructive/30'
                        : 'border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-border hover:border-primary/50 hover:bg-muted/40'
                  )}
                  aria-pressed={isSelected}
                  aria-label={t.psychology.emotions[emotion.value]}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center h-8 w-8 rounded-md transition-colors',
                      isSelected
                        ? isNegative
                          ? 'bg-destructive/15 text-destructive'
                          : 'bg-primary/15 text-primary'
                        : isNegative
                          ? 'bg-muted text-muted-foreground group-hover:text-destructive/70'
                          : 'bg-muted text-muted-foreground group-hover:text-primary'
                    )}
                  >
                    <emotion.Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="text-[11px] font-medium leading-tight">
                    {t.psychology.emotions[emotion.value]}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedEmotion && negativeSelected && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Detectamos un estado emocional desafiante. Considera esperar antes de operar.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 2. Discipline */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <Label className="text-base font-semibold">
              2. ¿Qué tan disciplinado te sientes hoy?
            </Label>
            <span className="text-2xl font-bold font-mono text-primary">
              {disciplineScore[0]}/10
            </span>
          </div>
          <Slider
            value={disciplineScore}
            onValueChange={setDisciplineScore}
            max={10}
            min={1}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo</span>
            <span>Moderado</span>
            <span>Alto</span>
          </div>
        </div>

        {/* 3. Sleep */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">3. Calidad de sueño anoche</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Moon
                  key={i}
                  className={cn(
                    'h-5 w-5',
                    i < sleepQuality[0] ? 'fill-primary text-primary' : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
          </div>
          <Slider
            value={sleepQuality}
            onValueChange={setSleepQuality}
            max={5}
            min={1}
            step={1}
            className="py-4"
          />
        </div>

        {/* 4. Stress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">4. Nivel de estrés</Label>
            <Badge variant={stressVariant}>{stressBadge}</Badge>
          </div>
          <Slider
            value={stressLevel}
            onValueChange={setStressLevel}
            max={5}
            min={1}
            step={1}
            className="py-4"
          />
        </div>

        {/* 5. Notes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            5. Lecciones de ayer o metas para hoy (opcional)
          </Label>
          <Textarea
            placeholder="Ej: Ayer operé con mucha emoción. Hoy seré más paciente y esperaré mi setup perfecto..."
            className="min-h-[100px] resize-none"
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right">
            {lessonsLearned.length}/500
          </div>
        </div>

        {formError && <p className="text-xs text-destructive text-center">{formError}</p>}

        <Button
          size="lg"
          className="w-full"
          onClick={handleSave}
          disabled={!selectedEmotion || createEntry.isPending}
        >
          {createEntry.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <CheckCircle className="mr-2 h-5 w-5" />
          )}
          Completar Check-in
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------- History View ----------
function HistoryView() {
  const { t } = useLanguage();
  const { entries, isLoading } = usePsychologyEntries();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Historial de Check-ins
        </CardTitle>
        <CardDescription>Tu evolución psicológica a lo largo del tiempo</CardDescription>
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
            <p className="text-muted-foreground">No hay entradas aún</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Completa tu primer check-in del día para comenzar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EntryCard({ entry }: { entry: PsychologyEntry }) {
  const { t } = useLanguage();
  const emotion = entry.pre_trade_emotion as Emotion | null;
  const emotionData = emotion ? emotions.find((e) => e.value === emotion) : null;

  return (
    <div className="p-4 rounded-lg bg-muted/40 border border-border hover:border-primary/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {new Date(entry.entry_date).toLocaleDateString('es-ES', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {emotion && emotionData && (
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 pl-1.5',
              emotionData.negative ? 'border-destructive/40 text-destructive' : 'border-primary/40 text-primary'
            )}
          >
            <emotionData.Icon className="h-3 w-3" aria-hidden />
            {t.psychology.emotions[emotion]}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Stat label="Disciplina" value={`${entry.discipline_score ?? 0}/10`} />
        <Stat label="Sueño" value={`${entry.sleep_quality ?? 0}/5`} />
        <Stat label="Estrés" value={`${entry.stress_level ?? 0}/5`} />
      </div>

      {entry.lessons_learned && (
        <div className="flex items-start gap-2 mt-2">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-md bg-background/50">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-base font-bold font-mono">{value}</p>
    </div>
  );
}

// ---------- Insights View ----------
function InsightsView() {
  const { entries, stats } = usePsychologyEntries();
  const hasEnoughData = entries.length >= 10;

  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Insights Personalizados</AlertTitle>
        <AlertDescription>
          Analizamos tus patrones psicológicos para ayudarte a mejorar. Necesitamos al menos 10
          entradas para generar insights confiables. Llevas {entries.length}/10.
        </AlertDescription>
      </Alert>

      {!hasEnoughData ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Sigue completando tus check-ins diarios para desbloquear insights personalizados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            title="Impacto del Sueño"
            icon={Moon}
            insight={`Tu calidad de sueño promedio es ${stats.avgSleep.toFixed(
              1
            )}/5. Mayor descanso suele correlacionar con mejor disciplina.`}
            confidence="Media"
            sample={`n=${entries.length} entradas`}
          />
          <InsightCard
            title="Disciplina Sostenida"
            icon={Target}
            insight={`Tu disciplina promedio es ${stats.avgDiscipline.toFixed(
              1
            )}/10. Mantenerla > 7 mejora la consistencia operativa.`}
            confidence="Alta"
            sample={`n=${entries.length} entradas`}
          />
          <InsightCard
            title="Adherencia al Plan"
            icon={Brain}
            insight={`Cumpliste reglas en ${stats.rulesFollowed}/${stats.totalEntries} sesiones. La consistencia es la métrica más predictiva.`}
            confidence="Alta"
            sample={`n=${stats.totalEntries} entradas`}
          />
          <InsightCard
            title="Patrón Semanal"
            icon={TrendingUp}
            insight="Tus check-ins más frecuentes correlacionan con períodos de mayor estabilidad emocional."
            confidence="Media"
            sample={`n=${entries.length} observaciones`}
          />
        </div>
      )}
    </div>
  );
}

function InsightCard({
  title,
  icon: Icon,
  insight,
  confidence,
  sample,
}: {
  title: string;
  icon: LucideIcon;
  insight: string;
  confidence: 'Alta' | 'Media' | 'Baja';
  sample: string;
}) {
  const confColors: Record<string, string> = {
    Alta: 'text-success bg-success/10',
    Media: 'text-warning bg-warning/10',
    Baja: 'text-[hsl(28_95%_55%)] bg-[hsl(28_95%_55%/0.1)]',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{insight}</p>
        <div className="flex items-center gap-2">
          <Badge className={cn('text-xs', confColors[confidence])}>
            Confianza: {confidence}
          </Badge>
          <span className="text-xs text-muted-foreground">{sample}</span>
        </div>
      </CardContent>
    </Card>
  );
}


