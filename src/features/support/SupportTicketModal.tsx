import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet } from '../../components/ui/Sheet';
import { Field, FieldLabel, FieldError } from '../../components/ui/Field';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { SupportTicket } from './types';
import { Send, CheckCircle2 } from 'lucide-react';

export interface SupportTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (ticket: SupportTicket) => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { show: showToast } = useToast();

  const [applicantName, setApplicantName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [category, setCategory] = useState('Passport & Bio-Data');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  const handleReset = () => {
    setApplicantName('');
    setContactInfo('');
    setCategory('Passport & Bio-Data');
    setDescription('');
    setTouched({});
    setSubmittedTicket(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ applicantName: true, contactInfo: true, description: true });

    if (!applicantName.trim() || !contactInfo.trim() || !description.trim()) {
      return;
    }

    const ticketId = `TKT-1800-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      ticketId,
      applicantName: applicantName.trim(),
      contactInfo: contactInfo.trim(),
      category,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    setSubmittedTicket(newTicket);
    showToast({
      kind: 'success',
      message: `Support ticket #${ticketId} submitted! An officer will contact you within 2 hours.`,
    });

    if (onSuccess) {
      onSuccess(newTicket);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title={t('help:supportTicket.title', 'Submit Support Query / Request Callback')}
      description={t(
        'help:supportTicket.subtitle',
        'Have a specific question? Send us a message and a consular officer will respond within 2 business hours.',
      )}
    >
      {submittedTicket ? (
        <div className="py-6 text-center space-y-4" data-testid="ticket-success-view">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-800">Query Received Successfully!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your Support Ticket ID is{' '}
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {submittedTicket.ticketId}
              </span>
              . Our team has queued your request and will reach out to{' '}
              <span className="font-semibold text-slate-800">{submittedTicket.contactInfo}</span>.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="primary" onClick={handleClose} className="w-full min-h-[44px]">
              Done &amp; Return
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Applicant Name */}
          <Field
            id="ticket-applicant-name"
            invalid={touched.applicantName && !applicantName.trim()}
          >
            <FieldLabel>{t('help:supportTicket.nameLabel', 'Your Full Name')}</FieldLabel>
            <Input
              id="ticket-applicant-name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, applicantName: true }))}
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              required
            />
            {touched.applicantName && !applicantName.trim() && (
              <FieldError>Please enter your full name.</FieldError>
            )}
          </Field>

          {/* Contact Info */}
          <Field id="ticket-contact-info" invalid={touched.contactInfo && !contactInfo.trim()}>
            <FieldLabel>
              {t('help:supportTicket.contactLabel', 'Mobile Number or Email')}
            </FieldLabel>
            <Input
              id="ticket-contact-info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, contactInfo: true }))}
              placeholder="+91 98765 43210 or name@example.com"
              required
            />
            {touched.contactInfo && !contactInfo.trim() && (
              <FieldError>Please provide a contact number or email address.</FieldError>
            )}
          </Field>

          {/* Category */}
          <Field id="ticket-category">
            <FieldLabel>{t('help:supportTicket.categoryLabel', 'Query Topic')}</FieldLabel>
            <Select
              id="ticket-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Passport & Bio-Data">Passport &amp; Bio-Data Details</option>
              <option value="Documents & Photo Upload">Documents &amp; Photo Specifications</option>
              <option value="Payment & Billing">Payment, UPI &amp; Refund Inquiries</option>
              <option value="Tracking & ARN Status">Tracking &amp; Status Verification</option>
              <option value="General Consulate Inquiries">General Visa Policy &amp; Other</option>
            </Select>
          </Field>

          {/* Issue Description */}
          <Field id="ticket-description" invalid={touched.description && !description.trim()}>
            <FieldLabel>
              {t('help:supportTicket.descLabel', 'Describe your question or issue')}
            </FieldLabel>
            <textarea
              id="ticket-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, description: true }))}
              placeholder="Provide details about your question, step, or error..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800 transition-colors"
              required
            />
            {touched.description && !description.trim() && (
              <FieldError>Please provide a brief description of your query.</FieldError>
            )}
          </Field>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="min-h-[44px] px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="min-h-[44px] px-5 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{t('help:supportTicket.submitBtn', 'Submit Query / Request Callback')}</span>
            </Button>
          </div>
        </form>
      )}
    </Sheet>
  );
};
