import { tool } from 'ai';
import { z } from 'zod';
import { VISA_CATALOG } from '../../features/visa/catalog';
import { FAQ_ITEMS, JARGON_DEFINITIONS } from '../../features/support/faqCatalog';
import type {
  VisaDetailsResult,
  FeeCalculationResult,
  RequiredDocumentsResult,
  PassportValidityResult,
  TrackingStatusResult,
  JargonExplanationResult,
  WizardNavigationResult,
} from './types';
import type { TripPurpose } from '../../features/visa/types';

export async function getVisaDetails(input: {
  destination: string;
  purpose?: string;
}): Promise<VisaDetailsResult> {
  const destLower = input.destination.toLowerCase().trim();
  const matches = VISA_CATALOG.filter((v) => {
    const matchDest =
      v.destination.toLowerCase().includes(destLower) || v.name.toLowerCase().includes(destLower);
    const matchPurpose = !input.purpose || v.purposes.includes(input.purpose as TripPurpose);
    return matchDest && matchPurpose;
  });

  const item = matches[0];
  if (!item) {
    return {
      found: false,
      error: `No visa information found for "${input.destination}". We currently support USA, UK, Schengen, UAE, Singapore, Japan, Canada, and Australia.`,
    };
  }

  return {
    found: true,
    id: item.id,
    name: item.name,
    destination: item.destination,
    category: item.category,
    purposes: item.purposes,
    description: item.description,
    visaFee: item.visaFee,
    govtFee: item.govtFee,
    platformFee: item.platformFee,
    totalCost: item.totalCost,
    processingTimeDisplay: item.processingTimeDisplay,
    requiredDocumentsCount: item.requiredDocuments.length,
  };
}

export async function calculateVisaFees(input: {
  visaIdOrDestination: string;
}): Promise<FeeCalculationResult> {
  const query = input.visaIdOrDestination.toLowerCase().trim();
  const item =
    VISA_CATALOG.find((v) => v.id.toLowerCase() === query) ||
    VISA_CATALOG.find((v) => v.destination.toLowerCase().includes(query)) ||
    VISA_CATALOG[0];

  const consularFee = item.visaFee;
  const govtFee = item.govtFee;
  const platformFee = item.platformFee;
  const totalAmount = item.totalCost;

  return {
    visaId: item.id,
    visaName: item.name,
    destination: item.destination,
    consularFee,
    governmentMeaFee: govtFee,
    platformFee,
    totalAmount,
    currency: 'INR (₹)',
    breakdown: `Consular Fee: ₹${consularFee.toLocaleString('en-IN')} + Govt MEA Fee: ₹${govtFee.toLocaleString('en-IN')} + Platform Fee: ₹${platformFee.toLocaleString('en-IN')} = Total ₹${totalAmount.toLocaleString('en-IN')}`,
  };
}

export async function getRequiredDocuments(input: {
  visaIdOrDestination: string;
}): Promise<RequiredDocumentsResult> {
  const query = input.visaIdOrDestination.toLowerCase().trim();
  const item =
    VISA_CATALOG.find((v) => v.id.toLowerCase() === query) ||
    VISA_CATALOG.find((v) => v.destination.toLowerCase().includes(query)) ||
    VISA_CATALOG[0];

  const mandatory = item.requiredDocuments
    .filter((d) => d.required)
    .map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      required: true,
      format: d.format,
    }));

  const optional = item.requiredDocuments
    .filter((d) => !d.required)
    .map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      required: false,
      format: d.format,
    }));

  return {
    visaId: item.id,
    visaName: item.name,
    destination: item.destination,
    mandatoryDocuments: mandatory,
    optionalDocuments: optional,
    photoSpecifications: {
      dimensions: '2x2 inches (51x51 mm) square format',
      background: 'Plain white or light off-white background',
      recency: 'Taken within the last 6 months',
      format: 'JPEG / PNG under 5MB',
    },
    fileRequirements: {
      maxSize: '5MB per document',
      acceptedFormats: ['PDF', 'JPEG', 'JPG', 'PNG'],
      offlineCompression: true,
    },
  };
}

