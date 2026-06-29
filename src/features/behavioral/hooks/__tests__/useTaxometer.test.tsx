import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTaxometer, type PsychErrorRow } from '../useTaxometer';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { supabase } from '@/config/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('@/features/auth/hooks/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/config/supabase', () => {
  const chain = {};
  const select = vi.fn().mockReturnValue(chain);
  const eq = vi.fn().mockReturnValue(chain);
  const order = vi.fn().mockReturnValue(chain);
  const insert = vi.fn().mockReturnValue(chain);
  const single = vi.fn();
  const from = vi.fn().mockReturnValue({
    select,
    insert,
  });

  Object.assign(chain, {
    select,
    eq,
    order,
    single,
    insert,
  });

  return {
    supabase: {
      from,
      _select: select,
      _eq: eq,
      _order: order,
      _insert: insert,
      _single: single,
    },
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTaxometer hook', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const getMocks = () => {
    return supabase as unknown as {
      from: any;
      _select: any;
      _eq: any;
      _order: any;
      _insert: any;
      _single: any;
    };
  };

  it('returns empty array if user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false, isGuest: false } as any);

    const { result } = renderHook(() => useTaxometer(), { wrapper });

    expect(result.current.errors).toEqual([]);
    expect(result.current.stats.totalCost).toBe(0);
  });

  it('fetches errors and calculates stats correctly', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: mockUser, loading: false, isGuest: false } as any);
    const mocks = getMocks();

    const nowStr = new Date().toISOString();
    const mockErrors: Partial<PsychErrorRow>[] = [
      {
        id: 'err-1',
        user_id: mockUser.id,
        error_type: 'revenge_trading',
        cost_dollars: 100,
        timestamp: nowStr, // this week
      },
      {
        id: 'err-2',
        user_id: mockUser.id,
        error_type: 'fomo',
        cost_dollars: 200,
        timestamp: nowStr, // this week
      },
    ];

    mocks._single.mockResolvedValue({ data: mockErrors, error: null });
    // In React Query, mock implementation of standard get query:
    mocks._order.mockResolvedValue({ data: mockErrors, error: null });

    const { result } = renderHook(() => useTaxometer(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.errors).toHaveLength(2);
    expect(result.current.stats.totalCost).toBe(300);
    expect(result.current.stats.weekCost).toBe(300);
    expect(result.current.errorsByType.revenge_trading).toEqual({ count: 1, total_cost: 100 });
    expect(result.current.errorsByType.fomo).toEqual({ count: 1, total_cost: 200 });
  });

  it('calls supabase insert on logError mutation', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: mockUser, loading: false, isGuest: false } as any);
    const mocks = getMocks();

    const loggedError = {
      id: 'new-err',
      user_id: mockUser.id,
      error_type: 'fomo',
      cost_dollars: 50,
    };
    mocks._single.mockResolvedValue({ data: loggedError, error: null });

    const { result } = renderHook(() => useTaxometer(), { wrapper });

    let response: any;
    await act(async () => {
      response = await result.current.logError({
        error_type: 'fomo',
        cost_dollars: 50,
      });
    });

    expect(mocks.from).toHaveBeenCalledWith('psychological_errors');
    expect(mocks._insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: mockUser.id,
        error_type: 'fomo',
        cost_dollars: 50,
      })
    );
    expect(response).toEqual(loggedError);
  });
});

// Helper act function wrapper for rendering hook mutations correctly
async function act(callback: () => Promise<void>) {
  await callback();
}
