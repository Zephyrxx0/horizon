# Product Requirements Document: Reimagined Indian Visa Service Portal

## Executive Summary

Current Indian visa application portals (iVisa, visa.gov.in, and VFS partner sites) create unnecessary friction for citizens applying for visas. This PRD proposes a redesigned experience that prioritizes **clarity, mobile accessibility, and step-by-step guidance** for first-time and returning applicants.

---

## 1. PROBLEM STATEMENT

### Who is facing the problem?

- **Primary users**: Indian passport holders applying for visas abroad (students, professionals, tourists, business travelers)
- **Secondary users**: First-time international travelers with limited digital literacy
- **Device context**: Users on budget Android phones, 3G/4G connections, using mobile-first platforms
- **Geographic context**: Users across India with varying English proficiency

### What is difficult about the current experience?

#### Pain Points (Current State)

| Problem                           | Impact                                                                     | User Quote                                                                            |
| --------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Unclear requirements**          | Users submit incomplete applications, leading to rejections                | "I didn't know which documents I needed until they rejected my application"           |
| **Non-linear workflow**           | Users get lost jumping between sections; no clear sense of progress        | "Is this step done? Do I submit now or later? The form doesn't tell me."              |
| **Poor mobile experience**        | Forms break on mobile; small buttons, unreadable text, difficult scrolling | "On my phone, the form is impossible to fill. Text overlaps. Buttons are tiny."       |
| **No status clarity**             | Users don't know what "In Review" means; no next steps communicated        | "My application has been 'In Review' for 3 weeks. What happens now?"                  |
| **Confusing payment flow**        | Multiple payment options, unclear total costs, unexpected platform fees    | "I paid ₹5000 but the site wanted ₹8000 more. Where did the extra charges come from?" |
| **Error messages unhelpful**      | Generic errors like "Invalid input" don't say what's wrong                 | "The form just says 'Error in Document Upload' but my PDF is fine."                   |
| **No support for lower literacy** | Technical jargon, no guidance icons, assumes digital familiarity           | "What is 'date of issue'? Is that when I got my passport or when it was made?"        |
| **No progress recovery**          | Session timeouts lose all entered data                                     | "My application timed out. Now I have to start over."                                 |

---

## 2. SOLUTION OVERVIEW

### What did we change?

#### Core Philosophy: **"Guided Journey, Not a Form"**

Instead of a traditional form interface, redesign as a **step-by-step guided journey** where:

- Users always know "where am I?" and "what's next?"
- Every field has context and examples
- Mobile-first interactions with large touch targets
- Progress is persistent and visible
- Errors are constructive, not punitive

### Key Changes

#### 1. **Linear, Guided Workflow**

- **From**: 20-field form with no indication of progress
- **To**: 5 clear stages with visual progress indicator and time estimates
  - Stage 1: Visa Type & Destination Selection (1 min)
  - Stage 2: Personal Details (3 min)
  - Stage 3: Document Upload (5 min)
  - Stage 4: Payment & Verification (2 min)
  - Stage 5: Confirmation & Tracking (1 min)

#### 2. **Mobile-First Design**

- **From**: Desktop-centric design (forms squeezed onto mobile)
- **To**:
  - 48px minimum touch targets (vs current ~24px)
  - Typography sized for 5" screens (14px base → readable)
  - Auto-filling and smart defaults to reduce typing
  - One question per screen when appropriate
  - Full-width inputs and buttons

#### 3. **Contextual Help & Accessibility**

- **From**: "Passport Number" (what exactly?)
- **To**: "Passport Number" + example ("AA1234567") + tooltip icon + auto-format
- **From**: Generic "Upload Documents" section
- **To**: Document checklist with:
  - Exactly which pages to upload (e.g., "Pages 2-3 of your passport")
  - Correct file format (PDF, JPG)
  - Size limits with current file size shown
  - Sample/template downloads where possible

#### 4. **Real-Time Feedback & Validation**

- **From**: Submit → Error page → Frustration
- **To**:
  - Field-level validation as user types
  - Green checkmarks when fields are valid
  - Inline help text: "Your passport expires in 2024 — that's fine!"
  - Prevent submission of incomplete applications

#### 5. **Progress Persistence**

- **From**: Session timeout = lost data
- **To**:
  - Auto-save every 10 seconds (mocked)
  - Local browser storage for form data
  - "Continue Application" for returning users
  - Email backup code to resume on any device

