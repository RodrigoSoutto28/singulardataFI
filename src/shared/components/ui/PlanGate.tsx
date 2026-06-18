import { useState } from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useSubscription, type FeatureKey } from '@/shared/hooks/useSubscription';
import { UpgradeModal } from '@/shared/components/ui/UpgradeModal';

// ─────────────────────────────────────────────────────────────
// PlanGate — wraps content that requires a specific feature
// If user lacks access, renders a tasteful locked overlay
// ─────────────────────────────────────────────────────────────

interface PlanGateProps {
  /** Feature key to check against the user's plan */
  feature: FeatureKey;
  /** Content to render when access is granted */
  children: React.ReactNode;
  /** Custom message shown in the lock overlay */
  message?: string;
  /** Required plan label shown in the badge */
  requiredPlan?: 'Pro' | 'Power';
  /** If true, renders children with a semi-transparent overlay instead of replacing them */
  overlay?: boolean;
  /** Fallback content to render instead of the default lock UI */
  fallback?: React.ReactNode;
  className?: string;
}

export function PlanGate({
  feature,
  children,
  message,
  requiredPlan = 'Pro',
  overlay = false,
  fallback,
  className,
}: PlanGateProps) {
  const { canUseFeature } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const lockMessage = message ?? `Esta función requiere el plan ${requiredPlan}`;

  const lockUI = (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          'group flex flex-col items-center justify-center gap-3 rounded-xl',
          'border border-dashed border-amber-500/30 bg-amber-500/5',
          'px-6 py-8 w-full text-center cursor-pointer',
          'hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-200',
          className
        )}
        aria-label={`Desbloquear: ${lockMessage}`}
      >
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-400" />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center">
            <Sparkles className="h-2.5 w-2.5 text-black" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-sm text-slate-200">{lockMessage}</p>
          <p className="text-xs text-slate-400">
            Actualiza a <span className="text-amber-400 font-medium">{requiredPlan}</span> para desbloquear
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:gap-2.5 transition-all">
          Ver planes
          <ArrowRight className="h-3 w-3" />
        </div>
      </button>

      <UpgradeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        featureMessage={lockMessage}
        recommendedPlan={requiredPlan === 'Power' ? 'power' : 'pro'}
      />
    </>
  );

  if (overlay) {
    return (
      <div className={cn('relative', className)}>
        <div className="pointer-events-none select-none blur-[2px] opacity-40">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          {lockUI}
        </div>
      </div>
    );
  }

  return lockUI;
}

// ─────────────────────────────────────────────────────────────
// PlanBadge — inline badge to mark Pro/Power features
// ─────────────────────────────────────────────────────────────
interface PlanBadgeProps {
  plan?: 'Pro' | 'Power';
  className?: string;
}

export function PlanBadge({ plan = 'Pro', className }: PlanBadgeProps) {
  const isPower = plan === 'Power';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        isPower
          ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        className
      )}
    >
      <Sparkles className="h-2.5 w-2.5" />
      {plan}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// UpgradeCTA — small inline CTA button
// ─────────────────────────────────────────────────────────────
interface UpgradeCTAProps {
  message?: string;
  plan?: 'pro' | 'power';
  className?: string;
}

export function UpgradeCTA({ message = 'Mejorar plan', plan = 'pro', className }: UpgradeCTAProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowModal(true)}
        className={cn(
          'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
          'text-black font-semibold gap-1.5 text-xs shadow-md shadow-amber-500/20',
          className
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {message}
      </Button>
      <UpgradeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        recommendedPlan={plan}
      />
    </>
  );
}
