import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, RefreshCw } from 'lucide-react';

export interface PaymentPendingCardProps {
  onCheckStatus: () => void;
  isChecking?: boolean;
}

export function PaymentPendingCard({ onCheckStatus, isChecking = false }: PaymentPendingCardProps) {
  return (
    <Card
      role="status"
      className="p-5 sm:p-6 space-y-4 border-2 border-amber-300 bg-amber-50/70 text-amber-950 shadow-xs animate-in fade-in duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-amber-100 text-amber-700 shrink-0">
          <Clock className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-900">Payment Confirmation Pending</h3>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            Your bank is taking longer than usual to confirm the debit response. Your transaction
            reference has been secured.
          </p>
          <p className="text-xs text-amber-700">
            Click below to check current authorization status from your bank.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          onClick={onCheckStatus}
          disabled={isChecking}
          className="min-h-[44px] flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isChecking ? 'Checking Status with Bank…' : 'Check Status Now'}
        </Button>
      </div>
    </Card>
  );
}
