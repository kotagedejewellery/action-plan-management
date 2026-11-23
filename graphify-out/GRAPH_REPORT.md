# Graph Report - action-plan-management  (2026-11-23)

## Corpus Check
- 158 files · ~250,191 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 1032 nodes · 2959 edges · 61 communities (56 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c796052`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- repositories.ts
- app/layout.tsx
- connected-dashboard-workspace.tsx
- attachments.ts
- divisions.ts
- connected-monitoring-workspace.tsx
- postgres.ts
- [noteId]/route.ts
- AppError
- fixture.ts
- PageHeading
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- main.tsx
- server.mjs
- Users
- connected-action-plan-workspace.tsx
- monitoring/page.tsx
- System Architecture — Action Plan Management System
- notes-websocket-bridge.test.ts
- Tech Stack — Action Plan Management System
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- devDependencies
- AGENTS.md
- Product Requirements Document — Action Plan Management System
- Product
- container.ts
- PROJECT_BRIEF.md
- use-cases.ts
- Setup Action Plan Management
- scripts
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- Glossary
- finish-review.md
- models.ts
- bootstrap-admin.mjs
- Division extension documentation check
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- 3. Keputusan implementasi utama
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- package.json
- { GET, POST }
- note-session.ts
- users/[userId]/route.ts
- schemas.ts
- (dashboard)/layout.tsx
- ActionPlanRepository
- User
- callback/route.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 93 edges
2. `AppError` - 70 edges
3. `apiError()` - 65 edges
4. `next` - 48 edges
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
- `6. Halaman dan navigasi` --references--> `Users()`  [INFERRED]
  docs/PRD.md → src/presentation/components/icons.tsx
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (61 total, 5 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.11
Nodes (37): POST(), DELETE(), GET(), POST(), DELETE(), PATCH(), POST(), PATCH() (+29 more)

### Community 1 - "repositories.ts"
Cohesion: 0.07
Nodes (46): 2. Clean Architecture, Infrastructure, Presentation, ActionPlan, required(), sheetsClient(), spreadsheetId(), append() (+38 more)

### Community 2 - "app/layout.tsx"
Cohesion: 0.21
Nodes (8): ref_node_fs, ref_node_path, src_app_globals, metadata, RootLayout(), viewport, FeedbackProvider(), appDirectory

### Community 3 - "connected-dashboard-workspace.tsx"
Cohesion: 0.17
Nodes (17): ConnectedDashboardWorkspace(), refresh(), selectPeriod(), DailyTrend(), DashboardData, DateField(), displayDate(), EmptyCopy() (+9 more)

### Community 4 - "attachments.ts"
Cohesion: 0.28
Nodes (7): ref_node_stream, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveFolderId(), googleDriveClient()

### Community 5 - "divisions.ts"
Cohesion: 0.19
Nodes (15): resolveActor(), accessWrite, activeAdmin(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser(), serializeAccessWrite() (+7 more)

### Community 6 - "connected-monitoring-workspace.tsx"
Cohesion: 0.10
Nodes (22): react, approvalState, dashboardPeriodInputSchema, ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail() (+14 more)

### Community 7 - "postgres.ts"
Cohesion: 0.14
Nodes (13): NoteWorkspaceRepository, NoteWorkspace, NoteWorkspaceMember, databaseUrl(), iso(), loadNoteDocument(), memberFrom(), noteFrom() (+5 more)

### Community 8 - "[noteId]/route.ts"
Cohesion: 0.12
Nodes (26): ref_node_events, GET(), runtime, Context, DELETE(), PATCH(), GET(), POST() (+18 more)

### Community 9 - "AppError"
Cohesion: 0.18
Nodes (23): requireActiveActor(), AppError, assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote(), deleteNoteWorkspace(), inviteNoteWorkspaceMember() (+15 more)

### Community 10 - "fixture.ts"
Cohesion: 0.09
Nodes (19): port, @playwright/test, calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, divisionFixture (+11 more)

### Community 11 - "PageHeading"
Cohesion: 0.18
Nodes (19): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+11 more)

### Community 12 - "connected-user-management-workspace.tsx"
Cohesion: 0.13
Nodes (21): Evidence checked, SafeUser, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), ConnectedUserManagementWorkspace(), roleLabel() (+13 more)

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
Nodes (19): dependencies, bcryptjs, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react, next (+11 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 18 - "main.tsx"
Cohesion: 0.12
Nodes (17): DashboardLoading(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, NotesRequestError, request() (+9 more)

### Community 19 - "server.mjs"
Cohesion: 0.18
Nodes (10): @hocuspocus/extension-database, pg, client, app, collaboration, collaborationRuntime(), handle, port (+2 more)

### Community 20 - "Users"
Cohesion: 0.15
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+8 more)

### Community 21 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 22 - "monitoring/page.tsx"
Cohesion: 0.14
Nodes (24): ActionPlansPage(), DashboardPage(), HistoryPage(), MonitoringPage(), WeeklyPlansPage(), requireMonitorActor(), visibleMembers(), approvalStates() (+16 more)

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

### Community 31 - "container.ts"
Cohesion: 0.18
Nodes (17): nextConfig, next, acceptedTypes, GET(), AppErrorCode, actionPlans, approvals, attachments (+9 more)

### Community 32 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 33 - "use-cases.ts"
Cohesion: 0.15
Nodes (19): Domain, bcryptjs, requireUserWorkspace(), StatusRepository, WeeklyPlanRepository, ActionPlanScope, addOwnActionPlanAttachments(), createOwnWeeklyPlan() (+11 more)

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

### Community 41 - "models.ts"
Cohesion: 0.15
Nodes (18): assertCanReadMember(), requireApprovalBod(), approvalWrite, decideApproval(), latestForPlan(), listMemberApprovalStates(), serializeApprovalWrite(), submitForApproval() (+10 more)

### Community 42 - "bootstrap-admin.mjs"
Cohesion: 0.25
Nodes (6): googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

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

### Community 47 - "3. Keputusan implementasi utama"
Cohesion: 0.33
Nodes (6): 3. Keputusan implementasi utama, Antarmuka, Autentikasi, Catatan Kolaboratif, Google Drive, Google Sheets

### Community 52 - "package.json"
Cohesion: 0.10
Nodes (18): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, react-dom (+10 more)

### Community 54 - "note-session.ts"
Cohesion: 0.52
Nodes (5): createNoteSession(), NoteSession, readNoteSession(), secret(), signature()

### Community 55 - "users/[userId]/route.ts"
Cohesion: 0.13
Nodes (17): vitest, GET(), PATCH(), userInputSchema, auth, handlers, signIn, signOut (+9 more)

### Community 56 - "schemas.ts"
Cohesion: 0.14
Nodes (13): Context, GET(), POST(), GET(), actionPlanInputSchema, approvalDecisionSchema, divisionInputSchema, noteInviteInputSchema (+5 more)

### Community 57 - "(dashboard)/layout.tsx"
Cohesion: 0.36
Nodes (6): DashboardError(), DashboardLayout(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

### Community 58 - "ActionPlanRepository"
Cohesion: 0.20
Nodes (4): Application, ActionPlanRepository, AttachmentStorage, deleteOwnWeeklyPlan()

### Community 59 - "User"
Cohesion: 0.36
Nodes (6): UserRepository, authenticateUser(), createUser(), updateUser(), toSafeUser(), User

### Community 60 - "callback/route.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), configuredDriveFolderId(), src_infrastructure_google_drive_oauth_drivescope, googleDriveOAuthClient(), required()

## Knowledge Gaps
- **304 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+299 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 372 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `container.ts` to `currentActor`, `app/layout.tsx`, `connected-dashboard-workspace.tsx`, `connected-monitoring-workspace.tsx`, `[noteId]/route.ts`, `connected-user-management-workspace.tsx`, `icons.tsx`, `server.mjs`, `package.json`, `monitoring/page.tsx`, `users/[userId]/route.ts`, `schemas.ts`, `(dashboard)/layout.tsx`, `callback/route.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Brief Proyek Action Plan Management`, `icons.tsx`, `3. Keputusan implementasi utama`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `AGENTS.md`, `Product Requirements Document — Action Plan Management System`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `currentActor()` connect `currentActor` to `divisions.ts`, `[noteId]/route.ts`, `AppError`, `(dashboard)/layout.tsx`, `users/[userId]/route.ts`, `monitoring/page.tsx`, `System Architecture — Action Plan Management System`, `schemas.ts`, `Tech Stack — Action Plan Management System`, `callback/route.ts`, `container.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _304 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.10628019323671498 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0654320987654321 - nodes in this community are weakly interconnected._