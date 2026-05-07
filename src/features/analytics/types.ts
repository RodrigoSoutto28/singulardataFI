import type { Tables } from '@/shared/types/database';

export type AnalyticsSnapshot = Tables<'analytics_snapshots'>;
export type AIInsight = Tables<'ai_insights'>;

export interface EquityPoint {
  date: string;
  equity: number;
}
