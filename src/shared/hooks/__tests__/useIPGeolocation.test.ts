import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIPGeolocation } from '../useIPGeolocation';
import { detectLanguageByIP, detectLanguageByIPFromCache, IPLanguageDetection } from '@/shared/lib/geolocation/ip-detector';
import { clearGeolocationCache, getCachedGeolocation } from '@/shared/lib/geolocation/cache';

vi.mock('@/shared/lib/geolocation/ip-detector', () => ({
  detectLanguageByIP: vi.fn(),
  detectLanguageByIPFromCache: vi.fn(),
}));

vi.mock('@/shared/lib/geolocation/cache', () => ({
  clearGeolocationCache: vi.fn(),
  getCachedGeolocation: vi.fn(),
}));

describe('useIPGeolocation hook', () => {
  const mockDetection: IPLanguageDetection = {
    countryCode: 'AR',
    country: 'AR',
    countryName: 'Argentina',
    language: 'es',
    confidence: 'high',
    cached: false,
    service: 'ipwho.is',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with cached value if present', () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(mockDetection);
    vi.mocked(getCachedGeolocation).mockReturnValue(mockDetection);

    const { result } = renderHook(() => useIPGeolocation());

    expect(result.current.detection).toEqual(mockDetection);
    expect(result.current.hasCache).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('initializes as null if no cache is present', () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(null);
    vi.mocked(getCachedGeolocation).mockReturnValue(null);

    const { result } = renderHook(() => useIPGeolocation());

    expect(result.current.detection).toBeNull();
    expect(result.current.hasCache).toBe(false);
  });

  it('detects location successfully on manual invocation', async () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(null);
    vi.mocked(detectLanguageByIP).mockResolvedValue(mockDetection);

    const { result } = renderHook(() => useIPGeolocation());

    let promise: Promise<any>;
    act(() => {
      promise = result.current.detectLocation();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.detection).toEqual(mockDetection);
    expect(result.current.error).toBeNull();
  });

  it('handles error during location detection', async () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(null);
    const mockError = new Error('Network error');
    vi.mocked(detectLanguageByIP).mockRejectedValue(mockError);

    const { result } = renderHook(() => useIPGeolocation());

    let errorThrown: any = null;
    await act(async () => {
      try {
        await result.current.detectLocation();
      } catch (e) {
        errorThrown = e;
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.detection).toBeNull();
    expect(result.current.error).toBe(mockError);
    expect(errorThrown).toBe(mockError);
  });

  it('resets detection and clears cache', () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(mockDetection);
    const { result } = renderHook(() => useIPGeolocation());

    act(() => {
      result.current.reset();
    });

    expect(clearGeolocationCache).toHaveBeenCalled();
    expect(result.current.detection).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('autodetects automatically if autoDetect option is true', async () => {
    vi.mocked(detectLanguageByIPFromCache).mockReturnValue(null);
    vi.mocked(detectLanguageByIP).mockResolvedValue(mockDetection);

    const { result } = renderHook(() => useIPGeolocation({ autoDetect: true }));

    // Let the useEffect trigger detectLocation
    await act(async () => {
      // Just waiting for promises to resolve
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(detectLanguageByIP).toHaveBeenCalled();
    expect(result.current.detection).toEqual(mockDetection);
  });
});
