# Pitfalls Research

**Domain:** Mobile-first guided visa-application wizard (government-service-style, low digital literacy users, budget Android/3G, 6 languages, mocked backend)
**Researched:** 2026-08-25
**Confidence:** HIGH (storage/quota and WCAG claims verified against official docs + WebAIM Million 2026; UX claims from NNGroup/Baymard/Smashing research; performance claims from web.dev/Chrome team sources)

> Phase names below are *functional* ("Foundation", "Persistence", …). Map them to actual roadmap phases when the roadmap is written — the mapping table at the end is the authoritative cross-reference.

---

## Critical Pitfalls

### Pitfall 1: localStorage used as the persistence layer for uploaded documents

**What goes wrong:**
The PRD says "Session Storage: Browser localStorage simulates backend persistence." Documents (passport scans, photos) stored in localStorage hit a hard ~5 MB per-origin ceiling almost immediately — a single phone-camera JPEG is 3–8 MB before compression. Writes start throwing `QuotaExceededError`, which developers rarely catch, so uploads silently fail to persist and the user's documents vanish on resume. Worse: even if you stay under quota, browsers evict best-effort storage under disk pressure (LRU eviction), Safari's ITP deletes *all* script-writable storage after 7 days without user interaction, private/incognito modes slash quotas (~300 MB cap in Chrome incognito, ~5% of disk), and "clear cookies and site data on exit" settings wipe everything.

**Why it happens:**
localStorage is the simplest API and the PRD names it explicitly. Developers conflate "small wizard state" (fine for localStorage) with "files" (catastrophically wrong API).

**How to avoid:**
- Two-tier persistence by contract: **form state** (strings, small JSON) → localStorage/sessionStorage; **documents** (Blobs/Files) → IndexedDB via a promise wrapper (`idb` / `idb-keyval`). Official web.dev guidance: localStorage is string-only, ~5 MB, synchronous, blocks main thread; IndexedDB/OPFS handle GiBs and binary natively.
- Wrap *every* storage write in try/catch handling `QuotaExceededError`; show an honest "storage full — remove a document" state rather than pretending the save happened.
- Call `navigator.storage.persist()` to opt out of pressure-eviction, and `navigator.storage.estimate()` to show remaining space next to uploads.
- Compress/downscale images client-side *before* storing (canvas resize to ≤2 MB) — this also fixes the phone-photo-size problem.
- Store a schema/version key alongside drafts so a future shape change doesn't corrupt restores.

**Warning signs:**
Any code path doing `localStorage.setItem(..., base64OrFileData)`; no try/catch around storage writes; QA testing only with small PDFs on desktop Chrome; no handling for "resume shows checklist but documents are gone."

**Phase to address:** Persistence/data-layer work in the Foundation phase — the storage abstraction must exist before the wizard and upload features build on it.

---

### Pitfall 2: Hydration mismatches and SSR crashes from reading localStorage during render (Next.js)

**What goes wrong:**
Next.js pre-renders on the server where `window`/`localStorage` don't exist. Reading persisted wizard state during render either crashes SSR (`localStorage is not defined`) or renders different HTML on server vs. client → React hydration mismatch errors, and in App Router versions a mismatch can tear down the whole tree and re-render client-side — visibly flashing and slow on exactly the low-end devices you're targeting.

**Why it happens:**
The natural instinct — `useState(() => localStorage.getItem(...))` — runs during SSR too. The correct patterns are documented but non-obvious.

**How to avoid:**
Follow the patterns from official Next.js docs/examples:
1. Read browser storage inside `useEffect` (post-mount), rendering a stable server-side fallback first;
2. Or `useSyncExternalStore` with `typeof window` guards returning safe defaults during SSR;
3. Or lazy `useState` initializer guarded by `typeof localStorage !== "undefined"` with `suppressHydrationWarning` on the specific element that may differ.
Centralize ALL storage access behind one hook/module (e.g. `useDraft()`) so the guard exists in exactly one place. Never branch UI on storage during first paint — restore state *after* mount with a brief skeleton.

**Warning signs:**
"Hydration failed because the initial UI does not match" in console; `window is not defined` in build logs; any component importing localStorage outside a `'use client'` effect/store subscription.

**Phase to address:** Foundation phase (app shell + persistence hooks). This is architectural — retrofitting means touching every component.

---

### Pitfall 3: Autosave theater — "your progress is saved" that doesn't survive reality

