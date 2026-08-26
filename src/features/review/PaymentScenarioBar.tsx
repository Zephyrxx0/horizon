import React, { useState } from 'react';
import { setScenarios } from '../../services/mock/scenarios';
import type { PaymentScenario } from './types';
import { Beaker, Check, AlertTriangle, Clock, XCircle } from 'lucide-react';

export interface PaymentScenarioBarProps {
  onScenarioChange?: (scenario: PaymentScenario) => void;
  className?: string;
}

export function PaymentScenarioBar({ onScenarioChange, className = '' }: PaymentScenarioBarProps) {
  const [activeScenario, setActiveScenario] = useState<PaymentScenario>('success');

  const handleScenarioChange = (scenario: PaymentScenario) => {
    setActiveScenario(scenario);

    if (scenario === 'success') {
      setScenarios({
        overrides: { payment: 'success' },
        latencyMs: [400, 800],
      });
    } else if (scenario === 'declined') {
      setScenarios({
        overrides: { payment: 'failure' },
        failureCode: 'CARD_DECLINED',
        failureMessage:
          'Payment declined by issuing bank: Insufficient balance or OTP verification failed.',
        latencyMs: [400, 800],
      });
    } else if (scenario === 'timeout') {
      setScenarios({
        overrides: { payment: 'timeout' },
        latencyMs: [500, 900],
      });
    } else if (scenario === 'network_error') {
      setScenarios({
        overrides: { payment: 'failure' },
        failureCode: 'NETWORK_ERROR',
        failureMessage:
          'Network error connecting to payment gateway. Please verify connection and retry.',
        latencyMs: [300, 600],
      });
    }

    if (onScenarioChange) {
      onScenarioChange(scenario);
    }
  };

  return (
    <div
      role="region"
      aria-label="Payment Demo Scenario Controller"
      className={`p-3.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 text-xs space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <Beaker className="w-4 h-4 text-amber-700" aria-hidden="true" />
          <span>Demo Payment Scenario Controller</span>
        </div>
        <span className="text-[11px] font-semibold text-amber-700">Test Mode Active</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handleScenarioChange('success')}
          className={`px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 transition-colors min-h-[32px] ${
            activeScenario === 'success'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
          aria-pressed={activeScenario === 'success'}
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Success
        </button>

        <button
          type="button"
          onClick={() => handleScenarioChange('declined')}
          className={`px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 transition-colors min-h-[32px] ${
            activeScenario === 'declined'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
          aria-pressed={activeScenario === 'declined'}
        >
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          Card Declined
        </button>

        <button
          type="button"
          onClick={() => handleScenarioChange('timeout')}
          className={`px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 transition-colors min-h-[32px] ${
            activeScenario === 'timeout'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
          aria-pressed={activeScenario === 'timeout'}
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          Bank Timeout
        </button>

        <button
          type="button"
          onClick={() => handleScenarioChange('network_error')}
          className={`px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 transition-colors min-h-[32px] ${
            activeScenario === 'network_error'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
          aria-pressed={activeScenario === 'network_error'}
        >
          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Network Error
        </button>
      </div>
    </div>
  );
}
