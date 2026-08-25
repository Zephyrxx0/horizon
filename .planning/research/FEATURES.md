# Feature Research

**Domain:** Guided visa application portal (mobile-first government-service UX, Indian market)
**Researched:** 2026-08-25
**Confidence:** MEDIUM (competitor features verified across app-store listings, vendor sites, and independent reviews; design patterns sourced from GOV.UK Design System/Service Manual and WebAIM data)

## Feature Landscape

Legend for **PRD?** column: ✅ covered · ⚠️ partially covered · ❌ missed by PRD

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete. Derived from iVisa, Atlys, DS-160/CEAC, and GOV.UK service patterns.

| #   | Feature                                                                                                                                                | Why Expected                                                                                                                                                                                                                                 | Complexity | PRD?       | Notes                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | Linear guided flow with visual progress indicator + per-stage time estimates                                                                           | Every modern portal (iVisa "3 steps", Atlys, France-Visas "5 steps") structures the journey this way; users must always know "where am I?"                                                                                                   | LOW        | ✅         | PRD's 5-stage model matches best practice exactly                                                                                                                                                    |
| T2  | Auto-save + resume across sessions                                                                                                                     | DS-160's 20-min silent timeout destroying work is _the_ most-hated failure in this domain; "Leave the page and lose everything" is iVisa's own anti-marketing against gov portals                                                            | MEDIUM     | ✅         | localStorage + ~10s autosave; also satisfies WCAG 2.2.1 (Timing Adjustable)                                                                                                                          |
| T3  | Cross-device resume                                                                                                                                    | Users start on phone, finish on desktop (or lose their phone mid-application)                                                                                                                                                                | MEDIUM     | ✅         | PRD's email backup code (mocked) is the right lightweight pattern                                                                                                                                    |
| T4  | Real-time field validation with constructive, fix-suggesting errors + green checkmarks                                                                 | Generic "Invalid input" errors are a top cited pain point; WCAG 3.3.3 (Error Suggestion) requires fix suggestions                                                                                                                            | MEDIUM     | ✅         | Nuance below: validate on blur/continue, not per keystroke (GOV.UK warns typing-time validation stresses users)                                                                                      |
| T5  | Accessible error summary: top-of-page summary, focus moved to it, "Error:" in page title, user input preserved on failure                              | GOV.UK standard validation-recovery pattern; screen-reader mandatory; WebAIM shows missing labels/errors are top failures                                                                                                                    | MEDIUM     | ❌ **GAP** | PRD has field-level errors but never specifies error-summary + focus-management + input-preservation behavior. Must be added to requirements                                                         |
| T6  | **Review-your-answers page before final submit/payment**                                                                                               | GOV.UK "Check answers" pattern; DS-160's #1 complaint is that mistakes can't be fixed after submission because there was no adequate review step. A portal whose whole pitch is "fewer rejections" cannot skip this                          | MEDIUM     | ❌ **GAP** | Biggest single miss in the PRD. Insert a review stage (or review step inside Stage 4 before pay button activates): grouped summary of all entered data, tap-to-edit jumps back to the relevant stage |
| T7  | Upfront visibility: document checklist, processing time, itemized cost BEFORE commitment                                                               | Both iVisa and Atlys lead with requirements-checker showing fees/timeline/documents before any data entry; PRD's own pain-point table calls surprise fees out                                                                                | LOW        | ✅         | Stage 1 response does this                                                                                                                                                                           |
| T8  | "Prepare before you start" guidance (what to have handy)                                                                                               | GOV.UK set-expectations-early pattern; DS-160 FAQ tells users to gather documents first — reduces abandonment when a required document isn't at hand                                                                                         | LOW        | ⚠️         | Checklist appears at Stage 1, but a pre-journey "you will need X, Y, Z — est. 15 min" intro screen is worth making explicit                                                                          |
| T9  | Document upload: camera capture, file-picker fallback, format/size validation with current-size display, preview before confirm, per-document progress | Capture UX research: real-time feedback drives first-attempt success; uploaders that reset the whole form on one bad file are the canonical frustration                                                                                      | HIGH       | ✅         | Add image thumbnail preview + confirm-before-attach if not already planned                                                                                                                           |
| T10 | Client-side image compression/resizing before upload                                                                                                   | Budget Android phones shoot 3–8 MB photos; raw uploads fail on 3G. Adaptive compression is standard practice                                                                                                                                 | MEDIUM     | ❌ **GAP** | PRD validates size but doesn't compress. Canvas-based downscale to ≤2 MB keeps uploads viable on the target network                                                                                  |
| T11 | Payment state machine: INITIATED → PENDING → SUCCESS/FAILED with retry that does NOT require re-entering details                                       | UPI reality: collect requests sit PENDING and can fail silently. "Instant confirmation, no waiting for bank" contradicts how UPI behaves; even mocked, users recognize fake instant-success flows                                            | MEDIUM     | ❌ **GAP** | PRD assumes instant success. Mock gateway must exercise pending (spinner + "approve in your UPI app"), failed (reason + retry with linked parent txn), duplicate-payment guard                       |
| T12 | Itemized cost breakdown + receipt saved in app                                                                                                         | PRD's own pain point ("₹5000 became ₹8000"); every competitor shows combined fee breakdown upfront                                                                                                                                           | LOW        | ✅         |                                                                                                                                                                                                      |
| T13 | Confirmation package: shareable reference number + status timeline + next steps                                                                        | Universal across all portals; reference number is the user's lifeline to the process                                                                                                                                                         | LOW        | ✅         |                                                                                                                                                                                                      |
| T14 | Post-submission tracking by reference number (without account/login)                                                                                   | iVisa offers order-number+email lookup with no account; forcing account creation to check status kills return visits                                                                                                                         | LOW        | ✅         | Keep tracking fully guest-accessible by reference number                                                                                                                                             |
| T15 | Human-readable status timeline: dated events, expected durations, explicit next-required-action                                                        | The "In Review for 3 weeks — what now?" pain point; Atlys's entire brand is radical timeline transparency                                                                                                                                    | MEDIUM     | ✅         | Ensure every terminal/stalled state has a "what you can do" action                                                                                                                                   |
| T16 | Help/support escape hatch (FAQ + visible contact path)                                                                                                 | ALL competitors staff 24/7 chat/WhatsApp/email — iVisa markets it as a headline feature. For low-digital-literacy users, "I'm stuck and there's no human" = abandonment. Even a mocked help center + WhatsApp-style contact card is expected | MEDIUM     | ❌ **GAP** | PRD has inline contextual help but zero fallback channel. Add: searchable FAQ (curated, translated), "Still stuck?" contact affordance on every stage, help entry in tracking view                   |
| T17 | Full UI translation incl. field examples, tooltips, error messages, status names                                                                       | Half-translated portals (labels English, buttons Hindi) read as broken; error messages in the wrong language defeat their purpose                                                                                                            | HIGH       | ✅         | Scope note: this means ALL strings through the validation/help/status systems, not just labels                                                                                                       |
| T18 | Dynamic `lang` attribute switching + script-aware fonts (no glyph clipping)                                                                            | WCAG 3.1.1/3.1.2; Devanagari's taller metrics clip in Latin-tuned line-heights (classic Noto-Sans-in-select bug); Telugu/Tamil shaping needs proper OpenType engines                                                                         | MEDIUM     | ⚠️         | PRD lists languages but not the rendering contract. Requirements should pin: Noto Sans/Serif family for all scripts, `lang` on `<html>` updates with locale, line-height audited per script          |
| T19 | WCAG 2.1 AA concrete coverage: 4.5:1 contrast, programmatic form labels, alt text, keyboard operability, visible focus, skip-nav, error identification | WebAIM: low contrast (~80%), missing labels (~48%), missing language attr (~17%) dominate gov-site failures; Lighthouse 90+ target demands all of these                                                                                      | MEDIUM     | ✅         | Stated as hard requirement; requirements doc should carry the specific SC checklist so it isn't aspirational                                                                                         |
| T20 | Mobile-first ergonomics: 48px targets, single column, full-width controls                                                                              | Table stakes by PRD's own problem statement; GOV.UK confirms one-column + full-width works best on mobile                                                                                                                                    | LOW        | ✅         |                                                                                                                                                                                                      |
| T21 | Offline tolerance (PWA caching, draft survives connection loss)                                                                                        | 3G/4G reality; PRD targets this correctly via service workers                                                                                                                                                                                | MEDIUM     | ✅         | Draft persistence matters more than offline _submission_                                                                                                                                             |
| T22 | Trust messaging: what happens to my data, why we ask, security reassurance near sensitive fields/uploads                                               | iVisa leads with "we're not the government, here's exactly what we do"; users hand over passport scans — unexplained data handling reads as phishing                                                                                         | LOW        | ❌ **GAP** | Cheap to add: short privacy explainer at start, "why we ask this" microcopy on sensitive fields, clear "prototype — no real data leaves your device" notice                                          |
| T23 | Duplicate application detection (same passport, multiple actives)                                                                                      | Listed in PRD under fraud prevention at scale, but Atlys-class products surface this as user-facing protection ("you already have an active application — resume it?")                                                                       | LOW        | ✅         | Make it a friendly resume prompt, not an error                                                                                                                                                       |

