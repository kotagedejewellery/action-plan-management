# Graph Report - action-plan-management  (2026-11-24)

## Corpus Check
- 163 files · ~256,673 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 1099 nodes · 3190 edges · 65 communities (60 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c769f08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiError
- repositories.ts
- vitest
- errors.ts
- googleDriveClient
- 3. Keputusan implementasi utama
- connected-monitoring-workspace.tsx
- notes.ts
- container.ts
- Division extension documentation check
- connected-dashboard-workspace.tsx
- action-plan-workspace.tsx
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- feedback.tsx
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
- divisions.ts
- Setup Action Plan Management
- scripts
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- Glossary
- finish-review.md
- approvals.ts
- bootstrap-admin.mjs
- AppError
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- user-deletion.test.ts
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- package.json
- { GET, POST }
- currentActor
- users/[userId]/route.ts
- auth.ts
- models.ts
- main.tsx
- action-plans/page.tsx
- monitoring-fixture.ts
- note-workspace-events.ts
- dashboard-analytics.ts
- fixture.ts
- note-session.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 99 edges
2. `AppError` - 77 edges
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

## Communities (65 total, 5 thin omitted)

### Community 0 - "apiError"
Cohesion: 0.09
Nodes (27): GET(), Context, GET(), GET(), POST(), Context, GET(), POST() (+19 more)

### Community 1 - "repositories.ts"
Cohesion: 0.07
Nodes (43): Division, required(), sheetsClient(), spreadsheetId(), append(), appendMany(), APPROVAL_HEADERS, assertApprovalHeaders() (+35 more)

### Community 2 - "vitest"
Cohesion: 0.17
Nodes (10): ref_node_fs, ref_node_path, vitest, src_app_globals, metadata, RootLayout(), viewport, dashboardPeriodInputSchema (+2 more)

### Community 3 - "errors.ts"
Cohesion: 0.36
Nodes (6): DashboardError(), AppErrorCode, errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

### Community 4 - "googleDriveClient"
Cohesion: 0.13
Nodes (13): ref_node_stream, AttachmentStorage, ActionPlanAttachment, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveQueryValue() (+5 more)

### Community 5 - "3. Keputusan implementasi utama"
Cohesion: 0.33
Nodes (6): 3. Keputusan implementasi utama, Antarmuka, Autentikasi, Catatan Kolaboratif, Google Drive, Google Sheets

### Community 6 - "connected-monitoring-workspace.tsx"
Cohesion: 0.10
Nodes (24): approvalState, SafeUser, ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate() (+16 more)

### Community 7 - "notes.ts"
Cohesion: 0.06
Nodes (45): requireActiveActor(), assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote(), deleteNoteImage(), deleteNoteWorkspace(), inviteNoteWorkspaceMember() (+37 more)

### Community 8 - "container.ts"
Cohesion: 0.16
Nodes (20): nextConfig, next, acceptedTypes, POST(), GET(), POST(), GET(), divisionInputSchema (+12 more)

### Community 9 - "Division extension documentation check"
Cohesion: 0.40
Nodes (4): Division extension documentation check, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 10 - "connected-dashboard-workspace.tsx"
Cohesion: 0.17
Nodes (17): ConnectedDashboardWorkspace(), refresh(), selectPeriod(), DailyTrend(), DashboardData, DateField(), displayDate(), EmptyCopy() (+9 more)

### Community 11 - "action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (15): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Pencil(), Plus(), Search(), UserField() (+7 more)

### Community 12 - "connected-user-management-workspace.tsx"
Cohesion: 0.12
Nodes (23): Evidence checked, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), ConnectedUserManagementWorkspace(), DeleteUserDialog(), divisionManagementHref() (+15 more)

### Community 13 - "icons.tsx"
Cohesion: 0.18
Nodes (21): next-auth, react, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, BrandLogo(), ArrowRight() (+13 more)

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

### Community 18 - "feedback.tsx"
Cohesion: 0.14
Nodes (14): NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, NotesRequestError, request() (+6 more)

### Community 19 - "server.mjs"
Cohesion: 0.15
Nodes (11): @hocuspocus/extension-database, pg, client, client, app, collaboration, collaborationRuntime(), handle (+3 more)

### Community 20 - "Users"
Cohesion: 0.16
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+8 more)

### Community 21 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 22 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.20
Nodes (11): ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm(), WeeklyStats (+3 more)

### Community 23 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 24 - "notes-websocket-bridge.test.ts"
Cohesion: 0.20
Nodes (8): @hocuspocus/provider, @hocuspocus/server, ref_node_http, ws, yjs, request(), providers, providers

### Community 25 - "Tech Stack — Action Plan Management System"
Cohesion: 0.25
Nodes (8): 1. Prinsip pemilihan, 2. Stack yang digunakan, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Otorisasi multi-divisi, Tech Stack — Action Plan Management System

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
Cohesion: 0.17
Nodes (11): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 6. Halaman dan navigasi, 7. Kebutuhan nonfungsional (+3 more)

