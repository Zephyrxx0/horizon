import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { FOCUS_RING_CLASS } from './focus';

export type ToastKind = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  show: (opts: { kind?: ToastKind; message: string; duration?: number }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idPrefix = useId();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({
      kind = 'info',
      message,
      duration = 5000,
    }: {
      kind?: ToastKind;
      message: string;
      duration?: number;
    }) => {
      const id = `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, kind, message, duration };

      setToasts((prev) => {
        // Enforce max 3 stacked toasts: keep newest 2 and append new one
        const trimmed = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
        return [...trimmed, newToast];
      });

      // Auto-dismiss success and info toasts; error toasts persist until manual dismiss
      if (kind !== 'error' && duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss, idPrefix],
  );

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[var(--radius-input)] shadow-lg text-white ${
              toast.kind === 'error'
                ? 'bg-[var(--color-error)]'
                : toast.kind === 'success'
                  ? 'bg-[var(--color-success)]'
                  : 'bg-[var(--color-indigo-primary)]'
            }`}
          >
            {toast.kind === 'success' && (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            {toast.kind === 'error' && (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            {toast.kind === 'info' && (
              <Info className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className="text-sm font-medium flex-1 leading-snug">{toast.message}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
              className={`p-1 rounded text-white/80 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center ${FOCUS_RING_CLASS}`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
