import type { Translations } from '@/shared/lib/i18n/translations';

export function sessionLabel(t: Translations, session: string): string {
  switch (session) {
    case 'asia':
      return t.brain.sessionAsia;
    case 'london':
      return t.brain.sessionLondon;
    case 'newyork':
      return t.brain.sessionNewYork;
    case 'overlap':
      return t.brain.sessionOverlap;
    default:
      return session;
  }
}

export function tagLabel(t: Translations, tag: string): string {
  switch (tag) {
    case 'trend':
      return t.brain.tagTrend;
    case 'range':
      return t.brain.tagRange;
    case 'liquiditySweep':
      return t.brain.tagLiquiditySweep;
    case 'fvg':
      return t.brain.tagFvg;
    case 'orderBlock':
      return t.brain.tagOrderBlock;
    case 'falseBreakout':
      return t.brain.tagFalseBreakout;
    case 'highVolatility':
      return t.brain.tagHighVolatility;
    case 'lowVolatility':
      return t.brain.tagLowVolatility;
    case 'news':
      return t.brain.tagNews;
    default:
      return tag;
  }
}

export function outcomeLabel(t: Translations, outcome: string): string {
  return outcome === 'win' ? t.brain.outcomeWin : t.brain.outcomeStop;
}
