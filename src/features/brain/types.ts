import type { Tables } from '@/shared/types/database';

export type BrainSample = Tables<'brain_samples'>;

export const BRAIN_SESSIONS = ['asia', 'london', 'newyork', 'overlap'] as const;
export type BrainSession = (typeof BRAIN_SESSIONS)[number];

export const BRAIN_OUTCOMES = ['win', 'stop'] as const;
export type BrainOutcome = (typeof BRAIN_OUTCOMES)[number];

export const BRAIN_STRUCTURE_TAGS = [
  'trend',
  'range',
  'liquiditySweep',
  'fvg',
  'orderBlock',
  'falseBreakout',
  'highVolatility',
  'lowVolatility',
  'news',
] as const;
export type BrainStructureTag = (typeof BRAIN_STRUCTURE_TAGS)[number];

export interface BrainSampleInput {
  file: File;
  session: BrainSession;
  symbol: string;
  timeframe: string;
  occurred_at: string;
  structure_tags: string[];
  outcome: BrainOutcome;
  r_multiple: number | null;
  setup_type: string;
  notes: string;
}
