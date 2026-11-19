# Graph Report - action-plan-management  (2026-11-18)

## Corpus Check
- 120 files · ~177,056 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 752 nodes · 2102 edges · 48 communities (38 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23e7662d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- repositories.ts
- models.ts
- divisions.ts
- use-cases.test.ts
- (dashboard)/layout.tsx
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
- connected-user-management-workspace.tsx
- workspace-ui.tsx
- Brief Proyek Action Plan Management
- attachments.ts
- Setup Action Plan Management
- Division extension documentation check
- bootstrap-admin.mjs
- AGENTS.md
- Penerapan multi-divisi
- postcss.config.mjs
- auth.ts
- { GET, POST }
- multi-division-brief.md
- verification.md
- devDependencies
- dependencies
- finish-review.md
- scripts
- eslint.config.mjs
- Multi-division gap closure — 18 November 2026
- vitest
- vite
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 65 edges
2. `AppError` - 49 edges
3. `apiError()` - 39 edges
4. `next` - 36 edges
5. `requireAdmin()` - 29 edges
6. `ConnectedDashboardWorkspace()` - 21 edges
7. `ConnectedMonitoringWorkspace()` - 21 edges
8. `ConnectedActionPlanWorkspace()` - 20 edges
9. `useFeedback()` - 20 edges
10. `PageHeading()` - 20 edges

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

## Communities (48 total, 10 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.07
Nodes (88): next, DELETE(), GET(), acceptedTypes, POST(), DELETE(), PATCH(), GET() (+80 more)

### Community 1 - "repositories.ts"
Cohesion: 0.08
Nodes (37): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), CachedRead, clearReadCache(), deleteRow() (+29 more)

### Community 2 - "models.ts"
Cohesion: 0.06
Nodes (44): @playwright/test, react-dom, src_app_globals, metadata, RootLayout(), calendarDates(), DashboardPlan, DashboardSummary (+36 more)

### Community 3 - "divisions.ts"
Cohesion: 0.17
Nodes (17): accessWrite, activeAdmin(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser(), serializeAccessWrite(), DivisionRepository (+9 more)

### Community 4 - "use-cases.test.ts"
Cohesion: 0.11
Nodes (17): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, ActionPlanRepository, StatusRepository, WeeklyPlanRepository (+9 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.48
Nodes (4): DashboardError(), DashboardLayout(), DataUnavailable(), DataUnavailableProps

### Community 6 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 7 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.19
Nodes (11): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Users"
Cohesion: 0.19
Nodes (13): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User, 5. Sheet `Weekly Plans`, 6. Relasi dan isolasi data (+5 more)

### Community 10 - "action-plan-workspace.tsx"
Cohesion: 0.22
Nodes (13): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Search(), MonitoringWorkspace(), StatusBadge() (+5 more)

### Community 11 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 12 - "connected-action-plan-workspace.tsx"
Cohesion: 0.20
Nodes (9): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), displayDate(), Draft, Field(), getWeekBounds(), PlanForm(), View (+1 more)

### Community 13 - "icons.tsx"
Cohesion: 0.23
Nodes (16): LoginPage(), AppShell(), baseNavigation, ArrowRight(), Calendar(), Chart(), CheckMark(), ChevronDown() (+8 more)

### Community 14 - "System Architecture — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+6 more)

### Community 15 - "Tech Stack — Action Plan Management System"
Cohesion: 0.15
Nodes (13): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+5 more)

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, version, lucide-react, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 17 - "connected-monitoring-workspace.tsx"
Cohesion: 0.13
Nodes (19): ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker(), renderResult() (+11 more)

### Community 18 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 19 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 7. Validasi integritas, 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 6. Halaman dan navigasi (+6 more)

### Community 20 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 21 - "Product"
Cohesion: 0.20
Nodes (9): Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose, Stack (+1 more)

### Community 23 - "connected-user-management-workspace.tsx"
Cohesion: 0.14
Nodes (16): ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm(), persist() (+8 more)

### Community 24 - "workspace-ui.tsx"
Cohesion: 0.20
Nodes (14): Evidence checked, react, ConnectedDivisionWorkspace(), DivisionForm(), Pencil(), UserField(), UserForm(), UserManagementWorkspace() (+6 more)

### Community 25 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 26 - "attachments.ts"
Cohesion: 0.17
Nodes (11): ref_node_stream, AttachmentStorage, ActionPlanAttachment, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveFolderId() (+3 more)

### Community 27 - "Setup Action Plan Management"
Cohesion: 0.29
Nodes (7): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Setup Action Plan Management

### Community 28 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 29 - "bootstrap-admin.mjs"
Cohesion: 0.22
Nodes (7): bcryptjs, googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 30 - "AGENTS.md"
Cohesion: 0.25
Nodes (7): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Urutan kerja, Validasi dan performa

### Community 31 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 33 - "auth.ts"
Cohesion: 0.15
Nodes (11): next-auth, authenticateUser(), handlers, signIn, signOut, AccountStatus, JWT, next-auth (+3 more)

### Community 38 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+4 more)

### Community 39 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, bcryptjs, googleapis, lucide-react, next, next-auth, react, react-dom (+1 more)

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, bootstrap:admin, build, dev, lint, start, test, test:ui

### Community 42 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 43 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

## Knowledge Gaps
- **218 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 280 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `Brief Proyek Action Plan Management`, `Setup Action Plan Management`, `AGENTS.md`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `models.ts`, `(dashboard)/layout.tsx`, `connected-weekly-plan-workspace.tsx`, `icons.tsx`, `next.config.ts`, `health/route.ts`, `package.json`, `connected-monitoring-workspace.tsx`, `workspace-ui.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `user()` connect `Product Requirements Document — Action Plan Management System` to `Users`, `use-cases.test.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.0736347621843805 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07857769973661106 - nodes in this community are weakly interconnected._