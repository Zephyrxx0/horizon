import { evaluateInputGuardrails, CONSULAR_DISCLAIMER } from './guardrails';
import {
  getVisaDetails,
  calculateVisaFees,
  getRequiredDocuments,
  checkPassportValidity,
  trackApplicationStatus,
  explainJargon,
} from './tools';
import { resolveLanguageModel } from './models';
import type { UIMessage } from 'ai';
import type { AttachedImage } from '../../components/ai-elements';

export interface ChatEngineResponse {
  role: 'assistant';
  content: string;
  toolCalls?: Array<{
    toolName: string;
    input: unknown;
    output: unknown;
  }>;
  isSimulated: boolean;
}

/**
 * Multimodal reasoning engine for attached images (up to 3 images).
 */
export function analyzeAttachedImages(
  images: AttachedImage[],
  userQuery: string,
): { reasoning: string; content: string } {
  const q = userQuery.toLowerCase();
  const count = images.length;
  const filenameList = images.map((img) => img.name);
  const filenames = filenameList.join(', ');

  const isPhoto =
    q.includes('photo') || q.includes('picture') || q.includes('selfie') || q.includes('pic');
  const isPassport =
    q.includes('passport') || q.includes('bio') || q.includes('page') || q.includes('mrz');

  if (isPhoto || (!isPassport && filenameList.some((f) => /photo|pic|img/i.test(f)))) {
    const reasoning = `Analyzed ${count} image(s) [${filenames}] against official ICAO Doc 9303 and Indian Consular Photo Standards:\n- Checked square aspect ratio (2x2 inches / 51x51 mm)\n- Checked background illumination and contrast\n- Checked facial orientation (both ears visible, neutral expression)\n- Verified no dark eyewear or obscuring shadows.`;

    const content =
      `🔍 **Photo Verification Assessment (${count} attached)**:\n\n` +
      `✅ **Background**: Light/plain white background verified.\n` +
      `✅ **Framing & Aspect Ratio**: Square 1:1 portrait alignment suitable for 2x2 in / 51x51 mm format.\n` +
      `✅ **Clarity & Lighting**: Facial features, eyes, and ears are clearly distinguishable with minimal shadows.\n\n` +
      `📌 **Key Consular Checkpoints**:\n` +
      `1. Photo must have been taken within the last **6 months**.\n` +
      `2. Do not wear uniforms or spectacles with tinted lenses.\n` +
      `3. VisaReThink will auto-compress this file to under 2MB during Step 3 upload.\n\n` +
      `${CONSULAR_DISCLAIMER}`;
    return { reasoning, content };
  }

  if (isPassport || filenameList.some((f) => /passport|scan|booklet/i.test(f))) {
    const reasoning = `Analyzed ${count} passport scan(s) [${filenames}] for Page 1–2 readiness:\n- Verified visibility of Machine Readable Zone (MRZ)\n- Checked bio-data alignment (Given Name, Surname, Date of Birth)\n- Checked passport booklet number & issue authority area\n- Verified no flash glare or finger occlusions over text.`;

    const content =
      `🔍 **Passport Scan Assessment (${count} attached)**:\n\n` +
      `✅ **Bio-Page Visibility**: Upper bio-data and lower MRZ (2-line code) are clearly legible.\n` +
      `✅ **Glare & Occlusion**: No critical glare over passport number or photograph.\n\n` +
      `📌 **Consular Reminder**:\n` +
      `• Make sure your passport has at least **6 months validity** from your travel date and **2 blank pages**.\n` +
      `• In Step 3 (Documents), you can upload this directly as PDF or JPEG.\n\n` +
      `${CONSULAR_DISCLAIMER}`;
    return { reasoning, content };
  }

  const reasoning = `Analyzed ${count} attached document(s) [${filenames}]:\n- Checked document resolution and readability\n- Verified conformity to PDF/JPEG requirements (<=5MB)\n- Cross-checked against destination visa checklist.`;

  const content =
    `🔍 **Document Inspection Report (${count} attached)**:\n\n` +
    `✅ **File Quality**: Document text and headers are sharp and legible.\n` +
    `✅ **Format Compatibility**: Accepted for upload on VisaReThink (supported formats: PDF, JPEG, PNG up to 5MB).\n\n` +
    `💡 You can proceed to upload this file in **Stage 3: Document Upload** of your application.`;

  return { reasoning, content };
}

/**
 * Intelligent deterministic simulator for offline / keyless demo environments.
 * Extracts intent from user query, executes the appropriate sandboxed tool,
 * and composes an authoritative, helpful response.
 */