**What goes wrong:**
A "Saved ✓" indicator exists, but saves fire only on step transitions (or only on a 10 s interval with no flush-on-unload). A refresh, tab crash, accidental back-swipe, or OS app-kill loses everything since the last transition. Resume drops users on Step 1 with an empty form, or restores data but not their place. For this product, data loss is the #1 stated pain point of the portals being replaced — shipping a subtle version of it invalidates the core value proposition. Note also: session timeouts destroying entered data are a formal WCAG failure (SC 2.2.5 Re-authenticating, Failure F12) — this is an accessibility issue, not just UX polish.

**Why it happens:**
Autosave is tested in ideal conditions (desktop, foreground tab, fast device). Nobody kills the tab at random moments during development.

**How to avoid:**
- Persist debounced on every field change (e.g. 1–2 s debounce) **plus** synchronous flush on `visibilitychange`→hidden, `pagehide`, and step transitions.
- Save a draft envelope: `{schemaVersion, currentStep, maxStepReached, fields, updatedAt}` — resume lands on the furthest incomplete step, never Step 1.
- Show honest save state: "Saved just now" / explicit "Not saved — retry" on failure (per save-and-resume research, silent failure is what destroys trust).
- Create the draft record on the *first* meaningful input, not after Stage 2.
- Test protocol: kill the tab mid-typing on every stage, background the app for 30 min (Android may freeze/kill it), toggle airplane mode, then resume. Every artifact must survive.
- Keep a "resume context card" on return: which stage, what's missing, one button to continue (treats leaving as normal, not failure).

**Warning signs:** Save logic coupled to a "Next" button handler; no `pagehide`/`visibilitychange` handlers; manual QA never closes the tab mid-form; no `updatedAt` timestamp shown to users.

**Phase to address:** Wizard-core phase (built together with the flow itself, immediately after the persistence layer).

---

### Pitfall 4: Accessibility attempted as a final pass → structural WCAG 2.1 AA failure

**What goes wrong:**
WCAG AA is a hard requirement (Lighthouse 90+ target), but teams build the whole wizard first and audit last. Retrofitting fails structurally because the worst offenders are baked into component design: the WebAIM Million 2026 found six failure types cause 96% of all detected errors — low contrast text (83.9% of pages), missing alt text (53.1%), missing form input labels (51%), empty links (46.3%), empty buttons (30.6%), missing document language (13.5%). Three of the six are *form-specific*, and this product is one long form. Additionally, multi-step flows have a11y traps Lighthouse can't see: focus not moved to new step content on navigation (screen-reader users are stranded on the old step), validation errors not announced (missing `aria-live` / `aria-describedby` / `aria-invalid`), and progressively-disclosed fields left in the tab order.

**Why it happens:**
Green checkmarks and colored error states get designed visually first; contrast and label wiring feel like decoration; "we'll run Lighthouse at the end" is the plan.

**How to avoid:**
- A11y acceptance criteria in *every* UI story: every input has a programmatic label (`<label for>`); icon-only buttons have accessible names; color contrast ≥4.5:1 body / ≥3:1 large text & UI components; color never the sole signal (pair red with icon + text).
- Error contract per WCAG 3.3: error linked via `aria-describedby`, `aria-invalid="true"` set/cleared, error summary at top with anchor links to fields, focus moved to first error or the summary on failed submit, `aria-live="polite"` region for async/system errors.
- Focus management contract for the stepper: on step change, move focus to the step heading; Back/forward preserve scroll; hidden conditional fields removed from the a11y tree and tab order.
- `<html lang>` updates dynamically on language switch (also fixes the "missing document language" class outright).
- CI gate from the first sprint: axe-core in component tests + Lighthouse CI threshold ≥90 — a regression fails the build, not a backlog ticket.

**Warning signs:** Components using placeholder-as-label; green/red alone distinguishing valid/invalid; no skip-to-content link; stepper implemented as divs with click handlers (no semantics); Lighthouse run for the first time after "feature complete."

**Phase to address:** Design-system/Foundation phase sets the accessible primitives; every subsequent UI phase enforces; a dedicated hardening pass verifies end-to-end (keyboard-only + screen reader walkthrough of the whole journey).

---

### Pitfall 5: Indic web fonts quietly destroy the performance budget

**What goes wrong:**
Six languages mean five Indic scripts (Devanagari, Tamil, Telugu, Kannada + Latin). Naively self-hosting a webfont per script per weight ships hundreds of KB–MB per script on 3G: Noto Sans Devanagari carries ~954 glyphs (vs ~200 for Latin), and Indic shaping *requires* full OpenType GSUB/GPOS tables (conjuncts, vowel reordering) so aggressive subsetting risks broken conjunct rendering that's invisible in casual review. Result: LCP blows past 2.5 s, CLS spikes from font swap, and the "fast on 3G" requirement is dead on arrival.

