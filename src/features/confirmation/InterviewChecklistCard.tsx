import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useToast } from '../../components/ui/Toast';
import { getInterviewChecklistItems, generateChecklistText } from './checklist';
import {
  ClipboardCheck,
  Download,
  Printer,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export interface InterviewChecklistCardProps {
  referenceNumber: string;
  applicantName?: string;
  visaType?: string;
  destinationCountry?: string;
  className?: string;
}

export const InterviewChecklistCard: React.FC<InterviewChecklistCardProps> = ({
  referenceNumber,
  applicantName = 'Applicant',
  visaType = 'Tourist Visa',
  destinationCountry = 'International',
  className = '',
}) => {
  const { show } = useToast();
  const items = getInterviewChecklistItems(destinationCountry, visaType);

  // Track checked state by item id
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = items.filter((item) => checkedState[item.id]).length;
  const totalCount = items.length;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  const handleDownloadTxt = () => {
    const textContent = generateChecklistText(
      referenceNumber,
      applicantName,
      visaType,
      destinationCountry,
      items,
    );

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VisaChecklist_${referenceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    show({
      kind: 'success',
      message: 'Downloaded! Interview checklist saved as a text document.',
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Card
      role="region"
      aria-label="Interview & Embassy Preparation Checklist"
      className={`p-5 sm:p-6 bg-white space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ClipboardCheck
              className="w-5 h-5 text-[var(--color-indigo-primary)]"
              aria-hidden="true"
            />
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-ink)]">
              Interview & Next Steps Checklist
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
            Tailored preparation guide for{' '}
            <strong>
              {visaType} ({destinationCountry})
            </strong>
          </p>
        </div>

        {/* Progress Badge */}
        <div
          className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isAllCompleted
              ? 'bg-green-100 text-green-800'
              : 'bg-indigo-50 text-[var(--color-indigo-primary)] border border-indigo-200'
          }`}
          data-testid="checklist-progress-badge"
        >
          {isAllCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>
            {completedCount} of {totalCount} items prepared
          </span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)] block">
          Required Physical Documents to Carry
        </span>

        <div className="space-y-2.5">
          {items.map((item) => {
            const isChecked = !!checkedState[item.id];
            return (
              <label
                key={item.id}
                htmlFor={`check-${item.id}`}
                className={`p-3 sm:p-3.5 rounded-[var(--radius-card)] border transition-colors cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-[var(--color-green-50,#F0FDF4)] border-green-300'
                    : 'bg-slate-50 border-[var(--color-border)] hover:bg-slate-100'
                }`}
              >
                <div className="pt-0.5">
                  <Checkbox
                    id={`check-${item.id}`}
                    name={`check-${item.id}`}
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    aria-label={`Mark ${item.title} as prepared`}
                    label={<span className="sr-only">Mark {item.title} as prepared</span>}
                  />
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span
                      className={`text-sm font-semibold ${
                        isChecked ? 'line-through text-slate-500' : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.required && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Consulate Security & Rules Section */}
      <div className="p-4 rounded-[var(--radius-card)] bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-900">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>Consulate Arrival Essentials & Embassy Rules</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-amber-800 leading-relaxed">
          <li>Arrive at the visa application center 15 minutes before your slot.</li>
          <li>Carry all original physical certificates and 2 printed copies of this checklist.</li>
          <li>
            <strong>Prohibited:</strong> Mobile phones, smartwatches, recording devices, sealed
            luggage, and liquids.
          </li>
          <li>Dress in business casual or formal attire for consular interviews.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1 border-t border-[var(--color-border)]">
        <Button
          variant="primary"
          onClick={handleDownloadTxt}
          className="flex-1 min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2"
          data-testid="download-checklist-btn"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Download Checklist (.txt)</span>
        </Button>

        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex-1 min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2 border-slate-300"
          data-testid="print-checklist-btn"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print Preparation Guide</span>
        </Button>
      </div>
    </Card>
  );
};
