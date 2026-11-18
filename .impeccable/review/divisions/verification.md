# Multi-division verification — 18 November 2026

- `npm.cmd test`: 53 tests passed across 10 files.
- `npm.cmd run test:ui`: all 50 browser tests passed in the final full run (45 existing dashboard/Monitoring cases and 5 multi-division cases).
- `npm.cmd exec tsc -- --noEmit`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, including new division pages and API routes.
- `git diff --check`: passed; only existing LF/CRLF conversion notices.
- Impeccable detector: ran once, empty findings array in `detector.json`.
- Independent visual review: `ship`, no material fixes; see `finish-review.md`.

Security tests execute actual API handlers and actor resolution against mocked authentication and repositories. They cover stale JWT role claims, cross-division member/attachment requests, scoped dashboard and Weekly Plan responses, BOD mutation denial, reassignment revocation, unmapped access denial, SuperAdmin visibility and User ownership. Application tests cover assignment uniqueness under concurrent writes, preservation of the last active SuperAdmin, immutable User affiliation, and legacy ID/hash/sheet preservation. Sheets adapter tests use a synthetic Google API and cover nine-column Users compatibility, occupied-column rejection, non-mutating missing-tab reads, error propagation and cache invalidation.

Browser tests use the existing standalone Vite harness with visibly synthetic data. They cover mapping confirmation and fixed affiliation, BOD replacement and failed-save retry, role navigation, division-preserving refresh, keyboard recovery and 390/1440/1919px captures. They do not prove live Next.js navigation, Auth.js login, Google permissions, spreadsheet/Drive integration, or production behavior.

No deployment, live backfill, bootstrap, real account mapping, spreadsheet reset, or Drive mutation was performed. Existing accounts must be mapped by SuperAdmin before their workspace access is enabled. The shared access-write queue and cache invalidation require one application process/container; see `docs/MULTI_DIVISION_ROLLOUT.md`.