**Why it happens:**
Font strategy is decided once in setup and never revisited; the dev machine loads fonts instantly from cache.

**How to avoid:**
- **Android ships Noto locally**: put local system Noto families first in the font stack (`'Noto Sans Devanagari', 'Noto Sans Tamil', ... , system-ui`) so most Indian Android users download *zero* font bytes; ship webfont subsets only as fallback for other platforms.
- If shipping webfonts: WOFF2, `unicode-range` splitting, one weight per script (regular + bold max), `font-display: swap` with `size-adjust`/fallback metrics to kill CLS.
- Never subset Indic below the full Unicode block + required ligature glyphs; test conjuncts (क्ष, ஸ்ரீ, స్త్రీ) after any subsetting.
- Budget fonts explicitly in the performance budget (see Pitfall 9).

**Warning signs:** `@next/font`/Google Fonts link including all six families up front; font requests >200 KB total on a cold 3G throttle; layout shift when language switches.

**Phase to address:** Design-system phase (typography tokens chosen once, here).

---

### Pitfall 6: i18n retrofitted after English is hard-coded

**What goes wrong:**
English-first development bakes in failure modes that are exponentially expensive to fix later: strings concatenated from fragments (`"Your passport expires in " + year`) cannot be reordered grammatically in Tamil/Telugu/Kannada/Hindi/Marathi; `if (count === 1)` plural logic breaks (Indic languages have different plural categories); hardcoded `DD/MM/YYYY` display vs ISO storage drifts; physical CSS (`margin-left`, `text-align:left`, directional icons) makes the RTL-readiness the PRD asks for a rewrite instead of a config flag; missing `lang` attributes break screen-reader pronunciation of Hindi content (wrong voice/syllabification).

**Why it happens:**
Translation feels like a "later content task," so nobody builds the machinery until Stage-N when there are hundreds of hardcoded strings.

**How to avoid:**
- Extract all strings to message catalogs from day one (e.g. `next-intl`/ICU MessageFormat); zero literal user-facing strings in components — enforce with ESLint rule + pseudolocalization locale (`en-XA`) that wraps every string in `[!! … !!]`: anything rendering unwrapped is hardcoded.
- ICU plurals/select for every count-dependent message; `Intl.DateTimeFormat`/`Intl.NumberFormat` for dates/numbers/₹ amounts (never manual formatting).
- CSS logical properties only (`margin-inline-start`, `padding-inline-end`, `text-align: start`) from the first component; mirror directional icons via `[dir="rtl"]` selectors; then RTL support later ≈ adding `dir="rtl"` + one test pass.
- Set `lang` on `<html>` per active locale; mark embedded English terms (passport numbers, brand names) so bidi/shaping stays correct.
- Translate the *whole* surface: error messages, validation copy, tooltips, status timeline labels, SMS/email templates. Half-translated government forms destroy trust faster than English-only.

**Warning signs:** Any template literal containing prose in a component; a `formatDate()` with a hardcoded pattern; CSS grep finds `margin-left`; language switcher added and half the error states stay English.

**Phase to address:** Foundation (i18n scaffolding + logical-CSS rule) and enforced continuously; a dedicated localization phase does translation + native-speaker review, not plumbing.

---

### Pitfall 7: Mocks without contracts — mock logic smeared through components

**What goes wrong:**
With eight mocked backend services (payment, OTP, passport lookup, OCR, email/SMS, tracking, background check, interview scheduling), the common failure is calling mock behavior inline inside UI components (`if (isMock) setTimeout(success…)` scattered everywhere). Consequences: (a) the "swap in real integration later" story the PRD tells is fiction — there's no seam to swap; (b) error/timeout/pending states are never simulated, so every failure UI is dead code that has never rendered; (c) demos confuse people into thinking a payment really happened.

**Why it happens:**
Mocks feel trivial, so they get no architecture. Each developer invents a local fake.

**How to avoid:**
- Define one typed service interface per domain (e.g. `PaymentService.charge(): Promise<Receipt>`) at project start; all components depend only on interfaces; a single `MockPaymentService` (and later a real one) implements them.
- Every mock implements the full outcome matrix: success, failure, timeout/pending, and validation-reject — driven by scenario config (e.g. a dev panel or seeded card numbers "fail" the payment), not random chance (randomness makes bugs unreproducible).
- Simulate realistic latency (800 ms–3 s) so loading skeletons, disabled-button states, and double-submit guards are actually exercised.
- Visible demo-mode affordance ("Prototype — no real payment is processed") on payment/OTP screens, plus fake-but-obviously-fake data (no real-looking card/OTP prompts).
- Mocks return the same shapes a real gateway would (receipt IDs, status enums, timestamps) so UI code doesn't special-case mock data.