#### 6. **Status Transparency**

- **From**: "In Review" (what does that mean?)
- **To**:
  - "Documents received (Feb 12) → Under assessment (Feb 13-15) → Interview scheduled (Feb 18)"
  - Expected timeline for each status
  - Next action required from user (if any)
  - Real-time notifications (mocked)

---

## 3. WHY THIS VERSION IS BETTER

### Metrics & Justification

| Dimension               | Current                     | Proposed      | Improvement                                      |
| ----------------------- | --------------------------- | ------------- | ------------------------------------------------ |
| **Completion Rate**     | ~62% (estimated)            | 85%+          | Clearer steps = fewer drop-offs                  |
| **Time to Submit**      | 25-40 min                   | 12-18 min     | Linear flow, smart defaults, auto-fill           |
| **Mobile Usability**    | Poor                        | Excellent     | 48px targets, single-column layout               |
| **Support Tickets**     | High (unclear requirements) | Reduced       | In-app guidance prevents errors                  |
| **Resubmission Rate**   | 18% (rejections)            | <8%           | Better upfront validation                        |
| **Accessibility Score** | ~55 (WCAG)                  | 90+ (WCAG AA) | Proper contrast, alt text, screen reader support |

### Design Principles Applied

1. **Progressive Disclosure**: Only show fields relevant to the visa type selected
2. **Empathy-Driven Copy**: Use plain language, avoid jargon, assume zero prior knowledge
3. **Persistent State**: Never lose user data; always offer a way back
4. **Mobile as Primary**: Desktop is a graceful enhancement, not the opposite
5. **Transparency**: Show exactly what's happening, when, and why

---

## 4. WHAT WORKS TODAY vs WHAT IS MOCKED

### ✅ Real Components (Would Integrate with Actual Systems)

- **Visa type selection** (hardcoded list, but reflects real visa categories)
- **Form validation logic** (e.g., passport format, email format)
- **UI/UX patterns** (progress tracking, multi-step workflows, mobile responsiveness)
- **Document upload flow** (file handling, size validation, format checking)

### 🎭 Mocked Components (Simulated for Prototype)

| Component                      | Mocked As                    | Notes                                                    |
| ------------------------------ | ---------------------------- | -------------------------------------------------------- |
| **Government Database Lookup** | Simulated success            | In reality: validates passport against official records  |
| **Payment Gateway**            | Fake Razorpay flow           | Real version integrates with Razorpay/NEFT               |
| **OTP Verification**           | Auto-verified with mock code | Real version: SMS via TWILIO; validates against database |
| **Document Scanning/OCR**      | Simulates "Success"          | Real version: ML model extracts & validates data         |
| **Email Notifications**        | Console logs                 | Real version: SendGrid/AWS SES integration               |
| **Application Tracking**       | Mock status timeline         | Real version: Backend database with real status updates  |
| **Background Checks**          | Instant mocked result        | Real version: Async processing (3-7 days)                |
| **Interview Scheduling**       | Mock calendar                | Real version: Integration with VFS/embassy systems       |

### Data Handling

- **Personal Data**: Uses realistic but fake data (no real passport numbers, addresses)
- **Session Storage**: Browser localStorage simulates backend persistence
- **Payment**: Shows payment flow UI without charging any real money

---

## 5. COMPLETE CITIZEN JOURNEY

### Stage 1: Visa Type Selection (1 min)

**User Action**: Select destination country and visa purpose
**System Response**:

- Show visa options relevant to destination
- Display typical processing time & cost
- Show required document checklist upfront

**Example**: User selects "Destination: USA" → System shows "B1/B2 (Tourist/Business)" with "Typical: 5-7 days, ₹16,000 cost"

---

### Stage 2: Personal Details (3-5 min)

**User Action**: Enter passport info, personal details, contact info
**System Response**:

- Auto-format passport number (e.g., "AA 123456" → "AA1234567")
- Validate passport expiry (must be >6 months)
- Smart defaults (e.g., country = India)
- Phone number formatter (auto-prefix +91)

**Error Handling**: If passport expires in <6 months, show:

```
⚠️ Your passport expires on March 2024.
Most countries need at least 6 months validity.
You may want to renew first. Continue anyway? [Yes] [No]
```

---

### Stage 3: Document Upload (5-8 min)

**User Action**: Upload required documents
**System Response**:

