# Graph Report - action-plan-management  (2026-11-23)

## Corpus Check
- 162 files · ~253,670 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 1085 nodes · 3128 edges · 57 communities (52 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 136 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a5fa222`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- repositories.ts
- errors.ts
- approvals.ts
- googleDriveClient
- schemas.ts
- ConnectedMonitoringWorkspace
- notes.ts
- monitoring/page.tsx
- container.ts
- connected-dashboard-workspace.tsx
- PageHeading
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- connected-notes-workspace.tsx
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
- notes-api.test.ts
- PROJECT_BRIEF.md
- AppError
- Setup Action Plan Management
- scripts
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- Glossary
- finish-review.md
- models.ts
- bootstrap-admin.mjs
- divisions.ts
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- connected-monitoring-workspace.tsx
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- package.json
- { GET, POST }
- requireAdmin
- users/[userId]/route.ts
- auth.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 98 edges
2. `AppError` - 75 edges
3. `apiError()` - 70 edges
4. `next` - 50 edges
5. `requireAdmin()` - 29 edges
6. `vitest` - 23 edges
7. `requireUserWorkspace()` - 22 edges
8. `notesPool()` - 22 edges
9. `ConnectedActionPlanWorkspace()` - 22 edges
10. `ConnectedMonitoringWorkspace()` - 22 edges

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

## Communities (57 total, 5 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.13
Nodes (28): POST(), DELETE(), GET(), POST(), DELETE(), POST(), PATCH(), GET() (+20 more)

### Community 1 - "repositories.ts"
Cohesion: 0.07
Nodes (43): Infrastructure, required(), sheetsClient(), spreadsheetId(), append(), appendMany(), APPROVAL_HEADERS, assertApprovalHeaders() (+35 more)

### Community 2 - "errors.ts"
Cohesion: 0.10
Nodes (21): ref_node_fs, ref_node_path, vitest, DashboardError(), DashboardLayout(), src_app_globals, metadata, RootLayout() (+13 more)

### Community 3 - "approvals.ts"
Cohesion: 0.13
Nodes (18): requireApprovalBod(), approvalState, approvalWrite, decideApproval(), latestForPlan(), listMemberApprovalStates(), serializeApprovalWrite(), submitForApproval() (+10 more)

### Community 4 - "googleDriveClient"
Cohesion: 0.13
Nodes (13): ref_node_stream, NoteImageStorage, ActionPlanAttachment, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveQueryValue() (+5 more)

### Community 5 - "schemas.ts"
Cohesion: 0.11
Nodes (23): ref_node_events, GET(), runtime, GET(), POST(), Context, GET(), POST() (+15 more)

### Community 6 - "ConnectedMonitoringWorkspace"
Cohesion: 0.19
Nodes (12): ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker(), renderResult() (+4 more)

### Community 7 - "notes.ts"
Cohesion: 0.07
Nodes (44): requireActiveActor(), assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote(), deleteNoteImage(), deleteNoteWorkspace(), inviteNoteWorkspaceMember() (+36 more)

### Community 8 - "monitoring/page.tsx"
Cohesion: 0.25
Nodes (19): GET(), ActionPlansPage(), DashboardPage(), HistoryPage(), MonitoringPage(), WeeklyPlansPage(), requireMonitorActor(), visibleMembers() (+11 more)

### Community 9 - "container.ts"
Cohesion: 0.28
Nodes (8): nextConfig, next, acceptedTypes, Context, divisionInputSchema, attachments, divisions, users

### Community 10 - "connected-dashboard-workspace.tsx"
Cohesion: 0.06
Nodes (42): port, @playwright/test, react-dom, DashboardLoading(), calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard() (+34 more)

### Community 11 - "PageHeading"
Cohesion: 0.18
Nodes (17): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Pencil(), Plus(), Search(), MonitoringWorkspace() (+9 more)

### Community 12 - "connected-user-management-workspace.tsx"
Cohesion: 0.10
Nodes (22): SafeUser, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor() (+14 more)

### Community 13 - "icons.tsx"
Cohesion: 0.21
Nodes (18): LoginPage(), AppShell(), baseNavigation, BrandLogo(), ArrowRight(), Calendar(), Chart(), CheckMark() (+10 more)

### Community 14 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 15 - "collaborative-note-editor.tsx"
Cohesion: 0.11
Nodes (24): lucide-react, ref_tiptap_core, @tiptap/extension-collaboration, @tiptap/extension-collaboration-caret, @tiptap/react, @tiptap/starter-kit, Actor, Collaborator (+16 more)

### Community 16 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react, next (+11 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 18 - "connected-notes-workspace.tsx"
Cohesion: 0.24
Nodes (9): NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, NotesRequestError, request() (+1 more)

### Community 19 - "server.mjs"
Cohesion: 0.15
Nodes (11): @hocuspocus/extension-database, pg, client, client, app, collaboration, collaborationRuntime(), handle (+3 more)

### Community 20 - "Users"
Cohesion: 0.14
Nodes (17): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+9 more)

### Community 21 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (12): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+4 more)

### Community 22 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.13
Nodes (16): Division extension documentation check, Evidence checked, Existing drift left unchanged, Five-line system summary, Verification boundary, ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate() (+8 more)

### Community 23 - "System Architecture — Action Plan Management System"
Cohesion: 0.11
Nodes (19): 1. Ringkasan, 2. Clean Architecture, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi (+11 more)

### Community 24 - "notes-websocket-bridge.test.ts"
Cohesion: 0.20
Nodes (8): @hocuspocus/provider, @hocuspocus/server, ref_node_http, ws, yjs, request(), providers, providers

### Community 25 - "Tech Stack — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+6 more)

### Community 26 - "2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md"
Cohesion: 0.15
Nodes (12): Hal yang sudah bekerja, Isu prioritas, Kesehatan desain, Observasi kecil, P0 — Skeleton Dashboard menyerupai aplikasi yang rusak, P1 — Antrean intervensi harus berada di atas laporan deskriptif, P1 — Scope divisi di Monitoring berulang dan membebani scan, P2 — Aksi baris Monitoring perlu lebih jelas (+4 more)

### Community 27 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/pg (+6 more)

### Community 28 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Skill dan alat tambahan, This is NOT the Next.js you know, Urutan kerja (+2 more)

### Community 29 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.18
Nodes (10): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 7. Kebutuhan nonfungsional, 8. Ruang lingkup (+2 more)

### Community 30 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 31 - "notes-api.test.ts"
Cohesion: 0.19
Nodes (17): DELETE(), GET(), acceptedTypes, hasImageSignature(), POST(), Context, DELETE(), PATCH() (+9 more)

### Community 32 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 33 - "AppError"
Cohesion: 0.13
Nodes (23): Application, bcryptjs, PATCH(), requireUserWorkspace(), AppError, AttachmentStorage, StatusRepository, WeeklyPlanRepository (+15 more)

### Community 34 - "Setup Action Plan Management"
Cohesion: 0.22
Nodes (9): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+1 more)

### Community 35 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, bootstrap:admin, build, check:notes, dev, lint, migrate:notes, start (+2 more)

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

### Community 41 - "models.ts"
Cohesion: 0.15
Nodes (15): assertCanReadMember(), resolveActor(), AccountStatus, Actor, NoteWorkspaceRole, admin, member, plan (+7 more)

### Community 42 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 43 - "divisions.ts"
Cohesion: 0.22
Nodes (13): accessWrite, activeAdmin(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser(), serializeAccessWrite(), UserRepository (+5 more)

### Community 44 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 45 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 46 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 47 - "connected-monitoring-workspace.tsx"
Cohesion: 0.19
Nodes (12): react, Period, PlanStatus(), Preset, Scope, ExternalLink(), AttachmentImage(), displayTimestamp() (+4 more)

### Community 52 - "package.json"
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+9 more)

### Community 54 - "requireAdmin"
Cohesion: 0.18
Nodes (14): GET(), GET(), PATCH(), GET(), POST(), responseError(), DivisionsPage(), UsersPage() (+6 more)

### Community 55 - "users/[userId]/route.ts"
Cohesion: 0.17
Nodes (14): GET(), Context, DELETE(), PATCH(), closeNoteCollaborationConnections(), closeNoteCollaborationConnectionsForUser(), noteCollaborationConfigured(), noteCollaborationEnabled() (+6 more)

### Community 56 - "auth.ts"
Cohesion: 0.50
Nodes (3): handlers, signIn, signOut

## Knowledge Gaps
- **308 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+303 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 381 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `container.ts` to `currentActor`, `AppError`, `errors.ts`, `schemas.ts`, `monitoring/page.tsx`, `connected-dashboard-workspace.tsx`, `connected-user-management-workspace.tsx`, `icons.tsx`, `connected-monitoring-workspace.tsx`, `server.mjs`, `package.json`, `requireAdmin`, `users/[userId]/route.ts`, `connected-weekly-plan-workspace.tsx`, `notes-api.test.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Brief Proyek Action Plan Management`, `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `AGENTS.md`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `AppError` connect `AppError` to `currentActor`, `repositories.ts`, `errors.ts`, `approvals.ts`, `notes.ts`, `monitoring/page.tsx`, `container.ts`, `models.ts`, `divisions.ts`, `requireAdmin`, `users/[userId]/route.ts`, `notes-api.test.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _308 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.12773109243697478 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06859806859806859 - nodes in this community are weakly interconnected._