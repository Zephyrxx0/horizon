import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import type { FaqCategory, FaqItem } from './types';
import { FAQ_ITEMS, HELPLINE_INFO, searchFaqs } from './faqCatalog';
import { SupportTicketModal } from './SupportTicketModal';
import {
  Search,
  X,
  ChevronDown,
  PhoneCall,
  Clock,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export interface FaqSheetProps {
  open: boolean;
  onClose: () => void;
  initialCategory?: FaqCategory;
}

const CATEGORIES: { key: FaqCategory; labelKey: string; defaultLabel: string }[] = [
  { key: 'all', labelKey: 'help:categories.all', defaultLabel: 'All Questions' },
  { key: 'passport', labelKey: 'help:categories.passport', defaultLabel: 'Passport & Bio-Data' },
  { key: 'documents', labelKey: 'help:categories.documents', defaultLabel: 'Documents & Photos' },
  { key: 'payment', labelKey: 'help:categories.payment', defaultLabel: 'Payment & Fees' },
  { key: 'tracking', labelKey: 'help:categories.tracking', defaultLabel: 'Tracking & Status' },
  { key: 'general', labelKey: 'help:categories.general', defaultLabel: 'General & Policies' },
];

export const FaqSheet: React.FC<FaqSheetProps> = ({ open, onClose, initialCategory = 'all' }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(initialCategory);
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(new Set());
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const filteredFaqs = useMemo(() => {
    return searchFaqs(searchQuery, activeCategory, (k: string, def?: string) => {
      const translateFn = t as (key: string, options?: { defaultValue?: string }) => string;
      return translateFn(k, { defaultValue: def || '' });
    });
  }, [searchQuery, activeCategory, t]);

  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedFaqIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setExpandedFaqIds(new Set());
  };

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={t('help:title', 'Help & Frequently Asked Questions')}
        description={t(
          'help:subtitle',
          'Search 18+ official visa guides, frequently asked questions, and consular definitions.',
        )}
      >
        <div className="space-y-5">
          {/* Search Input Bar */}
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              role="searchbox"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'help:searchPlaceholder',
                'Search questions, topics, fees, or documents…',
              )}
              aria-label="Search frequently asked questions"
              className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin"
            role="toolbar"
            aria-label="Filter FAQ categories"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  aria-pressed={isSelected}
                  data-testid={`faq-category-${cat.key}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation min-h-[36px] flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800'
                  }`}
                >
                  <span>{t(cat.labelKey, cat.defaultLabel)}</span>
                </button>
              );
            })}
          </div>

          {/* Results Bar & Expand/Collapse Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
            <span>
              {filteredFaqs.length === 1
                ? 'Showing 1 result'
                : `Showing ${filteredFaqs.length} of ${FAQ_ITEMS.length} guides`}
            </span>
            {filteredFaqs.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="hover:text-indigo-600 font-medium cursor-pointer"
                >
                  Expand all
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="hover:text-indigo-600 font-medium cursor-pointer"
                >
                  Collapse all
                </button>
              </div>
            )}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-700">No matching questions found</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Try searching for different keywords, clear your search filter, or request support
                below.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-2"
              >
                Reset Search Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5" data-testid="faq-accordion-list">
              {filteredFaqs.map((faq: FaqItem) => {
                const isExpanded = expandedFaqIds.has(faq.id);
                const questionText = t(faq.questionKey, faq.defaultQuestion);
                const answerText = t(faq.answerKey, faq.defaultAnswer);
                const panelId = `faq-panel-${faq.id}`;
                const headerId = `faq-header-${faq.id}`;

                return (
                  <div
                    key={faq.id}
                    className={`rounded-xl border transition-colors ${
                      isExpanded
                        ? 'border-indigo-200 bg-indigo-50/30 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      id={headerId}
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      className="w-full px-4 py-3 text-left flex items-start justify-between gap-3 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
                    >
                      <div className="space-y-1 pr-1">
                        <span className="text-sm font-semibold text-slate-900 block leading-snug">
                          {questionText}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-indigo-600' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headerId}
                        className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-indigo-100/60 animate-in fade-in-50 duration-150"
                      >
                        <p>{answerText}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Helpline & Support Escalation Card (D-04) */}
          <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-purple-50/50 p-4 space-y-3 mt-6 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <HeadphonesIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{t('help:helpline.title', 'Need Human Assistance?')}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                <span>Official MEA Helpdesk</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
                <span className="font-mono font-bold text-indigo-950 text-sm">
                  {HELPLINE_INFO.number}
                </span>
                <span className="text-slate-500 font-medium">
                  ({t('help:helpline.tollFree', 'Toll-Free')})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{t('help:helpline.hours', HELPLINE_INFO.hours)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100 flex flex-col sm:flex-row gap-2">
              <Button
                variant="primary"
                onClick={() => setIsTicketModalOpen(true)}
                className="w-full sm:flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-xs"
                data-testid="open-support-ticket-btn"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>
                  {t('help:supportTicket.title', 'Submit Support Query / Request Callback')}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Sheet>

      {/* Support Ticket Modal Dialog */}
      <SupportTicketModal open={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
    </>
  );
};

function HeadphonesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}
