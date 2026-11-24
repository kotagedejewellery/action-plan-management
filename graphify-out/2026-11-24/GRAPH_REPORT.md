# Graph Report - action-plan-management  (2026-11-24)

## Corpus Check
- 163 files · ~263,137 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .log 1, .ico 1)

## Summary
- 1107 nodes · 3204 edges · 54 communities (49 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bd095b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- repositories.ts
- errors.ts
- notes.ts
- connected-dashboard-workspace.tsx
- currentActor
- division-api.test.ts
- monitoring/page.tsx
- container.ts
- connected-monitoring-workspace.tsx
- users/[userId]/route.ts
- PageHeading
- icons.tsx
- Design System: Action Plan Management System
- connected-user-management-workspace.tsx
- collaborative-note-editor.tsx
- dependencies
- compilerOptions
- feedback.tsx
- connected-action-plan-workspace.tsx
- Users
- System Architecture — Action Plan Management System
- devDependencies
- workspace-ui.tsx
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
- pg
- Multi-division gap closure — 18 November 2026
- Dashboard Tim
- multi-division-brief.md
- divisions/verification.md
- postcss.config.mjs
- { GET, POST }
- package.json
- actor.ts
- note-workspace-events.ts

## God Nodes (most connected - your core abstractions)
1. `currentActor()` - 99 edges
2. `AppError` - 78 edges
3. `apiError()` - 71 edges
4. `next` - 50 edges
5. `requireAdmin()` - 30 edges
6. `vitest` - 24 edges
7. `useFeedback()` - 23 edges
8. `DialogFrame()` - 23 edges
9. `requireUserWorkspace()` - 22 edges
10. `User` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Catatan Kolaboratif` --references--> `owner()`  [INFERRED]
  docs/SYSTEM_ARCHITECTURE.md → src/application/notes.ts
- `Perlindungan data dan penyimpanan` --references--> `Users()`  [INFERRED]
  AGENTS.md → src/presentation/components/icons.tsx
- `6. Halaman dan navigasi` --references--> `Users()`  [INFERRED]
  docs/PRD.md → src/presentation/components/icons.tsx
- `Kebutuhan operasional` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx
- `Penyimpanan dan integrasi menurut dokumentasi` --references--> `Users()`  [INFERRED]
  docs/PROJECT_BRIEF.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (54 total, 5 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.06
Nodes (68): Application, Domain, bcryptjs, assertCanReadMember(), requireActiveActor(), requireApprovalBod(), requireUserWorkspace(), resolveActor() (+60 more)

### Community 1 - "repositories.ts"
Cohesion: 0.06
Nodes (50): 2. Clean Architecture, Infrastructure, Presentation, required(), sheetsClient(), spreadsheetId(), append(), appendMany() (+42 more)

### Community 2 - "errors.ts"
Cohesion: 0.09
Nodes (22): ref_node_fs, ref_node_path, vitest, DashboardError(), DashboardLayout(), src_app_globals, metadata, RootLayout() (+14 more)

### Community 3 - "notes.ts"
Cohesion: 0.06
Nodes (42): 13. PostgreSQL Catatan Kolaboratif, assertCanAccessNote(), createNote(), createNoteWorkspace(), deleteNote(), deleteNoteImage(), deleteNoteWorkspace(), listNoteWorkspaceMembers() (+34 more)

### Community 4 - "connected-dashboard-workspace.tsx"
Cohesion: 0.06
Nodes (42): port, @playwright/test, react-dom, DashboardLoading(), calendarDates(), DashboardPlan, DashboardSummary, summarizeDashboard() (+34 more)

### Community 5 - "currentActor"
Cohesion: 0.11
Nodes (31): acceptedTypes, POST(), DELETE(), PATCH(), GET(), GET(), POST(), Context (+23 more)

### Community 6 - "division-api.test.ts"
Cohesion: 0.10
Nodes (26): nextConfig, next, POST(), DELETE(), GET(), GET(), POST(), PATCH() (+18 more)

### Community 7 - "monitoring/page.tsx"
Cohesion: 0.14
Nodes (25): ActionPlansPage(), DashboardPage(), HistoryPage(), MonitoringPage(), WeeklyPlansPage(), requireMonitorActor(), visibleMembers(), approvalStates() (+17 more)

### Community 8 - "container.ts"
Cohesion: 0.19
Nodes (21): DELETE(), GET(), acceptedTypes, hasImageSignature(), POST(), Context, DELETE(), PATCH() (+13 more)

### Community 9 - "connected-monitoring-workspace.tsx"
Cohesion: 0.11
Nodes (20): approvalState, ConnectedMonitoringWorkspace(), choosePeriod(), clearFilters(), loadPlans(), openDetail(), renderDate(), renderMemberPicker() (+12 more)

### Community 10 - "users/[userId]/route.ts"
Cohesion: 0.13
Nodes (19): GET(), DELETE(), PATCH(), deleteUserInputSchema, userInputSchema, auth, handlers, signIn (+11 more)

### Community 11 - "PageHeading"
Cohesion: 0.18
Nodes (19): ActionPlanWorkspace(), Field(), PlanForm(), statusOptions, ExternalLink(), Pencil(), Plus(), Search() (+11 more)

### Community 12 - "icons.tsx"
Cohesion: 0.21
Nodes (18): LoginPage(), AppShell(), baseNavigation, BrandLogo(), ArrowRight(), Calendar(), Chart(), CheckMark() (+10 more)

### Community 13 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

### Community 14 - "connected-user-management-workspace.tsx"
Cohesion: 0.18
Nodes (14): ConnectedUserManagementWorkspace(), DeleteUserDialog(), divisionManagementHref(), roleLabel(), StatusEditor(), StatusForm(), StatusInput, UserField() (+6 more)

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

### Community 19 - "connected-action-plan-workspace.tsx"
Cohesion: 0.18
Nodes (11): acceptedAttachmentTypes, ConnectedActionPlanWorkspace(), approvalControl(), submitApproval(), displayDate(), Draft, Field(), getWeekBounds() (+3 more)

### Community 20 - "Users"
Cohesion: 0.17
Nodes (15): 10. Konsekuensi Google Sheets sebagai database, 11. Divisi dan kompatibilitas akun lama, 12. Sheet `Action Plan Approvals`, 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet `Settings`, 4. Sheet Action Plan per User, 5. Sheet `Weekly Plans` (+7 more)

### Community 21 - "System Architecture — Action Plan Management System"
Cohesion: 0.13
Nodes (15): 1. Ringkasan, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Deployment, 8. Batasan dan evolusi, 9. Checklist operasional (+7 more)

### Community 22 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, @playwright/test, tailwindcss, @tailwindcss/postcss, @types/node, @types/pg (+6 more)

### Community 23 - "workspace-ui.tsx"
Cohesion: 0.25
Nodes (9): react, ConnectedDivisionWorkspace(), save(), toggleApproval(), DivisionForm(), AccountStatus(), ConfirmDialog(), focusableElements() (+1 more)

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
Cohesion: 0.22
Nodes (9): @hocuspocus/extension-database, app, collaboration, collaborationRuntime(), handle, port, readSession(), server (+1 more)

### Community 30 - "PROJECT_BRIEF.md"
Cohesion: 0.29
Nodes (4): Action Plan Management, Dokumentasi, Menjalankan lokal, Pemeriksaan

### Community 31 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, bootstrap:admin, build, check:notes, dev, lint, migrate:notes, start (+2 more)

### Community 32 - "Setup Action Plan Management"
Cohesion: 0.22
Nodes (9): 1. Google Sheets dan Admin awal, 2. Google Drive untuk lampiran, 3. Menjalankan lokal, 4. Deployment VPS, 5. Pemulihan gangguan umum, 6. Penerapan multi-divisi, Backup dan pemulihan Notes, Mengaktifkan Catatan Kolaboratif (+1 more)

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
Cohesion: 0.29
Nodes (6): next-auth, JWT, next-auth, next-auth/jwt, Session, User

### Community 37 - "Penerapan multi-divisi"
Cohesion: 0.33
Nodes (5): Batas operasi dan pemulihan, Pemeriksaan sebelum layanan dibuka, Penerapan multi-divisi, Penyiapan melalui aplikasi, Persiapan dan tinjauan

### Community 38 - "3. Keputusan implementasi utama"
Cohesion: 0.33
Nodes (6): 3. Keputusan implementasi utama, Antarmuka, Autentikasi, Catatan Kolaboratif, Google Drive, Google Sheets

### Community 39 - "Division extension documentation check"
Cohesion: 0.33
Nodes (5): Division extension documentation check, Evidence checked, Existing drift left unchanged, Five-line system summary, Verification boundary

### Community 40 - "finish-review.md"
Cohesion: 0.33
Nodes (5): ceiling, fidelity, keep, material_fixes, persistence

### Community 41 - "Monitoring anggota"
Cohesion: 0.40
Nodes (4): Direction contract, Monitoring anggota, Shipped surface rules, Verification evidence

### Community 42 - "googleDriveClient"
Cohesion: 0.09
Nodes (22): googleapis, ref_next_env, ref_node_crypto, ref_node_stream, sheets, spreadsheetId, timestamp, GET() (+14 more)

### Community 43 - "pg"
Cohesion: 0.40
Nodes (3): pg, client, client

### Community 44 - "Multi-division gap closure — 18 November 2026"
Cohesion: 0.50
Nodes (3): Limits, Multi-division gap closure — 18 November 2026, Validation

### Community 45 - "Dashboard Tim"
Cohesion: 0.50
Nodes (3): Dashboard Tim, Direction contract, Shipped outcome and proof

### Community 52 - "package.json"
Cohesion: 0.11
Nodes (17): eslintConfig, name, private, version, eslint, eslint-config-next, ref_node_url, tailwindcss (+9 more)

### Community 54 - "actor.ts"
Cohesion: 0.20
Nodes (15): PATCH(), GET(), POST(), GET(), GET(), POST(), responseError(), DivisionsPage() (+7 more)

### Community 61 - "note-workspace-events.ts"
Cohesion: 0.33
Nodes (6): ref_node_events, GET(), runtime, events(), NoteWorkspaceEvents, subscribeToNoteWorkspaceChanges()

## Knowledge Gaps
- **314 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+309 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 390 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `division-api.test.ts` to `errors.ts`, `connected-dashboard-workspace.tsx`, `currentActor`, `monitoring/page.tsx`, `container.ts`, `connected-monitoring-workspace.tsx`, `users/[userId]/route.ts`, `googleDriveClient`, `icons.tsx`, `package.json`, `actor.ts`, `workspace-ui.tsx`, `server.mjs`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Users()` connect `Users` to `Setup Action Plan Management`, `Tech Stack — Action Plan Management System`, `Brief Proyek Action Plan Management`, `3. Keputusan implementasi utama`, `icons.tsx`, `System Architecture — Action Plan Management System`, `Product Requirements Document — Action Plan Management System`, `AGENTS.md`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `vitest` connect `errors.ts` to `AppError`, `repositories.ts`, `notes.ts`, `connected-dashboard-workspace.tsx`, `division-api.test.ts`, `container.ts`, `users/[userId]/route.ts`, `collaborative-note-editor.tsx`, `package.json`, `workspace-ui.tsx`, `notes-websocket-bridge.test.ts`, `note-workspace-events.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `currentActor()` (e.g. with `Isolasi divisi` and `Otorisasi multi-divisi`) actually correct?**
  _`currentActor()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _314 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.0570480404551201 - nodes in this community are weakly interconnected._
- **Should `repositories.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060144346431435444 - nodes in this community are weakly interconnected._