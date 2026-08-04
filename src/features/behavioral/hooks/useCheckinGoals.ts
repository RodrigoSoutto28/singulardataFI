import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export interface CheckinGoals {
  weeklyGoal: number;
  monthlyGoal: number;
}

const DEFAULT_GOALS: CheckinGoals = { weeklyGoal: 5, monthlyGoal: 20 };

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(v)));

export function useCheckinGoals() {
  const [goals, setGoals] = useLocalStorage<CheckinGoals>('mindon:checkin-goals', DEFAULT_GOALS);

  const weeklyGoal = clamp(goals?.weeklyGoal ?? DEFAULT_GOALS.weeklyGoal, 1, 7);
  const monthlyGoal = clamp(goals?.monthlyGoal ?? DEFAULT_GOALS.monthlyGoal, 1, 31);

  const setWeeklyGoal = (value: number) =>
    setGoals((prev) => ({ ...prev, weeklyGoal: clamp(value, 1, 7) }));

  const setMonthlyGoal = (value: number) =>
    setGoals((prev) => ({ ...prev, monthlyGoal: clamp(value, 1, 31) }));

  return { weeklyGoal, monthlyGoal, setWeeklyGoal, setMonthlyGoal };
}