### Community 30 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 31 - "notes-api.test.ts"
Cohesion: 0.19
Nodes (20): DELETE(), GET(), acceptedTypes, hasImageSignature(), POST(), Context, DELETE(), PATCH() (+12 more)

### Community 32 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 33 - "divisions.ts"
Cohesion: 0.15
Nodes (18): resolveActor(), accessWrite, activeAdmin(), deleteManagedUser(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser() (+10 more)

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
Cohesion: 0.33
Nodes (5): JWT, next-auth, next-auth/jwt, Session, User

### Community 38 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 39 - "Glossary"
Cohesion: 0.33
Nodes (5): Approval Action Plan, BOD Approver, Bukti hasil, Glossary, Perlu revisi

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "approvals.ts"
Cohesion: 0.14
Nodes (16): assertCanReadMember(), requireApprovalBod(), approvalWrite, decideApproval(), latestForPlan(), listMemberApprovalStates(), serializeApprovalWrite(), submitForApproval() (+8 more)

### Community 42 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

### Community 43 - "AppError"
Cohesion: 0.25
Nodes (17): bcryptjs, requireUserWorkspace(), AppError, StatusRepository, ActionPlanScope, addOwnActionPlanAttachments(), createOwnWeeklyPlan(), createStatus() (+9 more)

### Community 44 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 45 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 46 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 47 - "user-deletion.test.ts"
Cohesion: 0.14
Nodes (12): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, WeeklyPlanRepository, UserRole, WeeklyPlan (+4 more)

### Community 52 - "package.json"
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+9 more)

### Community 54 - "currentActor"
Cohesion: 0.10
Nodes (32): POST(), DELETE(), GET(), DELETE(), PATCH(), PATCH(), PATCH(), GET() (+24 more)

### Community 55 - "users/[userId]/route.ts"
Cohesion: 0.19
Nodes (13): GET(), PATCH(), auth, weeklyPlans, closeNoteCollaborationConnectionsForUser(), noteCollaborationConfigured(), noteCollaborationEnabled(), noteCollaborationReady() (+5 more)

### Community 56 - "auth.ts"
Cohesion: 0.33
Nodes (5): authenticateUser(), handlers, signIn, signOut, AccountStatus

### Community 57 - "models.ts"
Cohesion: 0.33
Nodes (10): DashboardPage(), MonitoringPage(), requireMonitorActor(), visibleMembers(), Actor, NoteWorkspaceRole, toSafeUser(), bangkokDate() (+2 more)

### Community 58 - "main.tsx"
Cohesion: 0.23
Nodes (8): react-dom, DashboardLoading(), divisionFixture, divisionUsers, data, params, state, monitoringUsers

### Community 59 - "action-plans/page.tsx"
Cohesion: 0.53
Nodes (7): ActionPlansPage(), HistoryPage(), WeeklyPlansPage(), approvalStates(), listOwnWeeklyPlans(), listVisiblePlans(), DivisionUnavailable()

### Community 60 - "monitoring-fixture.ts"
Cohesion: 0.36
Nodes (4): port, @playwright/test, bimaPlans, monitoringPlans

### Community 61 - "note-workspace-events.ts"
Cohesion: 0.33
Nodes (6): ref_node_events, GET(), runtime, events(), NoteWorkspaceEvents, subscribeToNoteWorkspaceChanges()

### Community 62 - "dashboard-analytics.ts"
Cohesion: 0.31
Nodes (6): calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, users

### Community 63 - "fixture.ts"
Cohesion: 0.29
Nodes (6): dashboardFixture, names, plans, tasks, users, weeklyPlans

### Community 64 - "note-session.ts"
Cohesion: 0.52
Nodes (5): createNoteSession(), NoteSession, readNoteSession(), secret(), signature()

## Knowledge Gaps
- **309 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+304 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `container.ts` to `apiError`, `vitest`, `connected-monitoring-workspace.tsx`, `connected-dashboard-workspace.tsx`, `connected-user-management-workspace.tsx`, `icons.tsx`, `server.mjs`, `package.json`, `currentActor`, `users/[userId]/route.ts`, `connected-weekly-plan-workspace.tsx`, `models.ts`, `action-plans/page.tsx`, `notes-api.test.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Brief Proyek Action Plan Management`, `3. Keputusan implementasi utama`, `icons.tsx`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `AGENTS.md`, `Product Requirements Document — Action Plan Management System`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `note-session.ts`, `divisions.ts`, `repositories.ts`, `connected-monitoring-workspace.tsx`, `notes.ts`, `container.ts`, `approvals.ts`, `AppError`, `collaborative-note-editor.tsx`, `user-deletion.test.ts`, `package.json`, `currentActor`, `users/[userId]/route.ts`, `notes-websocket-bridge.test.ts`, `models.ts`, `note-workspace-events.ts`, `dashboard-analytics.ts`, `notes-api.test.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _309 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiError` be split into smaller, more focused modules?**
  _Cohesion score 0.0944741532976827 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0688088283024992 - nodes in this community are weakly interconnected._