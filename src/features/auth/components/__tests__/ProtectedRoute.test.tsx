import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('@/features/auth/hooks/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/components/ui/page-loader', () => ({
  PageLoader: () => <div data-testid="loader">Loading...</div>,
}));

describe('ProtectedRoute component', () => {
  it('renders loader when loading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      isGuest: false,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('redirects to /auth when user is not logged in and not guest', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isGuest: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<div data-testid="auth-page">Auth Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('renders children when user is logged in', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
      isGuest: false,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('loader')).toBeNull();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders children when user is guest', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isGuest: true,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('loader')).toBeNull();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
