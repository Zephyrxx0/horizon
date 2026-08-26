import { FaqCategory, FaqItem, JargonDefinition, JargonKey } from './types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'q1_passport_validity',
    category: 'passport',
    questionKey: 'help:faqs.q1_passport_validity.question',
    answerKey: 'help:faqs.q1_passport_validity.answer',
    tags: ['validity', '6 months', 'expiry', 'passport', 'pages', 'blank'],
    defaultQuestion: 'How much passport validity is required before applying for a visa?',
    defaultAnswer:
      'Your passport must have at least 6 months of validity remaining from the intended date of arrival in the destination country, and at least two blank visa pages.',
  },
  {
    id: 'q2_photo_specs',
    category: 'documents',
    questionKey: 'help:faqs.q2_photo_specs.question',
    answerKey: 'help:faqs.q2_photo_specs.answer',
    tags: ['photo', 'picture', 'specifications', 'size', 'background', 'specs', 'camera'],
    defaultQuestion: 'What are the exact specifications for the passport photograph?',
    defaultAnswer:
      'Photos must be recent (taken within the last 6 months), square format (2x2 inches / 51x51 mm), full frontal face on a plain white or light-off-white background with both ears visible and no shadows, spectacles, or headgear (except religious).',
  },
  {
    id: 'q3_file_formats',
    category: 'documents',
    questionKey: 'help:faqs.q3_file_formats.question',
    answerKey: 'help:faqs.q3_file_formats.answer',
    tags: ['file format', 'pdf', 'jpg', 'png', 'size', 'upload', 'mb', 'compression', 'scan'],
    defaultQuestion: 'What file formats and file sizes are supported for document uploads?',
    defaultAnswer:
      'You can upload JPG, JPEG, PNG, or PDF files. Each file may be up to 5 MB. The app automatically optimizes and compresses your files to under 2 MB so you can upload smoothly even on 3G connections.',
  },
  {
    id: 'q4_processing_time',
    category: 'general',
    questionKey: 'help:faqs.q4_processing_time.question',
    answerKey: 'help:faqs.q4_processing_time.answer',
    tags: ['processing time', 'duration', 'days', 'urgent', 'emergency', 'fast', 'timeline'],
    defaultQuestion: 'How long does it take for a visa application to be processed?',
    defaultAnswer:
      'Standard electronic visa (e-Visa) processing normally takes 3 to 5 working days. Emergency or expedited visas may be processed within 24 to 48 hours depending on destination consular rules.',
  },
  {
    id: 'q5_payment_methods',
    category: 'payment',
    questionKey: 'help:faqs.q5_payment_methods.question',
    answerKey: 'help:faqs.q5_payment_methods.answer',
    tags: ['payment', 'upi', 'credit card', 'debit card', 'net banking', 'gpay', 'paytm', 'bhim'],
    defaultQuestion: 'What payment methods are accepted on VisaReThink?',
    defaultAnswer:
      'We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards (Visa, MasterCard, RuPay, American Express), and Net Banking across 50+ Indian banks.',
  },
  {
    id: 'q6_offline_saving',
    category: 'general',
    questionKey: 'help:faqs.q6_offline_saving.question',
    answerKey: 'help:faqs.q6_offline_saving.answer',
    tags: ['offline', 'internet', 'saving', 'storage', 'sync', 'draft', 'connection'],
    defaultQuestion: 'Can I fill out the application while offline without internet?',
    defaultAnswer:
      "Yes! All your entered answers and uploaded documents are stored securely in your browser's local storage. When you reconnect to the internet, your draft syncs automatically and you can submit.",
  },
  {
    id: 'q7_edit_after_submit',
    category: 'general',
    questionKey: 'help:faqs.q7_edit_after_submit.question',
    answerKey: 'help:faqs.q7_edit_after_submit.answer',
    tags: ['edit', 'change', 'correction', 'after submit', 'arn', 'mistake'],
    defaultQuestion: 'Can I edit my application after making the payment?',
    defaultAnswer:
      'Once submitted and paid, changes cannot be made directly online. If there is a critical correction needed, contact our 24x7 helpline immediately with your Application Reference Number (ARN).',
  },
  {
    id: 'q8_child_application',
    category: 'general',
    questionKey: 'help:faqs.q8_child_application.question',
    answerKey: 'help:faqs.q8_child_application.answer',
    tags: ['child', 'minor', 'infant', 'baby', 'separate application', 'family', 'children'],
    defaultQuestion: 'Do infants and minor children need separate visa applications?',
    defaultAnswer:
      'Yes. Every individual traveler, regardless of age (including newborn infants and minors), must possess their own valid passport and have a separate completed visa application.',
  },
  {
    id: 'q9_visa_on_arrival',
    category: 'general',
    questionKey: 'help:faqs.q9_visa_on_arrival.question',
    answerKey: 'help:faqs.q9_visa_on_arrival.answer',
    tags: ['visa on arrival', 'voa', 'airport', 'entry', 'arrival'],
    defaultQuestion: 'Is Visa on Arrival (VoA) available for all nationalities?',
    defaultAnswer:
      'Visa on Arrival privileges depend strictly on bilateral agreements between countries. Most international travelers are strongly advised to obtain an e-Visa before boarding their flight to avoid boarding denial.',
  },
  {
    id: 'q10_reference_contact',
    category: 'documents',
    questionKey: 'help:faqs.q10_reference_contact.question',
    answerKey: 'help:faqs.q10_reference_contact.answer',
    tags: ['reference', 'contact', 'hotel', 'sponsor', 'address', 'stay'],
    defaultQuestion: 'What should I enter for reference contacts in the destination country?',
    defaultAnswer:
      'If visiting friends/family, provide their name, phone number, and physical address. For tourism, you may provide your booked hotel name, manager contact, and hotel address.',
  },
  {
    id: 'q11_port_of_entry',
    category: 'general',
    questionKey: 'help:faqs.q11_port_of_entry.question',
    answerKey: 'help:faqs.q11_port_of_entry.answer',
    tags: ['port of entry', 'airport', 'seaport', 'icp', 'arrival', 'immigration'],
    defaultQuestion:
      'Can I arrive at a different airport or seaport than indicated in my application?',
    defaultAnswer:
      'Yes, for most e-Visas, you may enter through any authorized International Immigration Check Post (ICP) airport or seaport within the destination country unless explicitly restricted.',
  },
  {
    id: 'q12_multiple_entry',
    category: 'general',
    questionKey: 'help:faqs.q12_multiple_entry.question',
    answerKey: 'help:faqs.q12_multiple_entry.answer',
    tags: ['single entry', 'multiple entry', 'validity', 'trips', 're-entry'],
    defaultQuestion: 'What is the difference between single-entry and multiple-entry visas?',
    defaultAnswer:
      'A single-entry visa becomes invalid once you exit the country. A multiple-entry visa allows you to enter and exit the country multiple times during the overall validity period of the visa.',
  },
  {
    id: 'q13_name_mismatch',
    category: 'passport',
    questionKey: 'help:faqs.q13_name_mismatch.question',
    answerKey: 'help:faqs.q13_name_mismatch.answer',
    tags: ['name', 'single name', 'surname', 'given name', 'mismatch', 'first name', 'last name'],
    defaultQuestion: 'What if my name has only one word (no surname/family name)?',
    defaultAnswer:
      "If your passport has only a single name, enter that name under 'Given Name' and repeat it or leave Surname empty based on field instructions. Never invent or guess fictitious names.",
  },
  {
    id: 'q14_emergency_visa',
    category: 'general',
    questionKey: 'help:faqs.q14_emergency_visa.question',
    answerKey: 'help:faqs.q14_emergency_visa.answer',
    tags: ['emergency', 'urgent', 'medical', 'bereavement', 'fast track', 'priority'],
    defaultQuestion:
      'How do I apply for an urgent or emergency visa for medical/bereavement reasons?',
    defaultAnswer:
      "Select the 'Medical Emergency' or 'Urgent' visa track on Stage 1. Attach supporting death certificates or hospital admission letters to expedite consular queue prioritization.",
  },
  {
    id: 'q15_refund_policy',
    category: 'payment',
    questionKey: 'help:faqs.q15_refund_policy.question',
    answerKey: 'help:faqs.q15_refund_policy.answer',
    tags: ['refund', 'cancellation', 'fee', 'rejection', 'money back'],
    defaultQuestion: 'Are visa application fees refundable if my application is rejected?',
    defaultAnswer:
      'Consular and government visa processing fees are non-refundable once processing commences, regardless of the visa decision outcome, as per international diplomatic regulations.',
  },
  {
    id: 'q16_tracking_status',
    category: 'tracking',
    questionKey: 'help:faqs.q16_tracking_status.question',
    answerKey: 'help:faqs.q16_tracking_status.answer',
    tags: ['tracking', 'status', 'arn', 'check status', 'progress', 'application number'],
    defaultQuestion: 'How can I track the live status of my submitted application?',
    defaultAnswer:
      "You can track your application at any time using the 'Track Application' tab by entering your Application Reference Number (ARN) and Passport Number or Date of Birth.",
  },
  {
    id: 'q17_clear_data',
    category: 'general',
    questionKey: 'help:faqs.q17_clear_data.question',
    answerKey: 'help:faqs.q17_clear_data.answer',
    tags: ['clear data', 'cyber cafe', 'public computer', 'reset', 'privacy', 'erase', 'wipe'],
    defaultQuestion: 'How do I erase my personal data if I am using a public cyber café computer?',
    defaultAnswer:
      "Click the 'Clear saved draft' or 'Reset Public Computer' button in the header or footer. This will immediately wipe all cached answers, personal details, and documents from the local browser.",
  },
  {
    id: 'q18_security_privacy',
    category: 'general',
    questionKey: 'help:faqs.q18_security_privacy.question',
    answerKey: 'help:faqs.q18_security_privacy.answer',
    tags: ['security', 'privacy', 'encryption', 'protection', 'data', 'safe', 'confidential'],
    defaultQuestion: 'How does VisaReThink secure my sensitive passport and financial data?',
    defaultAnswer:
      'VisaReThink uses end-to-end client-side sandboxing, 256-bit TLS encryption in transit, zero third-party telemetry, and zero unconsented data retention.',
  },
];

