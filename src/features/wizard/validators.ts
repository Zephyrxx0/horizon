import { cleanPhoneDigits } from './formatters';
import { getDocumentSlotsForVisa } from '../documents/requirements';
import type { DocumentAttachment } from '../documents/types';

export function isValidPassport(passport: string): boolean {
  if (!passport || typeof passport !== 'string') return false;
  const clean = passport.trim().toUpperCase();
  return /^[A-Z]{2}\d{7}$/.test(clean);

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = cleanPhoneDigits(phone);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

export function isValidPincode(pincode: string): boolean {
  if (!pincode || typeof pincode !== 'string') return false;
  return /^\d{6}$/.test(pincode.trim());
}

export function isValidIsoDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const timestamp = Date.parse(dateStr);
  return !isNaN(timestamp);
}

export interface ExpiryEvaluation {
  isValid: boolean;
  isExpired: boolean;
  isNearExpiry: boolean;
  message: string;
}

/**
 * Checks passport expiry against a 6-month (180-day) validity buffer.
 */
export function getPassportExpiryStatus(
  expiryIso: string,
  referenceIso?: string,
): ExpiryEvaluation {
  if (!expiryIso || !isValidIsoDate(expiryIso)) {
    return {
      isValid: false,
      isExpired: false,
      isNearExpiry: false,
      message: 'Please enter a valid passport expiry date (YYYY-MM-DD).',
    };
  }

  const expiryTime = new Date(expiryIso).getTime();
  const baseTime =
    referenceIso && isValidIsoDate(referenceIso) ? new Date(referenceIso).getTime() : Date.now();

  const nowTime = Date.now();

  if (expiryTime <= nowTime) {
    return {
      isValid: false,
      isExpired: true,
      isNearExpiry: false,
      message: 'Your passport has already expired. You must renew your passport before applying.',
    };
  }

  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
  const isNearExpiry = expiryTime - baseTime < sixMonthsMs;

  if (isNearExpiry) {
    const formatted = new Date(expiryIso).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    });
    return {
      isValid: true,
      isExpired: false,
      isNearExpiry: true,
      message: `Your passport expires on ${formatted}. Most destination countries require at least 6 months validity from your travel date. You may want to renew first.`,
    };
  }

  return {
    isValid: true,
    isExpired: false,
    isNearExpiry: false,
    message: '',
  };
}

/**
 * Specific constructive error message dictionary (ERR-02).
 */
export function getConstructiveError(field: string, value?: unknown): string {
  switch (field) {
    case 'destinationCountry':
      return 'Please choose your destination country from the list to view available visas.';
    case 'tripPurpose':
      return 'Please select your primary reason for travel (e.g. Tourism, Business, Study, or Work).';
    case 'visaId':
      return 'Please select one of the matching visa types to continue.';
    case 'firstName':
      return 'First name is required. Enter your given name exactly as it appears on your passport.';
    case 'lastName':
      return 'Last name is required. Enter your surname as shown on your passport (or enter your given name if single name).';
    case 'dateOfBirth':
      return 'Date of birth is required. Please enter a valid date in YYYY-MM-DD format.';
    case 'gender':
      return 'Please select your gender as recorded on your passport.';
    case 'nationality':
      return 'Nationality is required. Please enter your country of citizenship.';
    case 'passportNumber':
      if (!value)
        return 'Passport number is required. Look at the top right of your passport bio-data page.';
      return 'Passport number must start with 2 letters followed by 7 digits (e.g. AA1234567).';
    case 'passportIssueDate':
      return 'Passport date of issue is required. Check the "Date of Issue" field on your passport.';
    case 'passportExpiryDate':
      return 'Passport date of expiry is required.';
    case 'passportExpiryConfirmed':
      return 'Please confirm that you understand the 6-month validity warning before proceeding.';
    case 'email':
      if (!value) return 'Email address is required for status updates and receipt delivery.';
      return 'Please enter a valid email address (e.g. name@example.com).';
    case 'phone':
      if (!value) return 'Phone number is required for SMS confirmation and tracking alerts.';
      return 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
    case 'addressLine1':
      return 'Address line 1 is required. Enter your current street address or house number.';
    case 'city':
      return 'City or town is required.';
    case 'state':
      return 'State or Union Territory is required.';
    case 'pincode':
      if (!value) return '6-digit PIN code is required.';
      return 'PIN code must be exactly 6 numeric digits (e.g. 560001).';
    case 'travelStartDate':
      return 'Expected travel date is required.';
    case 'travelEndDate':
      return 'Expected return date is required.';
    case 'stayAddress':
      return 'Hotel name or accommodation address in your destination country is required.';
    case 'companyName':
      return 'Visiting company or sponsoring organization name is required.';
    case 'institutionName':
      return 'University or educational institution name is required.';
    case 'sevisOrCasNumber':
      return 'SEVIS ID (USA), CAS Number (UK), or DLI Number (Canada) is required.';
    case 'employerName':
      return 'Employer or sponsoring company name is required.';
    case 'jobTitle':
      return 'Job designation or role title is required.';
    case 'declarationConfirmed':
      return 'Please confirm the declaration before proceeding to payment.';
    case 'paymentMethod':
      return 'Please choose a payment method (UPI, Card, or Netbanking).';
    default:
      return 'This field is required. Please provide a valid value to continue.';
  }
}

