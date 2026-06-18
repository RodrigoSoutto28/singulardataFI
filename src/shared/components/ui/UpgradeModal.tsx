import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Check, Zap, Crown, Rocket, Sparkles, ArrowRight, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

interface Plan {
  id: 'free' | 'pro' | 'power';
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  gradient: string;
  popular?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: '/mes',
    description: 'Para empezar a registrar tus operaciones.',
    icon: Zap,
    iconColor: 'text-slate-400',
    gradient: 'from-slate-800/50 to-slate-900/50',
    features: [
      '30 operaciones / mes',
      'Registro de diario básico',
      'Seguimiento psicológico',
      'Exportación JSON',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: '/mes',
    description: 'Para traders que quieren escalar su performance.',
    icon: Crown,
    iconColor: 'text-amber-400',
    gradient: 'from-amber-900/30 to-orange-900/30',
    popular: true,
    features: [
      'Operaciones ilimitadas',
      'Insights de IA avanzados',
      'Analytics profundos',
      'Exportación PDF / Excel',
      'Múltiples cuentas',
      'Reglas de trading custom',
      'Soporte prioritario',
    ],
  },
  {
    id: 'power',
    name: 'Power',
    price: 79,
    period: '/mes',
    description: 'Para traders profesionales e institucionales.',
    icon: Rocket,
    iconColor: 'text-violet-400',
    gradient: 'from-violet-900/30 to-purple-900/30',
    features: [
      'Todo lo de Pro',
      'Backtesting de estrategias',
      'Acceso a API REST',
      'Integraciones custom',
      'Soporte dedicado',
      'White label',
    ],
  },
];

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional pre-select a highlighted plan */
  recommendedPlan?: 'pro' | 'power';
  /** Context message shown at top (e.g. "Desbloqueá AI Insights") */
  featureMessage?: string;
}

export function UpgradeModal({ open, onClose, recommendedPlan = 'pro', featureMessage }: UpgradeModalProps) {
  const { plan: currentPlan } = useSubscription();
  const [selected, setSelected] = useState<'pro' | 'power'>(recommendedPlan);
  const { t } = useLanguage();

  const handleUpgrade = (planId: 'pro' | 'power') => {
    // TODO: Integrate Stripe Checkout Session here when payment processor is configured.
    // For now, redirect to contact / interest form.
    const subject = encodeURIComponent(`Upgrade a Plan ${planId.toUpperCase()} — MindOn`);
    const body = encodeURIComponent(
      `Hola equipo MindOn,\n\nQuiero actualizar mi cuenta al plan ${planId.toUpperCase()}.\n\nMi email: (tu email aquí)\n\nGracias.`
    );
    window.open(`mailto:hola@mindon-trading.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <DialogTitle className="text-xl font-bold text-white">
                Desbloquea todo tu potencial
              </DialogTitle>
            </div>
            {featureMessage && (
              <p className="text-sm text-amber-400/90 font-medium">
                ✨ {featureMessage}
              </p>
            )}
            <p className="text-sm text-slate-400 mt-1">
              Elige el plan que mejor se adapta a tu operativa
            </p>
          </DialogHeader>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            const isSelected = selected === plan.id;
            const isUpgrade = plan.id !== 'free' && !isCurrentPlan;

            return (
              <button
                key={plan.id}
                onClick={() => plan.id !== 'free' && setSelected(plan.id as 'pro' | 'power')}
                disabled={plan.id === 'free'}
                className={cn(
                  'relative text-left rounded-2xl border p-5 transition-all duration-200',
                  `bg-gradient-to-br ${plan.gradient}`,
                  isCurrentPlan
                    ? 'border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : isSelected && isUpgrade
                    ? 'border-amber-400/60 ring-1 ring-amber-400/30 scale-[1.02]'
                    : 'border-white/10 hover:border-white/20',
                  plan.id === 'free' && 'opacity-60 cursor-default'
                )}
              >
                {plan.popular && !isCurrentPlan && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-semibold text-xs px-2 py-0.5">
                    Más popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-semibold text-xs px-2 py-0.5">
                    Tu plan actual
                  </Badge>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn('h-5 w-5', plan.iconColor)} />
                  <span className="font-bold text-white">{plan.name}</span>
                </div>

                <div className="mb-3">
                  <span className="text-3xl font-bold text-white font-mono-numbers">
                    ${plan.price}
                  </span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-400 mb-4">{plan.description}</p>

                <ul className="space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA footer */}
        <div className="flex items-center justify-between px-6 pb-6 gap-4">
          <p className="text-xs text-slate-500">
            ¿Preguntas? Escribinos a{' '}
            <a href="mailto:hola@mindon-trading.com" className="text-amber-400 hover:underline">
              hola@mindon-trading.com
            </a>
          </p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose} className="text-slate-400">
              Ahora no
            </Button>
            <Button
              onClick={() => handleUpgrade(selected)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold gap-2 shadow-lg shadow-amber-500/25"
            >
              <Sparkles className="h-4 w-4" />
              Actualizar a {selected === 'pro' ? 'Pro' : 'Power'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Hook helper to manage UpgradeModal state easily
// ─────────────────────────────────────────────────────────────
export function useUpgradeModal() {
  const [open, setOpen] = useState(false);
  const [featureMessage, setFeatureMessage] = useState<string | undefined>();
  const [recommendedPlan, setRecommendedPlan] = useState<'pro' | 'power'>('pro');

  const openModal = (opts?: { feature?: string; plan?: 'pro' | 'power' }) => {
    setFeatureMessage(opts?.feature);
    setRecommendedPlan(opts?.plan ?? 'pro');
    setOpen(true);
  };

  return {
    upgradeModalOpen: open,
    featureMessage,
    recommendedPlan,
    openUpgradeModal: openModal,
    closeUpgradeModal: () => setOpen(false),
  };
}
