# Graph Report - action-plan-management  (2026-11-23)

## Corpus Check
- 157 files · ~250,758 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 1025 nodes · 2943 edges · 58 communities (53 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.85)
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
- models.ts
- connected-monitoring-workspace.tsx
- postgres.ts
- vitest
- notes.ts
- fixture.ts
- PageHeading
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- useFeedback
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
- main.tsx
- PROJECT_BRIEF.md
- CollaborativeNote
- Setup Action Plan Management
- scripts
- Brief Proyek Action Plan Management
- next-auth.d.ts
- Penerapan multi-divisi
- Glossary
- finish-review.md
- workspace-ui.tsx
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
- session/route.ts
- note-collaboration.ts
- dashboard-analytics.ts
- publicError

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 93 edges
2. `AppError` - 68 edges
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

## Communities (58 total, 5 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.06
Nodes (110): nextConfig, next, POST(), DELETE(), GET(), acceptedTypes, POST(), DELETE() (+102 more)

### Community 1 - "repositories.ts"
Cohesion: 0.06
Nodes (46): ActionPlanApprovalRepository, ActionPlanApproval, ActionPlanStatus, Division, required(), sheetsClient(), spreadsheetId(), append() (+38 more)

### Community 2 - "app/layout.tsx"
Cohesion: 0.21
Nodes (8): ref_node_fs, ref_node_path, src_app_globals, metadata, RootLayout(), viewport, FeedbackProvider(), appDirectory

### Community 3 - "connected-dashboard-workspace.tsx"
Cohesion: 0.17
Nodes (17): ConnectedDashboardWorkspace(), refresh(), selectPeriod(), DailyTrend(), DashboardData, DateField(), displayDate(), EmptyCopy() (+9 more)

### Community 4 - "attachments.ts"
Cohesion: 0.17
Nodes (11): ref_node_stream, AttachmentStorage, ActionPlanAttachment, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), driveFolderId() (+3 more)

### Community 5 - "models.ts"
Cohesion: 0.06
Nodes (40): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, accessWrite, activeAdmin(), DivisionInput (+32 more)

### Community 6 - "connected-monitoring-workspace.tsx"
Cohesion: 0.11
Nodes (20): approvalState, ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker() (+12 more)

### Community 7 - "postgres.ts"
Cohesion: 0.17
Nodes (11): NoteWorkspaceRepository, NoteWorkspace, NoteWorkspaceMember, databaseUrl(), iso(), loadNoteDocument(), memberFrom(), notesPool() (+3 more)

### Community 8 - "vitest"
Cohesion: 0.14
Nodes (23): ref_node_events, vitest, Context, DELETE(), PATCH(), Context, DELETE(), Context (+15 more)

### Community 9 - "notes.ts"
Cohesion: 0.19
Nodes (21): GET(), POST(), Context, GET(), POST(), requireActiveActor(), createNote(), createNoteWorkspace() (+13 more)

### Community 10 - "fixture.ts"
Cohesion: 0.20
Nodes (9): @playwright/test, divisionFixture, divisionUsers, dashboardFixture, names, plans, tasks, users (+1 more)

### Community 11 - "PageHeading"
Cohesion: 0.18
Nodes (19): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+11 more)

### Community 12 - "connected-user-management-workspace.tsx"
Cohesion: 0.19
Nodes (11): SafeUser, ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm() (+3 more)

### Community 13 - "icons.tsx"
Cohesion: 0.18
Nodes (20): next-auth, DashboardLayout(), LoginPage(), AppShell(), baseNavigation, BrandLogo(), ArrowRight(), Calendar() (+12 more)

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

### Community 18 - "useFeedback"
Cohesion: 0.16
Nodes (14): NotesPage(), CollaborativeNoteEditor(), Actor, ConnectedNotesWorkspace(), Member, Note, request(), Workspace (+6 more)

### Community 19 - "server.mjs"
Cohesion: 0.18
Nodes (10): @hocuspocus/extension-database, pg, client, app, collaboration, collaborationRuntime(), handle, port (+2 more)

### Community 20 - "Users"
Cohesion: 0.15
Nodes (16): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+8 more)

### Community 21 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (12): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+4 more)

### Community 22 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.18
Nodes (12): Evidence checked, ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm() (+4 more)

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

### Community 31 - "main.tsx"
Cohesion: 0.24
Nodes (8): react-dom, DashboardLoading(), data, params, state, bimaPlans, monitoringPlans, monitoringUsers

### Community 32 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 33 - "CollaborativeNote"
Cohesion: 0.28
Nodes (5): deleteNote(), NoteRepository, CollaborativeNote, noteFrom(), PostgresNoteRepository

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

### Community 41 - "workspace-ui.tsx"
Cohesion: 0.24
Nodes (8): react, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), AccountStatus(), focusableElements(), useDialogFocus()

### Community 42 - "bootstrap-admin.mjs"
Cohesion: 0.22
Nodes (7): bcryptjs, googleapis, ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp

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
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+9 more)

### Community 54 - "session/route.ts"
Cohesion: 0.33
Nodes (8): Context, GET(), assertCanAccessNote(), createNoteSession(), NoteSession, readNoteSession(), secret(), signature()

### Community 55 - "note-collaboration.ts"
Cohesion: 0.31
Nodes (7): GET(), closeNoteCollaborationConnectionsForUser(), noteCollaborationConfigured(), noteCollaborationReady(), NoteReader, NoteRuntime, WorkspaceReader

### Community 56 - "dashboard-analytics.ts"
Cohesion: 0.31
Nodes (6): calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary, users

### Community 57 - "publicError"
Cohesion: 0.43
Nodes (5): DashboardError(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

## Knowledge Gaps
- **302 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+297 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `currentActor` to `app/layout.tsx`, `connected-dashboard-workspace.tsx`, `connected-monitoring-workspace.tsx`, `vitest`, `notes.ts`, `workspace-ui.tsx`, `icons.tsx`, `server.mjs`, `package.json`, `session/route.ts`, `note-collaboration.ts`, `connected-weekly-plan-workspace.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Brief Proyek Action Plan Management`, `icons.tsx`, `3. Keputusan implementasi utama`, `System Architecture — Action Plan Management System`, `Tech Stack — Action Plan Management System`, `AGENTS.md`, `Product Requirements Document — Action Plan Management System`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `currentActor`, `repositories.ts`, `app/layout.tsx`, `models.ts`, `notes.ts`, `workspace-ui.tsx`, `collaborative-note-editor.tsx`, `package.json`, `session/route.ts`, `note-collaboration.ts`, `dashboard-analytics.ts`, `notes-websocket-bridge.test.ts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.05966981132075472 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06368330464716007 - nodes in this community are weakly interconnected._