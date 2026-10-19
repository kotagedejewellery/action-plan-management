---
version: 1
slug: "monitoring"
primary_target: "src/presentation/components/connected-monitoring-workspace.tsx"
related_targets: ["src/app/(dashboard)/monitoring/page.tsx", "src/presentation/components/monitoring-detail-panel.tsx"]
---

# Monitoring anggota

Mode: Operate. Admin reviews each member's plans and evidence. The user approved the searchable member rail, unified filters, readable records and a right-side detail panel. Preserve completion semantics, admin authorization, image-only attachment previews, existing dashboard deep links and all data. No new dependencies or production data mutations.

## Direction contract

THESIS: Choose a member, narrow the work, inspect its evidence without losing the list's position. A restrained workspace replaces scattered filters and ambiguous empty cells.

OWN-WORLD: Inherit the approved dashboard's cool canvas, white surfaces, teal controls, system sans and pale borders. Status colors retain their business meaning.

STORY: Find a member, understand the period and counts, scan morning/afternoon states, open details and return to the same record. The signature interaction is a right-side inspection panel with space reserved for the selected row and its controls beside it. While desktop detail is open, member selection uses the searchable inline chooser.

FIRST VIEWPORT: Page heading and refresh; searchable member rail beside one work surface. Selected member and inline totals lead, period/search/status controls follow, then aligned work rows. Mobile has a searchable member chooser, labeled record cards and full-screen detail. Skeletons prevent old-member data appearing under a new identity. Feedback is inline, recoverable and announced; motion respects reduced motion.

FORM: User-pinned existing operational world and explicitly approved composition; code-led local implementation, no open concept selection, comp or raster assets.

FINISH: Shipped within the existing dashboard identity. The initial supporting-text contrast correction remains confirmed at 5.89:1. A fresh full finish review of the six approved Monitoring gap fixes returned ship with no material fixes; all six required captures were validated against the accepted white/teal operational world. This surface brief records the finished composition and its local exceptions; global DESIGN.md and its sidecar remain unchanged. No raster assets ship.

## Shipped surface rules

- Member-first workspace: a searchable 240px member rail at widths of 1280px and above; a searchable inline chooser below that. While desktop detail is open, the searchable “Ganti anggota” chooser replaces the rail. Choosing the same or a different member restores focus to the visible toggle or desktop rail after layout changes. The member name, email and completion summary stay beside the reviewed work.
- One filter area holds the period, work search, status counts and current context. Default and reset use all dates. Week and month cover their entire calendar ranges, including scheduled future plans; future rows say “Mendatang”. Custom ranges validate order and allow an open bound. Successful refresh recalculates active presets from the server's Bangkok work date while preserving an applied custom period and unfinished date draft; clicking a preset uses the current Bangkok date. Successful protected `GET /api/action-plans` responses supply `x-workspace-date` and `Cache-Control: no-store` without changing the JSON array contract.
- Completion follows the configured afternoon status labels. Morning and afternoon remain separately labeled; blank statuses say “Belum diisi”. Summary and status counts reflect the current period and search. Lists paginate at 20 records; desktop rows become labeled cards below 768px. A linked record selects its page within the filtered, sorted results and scrolls into view. Detail belongs to the displayed page and closes when search, status, page or applied dates change.
- Detail is a Monitoring-specific exception to the global dialog defaults: a native modeless, 460px right panel at 1280px and above, and a full-screen modal below that. Desktop reserves the panel's width so keyboard controls remain unobscured; at 1280px the table scrolls horizontally within the remaining work surface. Its desktop scroll viewport has a maximum height of 640px, so fewer than the page's 20 records may be visible at once. The selected record remains highlighted. Escape and close restore focus to the latest opener, or the matching visible deep-link trigger; mobile Tab stays within detail, and closing restores body scrolling. The panel changes mode when the breakpoint changes.
- Admin attachment access stays image-only. Documents display their names as references; unavailable image previews offer recovery. Dashboard `userId`, `recordId`, `from` and `to` links retain their context.
- Loading replaces records with skeletons and suppresses the prior member's work. Superseded requests cannot replace the current member's response. Recoverable errors retain same-member data where available and offer retry; 401/403 hide records and offer session/access recovery. Access denial persists through later 503 or network failures and clears only after a valid authorized success. Empty team, empty member and filter mismatch have distinct guidance.
- Preserve the incumbent system sans, teal actions, status hues, pale borders, white surfaces and 12–16px rounding. Local supporting copy and placeholders use the existing darker neutral (`#516967`) for legibility; this does not redefine the global muted token. Reduced-motion preferences apply to loading animation.

## Verification evidence

The six captures in [the Monitoring review folder](../review/monitoring/) show the finished list at 1440×1380 (`desktop.png`), 1919×1380 (`user-1919.png`) and 390×1246 (`mobile.png`), all full-page, plus viewport captures of the right panel at 1919×1038 (`desktop-detail.png`), full-screen detail at 390×844 (`mobile-detail.png`) and reserved panel space at 1280×900 (`desktop-detail-1280.png`). All six were opened and validated in the fresh full finish review. [Browser checks](../review/monitoring/browser-checks.json) record 32 passing Monitoring cases, including 17 new regressions for the six approved fixes. Six bug regressions failed before the fixes and passed afterward. The final horizontal-scroll alignment adjustment was followed by six passing focus, scroll and screenshot tests.

Validation passed 31 unit tests, 45 browser tests (32 Monitoring and 13 dashboard), lint, TypeScript and the production build (19 pages). A detector pass over the two current Monitoring UI files returned no findings or advisories. Browser tests render the real React components and AppShell in a standalone Vite harness with synthetic API responses. Live authentication, Google integrations, production data, remote CI and Next.js navigation integration were not exercised. The unavailable image fixture intentionally demonstrates recovery. No dependencies were added and no real data was mutated; no global design defects or new visual rules are canonized by this bounded correction.
