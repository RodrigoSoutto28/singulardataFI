import type { Tables } from '@/shared/types/database';

export type TradingAccount = Tables<'trading_accounts'>;
export type AnalyticsSnapshot = Tables<'analytics_snapshots'>;

export interface DashboardKpi {
  label: string;
  value: number;
  delta?: number;
  format?: 'currency' | 'number' | 'percent';
}