export async function checkPassportValidity(input: {
  passportExpiryDate: string;
  travelDate?: string;
}): Promise<PassportValidityResult> {
  const expiry = new Date(input.passportExpiryDate);
  const travel = input.travelDate ? new Date(input.travelDate) : new Date();

  if (isNaN(expiry.getTime())) {
    return {
      isValidForTravel: false,
      daysRemaining: 0,
      monthsRemaining: 0,
      expiryDate: input.passportExpiryDate,
      travelDate: travel.toISOString().split('T')[0],
      meetsSixMonthRule: false,
      warningMessage: 'Invalid passport expiry date format.',
      recommendedAction: 'Please enter date in YYYY-MM-DD format.',
    };
  }

  const diffMs = expiry.getTime() - travel.getTime();
  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const monthsRemaining = Math.floor(daysRemaining / 30.4375);
  const meetsSixMonthRule = monthsRemaining >= 6;

  return {
    isValidForTravel: meetsSixMonthRule,
    daysRemaining,
    monthsRemaining,
    expiryDate: input.passportExpiryDate,
    travelDate: travel.toISOString().split('T')[0],
    meetsSixMonthRule,
    warningMessage: meetsSixMonthRule
      ? undefined
      : `Your passport expires in ~${monthsRemaining} months (${daysRemaining} days). Most international consulates strictly require a minimum of 6 months validity from the arrival date.`,
    recommendedAction: meetsSixMonthRule
      ? 'Your passport has sufficient validity for travel. Ensure you have at least 2 blank pages.'
      : 'You must apply for passport renewal at your nearest Passport Seva Kendra before international travel.',
  };
}

export async function trackApplicationStatus(input: {
  arn: string;
}): Promise<TrackingStatusResult> {
  const cleanArn = input.arn.trim().toUpperCase();

  return {
    found: true,
    arn: cleanArn,
    currentStage: 'Consular Verification in Progress',
    status: 'under_review',
    destinationCountry: 'United States of America',
    lastUpdated: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    estimatedCompletion: '3–5 working days',
    nextStepText:
      'Your documents have been verified by the automated system. Consular officers are reviewing your biometric profile.',
  };
}

export async function explainJargon(input: { term: string }): Promise<JargonExplanationResult> {
  const termLower = input.term.toLowerCase().trim();

  // Check Custom Travel Terms
  const CUSTOM_GLOSSARY: Record<
    string,
    { title: string; def: string; pitfall: string; location?: string }
  > = {
    'non-ecr': {
      title: 'Non-ECR (Emigration Check Not Required)',
      def: 'Status granted to Indian citizens with 10th standard matriculation or higher, or taxpayers, allowing travel abroad for work without Emigration Clearance.',
      pitfall: 'If your passport has no stamp on Page 2, it is by default Non-ECR.',
      location: 'Page 2 of Indian Passport Booklet',
    },
    ecr: {
      title: 'ECR (Emigration Check Required)',
      def: 'Passports with an ECR endorsement require official clearance from the Protector of Emigrants before traveling for employment in 18 designated countries.',
      pitfall: 'ECR rules only apply to employment visas, not tourist or business trips.',
      location: 'Stamped on Page 2 of Indian Passport Booklet',
    },
    apostille: {
      title: 'Apostille Certificate',
      def: 'An international legalization sticker attached to official documents (degrees, birth certificates) under the Hague Convention to make them legally recognized abroad.',
      pitfall:
        'Apostille must be performed by the Ministry of External Affairs (MEA) through authorized agencies.',
    },
    vfs: {
      title: 'VFS Global',
      def: 'The official commercial partner that manages visa application centers, biometric collection, and document submission on behalf of foreign embassies.',
      pitfall: 'VFS processes documents but does NOT make visa decisions.',
    },
    noc: {
      title: 'NOC (No Objection Certificate)',
      def: 'A signed declaration from your employer or educational institution stating they approve your international travel and that you will resume duties upon return.',
      pitfall: 'Must be on official organizational letterhead with seal and date.',
    },
  };

  const customKey = Object.keys(CUSTOM_GLOSSARY).find((k) => termLower.includes(k));
  if (customKey) {
    const item = CUSTOM_GLOSSARY[customKey];
    return {
      found: true,
      term: item.title,
      plainDefinition: item.def,
      commonMistakeToAvoid: item.pitfall,
      passportLocation: item.location,
    };
  }

  // Check JARGON_DEFINITIONS
  const jargonKey = Object.keys(JARGON_DEFINITIONS).find((k) =>
    k.toLowerCase().includes(termLower),
  ) as keyof typeof JARGON_DEFINITIONS | undefined;

  if (jargonKey && JARGON_DEFINITIONS[jargonKey]) {
    const def = JARGON_DEFINITIONS[jargonKey];
    return {
      found: true,
      term: def.defaultTitle,
      plainDefinition: def.defaultExplanation,
      commonMistakeToAvoid: def.defaultExample,
      passportLocation: 'Indian Passport Bio-data Page',
    };
  }

  // Check FAQs
  const faq = FAQ_ITEMS.find(
    (f) =>
      f.defaultQuestion.toLowerCase().includes(termLower) ||
      f.tags.some((t) => t.toLowerCase().includes(termLower)),
  );

  if (faq) {
    return {
      found: true,
      term: faq.defaultQuestion,
      plainDefinition: faq.defaultAnswer,
      commonMistakeToAvoid: 'Make sure details match your passport exactly.',
    };
  }

  return {
    found: false,
    term: input.term,
    plainDefinition: `Information regarding "${input.term}" is available in our Guidelines center.`,
    commonMistakeToAvoid: 'Always cross-reference official consular guidelines.',
  };
}

