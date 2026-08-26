import React, { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, CheckSquare, FileText } from 'lucide-react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { retrieveStoredDocument } from './storage';
import type { DocumentAttachment } from './types';

export interface DocumentPreviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: DocumentAttachment | null;
  onReplace?: () => void;
}

export const DocumentPreviewSheet: React.FC<DocumentPreviewSheetProps> = ({
  isOpen,
  onClose,
  attachment,
  onReplace,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    let active = true;
    let url: string | null = null;

    async function loadBlob() {
      if (!attachment || !isOpen) {
        setBlobUrl(null);
        return;
      }
      try {
        const blob = await retrieveStoredDocument(attachment.docId);
        if (blob && active) {
          url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      } catch {
        // Fallback
      }
    }

    loadBlob();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [attachment, isOpen]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  if (!attachment) return null;

  const isPdf = attachment.mimeType === 'application/pdf';
  const formattedSize =
    attachment.compressedSize < 1024 * 1024
      ? `${Math.round(attachment.compressedSize / 1024)} KB`
      : `${(attachment.compressedSize / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={attachment.fileName}
      description={`Size: ${formattedSize} • Format: ${attachment.mimeType}`}
    >
      <div className="space-y-4">
        {/* Zoom controls for image files */}
        {!isPdf && blobUrl && (
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-100 rounded-lg">
            <span className="text-xs font-medium text-gray-700">
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 min-h-[44px] min-w-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Document Preview Viewport */}
        <div className="relative w-full h-[320px] sm:h-[400px] bg-gray-900 rounded-xl overflow-auto flex items-center justify-center border border-gray-800 p-2">
          {blobUrl ? (
            isPdf ? (
              <object
                data={blobUrl}
                type="application/pdf"
                className="w-full h-full rounded bg-white"
                aria-label={attachment.fileName}
              >
                <div className="text-center p-6 text-white space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-gray-400" aria-hidden="true" />
                  <p className="text-sm">PDF preview cannot be embedded in this browser.</p>
                  <a
                    href={blobUrl}
                    download={attachment.fileName}
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 min-h-[48px]"
                  >
                    Download PDF to View
                  </a>
                </div>
              </object>
            ) : (
              <img
                src={blobUrl}
                alt={attachment.fileName}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="max-h-full max-w-full object-contain transition-transform duration-150 rounded"
              />
            )
          ) : (
            <div className="text-center text-gray-400 p-4">
              <p className="text-sm">Loading document preview…</p>
            </div>
          )}
        </div>

        {/* Legibility Inspection Checklist */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2 text-xs text-indigo-950">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
            <CheckSquare className="w-4 h-4 text-indigo-700" aria-hidden="true" />
            <span>Inspection Checklist:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Ensure all 4 corners and borders of the document are visible.</li>
            <li>Verify your full name, passport/ID numbers, and dates are sharp and clear.</li>
            <li>Ensure there is no heavy glare or shadow obscuring key information.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {onReplace && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onClose();
                onReplace();
              }}
              className="flex-1 sm:flex-initial"
            >
              Replace this file
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="flex-1 sm:flex-initial"
          >
            Done
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