### Differentiators (Competitive Advantage)

Aligned with Core Value: first-time applicant completes end-to-end on a budget phone, never lost, never losing data.

| #   | Feature                                                                                                    | Value Proposition                                                                                                                                       | Complexity            | PRD? | Notes                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---- | ------------------------------------------------------------------------------------------ |
| D1  | Six-language support incl. Tamil/Telugu/Kannada/Marathi                                                    | Genuinely rare: iVisa supports 14 languages but NO major competitor serves Indian regional languages well. Directly serves the underserved-user mission | HIGH (already scoped) | ✅   | The flagship differentiator — protect its budget                                           |
| D2  | Plain-language contextual help for low digital literacy (every field: example, tooltip, jargon-free label) | Gov portals assume knowledge ("date of issue?"); Atlys solves this with AI, this product solves it with editorial care — cheaper and more reliable      | MEDIUM                | ✅   | Depth matters: a glossary + per-field examples beats generic tooltips                      |
| D3  | Visa recommendation wizard from trip-purpose answers                                                       | Atlys charges for this class of "eligibility engine"; rule-based version over hardcoded catalog is cheap                                                | MEDIUM                | ✅   | Rule table over the visa catalog; explain WHY each suggestion fits                         |
| D4  | Passport-expiry advisory with informed-consent continue flow                                               | Atlys hard-stops the workflow; letting users proceed knowingly is both kinder and demonstrates the "constructive, not punitive" principle               | LOW                   | ✅   |                                                                                            |
| D5  | Camera overlay guides for photo/passport pages (static framing guides, no AI)                              | Atlys/iVisa's photo tools are top-rated features; a static 4.6×6cm crop overlay + edge guide captures most of the value with zero ML                    | LOW–MEDIUM            | ⚠️   | PRD has blurry-quality warnings; framing overlays are the cheap 80% — recommended addition |
| D6  | WhatsApp-native share for confirmation/reference                                                           | In India the share button _is_ WhatsApp; one-tap share of reference + confirmation summary                                                              | LOW                   | ❌   | Small cost, high perceived polish; use Web Share API with WhatsApp fallback                |
| D7  | Time-to-completion honesty (stage time estimates + running "about N min left")                             | Atlys's "~4 minutes" promise is central to its brand; honest estimates build the trust that gov portals destroy                                         | LOW                   | ✅   | Already in PRD; keep estimates updated as stages complete                                  |
| D8  | Interview-prep checklist download + SMS/email backup of confirmation                                       | Extends value past submission; competitors stop at approval notification                                                                                | LOW                   | ✅   | Mocked delivery channels                                                                   |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature                                                  | Why Requested                               | Why Problematic                                                                                                                                               | Alternative                                                                               |
| -------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| AI chatbot support assistant (Atlys "BOLO"-style)        | Competitors market it; seems impressive     | A mocked bot with canned replies feels broken and erodes the exact trust the product builds; NLU without backend is impossible; support burden of bad answers | Curated, translated, searchable FAQ + prominent human-contact card (T16)                  |
| Group/family applications in one order                   | iVisa supports it; families travel together | Multiplies every subsystem: per-applicant documents, payments, statuses, tracking. Prototype-breaking scope                                                   | Single applicant per application; note "one at a time" in copy                            |
| Processing-speed tiers (standard/rush/super-rush upsell) | iVisa monetizes urgency this way            | Adds a pricing matrix, tiered expectations, and refund logic for zero prototype learning; dark-pattern adjacent                                               | Single honest itemized fee (PRD's existing breakdown)                                     |
| Forced account registration before starting the journey  | Feels like "proper" product architecture    | Kills completion for the exact skeptical, low-literacy audience; competitors let you start as guest                                                           | Anonymous start + email backup code (PRD already right)                                   |
| Real OCR/document data extraction                        | Magic-moment demo appeal                    | Explicitly out of scope (PROJECT.md); half-fake extraction is worse than none                                                                                 | Simulated success per PRD §4 mock table; manual entry with great help text                |
| Session auto-logout "security theater"                   | Copies banking-app instincts                | DS-160's defining failure; destroys WCAG 2.2.1 compliance and user data                                                                                       | Autosave + explicit sign-out; warn before any timeout, never destroy drafts               |
| Live websocket status streaming                          | "Real-time" sounds better                   | No backend exists; polling/mock transitions achieve identical UX at this scale                                                                                | Timed mock status transitions (PRD's demo-transition approach)                            |
| Upsell/cross-sell interstitials during the journey       | Monetization instinct                       | Directly attacks the 85%-completion goal; gov-service trust dies at the first ad                                                                              | Zero marketing surfaces inside the 5-stage flow                                           |
| Collecting Aadhaar/biometric data                        | Realism of Indian KYC                       | Legal sensitivity (Aadhaar Act), massive privacy liability in browser storage, out of scope                                                                   | Accept alternate proof-of-address docs (utility bill etc.), as PRD checklist already does |

## Feature Dependencies

```
[Design tokens: contrast-safe palette + Noto Indic fonts]
    └──requires-before──> [ALL screens] ──requires──> [WCAG 2.1 AA pass]

[i18n framework + string extraction]
    ├──requires──> [T17 full-copy translation]
    ├──requires──> [T18 dynamic lang attr / font loading]
    └──blocks──> [D2 plain-language help] [T16 translated FAQ]

[Visa catalog data (type, destination, docs, fees, timelines)]
    ├──requires──> [Stage 1 selection + T7 upfront checklist/cost/time]
    ├──requires──> [D3 recommendation rules]
    └──requires──> [Progressive disclosure field sets]

[Application state store (single localStorage schema)]
    ├──requires──> [T2 autosave] ──requires──> [T3 cross-device code]
    ├──requires──> [T23 duplicate/resume detection]
    └──requires──> [Review page T6 reads the same state]

[Validation engine (rules + messages)]
    ├──requires──> [T4 field validation] ──requires──> [T5 error summary/focus]
    ├──requires──> [Progressive disclosure conditional rules]
    └──gates──> [Review page T6] ──gates──> [Payment enablement]

[Upload pipeline (validate → compress T10 → preview → attach)]
    ├──requires──> [Doc checklist from catalog]
    └──feeds──> [Submission package]

[Payment state machine T11]
    ├──requires──> [Itemized breakdown T12]
    ├──requires──> [Receipt + confirmation T13]
    └──triggers──> [Status timeline T15] ──requires──> [Tracking T14]

[Reference number generator]
    ├──requires──> [T13 confirmation] [T14 tracking]
    └──enables──> [T23 duplicate check] [D6 WhatsApp share]
```

### Dependency Notes

- **T6 (review page) requires the unified application-state store:** it renders whatever T2 persisted; building it early forces the good architecture (state → render, not scattered component state).
- **T11 (payment state machine) gates T13–T15:** confirmation/tracking only make sense once payment emits a terminal state; mock the three outcomes (success/pending→success/failed→retry) from day one.
- **i18n blocks nearly all copy work:** extract strings from the first component or retrofit costs more than building it. D1/D2/T16 all sit downstream.
- **Conflict:** T4 real-time validation vs GOV.UK stress guidance — resolve by validating on blur + on stage-continue, never per keystroke; green checkmarks appear after blur.
- **Conflict:** T2 autosave vs T23 duplicate detection — resuming must update the same record, not create a second one; key drafts by application ID from first save.

## MVP Definition

The project mandates a single milestone covering full PRD scope. Therefore "MVP" = PRD scope **plus the gap fixes** (T5, T6, T10, T11, T16, T22) — all table stakes. Nothing in the table-stakes list can slip without breaking the completion-rate thesis.

### Launch With (v1 — the single milestone)

- [ ] All Table Stakes T1–T23 — each maps to a PRD pain point or WCAG obligation; T5/T6/T10/T11/T16/T22 are net-new additions to PRD scope
- [ ] Differentiators D1–D5, D7, D8 — already in PRD scope
- [ ] D6 WhatsApp share — include only if the milestone has slack; it's the cheapest cut candidate

### Consciously Deferred / Excluded (documented, not forgotten)

- [ ] Document vault with reuse across future applications (Atlys) — requires accounts + server storage; meaningless when data is session-local
- [ ] Group/family applications — anti-feature above
- [ ] Photo-tool AI (background removal, ICAO auto-check) — static overlays (D5) deliver the value
- [ ] Rejection-risk prediction, appointment-slot scraping, cover-letter generators — need real outcome data/integrations
- [ ] OCR pre-fill — out of scope by decision
- [ ] Rush-tier pricing, referral/promo systems — monetization machinery irrelevant to a prototype

## Feature Prioritization Matrix

Top entries shown; full list follows the same logic. Cost assumes Next.js + client-side mocks, single team, one milestone.

| Feature                                     | User Value                    | Implementation Cost | Priority       |
| ------------------------------------------- | ----------------------------- | ------------------- | -------------- |
| T2/T3 autosave + resume                     | HIGH                          | MEDIUM              | P1             |
| T6 review-your-answers page                 | HIGH                          | MEDIUM              | P1             |
| T4/T5 validation + accessible error summary | HIGH                          | MEDIUM              | P1             |
| T11 payment state machine w/ retry          | HIGH                          | MEDIUM              | P1             |
| T1 guided flow + progress                   | HIGH                          | LOW                 | P1             |
| T7 upfront checklist/cost/time              | HIGH                          | LOW                 | P1             |
| T9 upload UX suite                          | HIGH                          | HIGH                | P1             |
| T17/T18 i18n + script rendering             | HIGH                          | HIGH                | P1             |
| T19 WCAG 2.1 AA coverage                    | HIGH                          | MEDIUM              | P1             |
| T15/T14 status timeline + tracking          | HIGH                          | MEDIUM              | P1             |
| T16 help escape hatch (FAQ + contact)       | HIGH                          | LOW–MED             | P1             |
| T10 upload compression                      | MEDIUM                        | LOW                 | P1             |
| T22 trust/privacy messaging                 | MEDIUM                        | LOW                 | P1             |
| D1 six languages                            | HIGH                          | HIGH (scoped)       | P1             |
| D2 plain-language help system               | HIGH                          | MEDIUM              | P1             |
| D3 recommendation wizard                    | MEDIUM                        | MEDIUM              | P2             |
| D5 camera overlay guides                    | MEDIUM                        | LOW                 | P2             |
| D6 WhatsApp share                           | MEDIUM                        | LOW                 | P3 (cut-first) |
| Vault/group apps/AI tooling/rush tiers      | LOW (for this audience/scope) | HIGH                | Excluded       |

**Priority key:** P1 = must ship · P2 = ship if capacity · P3 = first candidate to cut · Excluded = deliberately out

## Competitor Feature Analysis

| Feature                    | iVisa                                          | Atlys                                              | Official portals (DS-160 / visa.gov.in class)        | Our approach (PRD + gaps)                                                  |
| -------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| Journey structure          | 3-step guided, part 1 before pay               | App-like discovery → scan → questionnaire → pay    | Single 90-min monolithic form                        | 5-stage linear w/ time estimates (matches best practice)                   |
| Data-loss protection       | Auto-save, resume                              | Cloud vault + autosave                             | 20-min silent timeout, ID+security-question recovery | Autosave + email backup code — **best-in-class if shipped well**           |
| Pre-submission checking    | Expert human review (paid)                     | Automated pre-check gate + rejection-risk alerts   | None (review print is last chance)                   | Validation engine + review page (T6) — automated, free                     |
| Photo/document tooling     | Photo guidance app                             | AI ICAO photo tool, OCR pre-fill                   | Format/size limits only                              | Static overlay guides + quality warnings + compression (no AI)             |
| Status transparency        | Email updates, order lookup                    | Push + WhatsApp live tracking, predicted timelines | Opaque statuses ("In Review")                        | Dated timeline w/ durations + next actions + guest tracking                |
| Payments                   | Cards/PayPal/Apple Pay, rush tiers             | Combined govt+service fee, UPI supported           | Limited methods                                      | UPI/Card/Netbanking, itemized, **full state machine incl. failed/pending** |
| Support                    | 24/7 chat/WhatsApp/email, 14 languages         | BOLO AI assistant + humans                         | None meaningful                                      | Translated FAQ + contact card (mocked channels)                            |
| Languages                  | 14, none Indian-regional                       | English/Hindi focus                                | English (+portal translations)                       | **6 incl. Tamil/Telugu/Kannada/Marathi — unique in category**              |
| Low-literacy accommodation | Simple forms, expert review                    | AI abstraction of complexity                       | None — assumes familiarity                           | Editorial plain-language help on every field                               |
| Trust signaling            | "Not a government agency" disclaimers, reviews | On-time guarantees, doc-vault security copy        | Institutional (but unfriendly)                       | Privacy/data-locality messaging + honest mock-data notices (gap fix T22)   |

## Sources

- iVisa homepage, help center ("How to apply"), App Store listing, independent reviews (thetravelhack.com 2026-08) — MEDIUM confidence (cross-checked)
- Atlys Play Store/App Store listings, atlys.com/tools, enterprise.atlys.com, localsinsider.com review (2026-06), ideausher.com feature analyses (2026-03) — MEDIUM confidence (cross-checked)
- GOV.UK Design System (error message, validation pattern), GOV.UK Service Manual (form structure, one thing per page), GDS design notes blog, UK Parliament & Home Office design systems — HIGH confidence for patterns (primary sources), MEDIUM as web-retrieved
- DS-160/CEAC: ceac.state.gov, travel.state.gov FAQs, ds160.io timeout recovery guide, GitHub us-visa-process-issues issue #6 (verified timeouts), VisaJourney forums, Smashing Magazine session-timeout accessibility analysis (2026-04) — MEDIUM confidence
- UPI payment UX: Krafton India frontend-engineer role spec (payment-state UX requirements), UPI smart-retry MVP documentation, lime-pay.com merchant integration guide (2026-04), RBI-share statistics via ResearchGate UX study (2025-10) — MEDIUM confidence
- Accessibility: WebAIM Million data (via reciteme.com, accessiguard.app 2026), govzu.com government accessibility-failure analysis (2026-05), W3C WAI Understanding SC 3.3.1 — MEDIUM confidence
- Indic localization: W3C Indic Layout Requirements (ilreq), Google Fonts/Tiro Typeworks complex-script design notes, Stack Overflow Devanagari clipping case (Noto Sans/Nirmala UI fallback metrics), indicweb.com — MEDIUM confidence

---

_Feature research for: guided Indian visa application portal (VisaReThink)_
_Researched: 2026-08-25_
