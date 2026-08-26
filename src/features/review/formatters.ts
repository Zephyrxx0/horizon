export function formatCardNumber(val: string): string {
  if (!val || typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatCardExpiry(val: string): string {
  if (!val || typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function formatCvv(val: string): string {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/\D/g, '').slice(0, 4);
}

export function isValidUpiVpa(vpa: string): boolean {
  if (!vpa || typeof vpa !== 'string') return false;
  const clean = vpa.trim();
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(clean);
}

export function isValidCardNumber(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const digits = val.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function isValidCardExpiry(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const clean = val.replace(/\D/g, '');
  if (clean.length !== 4) return false;

  const month = parseInt(clean.slice(0, 2), 10);
  const year = parseInt(clean.slice(2, 4), 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

export function isValidCvv(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const digits = val.replace(/\D/g, '');
  return digits.length === 3 || digits.length === 4;
}

export function getCardBrand(number: string): 'visa' | 'mastercard' | 'rupay' | 'unknown' {
  const digits = (number || '').replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^(508|60|65|81|82)/.test(digits)) return 'rupay';
  return 'unknown';
}
