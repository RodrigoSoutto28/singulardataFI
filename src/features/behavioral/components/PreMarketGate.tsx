import React from "react";
import { usePreMarketCheckIn } from "@/features/behavioral/hooks/usePreMarketCheckIn";
import { useOnboarding } from "@/features/auth/hooks/useOnboarding";
import { PageLoader } from "@/shared/components/ui/page-loader";
import { PreMarketCheckInModal } from "@/features/behavioral/components/PreMarketCheckInModal";

export function PreMarketGate({ children }: { children: React.ReactNode }) {
  const { hasCheckedInToday, isLoading } = usePreMarketCheckIn();
  const { isOnboardingComplete, isLoading: onboardingLoading } = useOnboarding();
  if (isLoading || onboardingLoading) {
    return <PageLoader />;
  }
  return (
    <>
      {children}
      {isOnboardingComplete && (
        <PreMarketCheckInModal open={!hasCheckedInToday} onComplete={() => {}} />
      )}
    </>
  );
}
