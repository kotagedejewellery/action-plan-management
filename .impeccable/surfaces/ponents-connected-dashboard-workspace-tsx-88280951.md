---
version: 1
slug: "ponents-connected-dashboard-workspace-tsx-88280951"
primary_target: "src/presentation/components/connected-dashboard-workspace.tsx"
related_targets: ["src/app/(dashboard)/dashboard/page.tsx","src/app/(dashboard)/dashboard/loading.tsx"]
---

# Dashboard Tim

Mode: Operate. Admin needs a fast, accurate overview of the whole team's progress, then access to individual work. Approved scope: this dashboard, its loading state, a protected refresh read, and the five dashboard refinements recorded below. Keep the established teal identity, server authorization, completion rules, Sheets cache, and Monitoring links. No new production dependencies or data mutations; Playwright and Vite are development-only browser-testing dependencies.

## Direction contract

THESIS: Team progress leads. A compact overview and expandable aligned member rows replace the dominant dark warning and unbounded weekly list.

OWN-WORLD: Existing cool white/gray canvas, deep teal ink, working teal controls, system sans, 12–16px corners, pale borders. Amber is reserved for unfinished earlier work.

STORY: Read the selected period's totals, compare completion, expand a member, open Monitoring. The signature interaction is an inline member reveal that keeps the overview in place.

FIRST VIEWPORT: Header with refresh, compact period toolbar, four metrics, then a wider team panel beside the daily chart. Weekly plans and a quiet attention disclosure follow. Mobile uses 2x2 metrics and stacked panels. Controls have clear focus, busy, empty, error and success states; disclosures and progress transitions respect reduced motion.

FORM: User-approved composition and interactions from the conversation; no concept seed is needed for the pinned structure. Code-led implementation of this existing operational surface, without a new visual-world exercise or raster assets.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Shipped outcome and proof

The dashboard keeps DESIGN.md's teal palette, system typography, pale borders, white surfaces and rounded controls. Its team-first hierarchy, member disclosures, bounded lists and daily chart are local dashboard patterns. Desktop places the team panel beside the chart; mobile stacks them beneath 2x2 metrics. The loading skeleton follows the same structure and respects reduced motion. Global design and product documents remain unchanged; no raster assets ship.

The five refinements preserve that composition:

- Month and week presets recompute from the refreshed current date; custom applied periods and unsaved date drafts stay intact.
- Refresh failures retain the displayed results. Authentication and authorization failures give login or Admin guidance; transient failures offer Retry.
- Daily-chart buttons have a minimum 24px width, and the selected date remains visible in the chart scroller.
- The shared status badge accepts configured completion labels, passed by its live callers so completion colors match configured status meaning.
- Persistent browser coverage runs through `npm run test:ui` and is configured before deployment in CI.

Finish review disposition: ship, with no material fixes requested. Evidence: `.impeccable/review/desktop.png` (1440 × 2024) and `mobile.png` (390 × 3115) show the actual React dashboard and AppShell with labeled synthetic data, rendered through a standalone Vite test harness. The harness is not a Next.js preview route. `.impeccable/review/browser-checks.json` records the browser evidence. Validation passed locally: 29 unit tests, 13 browser tests, lint, TypeScript, production build, and zero detector findings. Live Google integrations, live authentication, production data, and remote CI execution were not verified.

These are local dashboard refinements and testing evidence. They introduce no global visual-system changes; existing drift in DESIGN.md and PRODUCT.md remains outside this scope and is not canonized here.