/**
 * Validates Stage 1 (Visa Selection)
 */
export function validateVisaSelectionStep(
  answers: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!answers.destinationCountry) {
    errors.destinationCountry = getConstructiveError('destinationCountry');
  }
  if (!answers.tripPurpose) {
    errors.tripPurpose = getConstructiveError('tripPurpose');
  }
  if (!answers.visaId) {
    errors.visaId = getConstructiveError('visaId');
  }

  return errors;
}

/**
 * Validates Stage 2a (Identity & Passport)
 */
export function validateIdentityStep(answers: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!answers.firstName || String(answers.firstName).trim().length === 0) {
    errors.firstName = getConstructiveError('firstName');
  }
  if (!answers.lastName || String(answers.lastName).trim().length === 0) {
    errors.lastName = getConstructiveError('lastName');
  }
  if (!answers.dateOfBirth || !isValidIsoDate(String(answers.dateOfBirth))) {
    errors.dateOfBirth = getConstructiveError('dateOfBirth');
  }
  if (!answers.gender) {
    errors.gender = getConstructiveError('gender');
  }
  if (!answers.nationality || String(answers.nationality).trim().length === 0) {
    errors.nationality = getConstructiveError('nationality');
  }

  const passport = String(answers.passportNumber || '');
  if (!passport.trim()) {
    errors.passportNumber = getConstructiveError('passportNumber');
  } else if (!isValidPassport(passport)) {
    errors.passportNumber = getConstructiveError('passportNumber', passport);
  }

  if (!answers.passportIssueDate || !isValidIsoDate(String(answers.passportIssueDate))) {
    errors.passportIssueDate = getConstructiveError('passportIssueDate');
  }

  const expiry = String(answers.passportExpiryDate || '');
  if (!expiry || !isValidIsoDate(expiry)) {
    errors.passportExpiryDate = getConstructiveError('passportExpiryDate');
  } else {
    const status = getPassportExpiryStatus(expiry);
    if (!status.isValid) {
      errors.passportExpiryDate = status.message;
    } else if (status.isNearExpiry && !answers.passportExpiryConfirmed) {
      errors.passportExpiryConfirmed = getConstructiveError('passportExpiryConfirmed');
    }
  }

  return errors;
}

/**
 * Validates Stage 2b (Contact & Address)
 */