export const JARGON_DEFINITIONS: Record<JargonKey, JargonDefinition> = {
  givenNameVsSurname: {
    key: 'givenNameVsSurname',
    titleKey: 'help:jargon.givenNameVsSurname.title',
    explanationKey: 'help:jargon.givenNameVsSurname.explanation',
    exampleKey: 'help:jargon.givenNameVsSurname.example',
    defaultTitle: 'Given Name vs. Surname',
    defaultExplanation:
      'Given Name refers to your first name and middle name(s). Surname is your last name or family name. Look at the two zones on your passport bio-page.',
    defaultExample:
      "If your passport reads: Surname: 'SHARMA', Given Names: 'AARAV KUMAR', enter 'AARAV KUMAR' as Given Name and 'SHARMA' as Surname.",
    hasDiagram: true,
  },
  dateOfIssueVsExpiry: {
    key: 'dateOfIssueVsExpiry',
    titleKey: 'help:jargon.dateOfIssueVsExpiry.title',
    explanationKey: 'help:jargon.dateOfIssueVsExpiry.explanation',
    exampleKey: 'help:jargon.dateOfIssueVsExpiry.example',
    defaultTitle: 'Date of Issue vs. Date of Expiry',
    defaultExplanation:
      'Date of Issue is the day your passport was granted by the passport office. Date of Expiry is the day your passport ceases to be valid for international travel.',
    defaultExample:
      'Date of Issue is in the past; Date of Expiry is in the future (must be at least 6 months after your travel date).',
    hasDiagram: true,
  },
  placeOfIssue: {
    key: 'placeOfIssue',
    titleKey: 'help:jargon.placeOfIssue.title',
    explanationKey: 'help:jargon.placeOfIssue.explanation',
    exampleKey: 'help:jargon.placeOfIssue.example',
    defaultTitle: 'Place of Issue',
    defaultExplanation:
      'The city, authority, or passport seva kendra that issued your passport document, printed on the first page.',
    defaultExample: "e.g., 'MUMBAI', 'NEW DELHI', 'CHENNAI', or 'LONDON'.",
    hasDiagram: true,
  },
  cvv: {
    key: 'cvv',
    titleKey: 'help:jargon.cvv.title',
    explanationKey: 'help:jargon.cvv.explanation',
    exampleKey: 'help:jargon.cvv.example',
    defaultTitle: 'CVV / Card Security Code',
    defaultExplanation:
      'A 3-digit number printed on the signature strip on the back of your Visa/MasterCard/RuPay card (or 4-digit on the front of Amex cards).',
    defaultExample: 'Used to verify that you physically possess the payment card.',
    hasDiagram: false,
  },
  vpa: {
    key: 'vpa',
    titleKey: 'help:jargon.vpa.title',
    explanationKey: 'help:jargon.vpa.explanation',
    exampleKey: 'help:jargon.vpa.example',
    defaultTitle: 'UPI ID / VPA (Virtual Payment Address)',
    defaultExplanation:
      'Your unique virtual identifier for Unified Payments Interface (UPI) instant payments.',
    defaultExample: 'e.g., yourname@okhdfcbank, mobilenumber@paytm, or username@apl.',
    hasDiagram: false,
  },
  mrz: {
    key: 'mrz',
    titleKey: 'help:jargon.mrz.title',
    explanationKey: 'help:jargon.mrz.explanation',
    exampleKey: 'help:jargon.mrz.example',
    defaultTitle: 'MRZ (Machine Readable Zone)',
    defaultExplanation:
      'The two lines of letters, numbers, and chevron symbols (<<<) printed at the very bottom of your passport photo page.',
    defaultExample:
      'Contains encoded name, passport number, nationality, birth date, and check digits for border scanner systems.',
    hasDiagram: true,
  },
};

