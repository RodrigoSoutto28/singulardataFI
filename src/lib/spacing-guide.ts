/**
 * Spacing guide based on the 8pt grid system.
 * Use these tokens via className composition to keep spacing consistent.
 */

export const SpacingGuide = {
  component: {
    card: { mobile: 'p-4', desktop: 'p-6', large: 'p-8' },
    button: { sm: 'px-3 py-1.5', md: 'px-4 py-2', lg: 'px-6 py-3' },
    input:  { sm: 'px-3 py-1.5', md: 'px-4 py-2.5', lg: 'px-5 py-3' },
    badge: 'px-2.5 py-0.5',
    alert: 'p-4',
  },
  gap: {
    tight: 'gap-2',
    normal: 'gap-4',
    relaxed: 'gap-6',
    loose: 'gap-8',
  },
  section: {
    tight: 'space-y-4',
    normal: 'space-y-6',
    relaxed: 'space-y-8',
    loose: 'space-y-12',
  },
  container: {
    mobile: 'px-4',
    tablet: 'md:px-6',
    desktop: 'lg:px-8',
  },
  grid: {
    tight: 'gap-3',
    normal: 'gap-4',
    relaxed: 'gap-6',
  },
} as const;

/** Convenience: responsive padding/gap class strings. */
export const ResponsiveSpacing = {
  paddingSm: 'p-3 md:p-4 lg:p-5',
  padding:   'p-4 md:p-6 lg:p-7',
  paddingLg: 'p-6 md:p-8 lg:p-10',
  gapSm: 'gap-2 md:gap-3 lg:gap-4',
  gap:   'gap-3 sm:gap-4 md:gap-6',
  gapLg: 'gap-4 md:gap-6 lg:gap-8',
  spaceSm: 'space-y-3 md:space-y-4 lg:space-y-5',
  space:   'space-y-4 md:space-y-6 lg:space-y-8',
  spaceLg: 'space-y-6 md:space-y-8 lg:space-y-10',
} as const;
