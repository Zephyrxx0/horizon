import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { FOCUS_RING_CLASS } from './focus';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Sheet({ open, onClose, title, description, children }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const prevFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      prevFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus first focusable element or sheet container
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable && focusable.length > 0) {
        focusable[0]?.focus();
      } else {
        sheetRef.current?.focus();
      }
    } else {
      document.body.style.overflow = '';
      if (prevFocusedElement.current) {
        prevFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[var(--color-overlay)] transition-opacity duration-200"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        aria-describedby={description ? 'sheet-description' : undefined}
        tabIndex={-1}
        className="relative z-10 w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto motion-safe:transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="sheet-title" className="text-xl font-semibold text-[var(--color-ink)]">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className={`p-2 rounded-full text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-bg)] ${FOCUS_RING_CLASS}`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {description && (
          <p
            id="sheet-description"
            className="text-sm text-[var(--color-ink-muted)] mb-4 leading-relaxed"
          >
            {description}
          </p>
        )}
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