**Warning signs:** Any `import { mockX }` inside a page component; grepping "mock" yields hits across dozens of files; no mock ever returns `Promise.reject`; loading spinners flash for <50 ms in every demo.

**Phase to address:** Architecture decision in Foundation; per-feature phases implement mocks against the contract.

---

### Pitfall 8: Scope explosion — building a fake backend instead of thin fakes

**What goes wrong:**
"Mock the backend" metastasizes into building a real one: a database of applications, a status-transition engine with timers, an admin console, persistent accounts. In a *single-milestone* project (explicit constraint), two weeks of fake-infrastructure engineering means the actual UX differentiators (guidance copy, upload UX, accessibility) get squeezed. The second flavor: mocking each service at high fidelity (full Razorpay checkout emulation, OTP screens with countdowns) burns days on pixels that prove nothing.

**Why it happens:**
Mocks are fun; fidelity feels like quality; there's no milestone-2 to defer to, so nothing pushes back except deliberate scoping.

**How to avoid:**
- Rule: a mock is a **scripted scenario**, not a system. Status timeline = a static array advanced by a "simulate next status" action, not a cron engine.
- Time-box each mock; if a mock exceeds ~half a day, cut its fidelity (return canned payloads).
- Track a running "mock inventory" against the PRD §4 table — every row gets: interface, outcomes supported, owner phase. Anything beyond the table needs justification.
- Prefer UI-level fakes (component states) over logic-level fakes (state machines).
- Explicitly de-scope in the roadmap: notification center ≠ one toast + one saved receipt view.

**Warning signs:** Mock code gains its own tests/persistence/migrations; discussions about "how should our fake Redis work"; status engine has unit tests; someone proposes seeding a database for a prototype.

**Phase to address:** Roadmap planning (cap mock scope explicitly per phase) + enforced during each feature phase.

---

### Pitfall 9: Performance treated as a launch-week audit, not a budget — INP death on budget Android

**What goes wrong:**
React/Next.js SPAs accumulate bundle weight invisibly; on the target hardware the bill arrives brutally: a 1 MB JS bundle takes ~3–4 s *of main-thread time* to parse+compile on a Moto-G4-class device, and hydration adds 1–2 s where the page *looks* interactive but isn't — taps queue up and INP (target ≤200 ms) craters. Form wizards are interaction-dense (every field tap, stepper click), so they feel the worst INP decay. Meanwhile fonts/images/CSS pile on LCP. "Core Web Vitals Good" is a stated constraint, and discovering this post-launch means re-architecture (code splitting boundaries, dropping libraries).

**Why it happens:**
Developers test on laptops over Wi-Fi; Lighthouse defaults emulate a *4G* mid-tier phone, gentler than real low-end + 3G; nothing fails the build when the bundle grows.

**How to avoid:**
- Set an explicit budget at project start and enforce in CI (bundlesize/size-limit): initial JS ≤ ~110–150 KB brotli per route, total transfer ceiling ~220–280 KB for mid-range mobile/fast-3G profile (derived from CWV budgets for that device class).
- Route-level code splitting from day one (each wizard stage a route/chunk); Server Components for static shells; heavy deps (date pickers, PDF viewers, camera libs) loaded lazily only on the screens that need them.
- Test with 4×–6× CPU throttling + Slow 3G in DevTools as part of the definition-of-done per stage screen, not at the end.
- Watch INP specifically on stepper transitions and validation (long tasks >50 ms block taps); yield with `scheduler.yield()` or split work if needed.
- Client-side image compression for uploads also protects memory-constrained devices (decoding an 8 MP photo on a 2 GB-RAM phone is expensive).

**Warning signs:** First-load JS figure climbing past ~250 KB gzipped in `next build` output; any animation jank in the emulator you've been ignoring; "we'll optimize later" said twice.

**Phase to address:** Budget set in Foundation; enforced every phase via CI; dedicated perf-hardening pass before completion.

---

### Pitfall 10: Service-worker cache serves a stale, broken app after deploys

**What goes wrong:**
The offline-PWA requirement introduces the classic trap: a cache-*first* strategy on HTML/navigation means after every deploy users get the old HTML, which references old hashed JS chunks — mixed old/new builds fail, or users are simply stuck on last week's app forever. Installed PWAs have no address bar and **no way to hard-refresh**; Ctrl+Shift+R doesn't reliably bypass the worker. The failure mode is sinister: the system working as designed is indistinguishable from broken.

**Why it happens:**
Starter service workers use cache-first because it makes offline demos work immediately; nobody deploys twice during development.

