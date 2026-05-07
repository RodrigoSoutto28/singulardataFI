// Global constants shared across features.

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  POWER: 'power',
} as const;
export type Plan = (typeof PLANS)[keyof typeof PLANS];

export const LIMITS = {
  FREE_MAX_TRADES: 100,
  FREE_MAX_ACCOUNTS: 1,
  PRO_MAX_ACCOUNTS: 5,
  POWER_MAX_ACCOUNTS: 25,
  IMPORT_MAX_ROWS: 10_000,
  EXPORT_MAX_ROWS: 50_000,
  TAXOMETER_DAILY_LOSS_PCT: 3,
} as const;

export const SUPPORTED_LANGUAGES = ['en', 'es', 'pt'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const QUERY_KEYS = {
  trades: 'trades',
  tradingAccount: 'trading_account',
  profile: 'profile',
  psychologyEntries: 'psychology_entries',
  preMarketCheckin: 'pre-market-checkin',
  insights: 'insights',
  analytics: 'analytics_snapshots',
} as const;
