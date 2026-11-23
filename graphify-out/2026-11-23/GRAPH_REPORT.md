# Graph Report - action-plan-management  (2026-11-20)

## Corpus Check
- 150 files · ~247,926 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 991 nodes · 2821 edges · 55 communities (48 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 122 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38a3d1c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- WeeklyPlan
- vitest
- .ensureSchema
- attachments.ts
- models.ts
- main.tsx
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- PageHeading
- connected-dashboard-workspace.tsx
- dependencies
- compilerOptions
- package.json
- connected-weekly-plan-workspace.tsx
- Users
- System Architecture — Action Plan Management System
- connected-action-plan-workspace.tsx
- server.mjs
- repositories.ts
- feedback.tsx
- collaborative-note-editor.tsx
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- devDependencies
- next-auth.d.ts
- approvals.test.ts
- Product Requirements Document — Action Plan Management System
- Product
- replace
- PROJECT_BRIEF.md
- notes-realtime.test.ts
- AGENTS.md
- Setup Action Plan Management
- scripts
- Tech Stack — Action Plan Management System
- Brief Proyek Action Plan Management
- Penerapan multi-divisi
- connected-monitoring-workspace.tsx
- Glossary
- finish-review.md
- Division extension documentation check
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- ActionPlan
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- { GET, POST }
- 3. Keputusan implementasi utama
- vite
- publicError
- workspace-ui.tsx

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 88 edges
2. `AppError` - 68 edges
3. `apiError()` - 60 edges
4. `next` - 47 edges
5. `requireAdmin()` - 29 edges
6. `requireUserWorkspace()` - 22 edges
7. `ConnectedActionPlanWorkspace()` - 22 edges
8. `ConnectedMonitoringWorkspace()` - 22 edges
9. `useFeedback()` - 22 edges
10. `PageHeading()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `13. PostgreSQL Catatan Kolaboratif` --references--> `owner()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/application/notes.ts
- `Catatan Kolaboratif` --references--> `owner()`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/application/notes.ts
- `Perlindungan data dan penyimpanan` --references--> `Users()`  [INFERRED]
  AGENTS.md → src/presentation/components/icons.tsx
- `6. Halaman dan navigasi` --references--> `Users()`  [INFERRED]
  docs/PRD.md → src/presentation/components/icons.tsx
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (55 total, 7 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.05
Nodes (119): nextConfig, next, POST(), DELETE(), GET(), acceptedTypes, POST(), DELETE() (+111 more)

### Community 1 - "WeeklyPlan"
Cohesion: 0.15
Nodes (10): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, StatusRepository, WeeklyPlanRepository, ActionPlanStatus (+2 more)

### Community 2 - "vitest"
Cohesion: 0.07
Nodes (30): ref_node_fs, ref_node_path, vitest, Context, DELETE(), Context, DELETE(), src_app_globals (+22 more)

### Community 3 - ".ensureSchema"
Cohesion: 0.19
Nodes (7): GoogleSheetsActionPlanRepository, GoogleSheetsStatusRepository, GoogleSheetsWeeklyPlanRepository, migrateLegacyPlanRecords(), rangeSheetName(), rows(), weeklyRange()

### Community 4 - "attachments.ts"
Cohesion: 0.10
Nodes (19): bcryptjs, googleapis, ref_next_env, ref_node_crypto, ref_node_stream, sheets, spreadsheetId, timestamp (+11 more)

### Community 5 - "models.ts"
Cohesion: 0.07
Nodes (44): Context, GET(), POST(), requireActiveActor(), assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote() (+36 more)

### Community 6 - "main.tsx"
Cohesion: 0.07
Nodes (36): @playwright/test, DashboardLoading(), DashboardPage(), MonitoringPage(), requireMonitorActor(), visibleMembers(), bangkokDate(), ConnectedMonitoringWorkspace() (+28 more)

### Community 7 - "connected-user-management-workspace.tsx"
Cohesion: 0.19
Nodes (11): SafeUser, ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm() (+3 more)

### Community 8 - "icons.tsx"
Cohesion: 0.18
Nodes (21): next-auth, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, BrandLogo(), useFeedback(), ArrowRight() (+13 more)

### Community 9 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 10 - "PageHeading"
Cohesion: 0.18
Nodes (17): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Pencil(), Plus(), Search(), MonitoringWorkspace() (+9 more)

### Community 11 - "connected-dashboard-workspace.tsx"
Cohesion: 0.11
Nodes (24): lucide-react, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, ConnectedDashboardWorkspace(), refresh() (+16 more)

### Community 12 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, crossws, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react (+11 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "package.json"
Cohesion: 0.12
Nodes (15): eslintConfig, name, private, version, eslint, eslint-config-next, react-dom, tailwindcss (+7 more)

### Community 15 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (11): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+3 more)

### Community 16 - "Users"
Cohesion: 0.15
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+8 more)

### Community 17 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 18 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 19 - "server.mjs"
Cohesion: 0.15
Nodes (12): crossws, @hocuspocus/extension-database, ref_node_http, pg, client, app, collaboration, collaborationRuntime() (+4 more)

### Community 20 - "repositories.ts"
Cohesion: 0.11
Nodes (17): APPROVAL_HEADERS, CachedRead, DIVISION_HEADERS, ensureUserDivisionHeader(), GoogleSheetsUserRepository, LEGACY_DIVISION_HEADERS, legacyPlanMigrations, PLAN_HEADERS (+9 more)

### Community 21 - "feedback.tsx"
Cohesion: 0.16
Nodes (13): NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, request(), Workspace (+5 more)

### Community 22 - "collaborative-note-editor.tsx"
Cohesion: 0.20
Nodes (11): @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, Actor, colors, endpoint(), fetchSession() (+3 more)

### Community 23 - "2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md"
Cohesion: 0.15
Nodes (12): Hal yang sudah bekerja, Isu prioritas, Kesehatan desain, Observasi kecil, P0 — Skeleton Dashboard menyerupai aplikasi yang rusak, P1 — Antrean intervensi harus berada di atas laporan deskriptif, P1 — Scope divisi di Monitoring berulang dan membebani scan, P2 — Aksi baris Monitoring perlu lebih jelas (+4 more)

### Community 24 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/pg (+5 more)

### Community 25 - "next-auth.d.ts"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 26 - "approvals.test.ts"
Cohesion: 0.12
Nodes (14): ActionPlanApprovalRepository, DivisionRepository, ActionPlanApproval, Division, GoogleSheetsDivisionRepository, bodActor, division, owner (+6 more)

### Community 27 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 6. Halaman dan navigasi, 7. Kebutuhan nonfungsional (+3 more)

### Community 28 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 29 - "replace"
Cohesion: 0.27
Nodes (12): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), assertApprovalHeaders(), clearReadCache(), deleteRow() (+4 more)