**How to avoid:**
- Navigation/HTML requests: **network-first**, falling back to cache only when offline (the HTML maps to content-hashed chunks; serving it stale pins dead references).
- Static assets (`/_next/static/**`): cache-first is safe *only because* filenames are content-hashed.
- Version the cache name on every deploy and delete old caches in `activate` — automate the bump in the deploy script so forgetting is impossible (a deploy that refuses to run with an unchanged version beats a checklist).
- Register the SW after the page `load` event; precache a minimal, curated asset list (data-plan users pay for precache bytes).
- Verify deploys from outside your browser: `curl -s https://site/sw.js | grep -oE "app-v[0-9]+"`.
- Offline form-submission behavior must be explicit: queue-and-retry with a visible "queued, will send when online" state — never silently drop a submission into a void.

**Warning signs:** A fix deployed but reproducible "old" behavior persists on a device that visited before; cache name is a constant never changed since creation; no `activate` cleanup handler.

**Phase to address:** PWA/offline phase — but decide the caching-strategy matrix (network-first navigations etc.) in that phase's plan, not discovered via bug report.

---

### Pitfall 11: Validation extremes — lockout via over-validation or garbage-in via under-validation

**What goes wrong:**
Two symmetric failures:
- **Over-validation:** Strict regexes reject legitimate documents (passport formats vary by issuing country and era; names contain single letters, hyphens, apostrophes; Indian addresses defy parsing). Live validation fires mid-keystroke ("AA12345" flagged invalid while still typing), or the submit button stays permanently disabled with no visible reason — disabled-button-with-hidden-reason approaches ~100% abandonment in usability research. Low-literacy users can't resolve arbitrary format demands and abandon.
- **Under-validation:** Garbage accepted per-field then detonates at the review step ("error four steps back"), or at mock-verification, forcing a full backtrack tour.

**Why it happens:**
Validation is written per-field by different people with no timing policy; strictness feels like "quality"; nobody represents the user whose name doesn't match the regex.

**How to avoid:**
Adopt one written validation policy:
- Timing: validate on **blur** (never per keystroke), empty-required fields validated **only on submit/step-next**; once a field errored, re-validate live ("reward early, punish late"); success checkmarks only where they add information (complex fields like passport number), not for mere non-emptiness.
- Submit stays enabled; clicking it routes focus to the first error + summary list with jump links (hybrid model recommended by accessibility researchers — never trap users).
- Distinguish blocking errors from advisory warnings: passport-expiry <6 months = warn + "continue anyway?" (the PRD already models this correctly — generalize the pattern).
- Only constrain formats you can defend (Indian passport: letter+7 digits is defensible; "no hyphens in names" is not). Use `inputmode`/`autocomplete`/`enterkeyhint` so keyboards help instead of fight.
- Every rule needs a translated, plain-language message with a fix suggestion (WCAG 3.3) — an untranslatable regex error message is a smell the rule is too clever.

**Warning signs:** A shared validators.ts with 40 regexes and no comments citing sources; any `disabled={!isValid}` on primary buttons; QA log contains "couldn't proceed with valid data."

**Phase to address:** Wizard-core phase defines the policy; Personal-details and Upload phases apply it.

---

### Pitfall 12: Error messaging rebuilt ad hoc per screen (and untranslated)

**What goes wrong:**
Each feature invents its own error presentation: a toast here, a tooltip there, a modal somewhere else, generic "Invalid input" strings. Per NNGroup's error-design research: tooltips as the sole error carrier hide critical info (and tooltips don't exist on touch devices — directly relevant here); modal errors force memorization; validation summaries without field links make users hunt. Screen-reader users hear nothing unless errors are programmatically associated and announced. And in a 6-language app, error copy is the hardest, most-trusted text — leaving it as a developer-authored English afterthought guarantees the weakest experience exactly where trust matters most.

**How to avoid:**
- One error-presentation system in the design system: inline message adjacent to field (icon + text + color, never color alone), optional top summary with anchor links, `aria-describedby`/`aria-invalid` wiring, `aria-live` for async errors — components consume it, never hand-roll.
- Message taxonomy: `FIELD_REQUIRED` / `FORMAT_PASSPORT` / `FILE_TOO_LARGE` / `NETWORK_SAVE_FAILED`… each with plain-language copy + fix hint per language, reviewed by a native speaker, not machine-translated at runtime.
- System/network errors tell users what happened to their data ("Nothing was lost — we'll retry") — for this audience, ambiguity about data safety is the cardinal sin.
- Repeated-error escape hatch: 3+ occurrences of the same error = offer human help / alternative path (research-backed trigger).

**Warning signs:** More than one error-rendering component in the codebase; error strings inline in components rather than catalogs; any error reachable only by hover.

