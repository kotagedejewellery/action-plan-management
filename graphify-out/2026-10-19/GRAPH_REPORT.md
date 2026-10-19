# Graph Report - action-plan-management  (2026-10-19)

## Corpus Check
- 96 files · ~62,047 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 646 nodes · 1685 edges · 39 communities (32 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bbcb0e28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-cases.ts
- repositories.ts
- connected-dashboard-workspace.tsx
- connected-user-management-workspace.tsx
- WeeklyPlan
- publicError
- Design System: Action Plan Management System
- connected-weekly-plan-workspace.tsx
- compilerOptions
- Users
- action-plan-workspace.tsx
- Monitoring anggota
- connected-action-plan-workspace.tsx
- icons.tsx
- System Architecture — Action Plan Management System
- Tech Stack — Action Plan Management System
- package.json
- connected-monitoring-workspace.tsx
- PROJECT_BRIEF.md
- Product Requirements Document — Action Plan Management System
- Dashboard Tim
- Product
- workspace-ui.tsx
- devDependencies
- Brief Proyek Action Plan Management
- dependencies
- Setup Action Plan Management
- next-auth.d.ts
- bootstrap-admin.mjs
- AGENTS.md
- scripts
- postcss.config.mjs
- eslint.config.mjs
- { GET, POST }
- vite
- next.config.ts
- vitest.config.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 53 edges
2. `AppError` - 37 edges
3. `apiError()` - 34 edges
4. `next` - 31 edges
5. `requireAdmin()` - 25 edges
6. `ConnectedDashboardWorkspace()` - 21 edges
7. `ConnectedActionPlanWorkspace()` - 20 edges
8. `ActionPlan` - 19 edges
9. `react` - 18 edges
10. `ConnectedMonitoringWorkspace()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Perlindungan data dan penyimpanan` --references--> `Users()`  [INFERRED]
  AGENTS.md → src/presentation/components/icons.tsx
- `6. Halaman dan navigasi` --references--> `Users()`  [INFERRED]
  docs/PRD.md → src/presentation/components/icons.tsx
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `Penyimpanan dan integrasi menurut dokumentasi` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `1. Google Sheets dan Admin awal` --references--> `Users()`  [INFERRED]
  docs/SETUP.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (39 total, 7 thin omitted)

### Community 0 - "use-cases.ts"
Cohesion: 0.07
Nodes (84): bcryptjs, next, vitest, DELETE(), GET(), acceptedTypes, POST(), DELETE() (+76 more)

### Community 1 - "repositories.ts"
Cohesion: 0.08
Nodes (33): Infrastructure, ActionPlanRepository, ActionPlan, ActionPlanStatus, required(), sheetsClient(), spreadsheetId(), append() (+25 more)

### Community 2 - "connected-dashboard-workspace.tsx"
Cohesion: 0.05
Nodes (47): @playwright/test, react-dom, src_app_globals, metadata, RootLayout(), calendarDates(), DashboardPlan, DashboardSummary (+39 more)

### Community 3 - "connected-user-management-workspace.tsx"
Cohesion: 0.21
Nodes (10): ConnectedUserManagementWorkspace(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm(), persist(), submit() (+2 more)

### Community 4 - "WeeklyPlan"
Cohesion: 0.08
Nodes (18): 2. Clean Architecture, Application, Domain, Presentation, ref_node_stream, AttachmentStorage, UserRepository, WeeklyPlanRepository (+10 more)

### Community 5 - "publicError"
Cohesion: 0.43
Nodes (5): DashboardError(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

### Community 6 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 7 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (11): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Users"
Cohesion: 0.16
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User, 5. Sheet `Weekly Plans`, 6. Relasi dan isolasi data, 7. Validasi integritas (+8 more)

### Community 10 - "action-plan-workspace.tsx"
Cohesion: 0.17
Nodes (16): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Pencil(), Plus(), UserField(), UserForm() (+8 more)

### Community 11 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 12 - "connected-action-plan-workspace.tsx"
Cohesion: 0.20
Nodes (9): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), displayDate(), Draft, Field(), getWeekBounds(), PlanForm(), View (+1 more)

### Community 13 - "icons.tsx"
Cohesion: 0.19
Nodes (19): next-auth, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, useFeedback(), ArrowRight(), Calendar() (+11 more)

### Community 14 - "System Architecture — Action Plan Management System"
Cohesion: 0.15
Nodes (13): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+5 more)

### Community 15 - "Tech Stack — Action Plan Management System"
Cohesion: 0.17
Nodes (12): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+4 more)

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, version, lucide-react, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 17 - "connected-monitoring-workspace.tsx"
Cohesion: 0.14
Nodes (22): ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), renderDate(), renderMemberPicker(), renderResult(), selectUser() (+14 more)

### Community 18 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 19 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.20
Nodes (9): 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 5. Data Action Plan, 6. Halaman dan navigasi, 7. Kebutuhan nonfungsional, 8. Ruang lingkup, 9. Kriteria penerimaan (+1 more)

### Community 20 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 21 - "Product"
Cohesion: 0.20
Nodes (9): Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose, Stack (+1 more)

### Community 23 - "workspace-ui.tsx"
Cohesion: 0.60
Nodes (3): react, focusableElements(), useDialogFocus()

### Community 24 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+4 more)

### Community 25 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 26 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, googleapis, lucide-react, next, next-auth, react, react-dom (+1 more)

### Community 27 - "Setup Action Plan Management"
Cohesion: 0.33
Nodes (6): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, Setup Action Plan Management

### Community 28 - "next-auth.d.ts"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 29 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 30 - "AGENTS.md"
Cohesion: 0.25
Nodes (7): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Urutan kerja, Validasi dan performa

### Community 31 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, bootstrap:admin, build, dev, lint, start, test, test:ui

### Community 33 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **187 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+182 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 237 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `Brief Proyek Action Plan Management`, `Setup Action Plan Management`, `AGENTS.md`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `next` connect `use-cases.ts` to `connected-dashboard-workspace.tsx`, `next.config.ts`, `connected-weekly-plan-workspace.tsx`, `icons.tsx`, `package.json`, `connected-monitoring-workspace.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `user()` connect `Users` to `use-cases.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _187 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06971428571428571 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0773405698778833 - nodes in this community are weakly interconnected._
- **Should `connected-dashboard-workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.053939714436805924 - nodes in this community are weakly interconnected._