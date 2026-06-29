import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { Trade } from '@/features/journal/hooks/useTrades';

export interface UseInfiniteTradesOptions {
  pageSize?: number;
  search?: string;
  status?: string; // 'all' | 'open' | 'closed' | ...
}

interface TradesPage {
  rows: Trade[];
  nextPage: number | null;
}

/**
 * Server-side paginated trades for long lists (Trade Ledger).
 *
 * - Uses TanStack `useInfiniteQuery` with `pageSize` rows per page (default 50).
 * - Filters `search` (symbol ILIKE) and `status` are applied at the database
 *   level, so memory stays flat regardless of total trade count.
 * - Does NOT replace `useTrades()` — that hook is still the source of truth
 *   for aggregates, mutations and exports.
 */
export function useInfiniteTrades({
  pageSize = 50,
  search = '',
  status = 'all',
}: UseInfiniteTradesOptions = {}) {
  const { user } = useAuth();
  const trimmedSearch = search.trim();

  const query = useInfiniteQuery<TradesPage>({
    queryKey: ['trades-infinite', user?.id, pageSize, trimmedSearch, status],
    enabled: !!user?.id,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const page = pageParam as number;
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let q = supabase
        .from('trades')
        .select('*')
        .eq('user_id', user!.id)
        .order('entry_date', { ascending: false })
        .range(from, to);

      if (status !== 'all') q = q.eq('status', status as 'open' | 'closed' | 'cancelled');
      if (trimmedSearch) q = q.ilike('symbol', `%${trimmedSearch}%`);

      const { data, error } = await q;
      if (error) throw error;

      const rows = (data ?? []) as Trade[];
      return {
        rows,
        nextPage: rows.length < pageSize ? null : page + 1,
      };
    },
    getNextPageParam: (last) => last.nextPage,
  });

  const trades = (query.data?.pages.flatMap((p) => p.rows) ?? []) as Trade[];

  return {
    trades,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    error: query.error,
  };
}
