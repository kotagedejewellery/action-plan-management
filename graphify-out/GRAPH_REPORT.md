# Graph Report - action-plan-management  (2026-10-19)

## Corpus Check
- 98 files · ~67,147 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 653 nodes · 1715 edges · 32 communities (28 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bbcb0e28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- repositories.ts
- models.ts
- connected-user-management-workspace.tsx
- use-cases.ts
- publicError
- Design System: Action Plan Management System
- connected-weekly-plan-workspace.tsx
- compilerOptions
- Users
- connected-monitoring-workspace.tsx
- Monitoring anggota
- connected-action-plan-workspace.tsx
- icons.tsx
- System Architecture — Action Plan Management System
- Tech Stack — Action Plan Management System
- package.json
- ConnectedMonitoringWorkspace
- PROJECT_BRIEF.md
- Product Requirements Document — Action Plan Management System
- Dashboard Tim
- Product
- useFeedback
- ConnectedUserManagementWorkspace
- Brief Proyek Action Plan Management
- Setup Action Plan Management
- attachments.ts
- AGENTS.md
- postcss.config.mjs
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 54 edges
2. `AppError` - 37 edges
3. `apiError()` - 34 edges
4. `next` - 31 edges
5. `requireAdmin()` - 25 edges
6. `ConnectedDashboardWorkspace()` - 21 edges
7. `ConnectedMonitoringWorkspace()` - 21 edges
8. `ConnectedActionPlanWorkspace()` - 20 edges
9. `ActionPlan` - 19 edges
10. `react` - 18 edges

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

## Communities (32 total, 4 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.07
Nodes (63): nextConfig, next, ref_node_path, vitest, DELETE(), GET(), acceptedTypes, POST() (+55 more)

### Community 1 - "repositories.ts"
Cohesion: 0.09
Nodes (32): 2. Clean Architecture, Infrastructure, Presentation, required(), sheetsClient(), spreadsheetId(), append(), appendMany() (+24 more)

### Community 2 - "models.ts"
Cohesion: 0.06
Nodes (43): @playwright/test, react-dom, src_app_globals, metadata, RootLayout(), calendarDates(), DashboardPlan, DashboardSummary (+35 more)

### Community 3 - "connected-user-management-workspace.tsx"
Cohesion: 0.27
Nodes (12): react, StatusEditor(), StatusInput, UserField(), UserForm(), persist(), submit(), UserInput (+4 more)

### Community 4 - "use-cases.ts"
Cohesion: 0.09
Nodes (36): Application, Domain, bcryptjs, ActionPlansPage(), HistoryPage(), WeeklyPlansPage(), AppError, ActionPlanRepository (+28 more)

### Community 5 - "publicError"
Cohesion: 0.18
Nodes (10): DashboardError(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps, JWT, next-auth, next-auth/jwt (+2 more)

### Community 6 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 7 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (10): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+2 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Users"
Cohesion: 0.16
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User, 5. Sheet `Weekly Plans`, 6. Relasi dan isolasi data, 7. Validasi integritas (+8 more)

### Community 10 - "connected-monitoring-workspace.tsx"
Cohesion: 0.14
Nodes (21): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Period, PlanStatus(), Preset, Scope (+13 more)

### Community 11 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 12 - "connected-action-plan-workspace.tsx"
Cohesion: 0.20
Nodes (9): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), displayDate(), Draft, Field(), getWeekBounds(), PlanForm(), View (+1 more)

### Community 13 - "icons.tsx"
Cohesion: 0.30
Nodes (13): DashboardLayout(), AppShell(), baseNavigation, Calendar(), Chart(), ChevronDown(), Close(), Grid() (+5 more)

### Community 14 - "System Architecture — Action Plan Management System"
Cohesion: 0.15
Nodes (13): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+5 more)

### Community 15 - "Tech Stack — Action Plan Management System"
Cohesion: 0.17
Nodes (12): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+4 more)

### Community 16 - "package.json"
Cohesion: 0.04
Nodes (45): eslintConfig, dependencies, bcryptjs, googleapis, lucide-react, next, next-auth, react (+37 more)

### Community 17 - "ConnectedMonitoringWorkspace"
Cohesion: 0.21
Nodes (12): ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker(), renderResult() (+4 more)

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

### Community 23 - "useFeedback"
Cohesion: 0.16
Nodes (12): next-auth, LoginPage(), StatusForm(), Feedback, FeedbackContext, FeedbackContextValue, FeedbackType, styles (+4 more)

### Community 24 - "ConnectedUserManagementWorkspace"
Cohesion: 0.27
Nodes (7): ConnectedUserManagementWorkspace(), Pencil(), Plus(), UserField(), UserForm(), UserManagementWorkspace(), AccountStatus()

### Community 25 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 27 - "Setup Action Plan Management"
Cohesion: 0.33
Nodes (6): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, Setup Action Plan Management

### Community 29 - "attachments.ts"
Cohesion: 0.14
Nodes (14): googleapis, ref_next_env, ref_node_crypto, ref_node_stream, sheets, spreadsheetId, timestamp, driveQueryValue() (+6 more)

### Community 30 - "AGENTS.md"
Cohesion: 0.25
Nodes (7): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Urutan kerja, Validasi dan performa

## Knowledge Gaps
- **190 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 241 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `Brief Proyek Action Plan Management`, `Setup Action Plan Management`, `AGENTS.md`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `models.ts`, `connected-weekly-plan-workspace.tsx`, `connected-monitoring-workspace.tsx`, `icons.tsx`, `package.json`, `useFeedback`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `user()` connect `Users` to `use-cases.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `currentActor()` (e.g. with `action-plans-date.test.ts` and `dashboard-server.test.ts`) actually correct?**
  _`currentActor()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.07393939393939394 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08883693746347165 - nodes in this community are weakly interconnected._