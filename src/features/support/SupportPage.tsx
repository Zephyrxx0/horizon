import { useState } from 'react';
import { Camera, FileCheck, Plane, PhoneCall, Mail, ChevronDown, HelpCircle } from 'lucide-react';
import { GovtBadge } from '../../components/ui/GovtBadge';

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const photoRequirements = [
    'Format: JPEG / JPG format, size 10 KB to 1 MB.',
    'Dimensions: Minimum 350 x 350 pixels (equal aspect ratio 1:1).',
    'Background: Plain white or off-white background with even lighting.',
    'Pose: Full face front view with eyes open and neutral facial expression.',
    'Attire: Plain clothing without uniforms or heavy patterns.',
    'Head Coverings: Permitted only for religious reasons (full facial features visible).',
  ];

  const passportRequirements = [
    'Validity: Minimum 6 months validity from the intended date of arrival in India.',
    'Blank Pages: Minimum 2 blank pages for immigration officer stamping.',
    'Bio-Page Scan: PDF or JPEG format (size 10 KB to 300 KB).',
    'Legibility: Full machine-readable zone (MRZ lines) clearly visible and uncropped.',
  ];

  const airports = [
    'Ahmedabad (AMD)',
    'Amritsar (ATQ)',
    'Bagdogra (IXB)',
    'Bengaluru (BLR)',
    'Bhubaneswar (BBI)',
    'Calicut (CCJ)',
    'Chandigarh (IXC)',
    'Chennai (MAA)',
    'Cochin (COK)',
    'Coimbatore (CJB)',
    'Delhi (DEL)',
    'Gaya (GAY)',
    'Goa (GOI / GOX)',
    'Guwahati (GAU)',
    'Hyderabad (HYD)',
    'Indore (IDR)',
    'Jaipur (JAI)',
    'Kannur (CNN)',
    'Kolkata (CCU)',
    'Lucknow (LKO)',
    'Madurai (IXM)',
    'Mangalore (IXE)',
    'Mumbai (BOM)',
    'Nagpur (NAG)',
    'Port Blair (IXZ)',
    'Pune (PNQ)',
    'Tiruchirappalli (TRZ)',
    'Trivandrum (TRV)',
    'Varanasi (VNS)',
    'Visakhapatnam (VTZ)',
  ];

  const seaports = ['Cochin', 'Goa (Mormugao)', 'Mangalore', 'Mumbai', 'Chennai'];

  const faqs = [
    {
      q: 'When should I apply for an Indian e-Visa?',
      a: 'For 30-Day e-Tourist Visas, apply 7 to 30 days prior to your arrival date. For 1-Year / 5-Year e-Tourist and e-Business visas, you can apply up to 120 days before travel.',
    },
    {
      q: 'What is an Electronic Travel Authorization (ETA)?',
      a: 'The ETA is the official electronic document issued by the Ministry of Home Affairs confirming authorization to travel to India. It is emailed to you and verified upon arrival at airport immigration.',
    },
    {
      q: 'Can I extend or convert my e-Visa in India?',
      a: 'e-Visas are non-extendable and non-convertible to any other visa type, except under exceptional medical emergency conditions approved by the Foreigners Regional Registration Officer (FRRO).',
    },
    {
      q: 'Do children or infants require a separate e-Visa?',
      a: 'Yes, every foreign national traveling to India regardless of age must possess an individual passport and a separate, approved e-Visa ETA.',
    },
    {
      q: 'Is the e-Visa application fee refundable if rejected?',
      a: 'The e-Visa application fee is non-refundable as it covers government processing and verification costs regardless of the outcome.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <GovtBadge variant="emblem" size="sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          e-Visa Guidelines, Specifications & Support
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Official compliance guidelines, technical document specifications, and 24x7 helpdesk
          assistance.
        </p>
      </div>

      {/* SECTION 1: PHOTO & PASSPORT SPECIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Specs Card */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Camera className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Digital Photo Specifications
            </h2>
          </div>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            {photoRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-zinc-400 font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Passport Specs Card */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <FileCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Passport Document Specifications
            </h2>
          </div>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            {passportRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-zinc-400 font-bold">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION 2: ENTRY AIRPORTS & SEAPORTS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Plane className="w-4 h-4" />
            <span>Designated Immigration Ports of Entry</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            e-Visa holders can enter India through 31 designated international airports and 5 major
            seaports.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
          <div>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-2">
              31 Designated International Airports:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              {airports.map((ap, i) => (
                <div
                  key={i}
                  className="p-1.5 rounded bg-zinc-50 dark:bg-zinc-800/60 font-mono text-[11px]"
                >
                  {ap}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">
              5 Designated Cruise Seaports:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {seaports.map((sp, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                >
                  {sp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: FREQUENTLY ASKED QUESTIONS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Common questions regarding processing rules, validity, and immigration requirements.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-4 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-3.5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: 24/7 HELPLINE CONTACT */}
      <div className="p-6 rounded-xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-base font-bold">24x7 Official e-Visa Tourist Helpline</h2>
          <p className="text-xs text-zinc-400">
            Dedicated support for foreign nationals and applicants in distress.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="tel:1800111363"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>1800-11-1363 (Toll Free)</span>
          </a>

          <a
            href="mailto:indian-evisa@gov.in"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>indian-evisa@gov.in</span>
          </a>
        </div>
      </div>
    </div>
  );
}