export function validateContactStep(answers: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};

  const email = String(answers.email || '');
  if (!email.trim()) {
    errors.email = getConstructiveError('email');
  } else if (!isValidEmail(email)) {
    errors.email = getConstructiveError('email', email);
  }

  const phone = String(answers.phone || '');
  if (!phone.trim()) {
    errors.phone = getConstructiveError('phone');
  } else if (!isValidPhone(phone)) {
    errors.phone = getConstructiveError('phone', phone);
  }

  if (!answers.addressLine1 || String(answers.addressLine1).trim().length === 0) {
    errors.addressLine1 = getConstructiveError('addressLine1');
  }
  if (!answers.city || String(answers.city).trim().length === 0) {
    errors.city = getConstructiveError('city');
  }
  if (!answers.state || String(answers.state).trim().length === 0) {
    errors.state = getConstructiveError('state');
  }

  const pincode = String(answers.pincode || '');
  if (!pincode.trim()) {
    errors.pincode = getConstructiveError('pincode');
  } else if (!isValidPincode(pincode)) {
    errors.pincode = getConstructiveError('pincode', pincode);
  }

  return errors;
}

/**
 * Validates Stage 2c (Visa Specific Details)
 */
export function validateVisaSpecificStep(answers: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  const category = String(answers.visaCategory || '');

  if (category === 'tourist') {
    if (!answers.travelStartDate || !isValidIsoDate(String(answers.travelStartDate))) {
      errors.travelStartDate = getConstructiveError('travelStartDate');
    }
    if (!answers.stayAddress || String(answers.stayAddress).trim().length === 0) {
      errors.stayAddress = getConstructiveError('stayAddress');
    }
  } else if (category === 'business') {
    if (!answers.companyName || String(answers.companyName).trim().length === 0) {
      errors.companyName = getConstructiveError('companyName');
    }
    if (!answers.travelStartDate || !isValidIsoDate(String(answers.travelStartDate))) {
      errors.travelStartDate = getConstructiveError('travelStartDate');
    }
  } else if (category === 'student') {
    if (!answers.institutionName || String(answers.institutionName).trim().length === 0) {
      errors.institutionName = getConstructiveError('institutionName');
    }
    if (!answers.sevisOrCasNumber || String(answers.sevisOrCasNumber).trim().length === 0) {
      errors.sevisOrCasNumber = getConstructiveError('sevisOrCasNumber');
    }
  } else if (category === 'work') {
    if (!answers.employerName || String(answers.employerName).trim().length === 0) {
      errors.employerName = getConstructiveError('employerName');
    }
    if (!answers.jobTitle || String(answers.jobTitle).trim().length === 0) {
      errors.jobTitle = getConstructiveError('jobTitle');
    }
  } else {
    // Default generic travel date check
    if (!answers.travelStartDate || !isValidIsoDate(String(answers.travelStartDate))) {
      errors.travelStartDate = getConstructiveError('travelStartDate');
    }
  }

  return errors;
}

/**
 * Validates Stage 3 (Document Upload Pipeline)
 */
export function validateDocumentsStep(answers: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  const visaId = String(answers.visaId || answers.visaType || 'us-tourist');
  const { mandatory } = getDocumentSlotsForVisa(visaId);

  const docs = (answers.documents || {}) as Record<string, DocumentAttachment>;

  for (const slot of mandatory) {
    if (slot.subSlots && slot.subSlots.length > 0) {
      for (const sub of slot.subSlots) {
        const subKey = `${slot.id}_${sub.id}`;
        const att = docs[subKey] || docs[sub.id];
        if (!att) {
          errors[subKey] = `Please upload ${sub.title}.`;
        } else if (att.isBlurWarning && !att.isBlurWarningAcknowledged) {
          errors[subKey] = `${sub.title}: Image warning must be acknowledged or photo retaken.`;
        }
      }
    } else {
      const att = docs[slot.id];
      if (!att) {
        errors[slot.id] = `Please upload ${slot.title}.`;
      } else if (att.isBlurWarning && !att.isBlurWarningAcknowledged) {
        errors[slot.id] = `${slot.title}: Image warning must be acknowledged or photo retaken.`;
      }
    }
  }

  return errors;
}

/**
 * Validates Stage 4 (Review & Payment)
 */
export function validateReviewPaymentStep(
  answers: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!answers.declarationConfirmed) {
    errors.declarationConfirmed = getConstructiveError('declarationConfirmed');
  }

  return errors;
}
