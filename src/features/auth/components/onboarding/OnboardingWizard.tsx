import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Sparkles, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { AccountSetupStep } from './AccountSetupStep';
import { TourStep } from './TourStep';
import { useOnboarding } from '@/features/auth/hooks/useOnboarding';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { cn } from '@/shared/lib/utils';
import confetti from 'canvas-confetti';

const ONBOARDING_COPY = {
  ES: { welcome: 'Bienvenida', account: 'Cuenta', tour: 'Tour', step: 'Paso', of: 'de', skip: 'Omitir', back: 'Atrás', next: 'Siguiente', complete: 'Completar' },
  EN: { welcome: 'Welcome', account: 'Account', tour: 'Tour', step: 'Step', of: 'of', skip: 'Skip', back: 'Back', next: 'Next', complete: 'Complete' },
  PT: { welcome: 'Bem-vindo', account: 'Conta', tour: 'Tour', step: 'Etapa', of: 'de', skip: 'Pular', back: 'Voltar', next: 'Próximo', complete: 'Concluir' },
} as const;

export function OnboardingWizard() {
  const { isOnboardingComplete, currentStep: savedStep, completeOnboarding, skipOnboarding, saveProgress, isLoading } =
    useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof savedStep === 'number') setCurrentStep(Math.min(savedStep, 2));
  }, [savedStep]);

  const steps = [
    { id: 'welcome', title: 'Bienvenida', canSkip: false, manualAdvance: false },
    { id: 'account', title: 'Cuenta', canSkip: false, manualAdvance: true },
    { id: 'tour', title: 'Tour', canSkip: true, manualAdvance: false },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveProgress(next);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleComplete = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    completeOnboarding();
  };

  if (isLoading || isOnboardingComplete) return null;

  const step = steps[currentStep];

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{step.title}</h2>
                <p className="text-xs text-muted-foreground">Paso {currentStep + 1} de {steps.length}</p>
              </div>
            </div>
            {step.canSkip && (
              <Button variant="ghost" size="sm" onClick={() => skipOnboarding()}>Omitir</Button>
            )}
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-between text-xs">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={cn('flex items-center gap-1.5', idx > currentStep && 'text-muted-foreground')}
              >
                <span
                  className={cn(
                    'h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                    idx < currentStep && 'bg-primary text-primary-foreground',
                    idx === currentStep && 'bg-primary text-primary-foreground',
                    idx > currentStep && 'bg-muted text-muted-foreground',
                  )}
                >
                  {idx < currentStep ? <Check className="h-3 w-3" /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {currentStep === 0 && <WelcomeScreen />}
          {currentStep === 1 && <AccountSetupStep onNext={handleNext} />}
          {currentStep === 2 && <TourStep />}
        </div>

        {/* Footer */}
        {!step.manualAdvance && (
          <div className="border-t px-6 py-4 flex items-center justify-between bg-card">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Atrás
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>Completar <Check className="h-4 w-4 ml-1" /></>
              ) : (
                <>Siguiente <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


