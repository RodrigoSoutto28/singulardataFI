import { BRAIN_SESSIONS, type BrainSample } from '../types';

export type ConfidenceLevel = 'insufficient' | 'low' | 'medium' | 'high';

export interface PatternStat {
  pattern: string;
  count: number;
  wins: number;
  winRate: number;
  avgR: number | null;
  avgQuality: number | null;
  confidence: ConfidenceLevel;
  examples: BrainSample[];
}

export interface SessionPatternGroup {
  session: (typeof BRAIN_SESSIONS)[number];
  sampleCount: number;
  winRate: number;
  avgR: number | null;
  patterns: PatternStat[];
}

function confidenceFor(count: number, winRate: number): ConfidenceLevel {
  if (count < 3) return 'insufficient';
  if (count < 5) return 'low';
  if (count < 10) return 'medium';
  return winRate >= 60 || winRate <= 40 ? 'high' : 'medium';
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function buildSessionPatternGroups(
  samples: BrainSample[],
  options: { outcome?: 'all' | 'win' | 'stop'; minOccurrences?: number } = {},
): SessionPatternGroup[] {
  const outcome = options.outcome ?? 'all';
  const minOccurrences = options.minOccurrences ?? 1;

  const pool = samples.filter(
    (s) => (s.ai_patterns ?? []).length > 0 && (outcome === 'all' || s.outcome === outcome),
  );

  return BRAIN_SESSIONS.map((session) => {
    const list = pool.filter((s) => s.session === session);
    if (!list.length) return null;

    const map = new Map<string, BrainSample[]>();
    list.forEach((s) => {
      (s.ai_patterns ?? []).forEach((raw) => {
        const pattern = raw.trim();
        if (!pattern) return;
        const bucket = map.get(pattern) ?? [];
        bucket.push(s);
        map.set(pattern, bucket);
      });
    });

    const patterns: PatternStat[] = Array.from(map.entries())
      .map(([pattern, items]) => {
        const wins = items.filter((s) => s.outcome === 'win').length;
        const winRate = Math.round((wins / items.length) * 100);
        const avgR = average(
          items.map((s) => s.r_multiple).filter((v): v is number => v != null),
        );
        const avgQuality = average(
          items.map((s) => s.ai_quality_score).filter((v): v is number => v != null),
        );
        const examples = [...items]
          .sort(
            (a, b) =>
              (b.ai_quality_score ?? 0) - (a.ai_quality_score ?? 0) ||
              (b.r_multiple ?? 0) - (a.r_multiple ?? 0),
          )
          .slice(0, 3);

        return {
          pattern,
          count: items.length,
          wins,
          winRate,
          avgR,
          avgQuality,
          confidence: confidenceFor(items.length, winRate),
          examples,
        };
      })
      .filter((p) => p.count >= minOccurrences)
      .sort((a, b) => b.count - a.count || b.winRate - a.winRate);

    if (!patterns.length) return null;

    const sessionWins = list.filter((s) => s.outcome === 'win').length;

    return {
      session,
      sampleCount: list.length,
      winRate: Math.round((sessionWins / list.length) * 100),
      avgR: average(list.map((s) => s.r_multiple).filter((v): v is number => v != null)),
      patterns,
    };
  }).filter((g): g is SessionPatternGroup => g !== null);
}
