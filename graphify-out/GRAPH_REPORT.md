# Graph Report - action-plan-management  (2026-11-24)

## Corpus Check
- 165 files · ~264,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .log 1, .ico 1)

## Summary
- 1129 nodes · 3243 edges · 61 communities (54 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bd095b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-cases.ts
- repositories.ts
- errors.ts
- notes.ts
- connected-dashboard-workspace.tsx
- schemas.ts
- currentActor
- container.ts
- api-error.ts
- connected-monitoring-workspace.tsx
- users/[userId]/route.ts
- PageHeading
- icons.tsx
- Design System: Action Plan Management System
- connected-user-management-workspace.tsx
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- main.tsx
- connected-action-plan-workspace.tsx
- Users
- System Architecture — Action Plan Management System
- devDependencies
- AppError
- notes-websocket-bridge.test.ts
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- Product Requirements Document — Action Plan Management System
- AGENTS.md
- Product
- server.mjs
- PROJECT_BRIEF.md
- scripts
- Setup Action Plan Management
- Tech Stack — Action Plan Management System
- Glossary
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- 3. Keputusan implementasi utama
- Division extension documentation check
- finish-review.md
- Monitoring anggota
- googleDriveClient
- divisions.ts
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- { GET, POST }
- connected-weekly-plan-workspace.tsx
- package.json
- approvals.test.ts
- ActionPlan
- models.ts
- vitest
- User
- auth.ts
- lucide-react
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 99 edges
2. `AppError` - 80 edges
3. `apiError()` - 71 edges
4. `next` - 50 edges
5. `requireAdmin()` - 30 edges
6. `vitest` - 24 edges
7. `useFeedback()` - 23 edges
8. `DialogFrame()` - 23 edges
9. `requireUserWorkspace()` - 22 edges
10. `User` - 22 edges

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

## Communities (61 total, 7 thin omitted)

### Community 0 - "use-cases.ts"
Cohesion: 0.14
Nodes (15): bcryptjs, AttachmentStorage, StatusRepository, WeeklyPlanRepository, ActionPlanScope, addOwnActionPlanAttachments(), createOwnWeeklyPlan(), createStatus() (+7 more)

### Community 1 - "repositories.ts"
Cohesion: 0.06
Nodes (48): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), APPROVAL_DIVISION_HEADERS, APPROVAL_HEADERS, assertApprovalHeaders() (+40 more)

### Community 2 - "errors.ts"
Cohesion: 0.09
Nodes (21): ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp, apply, headers, sheetNames (+13 more)

### Community 3 - "notes.ts"
Cohesion: 0.07
Nodes (44): requireActiveActor(), assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote(), deleteNoteImage(), deleteNoteWorkspace(), inviteNoteWorkspaceMember() (+36 more)

### Community 4 - "connected-dashboard-workspace.tsx"
Cohesion: 0.06
Nodes (38): port, @playwright/test, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, ConnectedDashboardWorkspace() (+30 more)

### Community 5 - "schemas.ts"
Cohesion: 0.13
Nodes (15): GET(), POST(), Context, GET(), POST(), actionPlanInputSchema, approvalDecisionSchema, dashboardPeriodInputSchema (+7 more)

### Community 6 - "currentActor"
Cohesion: 0.10
Nodes (42): POST(), DELETE(), GET(), acceptedTypes, POST(), DELETE(), PATCH(), POST() (+34 more)

### Community 7 - "container.ts"
Cohesion: 0.17
Nodes (26): next, GET(), GET(), ActionPlansPage(), DashboardPage(), HistoryPage(), MonitoringPage(), WeeklyPlansPage() (+18 more)

### Community 8 - "api-error.ts"
Cohesion: 0.11
Nodes (32): ref_node_events, GET(), runtime, DELETE(), GET(), acceptedTypes, hasImageSignature(), POST() (+24 more)

### Community 9 - "connected-monitoring-workspace.tsx"
Cohesion: 0.11
Nodes (21): SafeUser, bangkokDate(), ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate() (+13 more)

### Community 10 - "users/[userId]/route.ts"
Cohesion: 0.23
Nodes (10): GET(), deleteUserInputSchema, userInputSchema, closeNoteCollaborationConnectionsForUser(), noteCollaborationConfigured(), noteCollaborationEnabled(), noteCollaborationReady(), NoteReader (+2 more)

### Community 11 - "PageHeading"
Cohesion: 0.18
Nodes (19): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+11 more)

### Community 12 - "icons.tsx"
Cohesion: 0.18
Nodes (21): next-auth, react, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, BrandLogo(), ArrowRight() (+13 more)

### Community 13 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 14 - "connected-user-management-workspace.tsx"
Cohesion: 0.12
Nodes (23): Evidence checked, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), ConnectedUserManagementWorkspace(), DeleteUserDialog(), divisionManagementHref() (+15 more)

### Community 15 - "collaborative-note-editor.tsx"
Cohesion: 0.14
Nodes (19): ref_tiptap_core, Actor, Collaborator, colors, endpoint(), fetchSession(), imageTypes, initials() (+11 more)

### Community 16 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react, next (+11 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 18 - "main.tsx"
Cohesion: 0.10
Nodes (19): react-dom, DashboardLoading(), NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note (+11 more)

### Community 19 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 20 - "Users"
Cohesion: 0.16
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+8 more)

### Community 21 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 22 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/pg (+6 more)

