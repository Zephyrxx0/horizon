import React from 'react';
import { CheckCircle2, XCircle, Camera, AlertCircle } from 'lucide-react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { ALL_DOCUMENT_SLOTS } from './requirements';
import type { DocumentSlotId } from './types';

export interface SampleGuidanceSheetProps {
  slotId: DocumentSlotId | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SampleGuidanceSheet: React.FC<SampleGuidanceSheetProps> = ({
  slotId,
  isOpen,
  onClose,
}) => {
  if (!slotId) return null;

  const slot = ALL_DOCUMENT_SLOTS[slotId];
  if (!slot) return null;

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={`Sample & Tips: ${slot.title}`}
      description={slot.description}
    >
      <div className="space-y-5">
        {/* Slot specific visual sample guide */}
        {slotId === 'passport' && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
              <h3 className="text-sm font-semibold text-indigo-950 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                <span>Passport Bio & Address Page Specifications</span>
              </h3>

              <div className="p-3 bg-white border border-indigo-100 rounded-lg text-xs space-y-2">
                <div className="border-b pb-2">
                  <span className="font-bold text-gray-900 block">
                    1. Bio-Data Page (Pages 1–2):
                  </span>
                  <span className="text-gray-600">
                    Must clearly display your full legal name, date of birth, passport number,
                    photograph, and the 2 lines of Machine Readable Zone (MRZ) characters at the
                    bottom.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">
                    2. Address & Family Page (Pages 35–36):
                  </span>
                  <span className="text-gray-600">
                    Must clearly display father/mother/spouse names, registered residential address,
                    and passport issuing authority details.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-green-50/80 border border-green-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1 font-semibold text-green-900">
                  <CheckCircle2 className="w-4 h-4 text-green-700" aria-hidden="true" />
                  <span>Do This:</span>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Hold phone parallel to the passport surface.</li>
                  <li>Use bright daytime natural lighting.</li>
                  <li>Capture the complete 2-page spread.</li>
                </ul>
              </div>

              <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1 font-semibold text-red-900">
                  <XCircle className="w-4 h-4 text-red-700" aria-hidden="true" />
                  <span>Avoid This:</span>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Flash reflections blinding the photo or MRZ.</li>
                  <li>Fingers covering passport text or edges.</li>
                  <li>Blurry camera or dark shadows.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {slotId === 'photo' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-green-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-700" aria-hidden="true" />
                  <span>Acceptable Photograph</span>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Plain white background.</li>
                  <li>Looking straight at camera, neutral face.</li>
                  <li>Both ears and neck clearly visible.</li>
                  <li>Even studio lighting with no face shadows.</li>
                  <li>Recent photo taken within last 6 months.</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-red-900 text-sm">
                  <XCircle className="w-4 h-4 text-red-700" aria-hidden="true" />
                  <span>Unacceptable Photos</span>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Selfies or tilted camera angles.</li>
                  <li>Colored / patterned backgrounds.</li>
                  <li>Sunglasses, hats, or tinted glasses.</li>
                  <li>Heavy filters, low lighting, or blurry photos.</li>
                  <li>Cropped group photos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {slotId !== 'passport' && slotId !== 'photo' && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 text-xs text-gray-700">
            <div className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm">
              <AlertCircle className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              <span>General Document Guidelines</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Documents must be issued by a recognized authority / organization.</li>
              <li>
                Ensure all dates, names, reference numbers, and stamps are sharp and readable.
              </li>
              <li>Multi-page letters or statements should be saved in a single PDF document.</li>
              <li>Files must not exceed 10MB before compression.</li>
            </ul>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button type="button" variant="primary" onClick={onClose} className="w-full sm:w-auto">
            Got it, I understand
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
