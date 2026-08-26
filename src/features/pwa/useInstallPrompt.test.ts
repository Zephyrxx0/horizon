import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useInstallPrompt } from './useInstallPrompt';
import type { BeforeInstallPromptEvent } from './types';

describe('useInstallPrompt hook', () => {
  it('initializes with default non-installable state in non-standalone environment', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
  });

  it('captures beforeinstallprompt event and provides working promptToInstall', async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const preventDefault = vi.fn();
    const prompt = vi.fn().mockResolvedValue(undefined);
    const userChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });

    const mockEvent = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault,
      prompt,
      userChoice,
      platforms: ['web'],
    }) as unknown as BeforeInstallPromptEvent;

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true);

    let installed = false;
    await act(async () => {
      installed = await result.current.promptToInstall();
    });

    expect(prompt).toHaveBeenCalled();
    expect(installed).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it('handles dismissed install choice gracefully', async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockEvent = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' as const, platform: 'web' }),
      platforms: ['web'],
    }) as unknown as BeforeInstallPromptEvent;

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    let installed = true;
    await act(async () => {
      installed = await result.current.promptToInstall();
    });

    expect(installed).toBe(false);
  });

  it('updates state when appinstalled event is received', () => {
    const { result } = renderHook(() => useInstallPrompt());

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useInstallPrompt());

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function));
    removeSpy.mockRestore();
  });
});
