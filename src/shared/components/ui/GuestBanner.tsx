import { useState } from 'react';
import { Eye, X, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { cn } from '@/shared/lib/utils';

// ─────────────────────────────────────────────────────────────
// GuestBanner — persistent top strip shown while in guest mode
// ─────────────────────────────────────────────────────────────

const COPY = {
  ES: {
    title: 'Estás explorando Mind On con datos de demo.',
    cta: 'Crear cuenta gratis',
    dismiss: 'Cerrar aviso',
  },
  EN: {
    title: "You're exploring Mind On with demo data.",
    cta: 'Create free account',
    dismiss: 'Dismiss',
  },
  PT: {
    title: 'Você está explorando o Mind On com dados de demonstração.',
    cta: 'Criar conta gratuita',
    dismiss: 'Fechar aviso',
  },
  FR: {
    title: 'Vous explorez Mind On avec des données de démonstration.',
    cta: 'Créer un compte gratuit',
    dismiss: 'Fermer',
  },
};

export function GuestBanner() {
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!isGuest || dismissed) return null;

  const copy = COPY[language as keyof typeof COPY] ?? COPY.EN;

  const handleSignUp = () => {
    navigate('/auth', { state: { tab: 'signup' } });
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative flex items-center gap-3 px-4 py-2.5 text-sm',
        'border-b border-sky-500/30',
        'bg-gradient-to-r from-sky-950/90 via-sky-900/80 to-sky-950/90',
        'backdrop-blur-sm'
      )}
    >
      {/* Animated indicator */}
      <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-sky-500/20 border border-sky-500/30">
        <Eye className="h-3.5 w-3.5 text-sky-400" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sky-200 text-xs sm:text-sm font-medium truncate">
          👀 {copy.title}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-semibold text-sky-400 uppercase tracking-wide whitespace-nowrap">
          Demo Mode
        </span>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleSignUp}
          id="guest-banner-signup-btn"
          className={cn(
            'h-7 text-xs font-semibold gap-1.5 whitespace-nowrap',
            'bg-sky-500 hover:bg-sky-400 text-white',
            'shadow-md shadow-sky-500/20'
          )}
        >
          <UserPlus className="h-3 w-3" />
          <span className="hidden sm:inline">{copy.cta}</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="opacity-50 hover:opacity-100 transition-opacity p-1 text-sky-300"
          aria-label={copy.dismiss}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
