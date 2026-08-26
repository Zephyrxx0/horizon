export const FOCUS_RING_CLASS =
  'focus-visible:outline-2 focus-visible:outline-[var(--color-indigo-primary)] focus-visible:outline-offset-2';

/**
 * Programmatically shifts focus to the active step's main heading (h1/h2)
 * or to an active ErrorSummary if validation errors exist on the page.
 * Sets tabIndex="-1" if the target element is not natively focusable,
 * ensuring screen readers receive the announcement and keyboard position is updated.
 */
export function focusHeadingOrFirstElement(container?: HTMLElement | null): boolean {
  if (typeof document === 'undefined') return false;

  const root = container || document;

  // 1. Check for ErrorSummary / Alert first
  const errorSummary = root.querySelector<HTMLElement>(
    '[data-testid="error-summary"], [role="alert"]',
  );
  if (errorSummary) {
    if (!errorSummary.hasAttribute('tabindex')) {
      errorSummary.setAttribute('tabindex', '-1');
    }
    errorSummary.focus({ preventScroll: false });
    return true;
  }

  // 2. Look for primary heading inside main or root
  const heading =
    root.querySelector<HTMLElement>('main h2, main h1:not(.sr-only), [data-step-heading]') ||
    root.querySelector<HTMLElement>('h1:not(.sr-only), h2, h3') ||
    root.querySelector<HTMLElement>('#main-content');

  if (heading) {
    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
    }
    heading.focus({ preventScroll: false });
    return true;
  }

  return false;
}

/**
 * Smoothly shifts focus to active stage heading or error summary on stage transitions (D-15).
 */
export function focusStepHeading(stepId?: string): boolean {
  if (stepId && typeof document !== 'undefined') {
    const stepContainer = document.getElementById(stepId);
    if (stepContainer) {
      return focusHeadingOrFirstElement(stepContainer);
    }
  }
  return focusHeadingOrFirstElement();
}
