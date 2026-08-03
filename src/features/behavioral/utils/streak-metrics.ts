/**
 * Utilidades de cálculo de rachas (streaks) de check-ins.
 * Todas las fechas se manejan como claves locales "YYYY-MM-DD" para evitar
 * el desfase UTC de `new Date("YYYY-MM-DD")`.
 */

export function toDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Convierte una clave "YYYY-MM-DD" a Date local (medianoche). */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

/**
 * Racha actual y mejor racha histórica.
 * La racha actual sigue viva si hay check-in hoy o ayer.
 */
export function calcStreaks(dateKeys: string[], todayKey: string): StreakResult {
  const days = new Set(dateKeys.filter(Boolean));
  if (days.size === 0) return { currentStreak: 0, bestStreak: 0 };

  const today = fromDateKey(todayKey);
  const yesterdayKey = toDateKey(addDays(today, -1));

  let cursor: Date | null = null;
  if (days.has(todayKey)) cursor = today;
  else if (days.has(yesterdayKey)) cursor = addDays(today, -1);

  let currentStreak = 0;
  while (cursor) {
    const key = toDateKey(cursor);
    if (!days.has(key)) break;
    currentStreak++;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...days].sort();
  let bestStreak = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (fromDateKey(sorted[i]).getTime() - fromDateKey(sorted[i - 1]).getTime()) / 86400000
    );
    if (diff === 1) {
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else if (diff > 1) {
      run = 1;
    }
  }

  return { currentStreak, bestStreak };
}

export interface PeriodStats {
  completed: number;
  total: number;
  elapsed: number;
  missed: number;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}

/**
 * Estadísticas de un período [start, end] (inclusive).
 * Los días futuros cuentan en `total` pero no en `elapsed` ni en `missed`.
 */
export function periodStats(
  dateKeys: string[],
  start: Date,
  end: Date,
  todayKey: string
): PeriodStats {
  const days = new Set(dateKeys.filter(Boolean));
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);

  const inPeriod: string[] = [];
  let total = 0;
  let elapsed = 0;
  let completed = 0;

  let cursor = fromDateKey(startKey);
  while (toDateKey(cursor) <= endKey) {
    const key = toDateKey(cursor);
    total++;
    if (key <= todayKey) elapsed++;
    if (days.has(key)) {
      completed++;
      inPeriod.push(key);
    }
    cursor = addDays(cursor, 1);
  }

  const { currentStreak, bestStreak } = calcStreaks(inPeriod, todayKey);

  return {
    completed,
    total,
    elapsed,
    missed: Math.max(0, elapsed - completed),
    completionRate: elapsed > 0 ? Math.round((completed / elapsed) * 100) : 0,
    currentStreak,
    bestStreak: inPeriod.length ? bestStreak : 0,
  };
}

/** Lunes de la semana que contiene `date`. */
export function startOfWeek(date: Date): Date {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);
  const dow = (base.getDay() + 6) % 7; // 0 = lunes
  return addDays(base, -dow);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
