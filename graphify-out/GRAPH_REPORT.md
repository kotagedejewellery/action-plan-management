# Graph Report - action-plan-management  (2026-11-23)

## Corpus Check
- 156 files · ~249,817 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 1019 nodes · 2898 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e17db92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- .ensureSchema
- errors.ts
- connected-dashboard-workspace.tsx
- attachments.ts
- use-cases.ts
- monitoring/page.tsx
- postgres.ts
- models.ts
- divisions.ts
- AppError
- PageHeading
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- react
- server.mjs
- Users
- connected-action-plan-workspace.tsx
- connected-weekly-plan-workspace.tsx
- System Architecture — Action Plan Management System
- notes-websocket-bridge.test.ts
- Tech Stack — Action Plan Management System
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- devDependencies
- AGENTS.md
- Product Requirements Document — Action Plan Management System
- Product
- repositories.ts
- PROJECT_BRIEF.md
- note-collaboration.ts
- Setup Action Plan Management
- scripts
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- Glossary
- finish-review.md
- MonitoringDetailPanel
- 2. Clean Architecture
- Division extension documentation check
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- ConnectedDivisionWorkspace
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- package.json
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 90 edges
2. `AppError` - 68 edges
3. `apiError()` - 62 edges
4. `next` - 47 edges
5. `requireAdmin()` - 29 edges
6. `vitest` - 23 edges
7. `requireUserWorkspace()` - 22 edges
8. `ConnectedActionPlanWorkspace()` - 22 edges
9. `ConnectedMonitoringWorkspace()` - 22 edges
10. `useFeedback()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `13. PostgreSQL Catatan Kolaboratif` --references--> `owner()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/application/notes.ts
- `Catatan Kolaboratif` --references--> `owner()`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/application/notes.ts
- `Perlindungan data dan penyimpanan` --references--> `Users()`  [INFERRED]
  AGENTS.md → src/presentation/components/icons.tsx
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `Penyimpanan dan integrasi menurut dokumentasi` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.05
Nodes (104): nextConfig, next, ref_node_events, POST(), DELETE(), GET(), acceptedTypes, POST() (+96 more)

### Community 1 - ".ensureSchema"
Cohesion: 0.08
Nodes (32): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), assertApprovalHeaders(), clearReadCache(), deleteRow() (+24 more)

### Community 2 - "errors.ts"
Cohesion: 0.10
Nodes (21): ref_node_fs, ref_node_path, vitest, DashboardError(), DashboardLayout(), src_app_globals, metadata, RootLayout() (+13 more)

### Community 3 - "connected-dashboard-workspace.tsx"
Cohesion: 0.06
Nodes (40): @playwright/test, react-dom, DashboardLoading(), calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary (+32 more)

### Community 4 - "attachments.ts"
Cohesion: 0.14
Nodes (14): googleapis, ref_next_env, ref_node_crypto, ref_node_stream, sheets, spreadsheetId, timestamp, driveQueryValue() (+6 more)

### Community 5 - "use-cases.ts"
Cohesion: 0.13
Nodes (22): Application, bcryptjs, requireUserWorkspace(), AttachmentStorage, StatusRepository, WeeklyPlanRepository, ActionPlanScope, addOwnActionPlanAttachments() (+14 more)

### Community 6 - "monitoring/page.tsx"
Cohesion: 0.13
Nodes (28): ActionPlansPage(), DashboardPage(), HistoryPage(), MonitoringPage(), WeeklyPlansPage(), requireMonitorActor(), visibleMembers(), approvalStates() (+20 more)

### Community 7 - "postgres.ts"
Cohesion: 0.12
Nodes (15): NoteRepository, NoteWorkspaceRepository, CollaborativeNote, NoteWorkspace, NoteWorkspaceMember, databaseUrl(), iso(), loadNoteDocument() (+7 more)

### Community 8 - "models.ts"
Cohesion: 0.14
Nodes (18): assertCanReadMember(), approvalState, approvalWrite, decideApproval(), latestForPlan(), listMemberApprovalStates(), serializeApprovalWrite(), submitForApproval() (+10 more)

### Community 9 - "divisions.ts"
Cohesion: 0.17
Nodes (17): accessWrite, activeAdmin(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser(), serializeAccessWrite(), DivisionRepository (+9 more)

### Community 10 - "AppError"
Cohesion: 0.20
Nodes (22): requireActiveActor(), requireApprovalBod(), resolveActor(), AppError, assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote() (+14 more)

### Community 11 - "PageHeading"
Cohesion: 0.17
Nodes (20): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+12 more)

### Community 12 - "connected-user-management-workspace.tsx"
Cohesion: 0.15
Nodes (17): Evidence checked, SafeUser, DivisionForm(), ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput (+9 more)

