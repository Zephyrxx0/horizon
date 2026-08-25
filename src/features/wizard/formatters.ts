/**
 * Formats a passport number to standard Indian / international format (e.g. AA1234567).
 * Uppercases letters, strips spaces/special characters, and limits to 9 alphanumeric chars.
 */
export function formatPassportNumber(value: string): string {
  if (!value) return '';

  const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const letters = clean.slice(0, 2).replace(/[^A-Z]/g, '');
  const digits = clean.slice(2, 9).replace(/\D/g, '');

  return letters + digits;
}

/**
 * Formats an Indian phone number with auto +91 prefix and spaced digit grouping: +91 XXXXX XXXXX.
 */
export function formatPhoneNumber(value: string): string {
  if (!value) return '+91 ';

  // Strip non-digits
  let digits = value.replace(/\D/g, '');

  // Strip leading 91 if typed explicitly
  if (digits.startsWith('91') && digits.length > 2) {
    digits = digits.slice(2);
  }

  // Limit to 10 Indian mobile digits
  const tenDigits = digits.slice(0, 10);

  if (tenDigits.length === 0) {
    return '+91 ';
  }

  if (tenDigits.length <= 5) {
    return `+91 ${tenDigits}`;
  }

  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

/**
 * Strips phone formatting to pure digits for validation.
 */
export function cleanPhoneDigits(value: string): string {
  if (!value) return '';
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}