- Checklist format:
  ```
  ☐ Passport (Pages 1-2)
  ☐ Recent Photo (4x6cm)
  ☐ Proof of Address (Aadhar/Utility Bill)
  ☐ Sponsorship Letter (if required)
  ```
- Drag-and-drop + camera capture for mobile
- Real-time validation: "PDF uploaded. 2.3 MB. ✓ Ready"
- Quality warnings: "Image is blurry. Try again? [Retake]"

---

### Stage 4: Payment (2-3 min)

**User Action**: Select payment method and authorize payment
**System Response**:

- Itemized cost breakdown:
  ```
  Visa Processing Fee: ₹7,500
  Government Fee: ₹5,000
  Platform Fee: ₹1,500
  ─────────────────
  Total: ₹14,000
  ```
- Multiple payment options: UPI, Card, Netbanking
- Instant confirmation (no waiting for bank)
- Receipt emailed + saved in app

---

### Stage 5: Confirmation & Tracking (1 min)

**User Action**: View application confirmation
**System Response**:

- Reference number (shareable, used for tracking)
- Status timeline:
  ```
  ✓ Application Received (Today)
  → Documents Under Review (1-2 days)
  → Waiting for Interview Scheduling (2-3 days)
  → Interview Scheduled
  ```
- Download checklist: "Next steps for interview preparation"
- SMS + Email backup of confirmation

**Post-Submission Tracking**:

- Users can check status anytime by entering reference number
- Real-time status updates (mocked with demo transitions)
- Notification alerts when status changes

---

## 6. SCALE & SAFETY CONSIDERATIONS

### How could this idea work safely at scale?

#### 1. **Data Security**

- **In Prototype**: Data stored in browser localStorage (cleared on logout)
- **At Scale**:
  - End-to-end encryption for uploaded documents
  - PCI DSS compliance for payment processing
  - Regular security audits
  - Document storage in secure S3-like infrastructure
  - Audit logs for all user actions

#### 2. **Authentication & Verification**

- **In Prototype**: Simple email verification
- **At Scale**:
  - Multi-factor authentication (OTP + password)
  - Aadhaar e-KYC integration for document verification
  - Biometric passport verification
  - Fraud detection ML model to flag suspicious applications

#### 3. **Document Validation**

- **In Prototype**: File size and format checks only
- **At Scale**:
  - Automated OCR to extract and validate data
  - Government database cross-reference (passport validity)
  - Duplicate submission detection
  - Manual review by human officers for edge cases

#### 4. **Payment Security**

- **In Prototype**: Mocked payment flow with success confirmation
- **At Scale**:
  - PCI DSS Level 1 compliance
  - TLS 1.2+ encryption for transactions
  - Razorpay/HDFC tokenization for secure card storage
  - Real-time fraud detection
  - Instant refund capability

#### 5. **Government Integration**

- **In Prototype**: Direct integration simulated
- **At Scale**:
  - Secure APIs to Ministry of External Affairs (MEA) database
  - Real-time passport validity checking
  - Application data synced with VFS processing centers
  - Automated interview scheduling with embassy systems

#### 6. **Capacity & Performance**

- **Infrastructure**: Multi-region deployment (AWS/GCP) for redundancy
- **Load Testing**: Handle 50k concurrent users (target India population scale)
- **Latency**: P95 response time <500ms
- **Availability**: 99.9% uptime SLA with graceful degradation
- **Regional CDN**: Optimize for Indian users (Akamai, Cloudflare)

#### 7. **Compliance & Privacy**

- **GDPR/India Privacy Act**: Explicit consent for data usage
- **Aadhaar Act 2016**: Secure handling of optional Aadhaar data
- **Data Retention**: Delete applications after 2 years (unless pending)
- **Right to Deletion**: Implement data erasure on user request
- **Accessibility**: WCAG 2.1 AA compliance for all features

#### 8. **Fraud Prevention**

- **In Prototype**: Minimal checks (file validation only)
- **At Scale**:
  - Duplicate detection (same passport, multiple applications)
  - Suspicious pattern flagging (multiple attempts from same IP)
  - Manual review for high-risk countries
  - Known fraudster database cross-reference
  - Behavioral analysis (submission patterns)

#### 9. **Localization**

- **Languages Supported**: Hindi, Tamil, Telugu, Kannada, Marathi + English
- **Right-to-Left Support**: For potential future Arabic localization
- **Currency Formats**: Regional pricing (rupees, local payment methods)
- **Holiday Calendar**: Account for regional holidays in processing timelines

