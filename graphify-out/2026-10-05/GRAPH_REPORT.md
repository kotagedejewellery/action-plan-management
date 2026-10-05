# Graph Report - action-plan-management  (2026-10-05)

## Corpus Check
- 62 files · ~22,521 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 458 nodes · 1115 edges · 21 communities (18 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b64fb21b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-cases.ts
- Product Requirements Document — Action Plan Management System
- System Architecture — Action Plan Management System
- connected-weekly-plan-workspace.tsx
- compilerOptions
- feedback.tsx
- package.json
- Aturan Kerja Proyek
- currentActor
- icons.tsx
- dependencies
- README.md
- postcss.config.mjs
- Design System: Action Plan Management System
- { GET, POST }
- repositories.ts
- devDependencies
- bootstrap-admin.mjs
- scripts
- eslint.config.mjs
- connected-dashboard-workspace.tsx

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 34 edges
2. `AppError` - 24 edges
3. `next` - 20 edges
4. `ConnectedActionPlanWorkspace()` - 19 edges
5. `Icon()` - 18 edges
6. `requireAdmin()` - 17 edges
7. `listVisiblePlans()` - 17 edges
8. `ActionPlan` - 17 edges
9. `PageHeading()` - 17 edges
10. `useFeedback()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Infrastructure` --references--> `GoogleSheetsUserRepository`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/infrastructure/google-sheets/repositories.ts
- `Infrastructure` --references--> `GoogleSheetsActionPlanRepository`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/infrastructure/google-sheets/repositories.ts
- `1. Model penyimpanan` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `4. Relasi dan isolasi data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `6. Operasi akses data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (21 total, 3 thin omitted)

### Community 0 - "use-cases.ts"
Cohesion: 0.09
Nodes (28): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, bcryptjs, ActionPlanRepository, StatusRepository (+20 more)

### Community 1 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.05
Nodes (43): 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet Action Plan per User, 4. Relasi dan isolasi data, 5. Validasi integritas, 6. Operasi akses data, 7. Konsekuensi Google Sheets sebagai database, Database Design — Google Spreadsheet (+35 more)

### Community 2 - "System Architecture — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Batasan dan evolusi, 8. Checklist implementasi, Admin monitoring (+3 more)

### Community 3 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.27
Nodes (9): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanForm(), WeeklyStats, weeklyStatus() (+1 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "feedback.tsx"
Cohesion: 0.10
Nodes (19): next-auth, src_app_globals, metadata, RootLayout(), LoginPage(), Feedback, FeedbackContext, FeedbackContextValue (+11 more)

### Community 6 - "package.json"
Cohesion: 0.15
Nodes (12): name, private, version, lucide-react, react-dom, tailwindcss, @tailwindcss/postcss, @types/node (+4 more)

### Community 8 - "currentActor"
Cohesion: 0.12
Nodes (41): nextConfig, next, DELETE(), PATCH(), GET(), POST(), GET(), POST() (+33 more)

### Community 10 - "icons.tsx"
Cohesion: 0.08
Nodes (57): react, ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, AppShell(), baseNavigation, ConnectedActionPlanWorkspace() (+49 more)

### Community 11 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, googleapis, lucide-react, next, next-auth, react, react-dom (+1 more)

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 14 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 16 - "repositories.ts"
Cohesion: 0.11
Nodes (21): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), ensureHeaders(), GoogleSheetsActionPlanRepository, GoogleSheetsStatusRepository (+13 more)

### Community 18 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+2 more)

### Community 19 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 20 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, bootstrap:admin, build, dev, lint, start, test

### Community 21 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 22 - "connected-dashboard-workspace.tsx"
Cohesion: 0.15
Nodes (17): ref_node_path, vitest, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, SafeUser (+9 more)

## Knowledge Gaps
- **141 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Product Requirements Document — Action Plan Management System` to `icons.tsx`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `icons.tsx`, `connected-weekly-plan-workspace.tsx`, `feedback.tsx`, `package.json`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `user()` connect `Product Requirements Document — Action Plan Management System` to `use-cases.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08853410740203194 - nodes in this community are weakly interconnected._
- **Should `Product Requirements Document — Action Plan Management System` be split into smaller, more focused modules?**
  _Cohesion score 0.04609929078014184 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._