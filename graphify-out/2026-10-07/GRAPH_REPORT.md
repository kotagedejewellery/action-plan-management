# Graph Report - action-plan-management  (2026-10-06)

## Corpus Check
- 73 files · ~26,845 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 523 nodes · 1333 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 55 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bb25ec7f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- icons.tsx
- use-cases.ts
- repositories.ts
- Product Requirements Document — Action Plan Management System
- attachments.ts
- vitest
- Design System: Action Plan Management System
- compilerOptions
- System Architecture — Action Plan Management System
- package.json
- devDependencies
- app/layout.tsx
- dependencies
- scripts
- next-auth.d.ts
- (dashboard)/layout.tsx
- eslint.config.mjs
- README.md
- Aturan Kerja Proyek
- postcss.config.mjs
- models.ts
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 48 edges
2. `AppError` - 37 edges
3. `next` - 27 edges
4. `requireAdmin()` - 21 edges
5. `ConnectedActionPlanWorkspace()` - 20 edges
6. `Icon()` - 18 edges
7. `listVisiblePlans()` - 17 edges
8. `ActionPlan` - 17 edges
9. `PageHeading()` - 17 edges
10. `useFeedback()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Domain` --references--> `ActionPlanStatus`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/domain/models.ts
- `1. Model penyimpanan` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `4. Relasi dan isolasi data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `6. Operasi akses data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `6. Halaman dan navigasi` --references--> `Users()`  [INFERRED]
  docs/PRD.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (23 total, 5 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.05
Nodes (80): react, LoginPage(), ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, AppShell(), baseNavigation (+72 more)

### Community 1 - "use-cases.ts"
Cohesion: 0.09
Nodes (63): nextConfig, next, zod, DELETE(), GET(), acceptedTypes, POST(), DELETE() (+55 more)

### Community 2 - "repositories.ts"
Cohesion: 0.06
Nodes (38): 2. Clean Architecture, Application, Infrastructure, Presentation, ActionPlanRepository, AttachmentStorage, StatusRepository, UserRepository (+30 more)

### Community 3 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.05
Nodes (43): 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet Action Plan per User, 4. Relasi dan isolasi data, 5. Validasi integritas, 6. Operasi akses data, 7. Konsekuensi Google Sheets sebagai database, Database Design — Google Spreadsheet (+35 more)

### Community 4 - "attachments.ts"
Cohesion: 0.12
Nodes (19): bcryptjs, googleapis, ref_next_env, ref_node_crypto, ref_node_stream, sheets, spreadsheetId, timestamp (+11 more)

### Community 6 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "System Architecture — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Batasan dan evolusi, 8. Checklist implementasi, Admin monitoring (+3 more)

### Community 9 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, version, lucide-react, react-dom, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 10 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+2 more)

### Community 11 - "app/layout.tsx"
Cohesion: 0.50
Nodes (4): src_app_globals, metadata, RootLayout(), FeedbackProvider()

### Community 12 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, googleapis, lucide-react, next, next-auth, react, react-dom (+1 more)

### Community 13 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, bootstrap:admin, build, dev, lint, start, test

### Community 14 - "next-auth.d.ts"
Cohesion: 0.29
Nodes (6): next-auth, JWT, next-auth, next-auth/jwt, Session, User

### Community 15 - "(dashboard)/layout.tsx"
Cohesion: 0.48
Nodes (4): DashboardError(), DashboardLayout(), DataUnavailable(), DataUnavailableProps

### Community 16 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 17 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 22 - "models.ts"
Cohesion: 0.11
Nodes (23): Domain, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, handlers, signIn (+15 more)

## Knowledge Gaps
- **146 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 188 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `use-cases.ts` to `icons.tsx`, `attachments.ts`, `package.json`, `app/layout.tsx`, `(dashboard)/layout.tsx`, `models.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Users()` connect `Product Requirements Document — Action Plan Management System` to `icons.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `user()` connect `Product Requirements Document — Action Plan Management System` to `use-cases.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051597051597051594 - nodes in this community are weakly interconnected._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09125656951743909 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05612694681163679 - nodes in this community are weakly interconnected._