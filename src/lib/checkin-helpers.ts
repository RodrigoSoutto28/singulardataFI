export type EmotionalState = 'confident' | 'calm' | 'neutral' | 'anxious' | 'fearful';

export interface PreMarketCheckInData {
  allowed_setups: string[];
  max_risk_per_trade: number;
  max_daily_trades: number;
  emotional_state: EmotionalState;
  goals_today?: string | null;
}

export interface SetupOption {
  id: string;
  label: string;
  icon: string;
}

export interface EmotionOption {
  value: EmotionalState;
  label: string;
  emoji: string;
  tone: 'positive' | 'neutral' | 'negative';
}

export const SETUPS: SetupOption[] = [
  { id: 'breakout', label: 'Breakout', icon: '📈' },
  { id: 'pullback', label: 'Pullback', icon: '📊' },
  { id: 'reversal', label: 'Reversión', icon: '🔄' },
  { id: 'continuation', label: 'Continuación', icon: '➡️' },
  { id: 'range', label: 'Range Trading', icon: '↔️' },
];

export const EMOTIONS: EmotionOption[] = [
  { value: 'confident', label: 'Confiado', emoji: '😊', tone: 'positive' },
  { value: 'calm', label: 'Calmado', emoji: '😌', tone: 'positive' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', tone: 'neutral' },
  { value: 'anxious', label: 'Ansioso', emoji: '😰', tone: 'negative' },
  { value: 'fearful', label: 'Temeroso', emoji: '😨', tone: 'negative' },
];

export function getTodayDateString(): string {
  // YYYY-MM-DD in local timezone
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isNegativeEmotion(state: EmotionalState | '' | null): boolean {
  return state === 'anxious' || state === 'fearful';
}