---

## 7. SUCCESS METRICS

### Primary Metrics

- **Application Completion Rate**: Increase from 62% → 85%+
- **Time to Submit**: Reduce from 35 min → 15 min average
- **Mobile Adoption**: Increase from 45% → 70%+
- **Support Tickets**: Reduce by 40% (fewer unclear requirement questions)
- **Resubmission Rate**: Reduce from 18% → <8% (fewer rejections)

### Secondary Metrics

- **Accessibility Score**: WCAG 2.1 AA (90+ on Lighthouse)
- **Mobile Performance**: Core Web Vitals all "Good"
- **Error Rate**: <2% system errors per 1000 submissions
- **User Satisfaction**: NPS 50+ (from current ~25)
- **Bounce Rate**: <20% on first page

---

## 8. TECHNICAL ARCHITECTURE (Scalable)

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React/Next.js)                           │
│  - Progressive Web App (offline-capable)            │
│  - Mobile-first responsive design                   │
│  - Service workers for caching                      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  API Gateway (Kong/AWS API Gateway)                 │
│  - Rate limiting (prevent abuse)                    │
│  - Request validation                               │
│  - Authentication (JWT/OAuth2)                      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Backend Services (Node.js/Python)                  │
│  ├─ Application Service (create, update, list)      │
│  ├─ Document Service (upload, validate, store)      │
│  ├─ Payment Service (Razorpay integration)          │
│  ├─ Notification Service (email, SMS)               │
│  └─ Status Service (real-time updates)              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Data Layer                                         │
│  ├─ PostgreSQL (applications, users)                │
│  ├─ MongoDB (documents metadata)                    │
│  ├─ S3/Cloud Storage (documents)                    │
│  └─ Redis (session/cache)                           │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  External Integrations                              │
│  ├─ MEA Database (passport validation)              │
│  ├─ VFS APIs (status sync)                          │
│  ├─ Embassy Systems (interview booking)             │
│  └─ Payment Gateway (Razorpay)                      │
└─────────────────────────────────────────────────────┘
```

---

## 9. TIMELINE & ROLLOUT STRATEGY

### Phase 1 (Months 1-2): MVP

- Visa type selection + personal details + document upload
- Payment mock (simulated)
- Basic status tracking

### Phase 2 (Months 3-4): Government Integration

- Real passport validation APIs
- Real payment processing
- Interview scheduling integration

### Phase 3 (Months 5-6): Localization

- Multi-language support (Hindi, Tamil, etc.)
- Regional payment methods
- OCR for document verification

### Phase 4 (Month 6+): AI/Optimization

- Recommendation engine (visa type suggestions)
- Proactive guidance (document requirements)
- Fraud detection system

### Rollout

- **Soft Launch**: Beta test with 10k users in Delhi/Bangalore
- **Regional Rollout**: Expand to metros, then tier-2 cities
- **Full Launch**: All 1.4B Indians with phased communication

---

## 10. RISKS & MITIGATION

| Risk                            | Impact                              | Mitigation                                                         |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| **Government API downtime**     | Users can't verify documents        | Graceful fallback: "Please try again. Meanwhile, save your draft." |
| **Payment gateway failure**     | Users lose money                    | Reconciliation system; auto-refunds for failed transactions        |
| **Data breach**                 | Legal/compliance disaster           | Bug bounty program; regular pen tests; incident response playbook  |
| **High fraud rate**             | Visa rejections, embassy complaints | ML fraud model; manual review for <5% of applications              |
| **Low adoption in rural areas** | Equity issues                       | Multilingual support; offline-capable design; phone support center |

---

## Appendix: Prototype Scope

The interactive prototype demonstrates:

1. ✅ **Complete workflow**: From visa selection to confirmation (all 5 stages)
2. ✅ **Mobile-first design**: Fully responsive, large touch targets
3. ✅ **Real interactions**: Not static—users click, scroll, upload, pay (mocked)
4. ✅ **Progressive disclosure**: Only relevant fields shown based on visa type
5. ✅ **Error handling**: Validation feedback, recovery options
6. ✅ **Status tracking**: Real-time progress visualization
7. ✅ **Contextual help**: Tooltips, examples, and guidance throughout
8. ⚠️ **Not included** (would be real at scale): Government API calls, actual payment processing, true OTP verification, background checks
