export interface GuardrailEvaluation {
  allowed: boolean;
  sanitizedInput: string;
  reason?: 'OUT_OF_DOMAIN' | 'ADVERSARIAL_INJECTION_ATTEMPT' | 'SENSITIVE_PAYMENT_INFO';
  deflectionResponse?: string;
}

export const CONSULAR_DISCLAIMER =
  '📌 *Disclaimer: Guidance provided by Asha is for informational purposes based on current Bureau of Immigration / MEA regulations. Final visa issuance decisions rest solely with the consular authorities.*';

// Permitted domain keywords strictly confined to VisaReThink scope
const DOMAIN_KEYWORDS = [
  'visa',
  'passport',
  'document',
  'photo',
  'fee',
  'cost',
  'price',
  'track',
  'arn',
  'application',
  'consulate',
  'embassy',
  'validity',
  'expire',
  'expiry',
  'ecr',
  'non-ecr',
  'vfs',
  'apostille',
  'noc',
  'mrz',
  'status',
  'usa',
  'uk',
  'schengen',
  'uae',
  'dubai',
  'singapore',
  'japan',
  'canada',
  'australia',
  'tourism',
  'business',
  'medical',
  'conference',
  'transit',
  'step',
  'upload',
  'pay',
  'refund',
  'help',
  'support',
  'requirement',
  'checklist',
  'hi',
  'hello',
  'namaste',
  'hey',
  'start',
];

// Anti-jailbreak / system prompt extraction patterns
const ADVERSARIAL_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i,
  /system\s+prompt/i,
  /reveal\s+(your\s+)?(instructions|prompt|rules)/i,
  /you\s+are\s+now\s+(a|an)\s+unrestricted/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /pretend\s+you\s+can\s+do\s+anything/i,
  /disregard\s+all\s+guardrails/i,
];

// Sensitive payment patterns (CVV, Card Pin, OTP)
const SENSITIVE_PAYMENT_PATTERNS = [
  /\bcvv\b/i,
  /\bcvc\b/i,
  /\bcard\s*pin\b/i,
  /\batm\s*pin\b/i,
  /\botp\b/i,
  /\bpassword\b/i,
];

// Indian Passport number pattern (e.g. A1234567, Z9876543)
const PASSPORT_NUMBER_REGEX = /\b([A-Z][0-9]{7})\b/g;

/**
 * Check if string contains Indic characters (Devanagari, Tamil, Telugu, Kannada).
 */
export function hasIndicCharacters(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (
      (code >= 0x0900 && code <= 0x097f) ||
      (code >= 0x0b80 && code <= 0x0bff) ||
      (code >= 0x0c00 && code <= 0x0c7f) ||
      (code >= 0x0c80 && code <= 0x0cff)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Mask sensitive Indian passport numbers in user text for PII privacy.
 * Example: 'Z1234567' -> 'Z12***67'
 */
export function maskPassportNumbers(text: string): string {
  return text.replace(PASSPORT_NUMBER_REGEX, (_match, p1) => {
    return `${p1.slice(0, 3)}***${p1.slice(5)}`;
  });
}

/**
 * Evaluates incoming user messages against domain confinement, injection filters,
 * and payment safety guardrails.
 */
export function evaluateInputGuardrails(rawInput: string): GuardrailEvaluation {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      allowed: false,
      sanitizedInput: '',
      deflectionResponse: 'Please type a query or select one of the suggested topics below.',
    };
  }

  // 1. Adversarial Jailbreak / Prompt Injection Check
  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        sanitizedInput: trimmed,
        reason: 'ADVERSARIAL_INJECTION_ATTEMPT',
        deflectionResponse:
          '⚠️ I can only assist with authentic visa guidelines, application steps, and document requirements for Indian applicants.',
      };
    }
  }

  // 2. Sensitive Payment Credentials Check
  for (const pattern of SENSITIVE_PAYMENT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        sanitizedInput: trimmed,
        reason: 'SENSITIVE_PAYMENT_INFO',
        deflectionResponse:
          '🛡️ **Security Alert**: For your safety, never share payment PINs, CVV codes, or OTPs in chat. VisaReThink processes payments exclusively through official, encrypted payment gateways at Step 4.',
      };
    }
  }

  // 3. Domain Confinement Check (for queries longer than 15 chars)
  const lower = trimmed.toLowerCase();
  const isGreetingOrShort = trimmed.length < 15;
  const isDomainRelated = DOMAIN_KEYWORDS.some((keyword) => lower.includes(keyword));

  // Check Indic scripts (Hindi, Tamil, Telugu, Kannada, Marathi)
  const isIndic = hasIndicCharacters(trimmed);

  if (!isDomainRelated && !isGreetingOrShort && !isIndic) {
    return {
      allowed: false,
      sanitizedInput: trimmed,
      reason: 'OUT_OF_DOMAIN',
      deflectionResponse:
        'I am specialized exclusively as your VisaReThink assistant. I can help you with visa requirements, document checklists, fee calculations, passport validity checks, and tracking your application.',
    };
  }

  // 4. Sanitize and Mask PII
  const sanitized = maskPassportNumbers(trimmed);

  return {
    allowed: true,
    sanitizedInput: sanitized,
  };
}
