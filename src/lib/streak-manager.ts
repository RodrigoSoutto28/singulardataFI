import { supabase } from '@/integrations/supabase/client';

export async function updateStreak(userId: string, streakType: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('streak_type', streakType)
    .maybeSingle();

  if (!streak) {
    await supabase.from('user_streaks').insert({
      user_id: userId,
      streak_type: streakType,
      current_count: 1,
      best_count: 1,
      last_activity_date: today,
      start_date: today,
    });
    return;
  }

  const last = streak.last_activity_date ? new Date(streak.last_activity_date) : null;
  const todayDate = new Date(today);
  const diffDays = last
    ? Math.floor((todayDate.getTime() - last.getTime()) / 86400000)
    : 999;

  if (diffDays === 0) return;

  if (diffDays === 1) {
    const next = streak.current_count + 1;
    await supabase
      .from('user_streaks')
      .update({
        current_count: next,
        best_count: Math.max(streak.best_count, next),
        last_activity_date: today,
      })
      .eq('id', streak.id);
  } else {
    await supabase
      .from('user_streaks')
      .update({
        current_count: 1,
        last_activity_date: today,
        start_date: today,
      })
      .eq('id', streak.id);
  }
}
