export type SubscriptionPlan = 'free' | 'pro' | 'power';
export type TradeDirection = 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';
export type AssetClass = 'forex' | 'stocks' | 'crypto' | 'futures' | 'options' | 'commodities';
export type EmotionType = 'confident' | 'fearful' | 'greedy' | 'calm' | 'anxious' | 'frustrated' | 'excited' | 'neutral';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_expires_at: string | null;
  timezone: string;
  currency: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface TradingAccount {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  account_type: string | null;
  initial_balance: number;
  current_balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  account_id: string | null;
  symbol: string;
  asset_class: AssetClass;
  direction: TradeDirection;
  status: TradeStatus;
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  stop_loss: number | null;
  take_profit: number | null;
  entry_date: string;
  exit_date: string | null;
  pnl: number | null;
  pnl_percentage: number | null;
  commission: number;
  swap: number;
  timeframe: string | null;
  strategy: string | null;
  setup_type: string | null;
  notes: string | null;
  tags: string[] | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface TradeScreenshot {
  id: string;
  trade_id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  screenshot_type: string;
  created_at: string;
}

export interface PsychologyEntry {
  id: string;
  user_id: string;
  trade_id: string | null;
  entry_date: string;
  pre_trade_emotion: EmotionType | null;
  post_trade_emotion: EmotionType | null;
  discipline_score: number | null;
  followed_rules: boolean;
  broken_rules: string[] | null;
  market_conditions: string | null;
  mental_state_notes: string | null;
  lessons_learned: string | null;
  goals_for_tomorrow: string | null;
  sleep_quality: number | null;
  stress_level: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  user_id: string;
  account_id: string | null;
  snapshot_date: string;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number | null;
  profit_factor: number | null;
  average_win: number | null;
  average_loss: number | null;
  largest_win: number | null;
  largest_loss: number | null;
  total_pnl: number | null;
  max_drawdown: number | null;
  sharpe_ratio: number | null;
  equity_value: number | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  content: string;
  severity: string;
  is_read: boolean;
  is_actionable: boolean;
  action_taken: boolean;
  metadata: Record<string, any> | null;
  expires_at: string | null;
  created_at: string;
}

export interface TradingRule {
  id: string;
  user_id: string;
  rule_name: string;
  rule_description: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  feature_key: string;
  feature_name: string;
  description: string | null;
  free_plan: boolean;
  pro_plan: boolean;
  power_plan: boolean;
  created_at: string;
}

export type StudyContentType = 'summary' | 'paper_pdf';

export interface StudyContent {
  id: string;
  title: string;
  description: string | null;
  type: StudyContentType;
  categories: string[] | null;
  read_time_minutes: number | null;
  content_md: string | null;
  pdf_url: string | null;
  week_number: number | null;
  published_at: string | null;
  is_pro: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyProgress {
  user_id: string;
  content_id: string;
  progress_percent: number;
  completed: boolean;
  started_at: string | null;
  completed_at: string | null;
}
