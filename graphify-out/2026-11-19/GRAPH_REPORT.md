# Graph Report - action-plan-management  (2026-11-19)

## Corpus Check
- 121 files · ~201,144 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 766 nodes · 2117 edges · 45 communities (39 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78fa5ad5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- repositories.ts
- connected-dashboard-workspace.tsx
- division-access.test.ts
- use-cases.test.ts
- (dashboard)/layout.tsx
- Design System: Action Plan Management System
- connected-weekly-plan-workspace.tsx
- compilerOptions
- Users
- PageHeading
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
- main.tsx
- connected-user-management-workspace.tsx
- workspace-ui.tsx
- Brief Proyek Action Plan Management
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- Setup Action Plan Management
- Division extension documentation check
- bootstrap-admin.mjs
- AGENTS.md
- Penerapan multi-divisi
- postcss.config.mjs
- next-auth.d.ts
- { GET, POST }
- multi-division-brief.md
- verification.md
- devDependencies
- dependencies
- finish-review.md
- scripts
- eslint.config.mjs
- Multi-division gap closure — 18 November 2026
- vite

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
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `Penyimpanan dan integrasi menurut dokumentasi` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `1. Google Sheets dan Admin awal` --references--> `Users()`  [INFERRED]
  docs/SETUP.md → src/presentation/components/icons.tsx
- `6. Penanganan kegagalan` --references--> `Users()`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (45 total, 6 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.06
Nodes (97): nextConfig, googleapis, next, DELETE(), GET(), acceptedTypes, POST(), DELETE() (+89 more)

### Community 1 - "repositories.ts"
Cohesion: 0.08
Nodes (38): Infrastructure, required(), sheetsClient(), spreadsheetId(), append(), appendMany(), CachedRead, clearReadCache() (+30 more)

### Community 2 - "connected-dashboard-workspace.tsx"
Cohesion: 0.10
Nodes (26): ref_node_path, vitest, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, dashboardPeriodInputSchema (+18 more)

### Community 3 - "division-access.test.ts"
Cohesion: 0.17
Nodes (13): activeAdmin(), saveDivision(), saveManagedUser(), serializeAccessWrite(), DivisionRepository, UserRepository, createUser(), updateUser() (+5 more)

### Community 4 - "use-cases.test.ts"
Cohesion: 0.07
Nodes (25): 2. Clean Architecture, Application, Domain, Presentation, ref_node_stream, ActionPlanRepository, AttachmentStorage, StatusRepository (+17 more)

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
Cohesion: 0.18
Nodes (13): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 1. Model penyimpanan, 3. Sheet `Settings`, 4. Sheet Action Plan per User, 5. Sheet `Weekly Plans`, 6. Relasi dan isolasi data, 8. Operasi akses data (+5 more)

### Community 10 - "PageHeading"
Cohesion: 0.18
Nodes (18): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+10 more)

### Community 11 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 12 - "connected-action-plan-workspace.tsx"
Cohesion: 0.20
Nodes (8): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), displayDate(), Draft, Field(), getWeekBounds(), PlanForm(), View

### Community 13 - "icons.tsx"
Cohesion: 0.20
Nodes (19): next-auth, LoginPage(), AppShell(), baseNavigation, useFeedback(), ArrowRight(), Calendar(), Chart() (+11 more)

### Community 14 - "System Architecture — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+6 more)

### Community 15 - "Tech Stack — Action Plan Management System"
Cohesion: 0.15
Nodes (13): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+5 more)

### Community 16 - "package.json"
Cohesion: 0.15
Nodes (12): name, private, version, lucide-react, react-dom, tailwindcss, @tailwindcss/postcss, @types/node (+4 more)

### Community 17 - "connected-monitoring-workspace.tsx"
Cohesion: 0.12
Nodes (21): bangkokDate(), ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker() (+13 more)

### Community 18 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 19 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 2. Sheet `Users`, 7. Validasi integritas, 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan (+6 more)

### Community 20 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 21 - "Product"
Cohesion: 0.20
Nodes (9): Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose, Stack (+1 more)

### Community 22 - "main.tsx"
Cohesion: 0.11
Nodes (20): @playwright/test, DashboardLoading(), src_app_globals, metadata, RootLayout(), FeedbackProvider(), divisionFixture, divisionUsers (+12 more)

### Community 23 - "connected-user-management-workspace.tsx"
Cohesion: 0.19
Nodes (11): SafeUser, ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm() (+3 more)

### Community 24 - "workspace-ui.tsx"
Cohesion: 0.15
Nodes (13): Evidence checked, react, ConnectedDivisionWorkspace(), DivisionForm(), Feedback, FeedbackContext, FeedbackContextValue, FeedbackType (+5 more)

### Community 25 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 26 - "2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md"
Cohesion: 0.15
Nodes (12): Hal yang sudah bekerja, Isu prioritas, Kesehatan desain, Observasi kecil, P0 — Skeleton Dashboard menyerupai aplikasi yang rusak, P1 — Antrean intervensi harus berada di atas laporan deskriptif, P1 — Scope divisi di Monitoring berulang dan membebani scan, P2 — Aksi baris Monitoring perlu lebih jelas (+4 more)

### Community 27 - "Setup Action Plan Management"
Cohesion: 0.29
Nodes (7): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Setup Action Plan Management

### Community 28 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 29 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): bcryptjs, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 30 - "AGENTS.md"
Cohesion: 0.22
Nodes (8): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, This is NOT the Next.js you know, Urutan kerja, Validasi dan performa

### Community 31 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 33 - "next-auth.d.ts"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

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
- **230 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 290 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `Brief Proyek Action Plan Management`, `Setup Action Plan Management`, `AGENTS.md`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `connected-dashboard-workspace.tsx`, `(dashboard)/layout.tsx`, `connected-weekly-plan-workspace.tsx`, `icons.tsx`, `package.json`, `connected-monitoring-workspace.tsx`, `main.tsx`, `workspace-ui.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `user()` connect `Product Requirements Document — Action Plan Management System` to `use-cases.test.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.06369731800766283 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07715260017050299 - nodes in this community are weakly interconnected._