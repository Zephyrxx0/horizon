import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
import { configureAxe } from 'vitest-axe';

expect.extend(matchers);

// Configure axe rules globally (disable landmark region rule for atomic component testing)
configureAxe({
  globalOptions: {
    rules: [{ id: 'region', enabled: false }],
  },
});
