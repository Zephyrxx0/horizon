/**
 * Reference Number Generator & Formatter for VisaReThink
 * Format: VR-YYYY-XXXXXX (e.g., VR-2026-849201)
 */

export const REFERENCE_REGEX = /^VR-\d{4}-\d{6}$/;

/**
 * Generates a unique, human-readable application reference number.
 * Format: VR-YYYY-XXXXXX
 */
export function generateReferenceNumber(year: number = new Date().getFullYear()): string {
  // Generate random 6-digit number between 100000 and 999999
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `VR-${year}-${randomSuffix}`;
}

/**
 * Validates whether a given string is a valid VisaReThink reference number.
 */
export function isValidReferenceNumber(ref: string): boolean {
  if (!ref || typeof ref !== 'string') return false;
  return REFERENCE_REGEX.test(ref.trim().toUpperCase());
}

/**
 * Formats user input as they type into the standard VR-YYYY-XXXXXX format.
 */
export function formatReferenceNumber(val: string): string {
  if (!val) return '';
  // Strip non-alphanumeric
  const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Extract parts
  let prefix = '';
  if (cleaned.startsWith('VR')) {
    prefix = 'VR';
  } else if (cleaned.length > 0) {
    prefix = 'VR';
  }

  // Get remaining alphanumeric characters
  let remainder = cleaned;
  if (remainder.startsWith('VR')) {
    remainder = remainder.slice(2);
  }

  // Extract digits for Year (4 digits) and Suffix (6 digits)
  const digits = remainder.replace(/\D/g, '');
  const yearPart = digits.slice(0, 4);
  const suffixPart = digits.slice(4, 10);

  if (suffixPart.length > 0) {
    return `${prefix}-${yearPart}-${suffixPart}`;
  }
  if (yearPart.length > 0) {
    return `${prefix}-${yearPart}`;
  }
  return prefix ? `${prefix}-` : '';
}