### Community 23 - "AppError"
Cohesion: 0.21
Nodes (19): assertCanReadMember(), requireApprovalBod(), requireMonitorActor(), requireUserWorkspace(), visibleMembers(), approvalState, approvalWrite, latestForPlan() (+11 more)

### Community 24 - "notes-websocket-bridge.test.ts"
Cohesion: 0.20
Nodes (8): @hocuspocus/provider, @hocuspocus/server, ref_node_http, ws, yjs, request(), providers, providers

### Community 25 - "2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md"
Cohesion: 0.15
Nodes (12): Hal yang sudah bekerja, Isu prioritas, Kesehatan desain, Observasi kecil, P0 — Skeleton Dashboard menyerupai aplikasi yang rusak, P1 — Antrean intervensi harus berada di atas laporan deskriptif, P1 — Scope divisi di Monitoring berulang dan membebani scan, P2 — Aksi baris Monitoring perlu lebih jelas (+4 more)

### Community 26 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 6. Halaman dan navigasi, 7. Kebutuhan nonfungsional (+3 more)

### Community 27 - "AGENTS.md"
Cohesion: 0.18
Nodes (10): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, Skill dan alat tambahan, This is NOT the Next.js you know, Urutan kerja (+2 more)

### Community 28 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 29 - "server.mjs"
Cohesion: 0.15
Nodes (11): @hocuspocus/extension-database, pg, client, client, app, collaboration, collaborationRuntime(), handle (+3 more)

### Community 30 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 31 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, bootstrap:admin, build, check:action-plans, check:notes, dev, lint, migrate:action-plans (+4 more)

### Community 32 - "Setup Action Plan Management"
Cohesion: 0.20
Nodes (10): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+2 more)

### Community 33 - "Tech Stack — Action Plan Management System"
Cohesion: 0.25
Nodes (8): 1. Prinsip pemilihan, 2. Stack yang digunakan, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Otorisasi multi-divisi, Tech Stack — Action Plan Management System

### Community 34 - "Glossary"
Cohesion: 0.25
Nodes (7): Approval Action Plan, BOD Approver, BOD Monitor, Bukti hasil, Glossary, Lead BOD, Perlu revisi

### Community 35 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 36 - "next-auth.d.ts"
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 37 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 38 - "3. Keputusan implementasi utama"
Cohesion: 0.33
Nodes (6): 3. Keputusan implementasi utama, Antarmuka, Autentikasi, Catatan Kolaboratif, Google Drive, Google Sheets

### Community 39 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 42 - "googleDriveClient"
Cohesion: 0.12
Nodes (16): googleapis, ref_node_stream, GET(), NoteImageStorage, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName() (+8 more)

### Community 43 - "divisions.ts"
Cohesion: 0.20
Nodes (15): resolveActor(), accessWrite, activeAdmin(), deleteManagedUser(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser() (+7 more)

### Community 44 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 45 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 51 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (10): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+2 more)

### Community 52 - "package.json"
Cohesion: 0.09
Nodes (21): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+13 more)

### Community 53 - "approvals.test.ts"
Cohesion: 0.23
Nodes (9): decideApproval(), serializeApprovalWrite(), submitForApproval(), ActionPlanApprovalRepository, ActionPlanApproval, bodActor, division, owner (+1 more)

### Community 54 - "ActionPlan"
Cohesion: 0.21
Nodes (7): 2. Clean Architecture, Application, Infrastructure, Presentation, ActionPlanRepository, deleteOwnWeeklyPlan(), ActionPlan

### Community 55 - "models.ts"
Cohesion: 0.22
Nodes (10): Domain, AccountStatus, ActionPlanAttachment, ActionPlanStatus, NoteWorkspaceRole, UserRole, account(), actor (+2 more)

### Community 56 - "vitest"
Cohesion: 0.21
Nodes (9): ref_node_fs, ref_node_path, vitest, src_app_globals, metadata, RootLayout(), viewport, FeedbackProvider() (+1 more)

### Community 57 - "User"
Cohesion: 0.32
Nodes (6): UserRepository, authenticateUser(), createUser(), updateUser(), toSafeUser(), User

### Community 58 - "auth.ts"
Cohesion: 0.40
Nodes (4): auth, handlers, signIn, signOut

## Knowledge Gaps
- **324 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+319 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 401 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `container.ts` to `connected-dashboard-workspace.tsx`, `schemas.ts`, `currentActor`, `api-error.ts`, `connected-monitoring-workspace.tsx`, `users/[userId]/route.ts`, `googleDriveClient`, `icons.tsx`, `connected-user-management-workspace.tsx`, `connected-weekly-plan-workspace.tsx`, `package.json`, `vitest`, `next.config.ts`, `server.mjs`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `currentActor()` connect `currentActor` to `Tech Stack — Action Plan Management System`, `schemas.ts`, `container.ts`, `api-error.ts`, `googleDriveClient`, `users/[userId]/route.ts`, `icons.tsx`, `divisions.ts`, `main.tsx`, `System Architecture — Action Plan Management System`, `AppError`, `auth.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Tech Stack — Action Plan Management System`, `Brief Proyek Action Plan Management`, `3. Keputusan implementasi utama`, `icons.tsx`, `System Architecture — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `AGENTS.md`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _324 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14193548387096774 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06246498599439776 - nodes in this community are weakly interconnected._