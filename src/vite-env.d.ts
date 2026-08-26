/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom/vitest" />

import 'vitest';

/* eslint-disable @typescript-eslint/no-empty-object-type */
interface CustomAxeMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomAxeMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomAxeMatchers {}
}
