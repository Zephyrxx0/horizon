import 'i18next';
import type common from './locales/en/common.json';
import type wizard from './locales/en/wizard.json';
import type help from './locales/en/help.json';
import type errors from './locales/en/errors.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      wizard: typeof wizard;
      help: typeof help;
      errors: typeof errors;
    };
  }
}