**Phase to address:** Design-system phase (components + taxonomy); localization phase (translations + review).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Direct `localStorage` calls sprinkled in components | Fast prototyping | Can't add quota handling, sync, or IndexedDB migration without touching everything | Never — wrap behind one module from day one |
| English strings inline, "translate later" | Velocity weeks 1–3 | Full-codebase extraction sweep + missed strings in production | Never (extraction cost only grows) |
| Physical CSS properties (`margin-left`) | Familiarity | RTL becomes a stylesheet fork | Never — logical properties cost nothing extra |
| Mocks returning instant results (0 ms) | Snappy demos | All loading/disabled/timeout UI never exercised; race conditions shipped blind | Only in throwaway spike screens |
| Skipping focus management between wizard steps | Hours saved | Screen-reader journey is unusable; fixing later touches every step component | Never |
| Uncompressed full-size phone photos stored/uploaded | Skip image pipeline | Quota blowouts, 3G upload timeouts, memory crashes on 2 GB devices | Never — compress at capture |
| One giant client bundle (no route splitting) | Simple mental model | Misses INP/LCP targets on target hardware; late splitting is invasive | Acceptable only until Stage screens exist, then split |

## Integration Gotchas

Even mocked integrations have traps:

| Integration (mocked) | Common Mistake | Correct Approach |
|----------------------|----------------|------------------|
| Payment gateway | Mock resolves instantly and always; UI never shows processing/declined states | Scenario-driven outcomes incl. declined + 2 s latency; receipt object shaped like real gateway response |
| OTP verification | Building a full SMS UI with real-code expectations, confusing testers | Auto-fill mock code with a visible "demo" banner; one screen, no delivery simulation |
| Passport/gov lookup | Hard-coding "success" inside the personal-details component | `LookupService.verifyPassport()` mock with latency + one failure scenario; component agnostic |
| Email/SMS backup | Console.log only — resume-code flow untestable | Mock delivers code to an in-app "inbox" panel so cross-device resume is demonstrable |
| Status tracking | Live status engine with timers (scope creep) or fully static screen with no interactivity | Scripted transitions triggered by explicit "advance status" demo control |
| Document OCR/quality check | Promising "blurry image detected" (PRD mentions quality warnings) without any heuristic | Honest scope: file-type/size/format checks real; "quality warnings" either dropped or a simple resolution check, labeled as such |
| File uploads | Trusting `File.type`/extension; ignoring HEIC (iPhone default) and huge JPEGs | Validate magic bytes where cheap; accept/convert HEIC or clearly reject with guidance; compress before persisting |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Monolithic client bundle + full hydration | Taps delayed 500 ms+, LCP >4 s on throttled CPU | Route-splitting, RSC/static shells, CI bundle budget (~150 KB brotli/route) | Immediately on low-end devices; invisible on dev laptops |
| Six-script font payload | 1–3 s LCP delay, FOIT/CLS | Local-Noto-first stacks, unicode-range, 1 weight/script | Cold load, first visit, 3G |
| Base64-in-localStorage documents | Jank on save (sync main-thread), quota crashes | Blobs in IndexedDB; canvas downscale | First 5 MB of uploads — i.e., one photo |
| Synchronous autosave on every keystroke | Typing lag on budget phones | Debounce 1–2 s + flush on pagehide | As soon as drafts exceed a few KB |
| Precache-everything service worker | Data-hungry first visit; install competing with page load | Curated precache manifest; register after `load` | First visit on metered data |
| Layout shift from late-loading help text/tooltips/fonts | CLS >0.1, mis-taps | Reserve space (`size-adjust`, fixed heights for help regions) | Every cold navigation |

## Security Mistakes

Domain-specific (prototype context — no real money/government calls, but realistic-fake PII):

