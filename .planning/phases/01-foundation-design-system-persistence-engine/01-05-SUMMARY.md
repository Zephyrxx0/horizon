# 01-05 Summary: Document Compression & Storage (STATE-03)

## Outcome

Wave 4 (Plan 01-05) is complete. Implemented the IndexedDB blob persistence layer via `idb-keyval` under custom store `visarethink/documents` (`src/persistence/documents.ts`), client-side iterative canvas downscaling to $\le$ 2MB budget (`src/persistence/compress.ts`), and the `DocumentStep` demo surface inside the Review slot (`src/features/wizard/demo/DocumentStep.tsx`). Storage quota exhaustion and persistence errors are surfaced honestly via `useToast`, and document retention across full page reloads was proven end-to-end with Playwright.

## Delivered Artifacts

- **Document Compression Engine (`src/persistence/compress.ts`):**
  - `compressToBudget(file, maxBytes = 2 * 1024 * 1024)`: Scale floor (2048px max dimension), quality loop (0.85 $\rightarrow$ 0.40 step -0.15), 20% downscale retry loop, and non-image budget enforcement.
- **IndexedDB Blob Store (`src/persistence/documents.ts`):**
  - Custom `visarethink/documents` store.
  - Injectable CRUD functions: `saveDocument`, `getDocument`, `deleteDocument`, `hasDocument`.
  - Quota and capacity helpers: `getStorageEstimate` (with 80% usage threshold warning), `requestPersistentStorage`, `isQuotaError`, and `StorageUnavailableError`.
- **Upload Surface & Demo Component (`src/features/wizard/demo/DocumentStep.tsx`):**
  - Selection-time client-side pre-validation ($\le$ 5MB raw, `.jpg/.jpeg/.png/.pdf`).
  - Selection-time blob persistence to IndexedDB with metadata-only dispatched to XState context (`{ id, name, size, type }`).
  - Text-node filename rendering, formatted KB size, and live `✓ Ready` indicator backed by `hasDocument` confirmation.
- **Tests:**
  - `src/persistence/compress.test.ts` (canvas mock compression and budget exhaust tests).
  - `src/persistence/documents.test.ts` (injectable Map adapter CRUD and quota classifier).
  - `src/features/wizard/demo/DocumentStep.test.tsx` (component upload flow and metadata serialization).
  - `tests/e2e/save-documents.spec.ts` (Playwright upload $\rightarrow$ `✓ Ready` $\rightarrow$ reload $\rightarrow$ `✓ Ready` persistence proof).

## Verification Results

- `pnpm typecheck`: 0 errors
- `pnpm lint`: 0 errors
- `pnpm test`: 22 test files, 54 tests passed
- `pnpm e2e`: 4 Playwright tests passed (including real IndexedDB reload persistence)
