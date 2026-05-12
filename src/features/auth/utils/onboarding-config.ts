export const ONBOARDING_STEPS = ['welcome', 'account', 'tour'] as const;
export type OnboardingStepId = typeof ONBOARDING_STEPS[number];
export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;
