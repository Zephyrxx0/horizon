import { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Search,
  FileText,
  CreditCard,
  Plane,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import type { AppRoute } from '../../router/Router';
import { GovtBadge } from '../../components/ui/GovtBadge';
import { DestinationCarousel } from '../../components/ui/DestinationCarousel';
import { VisaCalculator } from '../../components/ui/VisaCalculator';
import { DataVisualizer } from '../../components/ui/DataVisualizer';
import { Button } from '../../components/ui/Button';

export function LandingPage() {
  const { navigate } = useRouter();
  const [quickRef, setQuickRef] = useState('');

  const visaCategories: {
    id: string;
    title: string;
    duration: string;
    entries: string;
    description: string;
    fee: string;
    path: AppRoute;
  }[] = [
    {
      id: 'tourist',
      title: 'e-Tourist Visa',
      duration: '30 Days / 1 Year / 5 Years',
      entries: 'Double / Multiple Entry',
      description:
        'Recreation, sightseeing, casual visits to meet friends and family, or short-term yoga programs.',
      fee: 'From $25 USD',
      path: '/apply',
    },
    {
      id: 'business',
      title: 'e-Business Visa',
      duration: '1 Year Validity',
      entries: 'Multiple Entry (180D stay)',
      description:
        'Commercial activities, business meetings, technical setup, sales inquiries, and trade exhibitions.',
      fee: 'From $80 USD',
      path: '/apply',
    },
    {
      id: 'medical',
      title: 'e-Medical & Attendant',
      duration: '60 Days Validity',
      entries: 'Triple Entry',
      description: 'Short-term medical treatment at recognized, specialized hospitals in India.',
      fee: 'From $80 USD',
      path: '/apply',
    },
    {
      id: 'conference',
      title: 'e-Conference Visa',
      duration: '30 Days Validity',
      entries: 'Single Entry',
      description:
        'Attending international workshops, seminars, and government-approved conferences.',
      fee: 'From $80 USD',
      path: '/apply',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Apply Online',
      desc: 'Complete the structured application form with personal and passport details.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Upload Documents',
      desc: 'Submit a digital passport photo and passport bio-page scan with automatic validation.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Pay Govt Fee',
      desc: 'Complete payment securely via international credit card, debit card, or UPI.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Receive ETA & Fly',
      desc: 'Electronic Travel Authorization (ETA) sent to email. Present QR pass on arrival.',
      icon: Plane,
    },
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      navigate('/track');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Thesis & Primary Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <GovtBadge variant="emblem" size="sm" />
              <GovtBadge variant="security" size="sm" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 [text-wrap:balance]">
                Official Electronic Visa (e-Visa) India
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed [text-wrap:pretty] max-w-xl">
                The authorized digital entry portal for international travelers visiting India for
                tourism, business, medical care, and conferences.
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/apply')}
                className="min-h-[46px] px-6 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Start New Application</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/track')}
                className="min-h-[46px] px-5 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-zinc-500" aria-hidden="true" />
                <span>Track Existing Status</span>
              </Button>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div>
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 tabular-nums block">
                  ~72 Hours
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">Average processing</span>
              </div>
              <div>
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 tabular-nums block">
                  165+ Countries
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">Eligible nationalities</span>
              </div>
              <div>
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 tabular-nums block">
                  36 Ports
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">Airports & seaports</span>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Tariff & Visa Checker */}
          <div className="lg:col-span-5">
            <VisaCalculator
              onSelectVisa={() => {
                navigate('/apply');
              }}
              headingLevel="h2"
            />
          </div>
        </div>
      </section>

      {/* 2. VISA CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Eligibility & Options
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Available e-Visa Categories
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Select the visa category that matches your travel purpose to begin your application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visaCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {cat.title}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {cat.fee}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                <div className="space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Duration:</span>{' '}
                    {cat.duration}
                  </div>
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Entries:</span>{' '}
                    {cat.entries}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate(cat.path)}
                  className="w-full text-xs font-medium py-1.5 min-h-[36px]"
                >
                  <span>Select & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR-STEP JOURNEY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Simple Process
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            How to Get Your e-Visa
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No embassy visits or physical passport submissions required. The entire process is
            conducted online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400 tabular-nums">
                    {s.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {s.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DESTINATION HIGHLIGHTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Incredible India
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Popular Travel Destinations
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/support')}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 cursor-pointer"
          >
            <span>View 31 Authorized Airports</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <DestinationCarousel />
      </section>

      {/* 5. TRANSPARENCY & DATA VISUALIZER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <DataVisualizer />
      </section>

      {/* 6. QUICK STATUS LOOKUP BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl bg-zinc-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Already Submitted an Application?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Track real-time status or reprint your Electronic Travel Authorization (ETA).
            </p>
          </div>

          <form
            onSubmit={handleTrackSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              placeholder="e.g. IND-2026-84920"
              value={quickRef}
              onChange={(e) => setQuickRef(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              aria-label="Application Reference Number"
            />
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto min-h-[38px] text-xs font-medium px-4"
            >
              <span>Track Status</span>
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