| Mistake | Risk | Prevention |
|---------|------|------------|
| Realistic-looking real-format passport numbers/names in seeds or screenshots | Demo data mistaken for leaked real data; normalizing careless PII display | Clearly synthetic values (e.g. X-prefix passports), a visible "sample data" watermark in demos |
| Personal data lingering in localStorage indefinitely | Contradicts PRD's "cleared on logout" promise; shared-device privacy issue for the exact target audience | Implement clear-on-completion/logout for real; auto-expire drafts (e.g. 30 days) with notice |
| Guessable sequential reference numbers | Users can enumerate others' applications when tracking-by-reference ships (even mocked) | Random opaque refs (e.g. `VRT-XXXXXX` from CSPRNG) — cheap now, correct forever |
| Backup/resume codes that are short/guessable | Draft hijack narrative in a prototype erodes credibility of the flow | 8+ char random codes; rate-limit resume attempts even in mock |
| Storing files with original filenames rendered in UI | Path/name injection into DOM, confusing long names breaking layout | Sanitize/display generated names; escape everything (standard, but upload UIs forget) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Tooltip-only contextual help | Zero discoverability on touch; low-literacy users never find it | Inline example text under fields (always visible), expandable "show me how" with illustration |
| Lying progress indicator (25% → 100% jumps; branching hides steps) | Users stop trusting progress; abandonment at surprise sub-steps | "Step 2 of ~5" phrasing; announce skipped branches ("we'll skip sponsorship — not needed") |
| Browser-back exits the wizard entirely | Accidental loss of place; fear of going back to fix errors | Back button returns to previous step preserving data; intercept/guard history exits |
| Wrong mobile keyboard (text for OTP, no `inputmode=numeric`) | Extra taps, higher error rate for low-literacy users | `inputmode`, `autocomplete`, `enterkeyhint` on every input; OTP auto-advance boxes |
| Date entry as three free-text fields or US format | "Date of issue" confusion is a named pain point; DD/MM vs MM/DD ambiguity | Native `type="date"` (locale-aware on Android) or guided DD-MM-YYYY with live formatted echo |
| Time estimates promised but static/wrong ("Stage 2: 3 min") | Erodes the transparency promise the product stands on | Measure real medians post-build; adjust copy; show ranges |
| Success states without next-step guidance | "Paid — now what?" dead ends (a named current-portal pain) | Every terminal state lists concrete next actions + saved receipt/reference |

## "Looks Done But Isn't" Checklist

- [ ] **Autosave:** Works after tab *kill* mid-field on every stage — verify resume lands on the right step with documents intact (not just a refresh on desktop Chrome).
- [ ] **Accessibility:** Passes keyboard-only + screen reader full journey (step-change focus moves, errors announced, stepper operable by arrows) — verify Lighthouse alone proves almost nothing for wizards.
- [ ] **i18n:** Switches language *mid-flow* without resetting the form, and error/validation/status copy translates too — verify dates/numbers/₹ reformat per locale.
- [ ] **Offline/PWA:** Airplane-mode reload shows cached shell with honest offline state; queued submission survives reconnect — verify after a fresh deploy (stale-SW check).
- [ ] **Uploads:** Handles 8 MB phone JPEG + HEIC + scanned multi-page PDF — verify compression, quota messaging, and camera capture on a real Android device.
- [ ] **Payment mock:** Declined + timeout + retry paths render; double-tap on Pay can't create two receipts — verify loading states actually appear (mock latency ≥1 s).
- [ ] **Resume across devices:** Backup-code flow demonstrably moves draft (incl. documents or their metadata) between two browsers — verify the code isn't case/spacing fragile.
- [ ] **Duplicate detection:** Same passport + active app produces a helpful, non-shaming interstitial with a path to the existing application — verify it triggers on resume-too, not only fresh starts.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| localStorage-for-files already shipped | MEDIUM | Introduce `idb-keyval` behind the same storage-module API; migrate blobs on first load; add quota try/catch at the single choke point |
| Hardcoded English everywhere | HIGH | Mechanical extraction sweep (ESLint codemod) → catalogs; expect 1–2 phases of churn + missed-string whack-a-mole |
| WCAG retrofit post-build | HIGH | Prioritize by impact order: labels → contrast tokens → focus management → aria error wiring; expect component rewrites for stepper/error UI |
| Mocks entangled in components | MEDIUM | Define service interfaces; move inline mock logic out one feature at a time; UI code stops changing once behind interfaces |
| Stale-SW affecting real users | LOW–MEDIUM | Ship worker that network-firsts navigations + bumps cache + unregister fallback page; communicate "refresh twice" interim |
| Bundle over budget late | MEDIUM | Route-split stages, dynamic-import heavy widgets, drop/replace heaviest deps (`npm ls` + bundle analyzer); 1–2 focused phases |
| Scope explosion underway | LOW (if caught) | Freeze mock inventory; downgrade fidelity of unbuilt mocks to scripted payloads; cut demo controls before cutting UX polish |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. localStorage for documents | Foundation (storage layer) | Unit test: 6 MB blob round-trips; QuotaExceeded handled; estimate() surfaced |
| 2. Hydration/SSR mismatch | Foundation (app shell) | Build passes SSR; zero hydration warnings on every route; single storage hook exists |
| 3. Autosave theater | Wizard core | Automated test: seed draft → kill context → resume asserts step + fields + docs |
| 4. Accessibility last | Foundation (primitives) + all UI phases + hardening pass | axe clean in CI; keyboard+SRA walkthrough script passes; Lighthouse ≥90 gate |
| 5. Font payload | Design system | Cold-load font transfer <~150 KB total on 3G throttle; conjunct smoke-test per script |
| 6. i18n retrofit | Foundation (scaffolding) + localization phase | Pseudolocale build: zero unwrapped strings; `dir="rtl"` smoke page sane; lang attr switches |
| 7. Mocks without contracts | Foundation (service interfaces) | No direct mock imports outside service layer (lint rule); every mock has ≥3 outcomes |
| 8. Mock scope explosion | Roadmap planning + each feature phase | Mock inventory table matches PRD §4 rows; no mock exceeds time-box |
| 9. Perf budget ignored | Foundation (budget) + every phase (CI) | size-limit/Lighthouse CI red-line; throttled manual pass per stage |
| 10. Stale SW | PWA/offline phase | Deploy-twice test on a previously-visited device; curl cache-version check in release notes/runbook |
| 11. Validation extremes | Wizard core (policy) + details/upload phases | Policy doc exists; no disabled-primary-buttons; override path for advisory rules; blur-timing in tests |
| 12. Ad-hoc errors | Design system + localization phase | Single error-component in codebase; error taxonomy catalog complete in all 6 languages |

