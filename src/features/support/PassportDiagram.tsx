import React from 'react';

export type PassportHighlightZone =
  'names' | 'passportNumber' | 'dates' | 'placeOfIssue' | 'mrz' | 'all';

export interface PassportDiagramProps {
  highlightZone?: PassportHighlightZone;
  className?: string;
}

export const PassportDiagram: React.FC<PassportDiagramProps> = ({
  highlightZone = 'all',
  className = '',
}) => {
  const isNamesHighlighted = highlightZone === 'names' || highlightZone === 'all';
  const isNumberHighlighted = highlightZone === 'passportNumber' || highlightZone === 'all';
  const isDatesHighlighted = highlightZone === 'dates' || highlightZone === 'all';
  const isPlaceHighlighted = highlightZone === 'placeOfIssue' || highlightZone === 'all';
  const isMrzHighlighted = highlightZone === 'mrz' || highlightZone === 'all';

  return (
    <div
      className={`rounded-xl border border-slate-300 bg-[#F8FAFC] p-3 shadow-xs text-xs font-sans select-none overflow-hidden ${className}`}
      data-testid="passport-diagram-container"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2.5">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
          Sample Indian Passport (Bio-Data Page)
        </span>
        <span className="text-[10px] text-slate-500 font-mono">SPECIMEN</span>
      </div>

      <svg
        viewBox="0 0 420 230"
        className="w-full h-auto rounded-lg shadow-inner bg-[#FEFDF9] border border-amber-200/80"
        role="img"
        aria-label="Indian Passport Biographical Page Data Zones Diagram"
      >
        <desc>
          Visual diagram of an Indian passport bio page showing photo area, Zone 1 for Surname and
          Given Names, Zone 2 for Passport Number and Place of Issue, Zone 3 for Date of Issue and
          Expiry, and Machine Readable Zone at the bottom.
        </desc>

        {/* Passport Header */}
        <rect x="0" y="0" width="420" height="28" fill="#1E293B" rx="4" />
        <text x="210" y="14" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">
          भारत गणराज्य / REPUBLIC OF INDIA
        </text>
        <text x="210" y="23" fill="#E2E8F0" fontSize="7" textAnchor="middle">
          PASSPORT / पासपोर्ट
        </text>

        {/* Photo Box */}
        <rect
          x="14"
          y="36"
          width="75"
          height="95"
          rx="4"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="1"
        />
        <circle cx="51.5" cy="70" r="18" fill="#CBD5E1" />
        <path d="M 30 115 A 22 22 0 0 1 73 115 Z" fill="#CBD5E1" />
        <text x="51.5" y="125" fill="#64748B" fontSize="8" fontWeight="600" textAnchor="middle">
          PHOTO
        </text>

        {/* National Emblem Watermark Hint */}
        <circle cx="270" cy="85" r="32" fill="#FEF3C7" opacity="0.4" />

        {/* Zone 2: Passport Number (Top Right) */}
        <g data-testid="zone-passport-number">
          <rect
            x="300"
            y="34"
            width="106"
            height="22"
            rx="4"
            fill={isNumberHighlighted ? '#EEF2FF' : '#F8FAFC'}
            stroke={isNumberHighlighted ? '#4F46E5' : '#CBD5E1'}
            strokeWidth={isNumberHighlighted ? '1.5' : '1'}
          />
          <text x="306" y="44" fill="#64748B" fontSize="6.5" fontWeight="bold">
            PASSPORT NO. / पासपोर्ट नं.
          </text>
          <text
            x="306"
            y="53"
            fill={isNumberHighlighted ? '#3730A3' : '#1E293B'}
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            AA1234567
          </text>
        </g>

        {/* Zone 1: Surname and Given Names */}
        <g data-testid="zone-names">
          <rect
            x="100"
            y="34"
            width="190"
            height="56"
            rx="4"
            fill={isNamesHighlighted ? '#EEF2FF' : '#F8FAFC'}
            stroke={isNamesHighlighted ? '#4F46E5' : '#CBD5E1'}
            strokeWidth={isNamesHighlighted ? '1.5' : '1'}
          />
          {/* Surname */}
          <text x="106" y="44" fill="#64748B" fontSize="6.5" fontWeight="bold">
            SURNAME / उपनाम [Zone 1: Last Name]
          </text>
          <text
            x="106"
            y="54"
            fill={isNamesHighlighted ? '#312E81' : '#1E293B'}
            fontSize="9"
            fontWeight="bold"
          >
            SHARMA
          </text>

          {/* Given Names */}
          <text x="106" y="68" fill="#64748B" fontSize="6.5" fontWeight="bold">
            GIVEN NAME(S) / दिया गया नाम [Zone 1: First & Middle]
          </text>
          <text
            x="106"
            y="79"
            fill={isNamesHighlighted ? '#312E81' : '#1E293B'}
            fontSize="9"
            fontWeight="bold"
          >
            AARAV KUMAR
          </text>
        </g>

        {/* Zone: Place of Issue & Nationality */}
        <g data-testid="zone-place-of-issue">
          <rect
            x="100"
            y="94"
            width="120"
            height="34"
            rx="4"
            fill={isPlaceHighlighted ? '#EEF2FF' : '#F8FAFC'}
            stroke={isPlaceHighlighted ? '#4F46E5' : '#CBD5E1'}
            strokeWidth={isPlaceHighlighted ? '1.5' : '1'}
          />
          <text x="106" y="104" fill="#64748B" fontSize="6.5" fontWeight="bold">
            PLACE OF ISSUE / जारी करने का स्थान
          </text>
          <text
            x="106"
            y="115"
            fill={isPlaceHighlighted ? '#312E81' : '#1E293B'}
            fontSize="8.5"
            fontWeight="bold"
          >
            MUMBAI
          </text>
          <text x="106" y="124" fill="#64748B" fontSize="6.5">
            NATIONALITY: INDIAN
          </text>
        </g>

        {/* Zone 3: Dates (Issue & Expiry) */}
        <g data-testid="zone-dates">
          <rect
            x="226"
            y="94"
            width="180"
            height="34"
            rx="4"
            fill={isDatesHighlighted ? '#EEF2FF' : '#F8FAFC'}
            stroke={isDatesHighlighted ? '#4F46E5' : '#CBD5E1'}
            strokeWidth={isDatesHighlighted ? '1.5' : '1'}
          />
          {/* Issue Date */}
          <text x="232" y="104" fill="#64748B" fontSize="6.5" fontWeight="bold">
            DATE OF ISSUE / जारी करने की तिथि
          </text>
          <text
            x="232"
            y="114"
            fill={isDatesHighlighted ? '#312E81' : '#1E293B'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            15/08/2020
          </text>

          {/* Expiry Date */}
          <text x="320" y="104" fill="#64748B" fontSize="6.5" fontWeight="bold">
            DATE OF EXPIRY / समाप्ति की तिथि
          </text>
          <text
            x="320"
            y="114"
            fill={isDatesHighlighted ? '#312E81' : '#1E293B'}
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            14/08/2030
          </text>
          <text x="232" y="124" fill="#059669" fontSize="6.5" fontWeight="600">
            ✓ Validity &gt; 6 Months Required
          </text>
        </g>

        {/* Zone: Machine Readable Zone (MRZ) */}
        <g data-testid="zone-mrz">
          <rect
            x="10"
            y="138"
            width="400"
            height="82"
            rx="4"
            fill={isMrzHighlighted ? '#F1F5F9' : '#F8FAFC'}
            stroke={isMrzHighlighted ? '#6366F1' : '#CBD5E1'}
            strokeWidth={isMrzHighlighted ? '1.5' : '1'}
          />
          <text x="18" y="150" fill="#64748B" fontSize="7" fontWeight="bold">
            MACHINE READABLE ZONE (MRZ) / मशीन पठनीय क्षेत्र
          </text>
          <text
            x="18"
            y="172"
            fill="#0F172A"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fontWeight="bold"
          >
            P&lt;INDSHARMA&lt;&lt;AARAV&lt;KUMAR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </text>
          <text
            x="18"
            y="198"
            fill="#0F172A"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fontWeight="bold"
          >
            AA12345678IND9001014M3008144&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
          </text>
          <text x="18" y="214" fill="#64748B" fontSize="6.5">
            Lines 1-2 encode Passport Number, Surname, Given Names, DOB &amp; Expiry for scanner
            verification.
          </text>
        </g>
      </svg>
    </div>
  );
};