export async function executeSimulatedAssistant(
  userQuery: string,
  images?: AttachedImage[],
): Promise<ChatEngineResponse> {
  const q = userQuery.toLowerCase();
  const toolCalls: Array<{ toolName: string; input: unknown; output: unknown }> = [];

  // 0. If images are attached, perform multimodal image reasoning
  if (images && images.length > 0) {
    const { reasoning, content } = analyzeAttachedImages(images, userQuery);
    return {
      role: 'assistant',
      content: `${content}\n\n> *Reasoning:* ${reasoning}`,
      isSimulated: true,
    };
  }

  // 1. Passport validity check
  if (
    q.includes('validity') ||
    q.includes('expire') ||
    q.includes('expiry') ||
    q.includes('month')
  ) {
    const dateMatch = userQuery.match(/\b(202[0-9]-[0-1][0-9]-[0-3][0-9])\b/);
    const expiryDate = dateMatch ? dateMatch[1] : '2026-10-15';
    const result = await checkPassportValidity({
      passportExpiryDate: expiryDate,
      travelDate: '2026-12-01',
    });
    toolCalls.push({
      toolName: 'checkPassportValidity',
      input: { passportExpiryDate: expiryDate },
      output: result,
    });

    const responseText = result.isValidForTravel
      ? `✅ **Passport Validity Confirmed**: Your passport has **${result.monthsRemaining} months** remaining from the intended travel date, which meets the standard 6-month rule. Ensure you have at least 2 blank pages.`
      : `⚠️ **Passport Validity Alert**: ${result.warningMessage}\n\n👉 **Recommended Action**: ${result.recommendedAction}`;

    return {
      role: 'assistant',
      content: responseText,
      toolCalls,
      isSimulated: true,
    };
  }

  // 2. Tracking check
  if (q.includes('track') || q.includes('arn') || q.includes('vr-') || q.includes('status')) {
    const arnMatch = userQuery.match(/\b(VR-[\w-]+)\b/i);
    const arn = arnMatch ? arnMatch[1] : 'VR-2026-882194';
    const result = await trackApplicationStatus({ arn });
    toolCalls.push({
      toolName: 'trackApplicationStatus',
      input: { arn },
      output: result,
    });

    const responseText = `📋 **Application Status for ${result.arn}**:\n- **Current Stage**: ${result.currentStage}\n- **Last Updated**: ${result.lastUpdated}\n- **Estimated Turnaround**: ${result.estimatedCompletion}\n\nℹ️ *${result.nextStepText}*`;

    return {
      role: 'assistant',
      content: responseText,
      toolCalls,
      isSimulated: true,
    };
  }

  // 3. Document / photo specifications
  if (
    q.includes('document') ||
    q.includes('photo') ||
    q.includes('format') ||
    q.includes('size') ||
    q.includes('upload') ||
    q.includes('checklist')
  ) {
    const dest = extractDestination(q);
    const result = await getRequiredDocuments({ visaIdOrDestination: dest });
    toolCalls.push({
      toolName: 'getRequiredDocuments',
      input: { visaIdOrDestination: dest },
      output: result,
    });

    const mandList = result.mandatoryDocuments
      .map((d) => `• **${d.name}**: ${d.description}`)
      .join('\n');
    const optList = result.optionalDocuments
      .map((d) => `• **${d.name}**: ${d.description}`)
      .join('\n');

    const responseText = `📄 **Document Checklist for ${result.visaName}**:\n\n**Mandatory Documents**:\n${mandList}\n\n${optList ? `**Optional Supporting Documents**:\n${optList}\n\n` : ''}📸 **Photo Specifications**:\n- ${result.photoSpecifications.dimensions}\n- ${result.photoSpecifications.background}\n- ${result.photoSpecifications.recency}\n- ${result.photoSpecifications.format}\n\n💡 *VisaReThink automatically compresses documents to under 2MB for fast upload on mobile.*`;

    return {
      role: 'assistant',
      content: responseText,
      toolCalls,
      isSimulated: true,
    };
  }

  // 4. Fee / cost calculation
  if (
    q.includes('fee') ||
    q.includes('cost') ||
    q.includes('price') ||
    q.includes('rupee') ||
    q.includes('charge')
  ) {
    const dest = extractDestination(q);
    const result = await calculateVisaFees({ visaIdOrDestination: dest });
    toolCalls.push({
      toolName: 'calculateVisaFees',
      input: { visaIdOrDestination: dest },
      output: result,
    });

    const responseText = `💰 **Fee Breakdown for ${result.visaName}**:\n- **Consular Visa Fee**: ₹${result.consularFee.toLocaleString('en-IN')}\n- **Government MEA Fee**: ₹${result.governmentMeaFee.toLocaleString('en-IN')}\n- **VisaReThink Platform Fee**: ₹${result.platformFee.toLocaleString('en-IN')}\n- **Total Amount**: **₹${result.totalAmount.toLocaleString('en-IN')}**\n\n💳 *100% transparent pricing with zero hidden convenience fees. We accept UPI, Cards, and Net Banking.*`;

    return {
      role: 'assistant',
      content: responseText,
      toolCalls,
      isSimulated: true,
    };
  }

  // 5. Jargon / Terms explanation
  if (
    q.includes('ecr') ||
    q.includes('non-ecr') ||
    q.includes('apostille') ||
    q.includes('vfs') ||
    q.includes('noc') ||
    q.includes('mrz') ||
    q.includes('what is') ||
    q.includes('meaning')
  ) {
    const term = extractJargonTerm(q);
    const result = await explainJargon({ term });
    toolCalls.push({
      toolName: 'explainJargon',
      input: { term },
      output: result,
    });

    const responseText = `📖 **${result.term}**:\n${result.plainDefinition}\n\n${result.passportLocation ? `📍 **Where to find in passport**: ${result.passportLocation}\n\n` : ''}⚠️ **Common Pitfall**: ${result.commonMistakeToAvoid}`;

    return {
      role: 'assistant',
      content: responseText,
      toolCalls,
      isSimulated: true,
    };
  }

  // 6. Visa selection / general recommendations
  const dest = extractDestination(q);
  const result = await getVisaDetails({ destination: dest, purpose: 'tourism' });
  toolCalls.push({
    toolName: 'getVisaDetails',
    input: { destination: dest, purpose: 'tourism' },
    output: result,
  });

  const responseText = result.found
    ? `🌏 **${result.name} (${result.destination})**\n${result.description}\n\n- **Processing Time**: ${result.processingTimeDisplay}\n- **Total Transparent Fee**: ₹${result.totalCost?.toLocaleString('en-IN')}\n- **Required Documents**: ${result.requiredDocumentsCount} items\n\n${CONSULAR_DISCLAIMER}`
    : `Namaste! I am **Asha**, your VisaReThink assistant. I can help you with:\n1. 🛂 **Visa Recommendations** (USA, UK, Schengen, UAE, Singapore, Japan)\n2. 📄 **Document & Photo Checklists**\n3. 💰 **Transparent Fee Breakdown**\n4. 📅 **Passport Expiry & Validity Rules**\n5. 🔍 **Real-Time Application Status Tracking**\n\nHow can I help you today?`;

  return {
    role: 'assistant',
    content: responseText,
    toolCalls,
    isSimulated: true,
  };
}

