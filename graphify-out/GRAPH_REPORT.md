# Graph Report - action-plan-management  (2026-11-20)

## Corpus Check
- 150 files · ~247,597 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .ico 1, .css 1)

## Summary
- 989 nodes · 2819 edges · 53 communities (48 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 122 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35d19bb3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- currentActor
- use-cases.ts
- app/layout.tsx
- repositories.ts
- attachments.ts
- postgres.ts
- connected-monitoring-workspace.tsx
- connected-user-management-workspace.tsx
- icons.tsx
- Design System: Action Plan Management System
- PageHeading
- models.ts
- dependencies
- compilerOptions
- package.json
- connected-weekly-plan-workspace.tsx
- Users
- System Architecture — Action Plan Management System
- connected-action-plan-workspace.tsx
- server.mjs
- AppError
- feedback.tsx
- collaborative-note-editor.tsx
- 2026-11-18T09-30-31Z__ponents-connected-dashboard-workspace-tsx-88280951.md
- devDependencies
- next-auth.d.ts
- approvals.ts
- Product Requirements Document — Action Plan Management System
- Product
- session/route.ts
- PROJECT_BRIEF.md
- notes-realtime.test.ts
- AGENTS.md
- Setup Action Plan Management
- scripts
- Tech Stack — Action Plan Management System
- Brief Proyek Action Plan Management
- Penerapan multi-divisi
- divisions.ts
- Glossary
- finish-review.md
- Division extension documentation check
- Monitoring anggota
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- { GET, POST }
- (dashboard)/layout.tsx
- callback/route.ts
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
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `Penyimpanan dan integrasi menurut dokumentasi` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (53 total, 5 thin omitted)

### Community 0 - "currentActor"
Cohesion: 0.05
Nodes (109): nextConfig, next, vitest, POST(), DELETE(), GET(), acceptedTypes, POST() (+101 more)

### Community 1 - "use-cases.ts"
Cohesion: 0.11
Nodes (24): 2. Clean Architecture, Application, Domain, Infrastructure, Presentation, bcryptjs, AttachmentStorage, StatusRepository (+16 more)

### Community 2 - "app/layout.tsx"
Cohesion: 0.21
Nodes (8): ref_node_fs, ref_node_path, src_app_globals, metadata, RootLayout(), viewport, FeedbackProvider(), appDirectory

### Community 3 - "repositories.ts"
Cohesion: 0.07
Nodes (42): required(), sheetsClient(), spreadsheetId(), append(), appendMany(), APPROVAL_HEADERS, assertApprovalHeaders(), CachedRead (+34 more)

### Community 4 - "attachments.ts"
Cohesion: 0.30
Nodes (6): ref_node_stream, driveQueryValue(), GoogleDriveAttachmentStorage, safeFileName(), safeFolderName(), googleDriveClient()

### Community 5 - "postgres.ts"
Cohesion: 0.13
Nodes (15): NoteRepository, NoteWorkspaceRepository, CollaborativeNote, NoteWorkspace, NoteWorkspaceMember, databaseUrl(), iso(), loadNoteDocument() (+7 more)

### Community 6 - "connected-monitoring-workspace.tsx"
Cohesion: 0.11
Nodes (23): ActionPlanAttachment, ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker() (+15 more)

### Community 7 - "connected-user-management-workspace.tsx"
Cohesion: 0.21
Nodes (10): ConnectedUserManagementWorkspace(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField(), UserForm(), persist() (+2 more)

### Community 8 - "icons.tsx"
Cohesion: 0.20
Nodes (20): next-auth, LoginPage(), AppShell(), baseNavigation, BrandLogo(), useFeedback(), ArrowRight(), Calendar() (+12 more)

### Community 9 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 10 - "PageHeading"
Cohesion: 0.19
Nodes (16): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, Pencil(), Plus(), Search(), UserField() (+8 more)

### Community 11 - "models.ts"
Cohesion: 0.06
Nodes (43): @playwright/test, react-dom, DashboardLoading(), calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard(), UserSummary (+35 more)

### Community 12 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, crossws, googleapis, @hocuspocus/extension-database, @hocuspocus/provider, @hocuspocus/server, lucide-react (+11 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "package.json"
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, lucide-react, ref_node_url (+9 more)

### Community 15 - "connected-weekly-plan-workspace.tsx"
Cohesion: 0.18
Nodes (12): Evidence checked, ConnectedWeeklyPlanWorkspace(), currentWeek(), displayDate(), Field(), mondayThisWeek(), WeeklyPlanEditForm(), WeeklyPlanForm() (+4 more)

### Community 16 - "Users"
Cohesion: 0.14
Nodes (17): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 13. PostgreSQL Catatan Kolaboratif, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User (+9 more)

### Community 17 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 18 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (12): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+4 more)

### Community 19 - "server.mjs"
Cohesion: 0.15
Nodes (12): crossws, @hocuspocus/extension-database, ref_node_http, pg, client, app, collaboration, collaborationRuntime() (+4 more)

### Community 20 - "AppError"
Cohesion: 0.17
Nodes (23): requireActiveActor(), requireApprovalBod(), resolveActor(), AppError, AppErrorCode, assertCanAccessNote(), createNote(), createNoteWorkspace() (+15 more)

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

### Community 26 - "approvals.ts"
Cohesion: 0.14
Nodes (18): assertCanReadMember(), requireUserWorkspace(), approvalState, approvalWrite, decideApproval(), latestForPlan(), listMemberApprovalStates(), serializeApprovalWrite() (+10 more)

### Community 27 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.18
Nodes (10): 11. Perluasan role multi-divisi ? disetujui 18 November 2026, 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 7. Kebutuhan nonfungsional, 8. Ruang lingkup (+2 more)

### Community 28 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 29 - "session/route.ts"
Cohesion: 0.17
Nodes (12): ref_next_env, ref_node_crypto, sheets, spreadsheetId, timestamp, Context, GET(), createNoteSession() (+4 more)

### Community 30 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 31 - "notes-realtime.test.ts"
Cohesion: 0.33
Nodes (4): @hocuspocus/provider, @hocuspocus/server, yjs, providers

### Community 32 - "AGENTS.md"
Cohesion: 0.22
Nodes (8): Batas perubahan, Klarifikasi dan konteks proyek, Perbaikan bug, Perlindungan data dan penyimpanan, Prinsip akhir, This is NOT the Next.js you know, Urutan kerja, Validasi dan performa

### Community 33 - "Setup Action Plan Management"
Cohesion: 0.22
Nodes (9): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+1 more)

### Community 34 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, bootstrap:admin, build, dev, lint, migrate:notes, start, test (+1 more)

### Community 35 - "Tech Stack — Action Plan Management System"
Cohesion: 0.14
Nodes (14): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+6 more)