### Community 13 - "icons.tsx"
Cohesion: 0.21
Nodes (19): LoginPage(), AppShell(), baseNavigation, BrandLogo(), useFeedback(), ArrowRight(), Calendar(), Chart() (+11 more)

### Community 14 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 15 - "collaborative-note-editor.tsx"
Cohesion: 0.14
Nodes (19): lucide-react, @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, Actor, Collaborator, colors (+11 more)

### Community 16 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, crossws, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react (+11 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 18 - "react"
Cohesion: 0.14
Nodes (14): react, NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, request() (+6 more)

### Community 19 - "server.mjs"
Cohesion: 0.16
Nodes (11): @hocuspocus/extension-database, ref_node_http, pg, client, app, collaboration, collaborationRuntime(), handle (+3 more)

### Community 20 - "Users"
Cohesion: 0.14
Nodes (17): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+9 more)

### Community 21 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 22 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (10): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+2 more)

### Community 23 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 24 - "notes-websocket-bridge.test.ts"
Cohesion: 0.15
Nodes (8): crossws, @hocuspocus/provider, @hocuspocus/server, yjs, request(), providers, connections, providers

### Community 25 - "Tech Stack — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+6 more)

### Community 26 - "2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md"
Cohesion: 0.15
Nodes (12): Hal yang sudah bekerja, Isu prioritas, Kesehatan desain, Observasi kecil, P0 — Skeleton Dashboard menyerupai aplikasi yang rusak, P1 — Antrean intervensi harus berada di atas laporan deskriptif, P1 — Scope divisi di Monitoring berulang dan membebani scan, P2 — Aksi baris Monitoring perlu lebih jelas (+4 more)

### Community 27 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/pg (+5 more)

### Community 28 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Skill dan alat tambahan, This is NOT the Next.js you know, Urutan kerja (+2 more)

### Community 29 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.18
Nodes (10): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 7. Kebutuhan nonfungsional, 8. Ruang lingkup (+2 more)

### Community 30 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 31 - "repositories.ts"
Cohesion: 0.18
Nodes (10): APPROVAL_HEADERS, CachedRead, DIVISION_HEADERS, LEGACY_DIVISION_HEADERS, legacyPlanMigrations, PLAN_HEADERS, readCache, Row (+2 more)

### Community 32 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 33 - "note-collaboration.ts"
Cohesion: 0.31
Nodes (7): GET(), closeNoteCollaborationConnectionsForUser(), noteCollaborationConfigured(), noteCollaborationReady(), NoteReader, NoteRuntime, WorkspaceReader

### Community 34 - "Setup Action Plan Management"
Cohesion: 0.22
Nodes (9): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+1 more)

### Community 35 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, bootstrap:admin, build, dev, lint, migrate:notes, start, test (+1 more)

### Community 36 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 37 - "next-auth.d.ts"
Cohesion: 0.29
Nodes (6): next-auth, JWT, next-auth, next-auth/jwt, Session, User

### Community 38 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 39 - "Glossary"
Cohesion: 0.33
Nodes (5): Approval Action Plan, BOD Approver, Bukti hasil, Glossary, Perlu revisi

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "MonitoringDetailPanel"
Cohesion: 0.33
Nodes (3): AttachmentImage(), displayTimestamp(), MonitoringDetailPanel()

### Community 42 - "2. Clean Architecture"
Cohesion: 0.40
Nodes (5): 2. Clean Architecture, Domain, Infrastructure, Presentation, UserRole

### Community 43 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 44 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 45 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 46 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 47 - "ConnectedDivisionWorkspace"
Cohesion: 1.00
Nodes (3): ConnectedDivisionWorkspace(), save(), toggleApproval()

### Community 52 - "package.json"
Cohesion: 0.11
Nodes (16): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+8 more)

## Knowledge Gaps
- **300 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 370 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Brief Proyek Action Plan Management`, `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `AGENTS.md`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `note-collaboration.ts`, `errors.ts`, `connected-dashboard-workspace.tsx`, `monitoring/page.tsx`, `models.ts`, `connected-user-management-workspace.tsx`, `icons.tsx`, `server.mjs`, `package.json`, `connected-weekly-plan-workspace.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `vitest` connect `errors.ts` to `currentActor`, `.ensureSchema`, `note-collaboration.ts`, `connected-dashboard-workspace.tsx`, `use-cases.ts`, `models.ts`, `divisions.ts`, `AppError`, `collaborative-note-editor.tsx`, `react`, `package.json`, `notes-websocket-bridge.test.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _300 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.050917225950783 - nodes in this community are weakly interconnected._
- **Should `.ensureSchema` be split into smaller, more focused modules?**
  _Cohesion score 0.0773892773892774 - nodes in this community are weakly interconnected._