import React from 'react';
import { Download } from 'lucide-react';
import { downloadTemplate, type DocumentTemplateType } from './templates';

export interface TemplateDownloadButtonProps {
  templateType: DocumentTemplateType;
  label?: string;
  className?: string;
}

export const TemplateDownloadButton: React.FC<TemplateDownloadButtonProps> = ({
  templateType,
  label = 'Download template (.txt)',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={() => downloadTemplate(templateType)}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors ${className}`}
      aria-label={`${label} for ${templateType}`}
    >
      <Download className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};
