# Graph Report - action-plan-management  (2026-10-05)

## Corpus Check
- 55 files · ~18,260 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 395 nodes · 890 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08213f82`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- feedback.tsx
- Product Requirements Document — Action Plan Management System
- System Architecture — Action Plan Management System
- Tech Stack — Action Plan Management System
- compilerOptions
- icons.tsx
- package.json
- Aturan Kerja Proyek
- use-cases.ts
- connected-action-plan-workspace.tsx
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
- vitest

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 27 edges
2. `AppError` - 21 edges
3. `ConnectedActionPlanWorkspace()` - 19 edges
4. `Icon()` - 17 edges
5. `next` - 16 edges
6. `compilerOptions` - 16 edges
7. `requireAdmin()` - 15 edges
8. `useFeedback()` - 14 edges
9. `Search()` - 14 edges
10. `react` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Autentikasi` --references--> `Users()`  [INFERRED]
  docs/TECH_STACK.md → src/presentation/components/icons.tsx
- `Domain` --references--> `UserRole`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/domain/models.ts
- `1. Model penyimpanan` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `4. Relasi dan isolasi data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `6. Operasi akses data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "feedback.tsx"
Cohesion: 0.22
Nodes (9): src_app_globals, metadata, RootLayout(), Feedback, FeedbackContext, FeedbackContextValue, FeedbackProvider(), FeedbackType (+1 more)

### Community 1 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.06
Nodes (32): 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet Action Plan per User, 4. Relasi dan isolasi data, 5. Validasi integritas, 6. Operasi akses data, 7. Konsekuensi Google Sheets sebagai database, Database Design — Google Spreadsheet (+24 more)

### Community 2 - "System Architecture — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Batasan dan evolusi, 8. Checklist implementasi, Admin monitoring (+3 more)

### Community 3 - "Tech Stack — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+3 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "icons.tsx"
Cohesion: 0.14
Nodes (23): next-auth, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, ArrowRight(), Calendar(), CheckMark() (+15 more)

### Community 6 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, version, lucide-react, react-dom, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 8 - "use-cases.ts"
Cohesion: 0.11
Nodes (44): nextConfig, bcryptjs, next, zod, DELETE(), PATCH(), GET(), POST() (+36 more)

### Community 10 - "connected-action-plan-workspace.tsx"
Cohesion: 0.09
Nodes (45): react, SafeUser, ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ConnectedActionPlanWorkspace(), displayDate() (+37 more)

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
Cohesion: 0.08
Nodes (28): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, ActionPlanRepository, StatusRepository, UserRepository (+20 more)

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

## Knowledge Gaps
- **136 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+131 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Product Requirements Document — Action Plan Management System` to `Tech Stack — Action Plan Management System`, `icons.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `next` connect `use-cases.ts` to `feedback.tsx`, `icons.tsx`, `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `user()` connect `Product Requirements Document — Action Plan Management System` to `use-cases.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Requirements Document — Action Plan Management System` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.135632183908046 - nodes in this community are weakly interconnected._