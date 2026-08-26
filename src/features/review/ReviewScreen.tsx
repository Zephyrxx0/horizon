import { useState } from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor } from '../wizard/context';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { ErrorSummary, type ErrorItem } from '../../components/ui/ErrorSummary';
import { StageReviewCard } from './StageReviewCard';
import { DeclarationCheckbox } from './DeclarationCheckbox';
import { FeeBreakdownCard } from './FeeBreakdownCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { UpiPaymentForm } from './UpiPaymentForm';
import { CardPaymentForm, type CardFormData } from './CardPaymentForm';
import { NetbankingForm } from './NetbankingForm';
import { PaymentProcessingModal } from './PaymentProcessingModal';
import { PaymentFailureCard } from './PaymentFailureCard';
import { PaymentPendingCard } from './PaymentPendingCard';
import { PaymentScenarioBar } from './PaymentScenarioBar';
import { calculateFeeBreakdown } from './fees';
import { MockPaymentService } from '../../services/mock/payment';
import { MockNotificationService } from '../../services/mock/notifications';
import type { PaymentMethodType, PaymentReceiptData } from './types';
import type { DocumentAttachment } from '../documents/types';
import { Lock, ArrowRight } from 'lucide-react';

const paymentService = new MockPaymentService();
const notificationService = new MockNotificationService();

