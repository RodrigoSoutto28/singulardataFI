import { useMemo } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { SubscriptionPlan } from '@/shared/types/database';

// ─────────────────────────────────────────────────────────────
// Feature keys mirror the feature_flags table in Supabase
// ─────────────────────────────────────────────────────────────
export type FeatureKey =
  | 'basic_journal'
  | 'unlimited_trades'
  | 'ai_insights'
  | 'advanced_analytics'
  | 'backtesting'
  | 'psychology_tracking'
  | 'screenshot_uploads'
  | 'export_reports'
  | 'multiple_accounts'
  | 'custom_rules'
  | 'api_access';

// Static feature matrix — mirrors feature_flags DB table
// Kept client-side so it works offline and avoids extra round-trips.
const FEATURE_MATRIX: Record<FeatureKey, Record<SubscriptionPlan, boolean>> = {
  basic_journal:        { free: true,  pro: true,  power: true  },
  psychology_tracking:  { free: true,  pro: true,  power: true  },
  screenshot_uploads:   { free: true,  pro: true,  power: true  },
  unlimited_trades:     { free: false, pro: true,  power: true  },
  ai_insights:          { free: false, pro: true,  power: true  },
  advanced_analytics:   { free: false, pro: true,  power: true  },
  export_reports:       { free: false, pro: true,  power: true  },
  multiple_accounts:    { free: false, pro: true,  power: true  },
  custom_rules:         { free: false, pro: true,  power: true  },
  backtesting:          { free: false, pro: false, power: true  },
  api_access:           { free: false, pro: false, power: true  },
};

export interface SubscriptionState {
  /** Current subscription plan */
  plan: SubscriptionPlan;
  /** True when plan is 'pro' or 'power' AND not expired */
  isPro: boolean;
  /** True when plan is 'power' AND not expired */
  isPower: boolean;
  /** True when plan is 'free' */
  isFree: boolean;
  /** True when subscription is active (free is always active; paid is active when not expired) */
  isActive: boolean;
  /** ISO string of expiry, or null for free/lifetime */
  expiresAt: string | null;
  /** Days until expiry. null when free, 0 when expired, negative if overdue */
  daysUntilExpiry: number | null;
  /** True when subscription expires within 7 days (shows renewal banner) */
  isExpiringSoon: boolean;
  /** True when a paid subscription has already expired */
  isExpired: boolean;
  /** Check if a specific feature is accessible for the current plan */
  canUseFeature: (feature: FeatureKey) => boolean;
}

export function useSubscription(): SubscriptionState {
  const { profile } = useAuth();

  return useMemo<SubscriptionState>(() => {
    const plan: SubscriptionPlan = profile?.subscription_plan ?? 'free';
    const expiresAt = profile?.subscription_expires_at ?? null;

    // ── Expiry logic ──────────────────────────────────────────
    let daysUntilExpiry: number | null = null;
    let isExpired = false;

    if (plan !== 'free' && expiresAt) {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      const msRemaining = expiryDate.getTime() - now.getTime();
      daysUntilExpiry = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
      isExpired = daysUntilExpiry <= 0;
    }

    const isActive = plan === 'free' || !isExpired;
    const isPro = (plan === 'pro' || plan === 'power') && isActive;
    const isPower = plan === 'power' && isActive;
    const isFree = plan === 'free';
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 7;

    // ── Feature gating ────────────────────────────────────────
    const canUseFeature = (feature: FeatureKey): boolean => {
      const matrix = FEATURE_MATRIX[feature];
      if (!matrix) return false;
      // If plan is paid but expired, treat as free
      const effectivePlan: SubscriptionPlan = isActive ? plan : 'free';
      return matrix[effectivePlan] ?? false;
    };

    return {
      plan,
      isPro,
      isPower,
      isFree,
      isActive,
      expiresAt,
      daysUntilExpiry,
      isExpiringSoon,
      isExpired,
      canUseFeature,
    };
  }, [profile?.subscription_plan, profile?.subscription_expires_at]);
}