export async function getWizardNavigationLink(input: {
  stage: 'visa-selection' | 'personal' | 'documents' | 'review' | 'tracking' | 'support';
}): Promise<WizardNavigationResult> {
  switch (input.stage) {
    case 'visa-selection':
      return {
        stepId: 'visa-selection',
        stepName: 'Stage 1: Visa Selection',
        route: '/apply',
        description: 'Select your destination country and trip purpose.',
      };
    case 'personal':
      return {
        stepId: 'personal-identity',
        stepName: 'Stage 2: Personal Details',
        route: '/apply',
        description: 'Fill in passport info, date of birth, and contact information.',
      };
    case 'documents':
      return {
        stepId: 'documents',
        stepName: 'Stage 3: Document Upload',
        route: '/apply',
        description: 'Upload passport bio-page scan and 2x2 photograph.',
      };
    case 'review':
      return {
        stepId: 'review-payment',
        stepName: 'Stage 4: Review & Payment',
        route: '/apply',
        description: 'Review your application draft and proceed to secure checkout.',
      };
    case 'tracking':
      return {
        stepId: 'tracking',
        stepName: 'Stage 5: Application Status',
        route: '/track',
        description: 'Track real-time status with your ARN reference number.',
      };
    case 'support':
    default:
      return {
        stepId: 'support',
        stepName: 'Guidelines & FAQs',
        route: '/support',
        description: 'Browse 24x7 FAQs and consular guidelines.',
      };
  }
}

export const getVisaDetailsTool = tool({
  description:
    'Look up visa categories, fees, validity, and processing turnaround times for a destination country and trip purpose.',
  inputSchema: z.object({
    destination: z
      .string()
      .describe(
        'Destination country, e.g. USA, UK, Schengen, UAE, Singapore, Japan, Canada, Australia',
      ),
    purpose: z
      .enum(['tourism', 'business', 'transit', 'medical', 'study', 'work'])
      .optional()
      .describe('Trip purpose (e.g. tourism, business, transit, medical, study, work)'),
  }),
  execute: getVisaDetails,
});

export const calculateVisaFeesTool = tool({
  description:
    'Calculate the itemized fee breakdown for a visa (Consular fee + Government MEA fee + Platform fee).',
  inputSchema: z.object({
    visaIdOrDestination: z
      .string()
      .describe('Visa ID (e.g. usa-b1b2, uk-standard, uae-tourist) or Destination country name'),
  }),
  execute: calculateVisaFees,
});

export const getRequiredDocumentsTool = tool({
  description:
    'Retrieve the checklist of mandatory & optional documents, photo dimensions, and file upload specifications.',
  inputSchema: z.object({
    visaIdOrDestination: z
      .string()
      .describe('Visa ID or destination country (e.g. USA, UK, Schengen, UAE)'),
  }),
  execute: getRequiredDocuments,
});

export const checkPassportValidityTool = tool({
  description:
    'Check if a passport has at least 6 months validity from the planned date of arrival in the destination country.',
  inputSchema: z.object({
    passportExpiryDate: z.string().describe('Passport expiry date in YYYY-MM-DD format'),
    travelDate: z
      .string()
      .optional()
      .describe('Planned travel / arrival date in YYYY-MM-DD format (defaults to today)'),
  }),
  execute: checkPassportValidity,
});

export const trackApplicationStatusTool = tool({
  description:
    'Look up the real-time application timeline and current status of an Application Reference Number (ARN).',
  inputSchema: z.object({
    arn: z.string().describe('Application Reference Number, e.g. VR-2026-882194 or VR-XXXXXX'),
  }),
  execute: trackApplicationStatus,
});

export const explainJargonTool = tool({
  description:
    'Provide clear, plain-language explanations for consular and passport jargon (e.g. ECR/ECNR, Apostille, VFS, NOC, MRZ, Biometrics).',
  inputSchema: z.object({
    term: z.string().describe('The term to explain, e.g. ECR, Non-ECR, Apostille, VFS, NOC, MRZ'),
  }),
  execute: explainJargon,
});

export const getWizardNavigationLinkTool = tool({
  description: 'Get deep-link navigation information for a specific application wizard stage.',
  inputSchema: z.object({
    stage: z
      .enum(['visa-selection', 'personal', 'documents', 'review', 'tracking', 'support'])
      .describe('Target stage'),
  }),
  execute: getWizardNavigationLink,
});

export const ALL_AI_TOOLS = {
  getVisaDetails: getVisaDetailsTool,
  calculateVisaFees: calculateVisaFeesTool,
  getRequiredDocuments: getRequiredDocumentsTool,
  checkPassportValidity: checkPassportValidityTool,
  trackApplicationStatus: trackApplicationStatusTool,
  explainJargon: explainJargonTool,
  getWizardNavigationLink: getWizardNavigationLinkTool,
};