export function ReviewScreen() {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);
  const { show: showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    (answers.paymentMethod as PaymentMethodType) || 'upi',
  );
  const [upiMode, setUpiMode] = useState<'vpa' | 'qr'>('vpa');
  const [upiVpa, setUpiVpa] = useState<string>(String(answers.upiVpa || ''));
  const [cardData, setCardData] = useState<CardFormData>({
    cardNumber: String(answers.cardNumber || ''),
    cardExpiry: String(answers.cardExpiry || ''),
    cardCvv: String(answers.cardCvv || ''),
    cardName: String(answers.cardName || ''),
  });
  const [selectedBank, setSelectedBank] = useState<string>(String(answers.netbankingBank || 'sbi'));

  const declarationConfirmed = Boolean(answers.declarationConfirmed);

  // Error and UI States
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isCheckingPending, setIsCheckingPending] = useState(false);
  const [pendingIntentId, setPendingIntentId] = useState<string | null>(null);

  const feeBreakdown = calculateFeeBreakdown(answers);

  // Handlers for editing stages
  const handleEditStage = (stepId: 'visa-selection' | 'personal-identity' | 'documents') => {
    actor.send({
      type: 'GOTO',
      stepId,
      returnToReview: true,
    });
  };

  const handleDeclarationChange = (checked: boolean) => {
    actor.send({
      type: 'ANSWER_CHANGED',
      fieldId: 'declarationConfirmed',
      value: checked,
    });
    if (checked) {
      setErrors((prev) => prev.filter((e) => e.fieldId !== 'declaration-confirmed'));
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    setFailureReason(null);
    setIsPending(false);
    actor.send({
      type: 'ANSWER_CHANGED',
      fieldId: 'paymentMethod',
      value: method,
    });
  };

  const validateForm = (): boolean => {
    const errs: ErrorItem[] = [];

    if (!declarationConfirmed) {
      errs.push({
        fieldId: 'declaration-confirmed',
        label: 'Declaration Agreement',
        message: 'You must confirm the applicant declaration before proceeding to payment.',
      });
    }

    if (paymentMethod === 'upi' && upiMode === 'vpa' && !upiVpa.trim()) {
      errs.push({
        fieldId: 'upiVpa',
        label: 'UPI ID / VPA',
        message: 'Please enter a valid UPI address (e.g. yourname@okhdfcbank).',
      });
    }

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber.trim()) {
        errs.push({
          fieldId: 'cardNumber',
          label: 'Card Number',
          message: 'Please enter your 16-digit credit/debit card number.',
        });
      }
      if (!cardData.cardName.trim()) {
        errs.push({
          fieldId: 'cardName',
          label: 'Cardholder Name',
          message: 'Cardholder name is required as printed on card.',
        });
      }
      if (!cardData.cardExpiry.trim()) {
        errs.push({
          fieldId: 'cardExpiry',
          label: 'Expiry Date',
          message: 'Valid card expiry date (MM/YY) is required.',
        });
      }
      if (!cardData.cardCvv.trim()) {
        errs.push({
          fieldId: 'cardCvv',
          label: 'CVV Security Code',
          message: 'Card security code (CVV) is required.',
        });
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      errs.push({
        fieldId: 'netbankingOtherSelect',
        label: 'Netbanking Bank',
        message: 'Please choose your issuing bank for netbanking.',
      });
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handlePayAndSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setFailureReason(null);
    setIsPending(false);
    setIsProcessing(true);
    setProcessingStep(0);

    try {
      // Step 1: Gateway connect
      const initiateOutcome = await paymentService.initiate({
        amountRupees: feeBreakdown.totalAmount,
        currency: 'INR',
        reference: `APP-${Date.now().toString().slice(-6)}`,
      });

      if (initiateOutcome.status === 'timeout') {
        setIsProcessing(false);
        setIsPending(true);
        setPendingIntentId(`pi_${Date.now()}`);
        return;
      }

      if (initiateOutcome.status === 'failure') {
        setIsProcessing(false);
        setFailureReason(initiateOutcome.message || 'Payment initiation failed.');
        return;
      }

      setProcessingStep(1);
      const intentId = initiateOutcome.data?.intentId || `pi_${Date.now()}`;

      // Step 2: Authorize and Confirm
      const confirmOutcome = await paymentService.confirm(intentId);

      if (confirmOutcome.status === 'timeout') {
        setIsProcessing(false);
        setIsPending(true);
        setPendingIntentId(intentId);
        return;
      }

      if (confirmOutcome.status === 'failure') {
        setIsProcessing(false);
        setFailureReason(confirmOutcome.message || 'Payment was declined by issuing bank.');
        return;
      }

      setProcessingStep(2);

      // Successful completion
      const txRef = confirmOutcome.data?.reference || `PAY-${Date.now().toString().slice(-6)}`;
      const applicantName =
        `${answers.firstName || ''} ${answers.lastName || ''}`.trim() || 'Applicant';
      const passportNo = String(answers.passportNumber || '—');
      const visaType = String(answers.visaType || answers.visaId || 'Tourist Visa');
      const rawRef =
        (answers.referenceNumber as string) ||
        `VR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const destination = String(answers.destinationCountry || 'United States');

      const receipt: PaymentReceiptData = {
        transactionId: txRef,
        referenceNumber: rawRef,
        paidAt: confirmOutcome.data?.paidAt || new Date().toISOString(),
        applicantName,
        passportNumber: passportNo,
        destinationCountry: destination,
        visaType,
        paymentMethod,
        paymentMethodDetails:
          paymentMethod === 'upi'
            ? upiMode === 'qr'
              ? 'UPI QR Code'
              : upiVpa
            : paymentMethod === 'card'
              ? `Card ending in ${cardData.cardNumber.slice(-4) || '4444'}`
              : `Netbanking (${selectedBank.toUpperCase()})`,
        feeBreakdown,
      };

      // Simulated notification dispatch
      const applicantEmail = String(answers.email || 'applicant@example.com');
      const applicantPhone = String(answers.phone || '+91 98765 43210');

      await Promise.all([
        notificationService.sendEmail(applicantEmail, 'PAYMENT_RECEIPT', { receipt }),
        notificationService.sendSms(applicantPhone, 'PAYMENT_CONFIRMATION', {
          txRef,
          amount: feeBreakdown.totalAmount,
        }),
      ]);

      showToast({
        kind: 'success',
        message: 'Payment confirmed! Receipt & confirmation sent to your email and phone.',
      });

      // Advance wizard machine to confirmation with receipt data
      actor.send({
        type: 'SUBMIT_PAYMENT_SUCCESS',
        receipt,
      });
    } catch {
      setIsProcessing(false);
      setFailureReason('An unexpected system error occurred during payment. Please retry.');
    }
  };

  const handleCheckPendingStatus = async () => {
    if (!pendingIntentId) return;
    setIsCheckingPending(true);

    const outcome = await paymentService.retry(pendingIntentId);
    setIsCheckingPending(false);

    if (outcome.status === 'success') {
      setIsPending(false);
      const txRef = outcome.data?.reference || `PAY-${Date.now().toString().slice(-6)}`;
      const applicantName =
        `${answers.firstName || ''} ${answers.lastName || ''}`.trim() || 'Applicant';
      const receipt: PaymentReceiptData = {
        transactionId: txRef,
        referenceNumber: `VRK-2026-${txRef}`,
        paidAt: outcome.data?.paidAt || new Date().toISOString(),
        applicantName,
        passportNumber: String(answers.passportNumber || '—'),
        destinationCountry: String(answers.destinationCountry || 'United States'),
        visaType: String(answers.visaType || answers.visaId || 'Tourist Visa'),
        paymentMethod,
        paymentMethodDetails: 'Authorized following pending status check',
        feeBreakdown,
      };

      showToast({
        kind: 'success',
        message: 'Payment confirmed! Application submitted successfully.',
      });

      actor.send({
        type: 'SUBMIT_PAYMENT_SUCCESS',
        receipt,
      });
    } else {
      showToast({
        kind: 'error',
        message: 'Bank response is still pending. Please check again in a few moments.',
      });
    }
  };

  // Stage 1 Fields
  const stage1Fields = [
    { label: 'Destination Country', value: String(answers.destinationCountry || 'United States') },
    { label: 'Trip Purpose', value: String(answers.tripPurpose || 'Tourism') },
    {
      label: 'Visa Category',
      value: String(answers.visaType || answers.visaId || 'Tourist Visa (B1/B2)'),
    },
    {
      label: 'Processing Speed',
      value: String(answers.processingTime || 'Standard (3-5 Business Days)'),
    },
  ];

  // Stage 2 Fields
  const fullName = `${answers.firstName || ''} ${answers.lastName || ''}`.trim();
  const address = [answers.addressLine1, answers.city, answers.state, answers.pincode]
    .filter(Boolean)
    .join(', ');

  const stage2Fields = [
    { label: 'Applicant Name', value: fullName || 'Rahul Sharma' },
    { label: 'Date of Birth', value: String(answers.dateOfBirth || '1995-05-15') },
    { label: 'Passport Number', value: String(answers.passportNumber || 'AA1234567') },
    { label: 'Passport Expiry', value: String(answers.passportExpiryDate || '2030-01-01') },
    { label: 'Email Address', value: String(answers.email || 'rahul.sharma@example.com') },
    { label: 'Mobile Number', value: String(answers.phone || '+91 98765 43210') },
    { label: 'Residential Address', value: address || '123 MG Road, Bengaluru, Karnataka 560001' },
    { label: 'Travel Start Date', value: String(answers.travelStartDate || '2026-12-01') },
  ];

  const documents = (answers.documents || {}) as Record<string, DocumentAttachment>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF0FB] text-[var(--color-indigo-primary)]">
            Stage 4 of 5
          </span>
          <span className="text-xs font-semibold text-[var(--color-ink-muted)]">
            Review & Payment
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
          Review Application & Complete Payment
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Please review your submitted details carefully. You can edit any section before
          authorizing payment.
        </p>
      </div>

      {/* Accessible Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Stage Summary Cards */}
      <div className="space-y-4">
        <StageReviewCard
          stageNumber={1}
          stageTitle="Visa Selection"
          stageSubtitle="Destination & Visa Type"
          fields={stage1Fields}
          onEdit={() => handleEditStage('visa-selection')}
        />

        <StageReviewCard
          stageNumber={2}
          stageTitle="Personal & Passport Details"
          stageSubtitle="Applicant identity, contact & travel details"
          fields={stage2Fields}
          onEdit={() => handleEditStage('personal-identity')}
        />

        <StageReviewCard
          stageNumber={3}
          stageTitle="Uploaded Documents"
          stageSubtitle="Verified document attachments"
          fields={[]}
          documents={documents}
          onEdit={() => handleEditStage('documents')}
        />
      </div>

      {/* Applicant Declaration Checkbox */}
      <div className="pt-2">
        <DeclarationCheckbox
          checked={declarationConfirmed}
          onChange={handleDeclarationChange}
          error={errors.find((e) => e.fieldId === 'declaration-confirmed')?.message}
        />
      </div>

      {/* Itemized Fee Breakdown Card */}
      <FeeBreakdownCard feeBreakdown={feeBreakdown} />

      {/* Payment Method Selector & Method Form */}
      <div className="space-y-4">
        <PaymentMethodSelector value={paymentMethod} onChange={handlePaymentMethodChange} />

        {paymentMethod === 'upi' && (
          <UpiPaymentForm
            vpa={upiVpa}
            mode={upiMode}
            totalAmount={feeBreakdown.totalAmount}
            onVpaChange={(v) => {
              setUpiVpa(v);
              actor.send({ type: 'ANSWER_CHANGED', fieldId: 'upiVpa', value: v });
            }}
            onModeChange={setUpiMode}
            error={errors.find((e) => e.fieldId === 'upiVpa')?.message}
          />
        )}

        {paymentMethod === 'card' && (
          <CardPaymentForm
            data={cardData}
            onChange={(d) => {
              setCardData(d);
              actor.send({ type: 'ANSWERS_BATCHED', answers: { ...d } });
            }}
            errors={{
              cardNumber: errors.find((e) => e.fieldId === 'cardNumber')?.message,
              cardName: errors.find((e) => e.fieldId === 'cardName')?.message,
              cardExpiry: errors.find((e) => e.fieldId === 'cardExpiry')?.message,
              cardCvv: errors.find((e) => e.fieldId === 'cardCvv')?.message,
            }}
          />
        )}

        {paymentMethod === 'netbanking' && (
          <NetbankingForm
            selectedBank={selectedBank}
            onBankChange={(b) => {
              setSelectedBank(b);
              actor.send({ type: 'ANSWER_CHANGED', fieldId: 'netbankingBank', value: b });
            }}
            error={errors.find((e) => e.fieldId === 'netbankingOtherSelect')?.message}
          />
        )}
      </div>

      {/* Payment Failure & Pending Recovery Cards */}
      {failureReason && (
        <PaymentFailureCard
          reason={failureReason}
          onRetry={handlePayAndSubmit}
          onChangeMethod={() => {
            setFailureReason(null);
            setPaymentMethod('upi');
          }}
        />
      )}

      {isPending && (
        <PaymentPendingCard
          onCheckStatus={handleCheckPendingStatus}
          isChecking={isCheckingPending}
        />
      )}

      {/* Pay Now Submission Button */}
      <div className="pt-4 space-y-3">
        <Button
          type="button"
          variant="primary"
          onClick={handlePayAndSubmit}
          disabled={isProcessing}
          className="w-full min-h-[52px] text-base font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Lock className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          Pay ₹{feeBreakdown.totalAmount.toLocaleString('en-IN')} & Submit Application
          <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
        </Button>
        <p className="text-center text-xs text-[var(--color-ink-muted)]">
          🔒 Secure 256-bit payment gateway • Backed by official consular encryption
        </p>
      </div>

      {/* Interactive Payment Processing Modal */}
      <PaymentProcessingModal
        isOpen={isProcessing}
        stepIndex={processingStep}
        amount={feeBreakdown.totalAmount}
      />

      {/* Demo Scenario Controller Bar */}
      <div className="pt-6 border-t border-[var(--color-border)]">
        <PaymentScenarioBar />
      </div>
    </div>
  );
}
