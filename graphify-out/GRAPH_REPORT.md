# Graph Report - action-plan-management  (2026-10-19)

## Corpus Check
- 91 files · ~43,901 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 621 nodes · 1625 edges · 39 communities (32 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 73 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81cf7f8e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-cases.ts
- repositories.ts
- connected-dashboard-workspace.tsx
- connected-user-management-workspace.tsx
- models.ts
- (dashboard)/layout.tsx
- Design System: Action Plan Management System
- connected-weekly-plan-workspace.tsx
- compilerOptions
- Users
- workspace-ui.tsx
- useFeedback
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
- attachments.ts
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

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 53 edges
2. `AppError` - 37 edges
3. `apiError()` - 34 edges
4. `next` - 31 edges
5. `requireAdmin()` - 25 edges
6. `ConnectedDashboardWorkspace()` - 21 edges
7. `ConnectedActionPlanWorkspace()` - 20 edges
8. `useFeedback()` - 18 edges
9. `Icon()` - 18 edges
10. `react` - 17 edges

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
Cohesion: 0.09
Nodes (73): next, DELETE(), GET(), acceptedTypes, POST(), DELETE(), PATCH(), GET() (+65 more)

### Community 1 - "repositories.ts"
Cohesion: 0.10
Nodes (29): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), CachedRead, clearReadCache(), deleteRow() (+21 more)

### Community 2 - "connected-dashboard-workspace.tsx"
Cohesion: 0.06
Nodes (41): ref_node_path, @playwright/test, react-dom, vitest, src_app_globals, metadata, RootLayout(), calendarDates() (+33 more)

### Community 3 - "connected-user-management-workspace.tsx"
Cohesion: 0.15
Nodes (18): ActionPlanWorkspace(), ConnectedUserManagementWorkspace(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm(), persist() (+10 more)

### Community 4 - "models.ts"
Cohesion: 0.08
Nodes (19): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, ActionPlanRepository, StatusRepository, UserRepository (+11 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.36
Nodes (6): DashboardError(), DashboardLayout(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

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

### Community 10 - "workspace-ui.tsx"
Cohesion: 0.19
Nodes (14): react, Field(), PlanForm(), statusOptions, ExternalLink(), MonitoringWorkspace(), focusableElements(), StatusBadge() (+6 more)

### Community 11 - "useFeedback"
Cohesion: 0.19
Nodes (11): next-auth, LoginPage(), Feedback, FeedbackContext, FeedbackContextValue, FeedbackType, styles, useFeedback() (+3 more)

### Community 12 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): bangkokDate(), acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), displayDate(), Draft, Field(), getWeekBounds(), PlanForm() (+3 more)

### Community 13 - "icons.tsx"
Cohesion: 0.35
Nodes (12): AppShell(), baseNavigation, Calendar(), Chart(), ChevronDown(), Close(), Grid(), History() (+4 more)

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
Cohesion: 0.39
Nodes (7): ConnectedMonitoringWorkspace(), loadPlans(), selectScope(), selectUser(), displayDate(), displayTimestamp(), Scope

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

### Community 23 - "attachments.ts"
Cohesion: 0.17
Nodes (11): ref_node_stream, AttachmentStorage, ActionPlanAttachment, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveFolderId() (+3 more)

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
Cohesion: 0.22
Nodes (7): bcryptjs, googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

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
- **182 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+177 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 228 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `Brief Proyek Action Plan Management`, `Setup Action Plan Management`, `AGENTS.md`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Why does `next` connect `use-cases.ts` to `connected-dashboard-workspace.tsx`, `(dashboard)/layout.tsx`, `next.config.ts`, `health/route.ts`, `connected-weekly-plan-workspace.tsx`, `useFeedback`, `icons.tsx`, `package.json`, `connected-monitoring-workspace.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `user()` connect `Users` to `use-cases.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _182 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08679245283018867 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09610389610389611 - nodes in this community are weakly interconnected._
- **Should `connected-dashboard-workspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0593990216631726 - nodes in this community are weakly interconnected._