import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export interface PaymentFailureCardProps {
  reason: string;
  onRetry: () => void;
  onChangeMethod: () => void;
  disabled?: boolean;
}

export function PaymentFailureCard({
  reason,
  onRetry,
  onChangeMethod,
  disabled = false,
}: PaymentFailureCardProps) {
  return (
    <Card
      role="alert"
      className="p-5 sm:p-6 space-y-4 border-2 border-rose-300 bg-rose-50/70 text-rose-950 shadow-xs animate-in fade-in duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-rose-100 text-rose-600 shrink-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-rose-900">Payment Could Not Be Completed</h3>
          <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
            {reason ||
              'Transaction was declined by your bank or the payment gateway encountered an error.'}
          </p>
          <p className="text-xs text-rose-700">
            Your application details and document uploads remain 100% safe. No funds were debited.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <Button
          type="button"
          variant="primary"
          onClick={onRetry}
          disabled={disabled}
          className="min-h-[44px] flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Retry Payment
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onChangeMethod}
          disabled={disabled}
          className="min-h-[44px] flex items-center justify-center gap-1.5 bg-white text-rose-900 border-rose-300 hover:bg-rose-100"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Choose Another Method
        </Button>
      </div>
    </Card>
  );
}