### Community 36 - "Brief Proyek Action Plan Management"
Cohesion: 0.29
Nodes (7): Alur dan aturan yang sudah diverifikasi pada implementasi, Arsitektur dan teknologi, Batas pemahaman dan risiko utama, Brief Proyek Action Plan Management, Kebutuhan operasional, Penyimpanan dan integrasi menurut dokumentasi, Tujuan dan pengguna

### Community 37 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 38 - "divisions.ts"
Cohesion: 0.17
Nodes (17): accessWrite, activeAdmin(), DivisionInput, ManagedUserInput, saveDivision(), saveManagedUser(), serializeAccessWrite(), DivisionRepository (+9 more)

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

### Community 53 - "(dashboard)/layout.tsx"
Cohesion: 0.31
Nodes (6): DashboardError(), DashboardLayout(), errorStatus(), publicError(), DataUnavailable(), DataUnavailableProps

### Community 56 - "callback/route.ts"
Cohesion: 0.50
Nodes (6): googleapis, GET(), configuredDriveFolderId(), driveFolderId(), googleDriveOAuthClient(), required()

### Community 58 - "workspace-ui.tsx"
Cohesion: 0.24
Nodes (8): react, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), AccountStatus(), focusableElements(), useDialogFocus()

## Knowledge Gaps
- **292 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `AGENTS.md`, `Setup Action Plan Management`, `Tech Stack — Action Plan Management System`, `Brief Proyek Action Plan Management`, `icons.tsx`, `System Architecture — Action Plan Management System`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `next` connect `currentActor` to `app/layout.tsx`, `connected-monitoring-workspace.tsx`, `icons.tsx`, `models.ts`, `package.json`, `connected-weekly-plan-workspace.tsx`, `server.mjs`, `(dashboard)/layout.tsx`, `callback/route.ts`, `workspace-ui.tsx`, `session/route.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `AppError` connect `AppError` to `currentActor`, `use-cases.ts`, `repositories.ts`, `postgres.ts`, `divisions.ts`, `(dashboard)/layout.tsx`, `callback/route.ts`, `approvals.ts`, `session/route.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `currentActor` be split into smaller, more focused modules?**
  _Cohesion score 0.05097326365220026 - nodes in this community are weakly interconnected._
- **Should `use-cases.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._