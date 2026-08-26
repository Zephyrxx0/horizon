import React, { useEffect, useState } from 'react';
import i18n, { LOCALES } from '../i18n';

export interface AnnounceEventDetail {
  message: string;
  priority?: 'polite' | 'assertive';
}

/**
 * Dispatch an accessible announcement to screen readers.
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<AnnounceEventDetail>('a11y-announce', {
        detail: { message, priority },
      }),
    );
  }
}

/**
 * Convenience helper for polite announcements (e.g., step transitions, save confirmations).
 */
export function announcePolite(message: string): void {
  announce(message, 'polite');
}

/**
 * Convenience helper for assertive announcements (e.g., validation alerts, quota warnings).
 */
export function announceAssertive(message: string): void {
  announce(message, 'assertive');
}

export interface A11yAnnouncerProps {
  className?: string;
  politeMessage?: string;
  assertiveMessage?: string;
}

/**
 * A11yAnnouncer provides visually hidden aria-live regions for screen reader announcements.
 * Announces stage transitions, save confirmations, error alerts, and language switches (D-15 / A11Y-02).
 */
export const A11yAnnouncer: React.FC<A11yAnnouncerProps> = ({
  className = '',
  politeMessage: propPolite = '',
  assertiveMessage: propAssertive = '',
}) => {
  const [eventPolite, setEventPolite] = useState('');
  const [eventAssertive, setEventAssertive] = useState('');

  const displayPolite = eventPolite || propPolite;
  const displayAssertive = eventAssertive || propAssertive;

  useEffect(() => {
    const handleAnnounce = (e: Event) => {
      const customEvent = e as CustomEvent<AnnounceEventDetail>;
      if (!customEvent.detail || !customEvent.detail.message) return;

      const { message, priority = 'polite' } = customEvent.detail;
      if (priority === 'assertive') {
        setEventAssertive('');
        // Small tick to ensure screen readers detect the change
        setTimeout(() => setEventAssertive(message), 10);
      } else {
        setEventPolite('');
        setTimeout(() => setEventPolite(message), 10);
      }
    };

    const handleLanguageChanged = (lng: string) => {
      const loc = LOCALES.find((l) => l.code === lng);
      const name = loc ? `${loc.label} (${loc.englishName})` : lng;
      announcePolite(`Language changed to ${name}`);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('a11y-announce', handleAnnounce);
    }
    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('a11y-announce', handleAnnounce);
      }
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <div className={`sr-only ${className}`} aria-hidden="false">
      <div
        id="a11y-announcer-polite"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="a11y-polite"
      >
        {displayPolite}
      </div>
      <div
        id="a11y-announcer-assertive"
        aria-live="assertive"
        aria-atomic="true"
        data-testid="a11y-assertive"
      >
        {displayAssertive}
      </div>
    </div>
  );
};