### Community 30 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 31 - "notes-realtime.test.ts"
Cohesion: 0.33
Nodes (4): @hocuspocus/provider, @hocuspocus/server, yjs, providers

### Community 32 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Skill dan alat tambahan, This is NOT the Next.js you know, Urutan kerja (+2 more)

### Community 33 - "Setup Action Plan Management"
Cohesion: 0.22
Nodes (9): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+1 more)

### Community 34 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, bootstrap:admin, build, dev, lint, migrate:notes, start, test (+1 more)

### Community 35 - "Tech Stack — Action Plan Management System"
Cohesion: 0.25
Nodes (8): 1. Prinsip pemilihan, 2. Stack yang digunakan, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Otorisasi multi-divisi, Tech Stack — Action Plan Management System

### Community 36 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 37 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 38 - "connected-monitoring-workspace.tsx"
Cohesion: 0.20
Nodes (11): react, approvalState, Period, PlanStatus(), Preset, Scope, ExternalLink(), AttachmentImage() (+3 more)

### Community 39 - "Glossary"
Cohesion: 0.33
Nodes (5): Approval Action Plan, BOD Approver, Bukti hasil, Glossary, Perlu revisi

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 42 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 43 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 44 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 51 - "3. Keputusan implementasi utama"
Cohesion: 0.33
Nodes (6): 3. Keputusan implementasi utama, Antarmuka, Autentikasi, Catatan Kolaboratif, Google Drive, Google Sheets

### Community 53 - "publicError"
Cohesion: 0.43
Nodes (5): DashboardError(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

### Community 58 - "workspace-ui.tsx"
Cohesion: 0.26
Nodes (9): Evidence checked, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), AccountStatus(), ConfirmDialog(), focusableElements() (+1 more)

## Knowledge Gaps
- **294 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `AGENTS.md`, `Setup Action Plan Management`, `Tech Stack — Action Plan Management System`, `Brief Proyek Action Plan Management`, `icons.tsx`, `System Architecture — Action Plan Management System`, `3. Keputusan implementasi utama`, `Product Requirements Document — Action Plan Management System`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `vitest`, `attachments.ts`, `models.ts`, `main.tsx`, `connected-monitoring-workspace.tsx`, `icons.tsx`, `connected-dashboard-workspace.tsx`, `package.json`, `connected-weekly-plan-workspace.tsx`, `server.mjs`, `workspace-ui.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `AppError` connect `currentActor` to `vitest`, `models.ts`, `main.tsx`, `icons.tsx`, `repositories.ts`, `publicError`, `approvals.test.ts`, `replace`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.051690917547006845 - nodes in this community are weakly interconnected._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.07087486157253599 - nodes in this community are weakly interconnected._