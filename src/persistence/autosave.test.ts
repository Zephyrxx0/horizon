import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAutosaveController, installAutosave } from './autosave';

describe('Autosave Controller and Lifecycle Listeners', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transitions from idle -> dirty -> saving -> saved on debounce timeout', () => {
    const flush = vi.fn().mockReturnValue(true);
    const controller = createAutosaveController({ flush, delayMs: 10000 });

    const stateHistory: string[] = [];
    controller.subscribe((state) => stateHistory.push(state));

    expect(controller.state()).toBe('idle');

    controller.scheduleEdit();
    expect(controller.state()).toBe('dirty');
    expect(flush).not.toHaveBeenCalled();

    // Fast-forward 10s
    vi.advanceTimersByTime(10000);

    expect(flush).toHaveBeenCalledTimes(1);
    expect(controller.state()).toBe('saved');
    expect(stateHistory).toEqual(['dirty', 'saving', 'saved']);
  });

  it('transitions to error state when flush fails', () => {
    const flush = vi.fn().mockReturnValue(false);
    const controller = createAutosaveController({ flush });

    controller.scheduleEdit();
    controller.flushNow();

    expect(controller.state()).toBe('error');
  });

  it('installs visibilitychange and pagehide listeners and flushes on hide', () => {
    const flush = vi.fn().mockReturnValue(true);
    const uninstall = installAutosave(flush);

    // Simulate pagehide
    window.dispatchEvent(new Event('pagehide'));
    expect(flush).toHaveBeenCalledTimes(1);

    // Cleanup
    uninstall();
    window.dispatchEvent(new Event('pagehide'));
    expect(flush).toHaveBeenCalledTimes(1);
  });
});
