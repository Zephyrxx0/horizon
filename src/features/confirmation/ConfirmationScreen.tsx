import React, { useMemo } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import { ReferenceCard } from './ReferenceCard';
import { StatusTimelineCard } from './StatusTimelineCard';
import { InterviewChecklistCard } from './InterviewChecklistCard';
import { SentNotificationsCard } from './SentNotificationsCard';
import { ReceiptCard } from '../review/ReceiptCard';
import { generateReferenceNumber } from './reference';
import { saveSubmittedApplication } from '../../services/mock/duplicate';
import { Button } from '../../components/ui/Button';
import { QRCodeGenerator } from '../../components/ui/QRCodeGenerator';
import { RotateCcw, QrCode as QrIcon } from 'lucide-react';

import type { PaymentReceiptData } from '../review/types';

export interface ConfirmationScreenProps {
  className?: string;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const context = useSelector(actor, (s) => s.context);
  const { answers } = context;
  const receipt =
    (answers.receipt as PaymentReceiptData | undefined) ||
    (context as unknown as { receipt?: PaymentReceiptData }).receipt;

  // Extract applicant details
  const applicantName =
    [answers.firstName || answers.givenNames, answers.lastName || answers.surname]
      .filter(Boolean)
      .join(' ') || 'Applicant';

  const visaType = (answers.visaName as string) || (answers.visaType as string) || 'Tourist Visa';

  const destinationCountry =
    (answers.destinationCountry as string) || (answers.country as string) || 'International';

  const passportNumber = (answers.passportNumber as string) || 'P8765432';
  const email = (answers.email as string) || 'applicant@example.com';
  const phoneNumber = (answers.phoneNumber as string) || '+919876543210';

  // Ensure deterministic reference number
  const referenceNumber = useMemo(() => {
    if (receipt?.referenceNumber) return receipt.referenceNumber;
    if (answers.referenceNumber && typeof answers.referenceNumber === 'string') {
      return answers.referenceNumber;
    }
    const generated = generateReferenceNumber();
    // Persist to local submitted registry
    saveSubmittedApplication({
      referenceNumber: generated,
      passportNumber,
      applicantName,
      visaType,
      country: destinationCountry,
      submittedAt: new Date().toISOString(),
      status: 'Documents Under Review',
    });
    return generated;
  }, [
    receipt?.referenceNumber,
    answers.referenceNumber,
    passportNumber,
    applicantName,
    visaType,
    destinationCountry,
  ]);

  const handleStartNewApplication = () => {
    actor.send({ type: 'RESET' });
  };

  return (
    <section
      aria-label="Application Confirmation Stage"
      className={`max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn ${className}`}
      data-testid="stage5-confirmation-screen"
    >
      {/* 1. Official Reference & Submission Banner */}
      <ReferenceCard
        referenceNumber={referenceNumber}
        applicantName={applicantName}
        visaType={visaType}
        destinationCountry={destinationCountry}
        submittedAt={receipt?.paidAt}
      />

      {/* 2. Downloadable Official QR Code Travel Pass */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          <QrIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Electronic Travel Pass & Airport QR Code
          </h3>
        </div>
        <QRCodeGenerator
          value={`https://indianvisaonline.gov.in/verify?ref=${referenceNumber}&pass=${passportNumber}`}
          title="Digital e-Visa Verification Pass"
          subtitle="Scan at designated airport immigration counters"
          size={160}
        />
      </div>

      {/* 3. Official Fee Payment Receipt Card */}
      {receipt && (
        <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Payment & Fee Receipt
            </h3>
          </div>
          <ReceiptCard receipt={receipt} />
        </div>
      )}

      {/* 4. Live Status Timeline & Demo Controller */}
      <StatusTimelineCard referenceNumber={referenceNumber} />

      {/* 5. Visa-Specific Preparation & Document Checklist */}
      <InterviewChecklistCard
        referenceNumber={referenceNumber}
        applicantName={applicantName}
        visaType={visaType}
        destinationCountry={destinationCountry}
      />

      {/* 6. Simulated Notifications Preview */}
      <SentNotificationsCard
        referenceNumber={referenceNumber}
        email={email}
        phoneNumber={phoneNumber}
        applicantName={applicantName}
        visaType={visaType}
      />

      {/* 7. Footer Navigation & Reset Action */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
          Need to apply for a family member or another destination?
        </p>

        <Button
          variant="outline"
          onClick={handleStartNewApplication}
          className="w-full sm:w-auto min-h-[40px] px-4 text-xs font-medium flex items-center justify-center gap-2"
          data-testid="start-new-application-btn"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Start a New Visa Application</span>
        </Button>
      </div>
    </section>
  );
};