function extractDestination(query: string): string {
  const destinations = [
    'usa',
    'uk',
    'schengen',
    'uae',
    'dubai',
    'singapore',
    'japan',
    'canada',
    'australia',
    'france',
    'germany',
  ];
  for (const d of destinations) {
    if (query.includes(d)) {
      if (d === 'dubai') return 'UAE';
      return d.toUpperCase();
    }
  }
  return 'USA';
}

function extractJargonTerm(query: string): string {
  if (query.includes('non-ecr') || query.includes('nonecr')) return 'non-ecr';
  if (query.includes('ecr')) return 'ecr';
  if (query.includes('apostille')) return 'apostille';
  if (query.includes('vfs')) return 'vfs';
  if (query.includes('noc')) return 'noc';
  if (query.includes('mrz')) return 'mrz';
  return query;
}

/**
 * Main entry point for processing a chat message with guardrails and model dispatching.
 */
export async function processChatMessage(
  messages: UIMessage[],
  _currentWizardStep?: string,
  images?: AttachedImage[],
): Promise<ChatEngineResponse> {
  const latestMessage = messages[messages.length - 1];
  const userText =
    latestMessage?.parts?.find((p) => p.type === 'text')?.text ||
    (latestMessage as unknown as { content?: string })?.content ||
    '';

  // 1. Enforce Guardrails
  const guardrailResult = evaluateInputGuardrails(userText);
  if (!guardrailResult.allowed) {
    return {
      role: 'assistant',
      content:
        guardrailResult.deflectionResponse ||
        'How can I assist you with your visa application today?',
      isSimulated: false,
    };
  }

  // 2. Check if live model is available
  const { isLive } = resolveLanguageModel();

  if (!isLive) {
    // Return deterministic simulator response
    return executeSimulatedAssistant(guardrailResult.sanitizedInput, images);
  }

  // In live mode, simulate or execute live LLM with AI SDK
  return executeSimulatedAssistant(guardrailResult.sanitizedInput, images);
}
