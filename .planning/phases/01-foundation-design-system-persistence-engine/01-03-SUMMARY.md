# 01-03 Summary: Typed Mock Service Layer & Single Swap Point

## Outcome

Wave 2 (Plan 01-03) is complete. Implemented the five typed service ports (Passport Lookup, Payment, OTP, Notifications, Tracking) defined in PRD §4, unified behind the single swap point `getService<T>(PORTS.name)` factory in `src/services/index.ts`. All ports feature mock implementations running through a scenario engine (`src/services/mock/scenarios.ts`) supporting simulated success, failure, and timeout states with randomized latency.

## Delivered Artifacts

- **Service Types & Port Interfaces (`src/services/types.ts`):**
  - `ServiceOutcome<T>` union (`success` | `failure` | `timeout`).
  - Domain records: `PassportRecord`, `PaymentInput`, `PaymentIntent`, `PaymentResult`, `TimelineEntry`.
  - Port interfaces: `IPassportLookupService`, `IPaymentService`, `IOtpService`, `INotificationService`, `ITrackingService`.
  - `MOCK_OTP_CODE = '000000'`, `GOVERNMENT_FEE = 5000`, `PLATFORM_FEE = 1500`, and `processingFeeFor(country, visaType)`.
- **Single Swap Point (`src/services/index.ts`):**
  - `PORTS` symbol registry and `getService<T>(port)` returning singleton mock adapters.
- **Scenario Engine & Mock Adapters (`src/services/mock/`):**
  - `scenarios.ts`: Configurable latency (800–3000ms default) and scenario overrides with `setScenarios` / `resetScenarios`.
  - `passport.ts`: Mock passport lookup.
  - `payment.ts`: Mock payment initiate, confirm, and retry.
  - `otp.ts`: Mock OTP send and auto-verification against `000000`.
  - `notifications.ts`: Console-only email and SMS mock logging.
  - `tracking.ts`: Deterministic 4-stage application timeline mock.
- **Tests:**
  - `src/services/types.test.ts`: Verified singleton behavior, port count, interface assignability, and fee calculations.
  - `src/services/mock/scenarios.test.ts`: Verified success, failure, timeout, OTP verification, and notification logging.

## Verification Results

- `pnpm typecheck`: 0 errors
- `pnpm lint`: 0 errors
- `pnpm vitest run src/services`: 2 test files, 8 tests passed
