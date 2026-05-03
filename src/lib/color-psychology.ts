/**
 * Color system grounded in psychology for context-driven UI.
 * Use sparingly: prefer semantic tokens (`--primary`, `--success`, etc.)
 * for theming and reach for these helpers when a component needs an
 * inline glow or gradient tied to meaning.
 */

export const ColorPsychology = {
  // Blue — trust, stability, professionalism
  trust: {
    primary: 'hsl(197 100% 35%)',
    light: 'hsl(197 100% 35% / 0.15)',
    dark: 'hsl(197 100% 25%)',
    glow: '0 0 20px hsl(197 100% 35% / 0.3)',
  },
  // Green — growth, success, safety (profits, wins)
  growth: {
    primary: 'hsl(165 70% 38%)',
    light: 'hsl(165 70% 38% / 0.15)',
    dark: 'hsl(165 70% 28%)',
    glow: '0 0 20px hsl(165 70% 38% / 0.3)',
  },
  // Red — urgency, alert, loss
  urgency: {
    primary: 'hsl(0 80% 50%)',
    light: 'hsl(0 80% 50% / 0.15)',
    dark: 'hsl(0 80% 40%)',
    glow: '0 0 20px hsl(0 80% 50% / 0.3)',
  },
  // Orange — attention, warning
  attention: {
    primary: 'hsl(32 95% 50%)',
    light: 'hsl(32 95% 50% / 0.15)',
    dark: 'hsl(32 95% 40%)',
    glow: '0 0 20px hsl(32 95% 50% / 0.3)',
  },
  // Purple — exclusivity, achievements, premium
  premium: {
    primary: 'hsl(270 70% 55%)',
    light: 'hsl(270 70% 55% / 0.15)',
    dark: 'hsl(270 70% 45%)',
    glow: '0 0 20px hsl(270 70% 55% / 0.3)',
  },
} as const;

export type PsychologyContext =
  | 'profit'
  | 'loss'
  | 'neutral'
  | 'warning'
  | 'achievement';

export function getColorForContext(context: PsychologyContext) {
  switch (context) {
    case 'profit':
      return ColorPsychology.growth;
    case 'loss':
      return ColorPsychology.urgency;
    case 'warning':
      return ColorPsychology.attention;
    case 'achievement':
      return ColorPsychology.premium;
    default:
      return ColorPsychology.trust;
  }
}
