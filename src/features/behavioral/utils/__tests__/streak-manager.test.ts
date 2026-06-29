import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateStreak } from '../streak-manager';
import { supabase } from '@/config/supabase';

vi.mock('@/config/supabase', () => {
  const chain = {};
  const select = vi.fn().mockReturnValue(chain);
  const eq = vi.fn().mockReturnValue(chain);
  const maybeSingle = vi.fn();
  const insert = vi.fn().mockResolvedValue({ error: null });
  const update = vi.fn().mockReturnValue(chain);
  const from = vi.fn().mockReturnValue({
    select,
    insert,
    update,
  });

  Object.assign(chain, {
    eq,
    maybeSingle,
  });

  return {
    supabase: {
      from,
      // References for assertions
      _select: select,
      _eq: eq,
      _maybeSingle: maybeSingle,
      _insert: insert,
      _update: update,
    },
  };
});

describe('streak-manager', () => {
  const userId = 'user-123';
  const streakType = 'checkin';
  const todayStr = new Date().toISOString().split('T')[0];

  const getMocks = () => {
    return supabase as unknown as {
      from: any;
      _select: any;
      _eq: any;
      _maybeSingle: any;
      _insert: any;
      _update: any;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new streak if none exists', async () => {
    const mocks = getMocks();
    mocks._maybeSingle.mockResolvedValue({ data: null, error: null });

    await updateStreak(userId, streakType);

    expect(mocks.from).toHaveBeenCalledWith('user_streaks');
    expect(mocks._insert).toHaveBeenCalledWith({
      user_id: userId,
      streak_type: streakType,
      current_count: 1,
      best_count: 1,
      last_activity_date: todayStr,
      start_date: todayStr,
    });
  });

  it('does nothing (no-op) if last activity date is today (same day)', async () => {
    const mocks = getMocks();
    const existingStreak = {
      id: 'streak-abc',
      user_id: userId,
      streak_type: streakType,
      current_count: 3,
      best_count: 5,
      last_activity_date: todayStr,
    };
    mocks._maybeSingle.mockResolvedValue({ data: existingStreak, error: null });

    await updateStreak(userId, streakType);

    expect(mocks._insert).not.toHaveBeenCalled();
    expect(mocks._update).not.toHaveBeenCalled();
  });

  it('increments streak if last activity date was yesterday (consecutive)', async () => {
    const mocks = getMocks();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const existingStreak = {
      id: 'streak-abc',
      user_id: userId,
      streak_type: streakType,
      current_count: 3,
      best_count: 5,
      last_activity_date: yesterdayStr,
    };
    mocks._maybeSingle.mockResolvedValue({ data: existingStreak, error: null });

    await updateStreak(userId, streakType);

    expect(mocks._update).toHaveBeenCalledWith({
      current_count: 4,
      best_count: 5,
      last_activity_date: todayStr,
    });
  });

  it('increments streak and updates best_count if current surpasses best', async () => {
    const mocks = getMocks();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const existingStreak = {
      id: 'streak-abc',
      user_id: userId,
      streak_type: streakType,
      current_count: 5,
      best_count: 5,
      last_activity_date: yesterdayStr,
    };
    mocks._maybeSingle.mockResolvedValue({ data: existingStreak, error: null });

    await updateStreak(userId, streakType);

    expect(mocks._update).toHaveBeenCalledWith({
      current_count: 6,
      best_count: 6,
      last_activity_date: todayStr,
    });
  });

  it('resets streak to 1 if last activity date is older than yesterday', async () => {
    const mocks = getMocks();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

    const existingStreak = {
      id: 'streak-abc',
      user_id: userId,
      streak_type: streakType,
      current_count: 5,
      best_count: 10,
      last_activity_date: twoDaysAgoStr,
    };
    mocks._maybeSingle.mockResolvedValue({ data: existingStreak, error: null });

    await updateStreak(userId, streakType);

    expect(mocks._update).toHaveBeenCalledWith({
      current_count: 1,
      last_activity_date: todayStr,
      start_date: todayStr,
    });
  });
});
