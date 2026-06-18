import { useState } from 'react';
import { AlertTriangle, Clock, X, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { UpgradeModal } from '@/shared/components/ui/UpgradeModal';

export function SubscriptionExpiryBanner() {
  const { isFree, isExpired, isExpiringSoon, daysUntilExpiry, plan } = useSubscription();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Only show for paid plans with upcoming or past expiry
  if (isFree || dismissed || (!isExpired && !isExpiringSoon)) return null;

  const isUrgent = isExpired || (daysUntilExpiry !== null && daysUntilExpiry <= 2);

  const title = isExpired
    ? '⚠️ Tu suscripción ha vencido'
    : daysUntilExpiry === 1
    ? '⏰ Tu suscripción vence hoy'
    : `⏰ Tu suscripción vence en ${daysUntilExpiry} días`;

  const description = isExpired
    ? 'Perdiste acceso a las funciones Pro. Renovas para continuar sin interrupciones.'
    : 'Renová antes de que venza para no perder el acceso a tus datos y funciones premium.';

  return (
    <>
      <div
        role="alert"
        className={cn(
          'relative flex items-center gap-3 px-4 py-3 text-sm',
          'border-b transition-all',
          isUrgent
            ? 'bg-red-950/80 border-red-500/30 text-red-200'
            : 'bg-amber-950/80 border-amber-500/30 text-amber-200'
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
            isUrgent ? 'bg-red-500/20' : 'bg-amber-500/20'
          )}
        >
          {isExpired ? (
            <AlertTriangle className={cn('h-4 w-4', isUrgent ? 'text-red-400' : 'text-amber-400')} />
          ) : (
            <Clock className="h-4 w-4 text-amber-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{title}</span>
          <span className="hidden sm:inline text-xs opacity-75 ml-2">{description}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className={cn(
              'h-7 text-xs font-semibold gap-1.5',
              isUrgent
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            )}
          >
            <Sparkles className="h-3 w-3" />
            Renovar plan {plan.toUpperCase()}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="opacity-60 hover:opacity-100 transition-opacity p-1"
            aria-label="Cerrar aviso"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <UpgradeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        featureMessage={isExpired ? 'Renová tu plan para recuperar el acceso completo' : undefined}
        recommendedPlan={plan === 'power' ? 'power' : 'pro'}
      />
    </>
  );
}