**Suggested ordering implication for the roadmap:** Foundation (storage + hydration-safe persistence hooks + service-interface mocks + a11y primitives + i18n scaffolding + perf budget) must precede wizard construction; wizard core (flow + autosave + validation policy) precedes stage-specific features (upload, payment, tracking); PWA/offline and localization/hardening come after feature-complete, with a11y/perf gates running throughout rather than as final phases.

## Sources

- web.dev — *Storage for the web* (2024): localStorage limits/eviction, IndexedDB/OPFS guidance — HIGH
- MDN — *Storage quotas and eviction criteria* (updated 2026): quota tables, `QuotaExceededError`, Safari ITP 7-day eviction — HIGH
- WebAIM Million 2026 (+2025/2024 trend data): six WCAG failure types = 96% of errors; contrast 83.9%, labels 51% — HIGH
- W3C WAI — *Understanding SC 2.2.5 Re-authenticating* + *Failure F12*: session-timeout data loss as WCAG failure — HIGH
- Nielsen Norman Group — *Wizards: Definition and Design Recommendations*; *10 Design Guidelines for Reporting Errors in Forms* — HIGH (established UX research)
- Smashing Magazine — *A Complete Guide To Live Validation UX* (2022): late-validation, reward-early/punish-late, disabled-button abandonment — HIGH
- Baymard Institute — inline validation research (31% of sites lack it) — HIGH
- Byrne-Haber — *Inline Field Validation vs. Constantly Active Submit* (2026); Accessalyze — *Accessible Error Messages, WCAG 3.3* (2026) — MEDIUM–HIGH
- Chrome for Developers (Workbox) — *Expectations around service worker deployment*; MDN PWA Caching guide — HIGH
- Post-mortems: Daniel Joffe, *Why a service worker serves stale chunks after a deploy* (2026); FromZeroToShip, *PWA Still Shows the Old Version After Deploy* (2026) — MEDIUM (single-source but consistent with Workbox docs)
- Next.js official docs/examples via Context7 (`/vercel/next.js`): static-exports browser-API guidance, preventing-flash-before-hydration guide, theme-switcher localStorage pattern — HIGH
- Google Fonts/Noto specimens: Noto Sans Devanagari (954 glyphs), Noto Sans Tamil UI (244 glyphs); web.dev *Optimize web fonts*; Indic shaping/OpenType feature requirements (GSUB/GPOS, conjunct testing) — MEDIUM–HIGH
- Localization failure-pattern guides (localization.guide 2026, intlpull 2026, simplelocalize 2026, i18n-l10n pseudolocalization 2026) + web.dev *Internationalization*: concatenation, ICU plurals, logical properties, en-XA/ar-XB pseudo-locales — MEDIUM–HIGH
- webvitals.tools *JavaScript Performance Guide* + performance-budget calculator (2026); web.dev *Web Vitals* thresholds: parse-cost figures (Moto G4 ~1 MB ≈ 3–4 s), INP ≤200 ms, mid-range-mobile budget tables (~110–150 KB brotli initial) — HIGH for thresholds, MEDIUM for exact device-class byte tables
- Project artifacts: `.planning/PROJECT.md`, `visarethink/indian_visa_prd.md` (§4 mock table, §6 scale/safety, §10 risks)

---
*Pitfalls research for: mobile-first guided visa application wizard (VisaReThink)*
*Researched: 2026-08-25*
