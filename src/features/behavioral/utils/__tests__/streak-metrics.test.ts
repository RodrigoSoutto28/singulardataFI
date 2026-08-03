import { describe, it, expect } from 'vitest';
import {
  calcStreaks,
  periodStats,
  toDateKey,
  startOfWeek,
  startOfMonth,
  endOfMonth,
} from '../streak-metrics';

const TODAY = '2026-08-02'; // domingo

describe('calcStreaks', () => {
  it('returns zeros with no entries', () => {
    expect(calcStreaks([], TODAY)).toEqual({ currentStreak: 0, bestStreak: 0 });
  });

  it('counts a live streak ending today', () => {
    const r = calcStreaks(['2026-07-31', '2026-08-01', '2026-08-02'], TODAY);
    expect(r.currentStreak).toBe(3);
    expect(r.bestStreak).toBe(3);
  });

  it('keeps the streak alive when the last check-in was yesterday', () => {
    const r = calcStreaks(['2026-07-31', '2026-08-01'], TODAY);
    expect(r.currentStreak).toBe(2);
  });

  it('breaks the current streak when the last check-in is older than yesterday', () => {
    const r = calcStreaks(['2026-07-28', '2026-07-29', '2026-07-30'], TODAY);
    expect(r.currentStreak).toBe(0);
    expect(r.bestStreak).toBe(3);
  });

  it('handles a single day', () => {
    expect(calcStreaks([TODAY], TODAY)).toEqual({ currentStreak: 1, bestStreak: 1 });
  });

  it('ignores duplicate dates', () => {
    const r = calcStreaks(['2026-08-01', '2026-08-01', '2026-08-02'], TODAY);
    expect(r.currentStreak).toBe(2);
    expect(r.bestStreak).toBe(2);
  });
});

describe('periodStats', () => {
  it('excludes future days from elapsed and missed', () => {
    const start = new Date(2026, 7, 1); // Aug 1
    const end = new Date(2026, 7, 7); // Aug 7
    const s = periodStats(['2026-08-01', '2026-08-02'], start, end, TODAY);
    expect(s.total).toBe(7);
    expect(s.elapsed).toBe(2);
    expect(s.completed).toBe(2);
    expect(s.missed).toBe(0);
    expect(s.completionRate).toBe(100);
  });

  it('counts missed elapsed days', () => {
    const start = new Date(2026, 6, 27); // Jul 27
    const end = new Date(2026, 7, 2); // Aug 2
    const s = periodStats(['2026-07-27', '2026-08-02'], start, end, TODAY);
    expect(s.elapsed).toBe(7);
    expect(s.completed).toBe(2);
    expect(s.missed).toBe(5);
    expect(s.bestStreak).toBe(1);
  });

  it('returns zero streaks for an empty period', () => {
    const s = periodStats([], new Date(2026, 7, 1), new Date(2026, 7, 7), TODAY);
    expect(s.bestStreak).toBe(0);
    expect(s.currentStreak).toBe(0);
  });
});

describe('date helpers', () => {
  it('startOfWeek returns Monday', () => {
    expect(toDateKey(startOfWeek(new Date(2026, 7, 2)))).toBe('2026-07-27');
  });

  it('month bounds', () => {
    expect(toDateKey(startOfMonth(new Date(2026, 7, 15)))).toBe('2026-08-01');
    expect(toDateKey(endOfMonth(new Date(2026, 7, 15)))).toBe('2026-08-31');
  });
});
