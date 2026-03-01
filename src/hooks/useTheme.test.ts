import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme } from './useTheme';

const STORAGE_KEY = 'merch-register-theme';

describe('useTheme', () => {
  let matchMediaListeners: Array<(e: { matches: boolean }) => void>;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    matchMediaListeners = [];
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        addEventListener: (_: string, cb: (e: { matches: boolean }) => void) =>
          matchMediaListeners.push(cb),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to system theme when nothing stored', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('reads stored theme from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('cycles light → dark → system on toggle', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    document.documentElement.setAttribute('data-theme', 'light');

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('system');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('sets data-theme attribute on document element', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());
    // system -> light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    act(() => result.current.toggleTheme());
    // light -> dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('resolvedTheme follows system preference in system mode', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: (_: string, cb: (e: { matches: boolean }) => void) =>
          matchMediaListeners.push(cb),
        removeEventListener: vi.fn(),
      })),
    );

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });
});
