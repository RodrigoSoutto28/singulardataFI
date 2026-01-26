import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Brain,
  Heart,
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
  type LucideIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Emotion = 'confident' | 'fearful' | 'greedy' | 'calm' | 'anxious' | 'frustrated' | 'excited' | 'neutral';

interface EmotionOption {
  value: Emotion;
  label: string;
  color: string;
  Icon: LucideIcon;
}

const emotions: EmotionOption[] = [
  { value: 'confident', label: 'Confident', color: 'bg-success/20 text-success border-success/30', Icon: Shield },
  { value: 'calm', label: 'Calm', color: 'bg-primary/20 text-primary border-primary/30', Icon: Leaf },
  { value: 'neutral', label: 'Neutral', color: 'bg-muted text-muted-foreground border-border', Icon: Minus },
  { value: 'excited', label: 'Excited', color: 'bg-warning/20 text-warning border-warning/30', Icon: Zap },
  { value: 'anxious', label: 'Anxious', color: 'bg-warning/20 text-warning border-warning/30', Icon: AlertCircle },
  { value: 'fearful', label: 'Fearful', color: 'bg-destructive/20 text-destructive border-destructive/30', Icon: ShieldAlert },
  { value: 'greedy', label: 'Greedy', color: 'bg-destructive/20 text-destructive border-destructive/30', Icon: TrendingUp },
  { value: 'frustrated', label: 'Frustrated', color: 'bg-destructive/20 text-destructive border-destructive/30', Icon: Flame },
];

interface DailyEntry {
  date: string;
  preTradeEmotion: Emotion;
  postTradeEmotion: Emotion;
  disciplineScore: number;
  sleepQuality: number;
  stressLevel: number;
  followedRules: boolean;
  lessonsLearned: string;
  goals: string;
}

const mockEntries: DailyEntry[] = [
  {
    date: '2025-01-23',
    preTradeEmotion: 'confident',
    postTradeEmotion: 'calm',
    disciplineScore: 8,
    sleepQuality: 4,
    stressLevel: 2,
    followedRules: true,
    lessonsLearned: 'Patience paid off waiting for the right setup.',
    goals: 'Focus on fewer, higher quality trades.',
  },
  {
    date: '2025-01-22',
    preTradeEmotion: 'anxious',
    postTradeEmotion: 'frustrated',
    disciplineScore: 5,
    sleepQuality: 3,
    stressLevel: 4,
    followedRules: false,
    lessonsLearned: 'Overtraded due to FOMO. Need to stick to the plan.',
    goals: 'Max 3 trades tomorrow.',
  },
  {
    date: '2025-01-21',
    preTradeEmotion: 'calm',
    postTradeEmotion: 'confident',
    disciplineScore: 9,
    sleepQuality: 5,
    stressLevel: 1,
    followedRules: true,
    lessonsLearned: 'Morning routine helped maintain focus.',
    goals: 'Continue with the morning routine.',
  },
];

function EmotionBadge({ emotion }: { emotion: Emotion }) {
  const emotionData = emotions.find((e) => e.value === emotion);
  if (!emotionData) return null;

  const IconComponent = emotionData.Icon;
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1', emotionData.color)}>
      <IconComponent className="h-3 w-3" />
      {emotionData.label}
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

export default function Psychology() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [disciplineScore, setDisciplineScore] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([4]);
  const [stressLevel, setStressLevel] = useState([3]);

  // Calculate averages
  const avgDiscipline = mockEntries.reduce((sum, e) => sum + e.disciplineScore, 0) / mockEntries.length;
  const avgSleep = mockEntries.reduce((sum, e) => sum + e.sleepQuality, 0) / mockEntries.length;
  const rulesFollowed = mockEntries.filter((e) => e.followedRules).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Psychology Tracker</h1>
          <p className="text-muted-foreground">Monitor your trading mindset and emotions</p>
        </div>
        <Button variant="glow" className="gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
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
                <p className="text-sm text-muted-foreground">Avg Discipline</p>
                <p className="text-2xl font-bold font-mono-numbers">{avgDiscipline.toFixed(1)}/10</p>
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
                <p className="text-sm text-muted-foreground">Rules Followed</p>
                <p className="text-2xl font-bold font-mono-numbers">{rulesFollowed}/{mockEntries.length}</p>
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
                <p className="text-sm text-muted-foreground">Avg Sleep</p>
                <p className="text-2xl font-bold font-mono-numbers">{avgSleep.toFixed(1)}/5</p>
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
                <p className="text-sm text-muted-foreground">Entries This Week</p>
                <p className="text-2xl font-bold font-mono-numbers">{mockEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Entry Form */}
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Today's Check-in
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Emotion Selection */}
            <div className="space-y-3">
              <Label>Current Emotion</Label>
              <div className="grid grid-cols-2 gap-2">
                {emotions.slice(0, 4).map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => setSelectedEmotion(emotion.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      selectedEmotion === emotion.value
                        ? emotion.color
                        : 'bg-muted/30 border-border hover:border-primary/30'
                    )}
                  >
                    <emotion.Icon className="h-5 w-5" />
                    <p className="text-sm font-medium mt-1">{emotion.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Discipline Score */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Discipline Score</Label>
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
                <Label>Sleep Quality</Label>
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
                <Label>Stress Level</Label>
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
              <Label>Lessons Learned</Label>
              <Textarea
                placeholder="What did you learn today?"
                className="bg-muted/50 min-h-[80px]"
              />
            </div>

            <Button variant="glow" className="w-full">
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recent Entries
            </CardTitle>
            <CardDescription>Your psychology journal history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEntries.map((entry, index) => (
                <div
                  key={entry.date}
                  className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EmotionBadge emotion={entry.preTradeEmotion} />
                      <span className="text-muted-foreground">→</span>
                      <EmotionBadge emotion={entry.postTradeEmotion} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <MetricBar
                      value={entry.disciplineScore}
                      max={10}
                      label="Discipline"
                      color={entry.disciplineScore >= 7 ? 'bg-success' : entry.disciplineScore >= 5 ? 'bg-warning' : 'bg-destructive'}
                    />
                    <MetricBar
                      value={entry.sleepQuality}
                      max={5}
                      label="Sleep"
                      color={entry.sleepQuality >= 4 ? 'bg-success' : entry.sleepQuality >= 3 ? 'bg-warning' : 'bg-destructive'}
                    />
                    <MetricBar
                      value={entry.stressLevel}
                      max={5}
                      label="Stress"
                      color={entry.stressLevel <= 2 ? 'bg-success' : entry.stressLevel <= 3 ? 'bg-warning' : 'bg-destructive'}
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    {entry.followedRules ? (
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    )}
                    <p className="text-sm text-muted-foreground">{entry.lessonsLearned}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
