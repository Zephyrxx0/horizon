export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export interface AutosaveControllerOptions {
  flush: () => boolean;
  delayMs?: number;
}

export interface AutosaveController {
  scheduleEdit: () => void;
  flushNow: () => boolean;
  state: () => SaveState;
  subscribe: (listener: (state: SaveState) => void) => () => void;
}

export function createAutosaveController({
  flush,
  delayMs = 10000,
}: AutosaveControllerOptions): AutosaveController {
  let currentState: SaveState = 'idle';
  let timerId: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<(state: SaveState) => void>();

  function setState(next: SaveState) {
    if (currentState === next) return;
    currentState = next;
    listeners.forEach((fn) => fn(currentState));
  }

  function executeFlush(): boolean {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }

    setState('saving');
    const success = flush();
    if (success) {
      setState('saved');
    } else {
      setState('error');
    }
    return success;
  }

  function scheduleEdit() {
    setState('dirty');

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      executeFlush();
    }, delayMs);
  }

  function flushNow(): boolean {
    return executeFlush();
  }

  return {
    scheduleEdit,
    flushNow,
    state: () => currentState,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

/**
 * Registers lifecycle listeners for guaranteed flush on backgrounding/leaving tab.
 * Sync flush ensures writes complete before page lifecycle freeze.
 */
export function installAutosave(flush: () => boolean): () => void {
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  };

  const onPageHide = () => {
    flush();
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);

  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide);
  };
}
