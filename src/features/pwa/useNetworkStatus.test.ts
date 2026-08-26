import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNetworkStatus } from './useNetworkStatus';

describe('useNetworkStatus hook', () => {
  const originalOnLine = navigator.onLine;

  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      configurable: true,
      writable: true,
    });
  });

  it('initializes with navigator.onLine value', () => {
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
    expect(result.current.isReconnected).toBe(false);
  });

  it('updates state and invokes onOffline when offline event fires', () => {
    const onOffline = vi.fn();
    const { result } = renderHook(() => useNetworkStatus({ onOffline }));

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
    expect(result.current.isReconnected).toBe(false);
    expect(onOffline).toHaveBeenCalledTimes(1);
  });

  it('updates state and invokes onReconnect when online event fires after offline', () => {
    const onReconnect = vi.fn();
    const onOffline = vi.fn();
    const { result } = renderHook(() => useNetworkStatus({ onReconnect, onOffline }));

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(true);
    expect(result.current.isReconnected).toBe(true);
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useNetworkStatus());

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    removeSpy.mockRestore();
  });
});