export const HELPLINE_INFO = {
  number: '1800-VISA-HELP (1800-847-2435)',
  hours: 'Monday – Saturday: 8:00 AM – 8:00 PM IST',
  tollFree: 'Toll-Free within India · Multi-lingual Support',
  email: 'support@visarethink.gov.in.demo',
};

export function searchFaqs(
  query: string,
  category: FaqCategory = 'all',
  t?: (key: string, defaultValue?: string) => string,
): FaqItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return FAQ_ITEMS.filter((item) => {
    // Category match
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    if (tokens.length === 0) {
      return true;
    }

    const question = (
      t ? t(item.questionKey, item.defaultQuestion) : item.defaultQuestion
    ).toLowerCase();
    const answer = (t ? t(item.answerKey, item.defaultAnswer) : item.defaultAnswer).toLowerCase();
    const tags = item.tags.map((tag) => tag.toLowerCase());

    // Matches if every token matches in either question, answer, or tags, or the whole query matches
    const allTokensMatch = tokens.every(
      (token) =>
        question.includes(token) ||
        answer.includes(token) ||
        tags.some((tag) => tag.includes(token)),
    );

    const fullQueryMatch =
      question.includes(normalizedQuery) ||
      answer.includes(normalizedQuery) ||
      tags.some((tag) => tag.includes(normalizedQuery));

    return allTokensMatch || fullQueryMatch;
  });
}
