import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'onboarding_completed';

interface Step {
  selector: string;
  title: string;
  body: string;
  /** Posición preferida del tooltip respecto al target. */
  placement?: 'right' | 'bottom' | 'top' | 'left';
  /** Ruta requerida; el tour navega ahí antes de medir. */
  route?: string;
}

const STEPS: Step[] = [
  {
    selector: '[data-tour="sidebar"]',
    title: 'Navegación',
    body: 'Desde aquí navegás entre las secciones de tu workspace.',
    placement: 'right',
    route: '/dashboard',
  },
  {
    selector: '[data-tour="dashboard"]',
    title: 'Panel de Control',
    body: 'Este es tu resumen del día — objetivos, alertas y métricas clave.',
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    selector: '[data-tour="add-trade"]',
    title: 'Agregar Operación',
    body: 'Registrá tu primera operación manualmente o importala desde tu broker.',
    placement: 'bottom',
    route: '/journal',
  },
  {
    selector: '[data-tour="analytics"]',
    title: 'Centro de Análisis',
    body: 'Aquí la IA analiza tus patrones de trading.',
    placement: 'right',
    route: '/analytics',
  },
  {
    selector: '[data-tour="psychology"]',
    title: 'Métricas Conductuales',
    body: 'Registrá tu estado mental cada día para entender cómo afecta tu rendimiento.',
    placement: 'right',
    route: '/psychology',
  },
];

interface Position {
  top: number;
  left: number;
  targetRect: DOMRect | null;
}

export function OnboardingTour() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [pos, setPos] = useState<Position>({ top: 0, left: 0, targetRect: null });

  // Iniciar automáticamente para usuarios sin tour completado
  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    const t = setTimeout(() => setActive(true), 800);
    return () => clearTimeout(t);
  }, [user]);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setActive(false);
    setStepIdx(0);
  }, []);

  // Navegar a la ruta del paso si es necesario
  useEffect(() => {
    if (!active) return;
    const step = STEPS[stepIdx];
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
    }
  }, [active, stepIdx, location.pathname, navigate]);

  // Calcular posición del tooltip
  useEffect(() => {
    if (!active) return;
    const step = STEPS[stepIdx];

    const update = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) {
        setPos({ top: window.innerHeight / 2 - 80, left: window.innerWidth / 2 - 160, targetRect: null });
        return;
      }
      const r = el.getBoundingClientRect();
      const tooltipW = 320;
      const tooltipH = 160;
      const margin = 12;
      let top = r.bottom + margin;
      let left = r.left;

      switch (step.placement) {
        case 'right':
          top = r.top;
          left = r.right + margin;
          break;
        case 'left':
          top = r.top;
          left = r.left - tooltipW - margin;
          break;
        case 'top':
          top = r.top - tooltipH - margin;
          left = r.left;
          break;
        case 'bottom':
        default:
          top = r.bottom + margin;
          left = r.left;
      }

      // Clamp dentro del viewport
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipW - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - tooltipH - 8));

      setPos({ top, left, targetRect: r });
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [active, stepIdx]);

  if (!active) return null;
  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  const node = (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" onClick={finish} />

      {/* Highlight ring */}
      {pos.targetRect && (
        <div
          aria-hidden
          className="absolute pointer-events-none rounded-lg ring-2 ring-primary shadow-[0_0_0_9999px_hsl(var(--background)/0.55)] transition-all"
          style={{
            top: pos.targetRect.top - 6,
            left: pos.targetRect.left - 6,
            width: pos.targetRect.width + 12,
            height: pos.targetRect.height + 12,
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute w-[320px] rounded-lg border border-border bg-card p-4 shadow-xl"
        style={{ top: pos.top, left: pos.left }}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[11px] font-mono text-muted-foreground tracking-wider uppercase">
            Paso {stepIdx + 1} de {STEPS.length}
          </span>
          <button
            onClick={finish}
            aria-label="Omitir tour"
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 id="tour-title" className="font-semibold text-foreground text-sm mb-1">
          {step.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>

        <div className="flex items-center justify-between mt-4 gap-2">
          <Button variant="ghost" size="sm" onClick={finish} className="text-xs">
            Omitir
          </Button>
          <div className="flex items-center gap-2">
            {stepIdx > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStepIdx((i) => i - 1)}
                aria-label="Paso anterior"
                className="gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => (isLast ? finish() : setStepIdx((i) => i + 1))}
              className="gap-1"
            >
              {isLast ? 'Finalizar' : 'Siguiente'}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

/** Resetea el tour para volver a mostrarlo (útil desde Settings). */
export function resetOnboardingTour() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
