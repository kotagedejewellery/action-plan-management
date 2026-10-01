# Graph Report - action-plan-management  (2026-10-01)

## Corpus Check
- 28 files · ~9,927 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 211 nodes · 306 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Product Requirements Document — Action Plan Management System
- Users
- System Architecture — Action Plan Management System
- Tech Stack — Action Plan Management System
- compilerOptions
- Product
- package.json
- Aturan Kerja Proyek
- next
- devDependencies
- action-plan-workspace.tsx
- icons.tsx
- README.md
- postcss.config.mjs
- Design System: Action Plan Management System

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Icon()` - 15 edges
3. `ActionPlanWorkspace()` - 11 edges
4. `Product` - 10 edges
5. `Product Requirements Document — Action Plan Management System` - 10 edges
6. `Users()` - 9 edges
7. `UserManagementWorkspace()` - 9 edges
8. `Design System: Action Plan Management System` - 9 edges
9. `System Architecture — Action Plan Management System` - 9 edges
10. `react` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Autentikasi` --references--> `Users()`  [INFERRED]
  docs/TECH_STACK.md → src/presentation/components/icons.tsx
- `1. Model penyimpanan` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `2. Sheet `Users`` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `4. Relasi dan isolasi data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx
- `6. Operasi akses data` --references--> `Users()`  [INFERRED]
  docs/DATABASE_DESIGN.md → src/presentation/components/icons.tsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "Product Requirements Document — Action Plan Management System"
Cohesion: 0.20
Nodes (9): 1. Ringkasan produk, 2. Tujuan, 3. Peran dan hak akses, 4. Kebutuhan fungsional, 5. Data Action Plan, 7. Kebutuhan nonfungsional, 8. Ruang lingkup, 9. Kriteria penerimaan (+1 more)

### Community 1 - "Users"
Cohesion: 0.21
Nodes (11): 1. Model penyimpanan, 2. Sheet `Users`, 3. Sheet Action Plan per User, 4. Relasi dan isolasi data, 5. Validasi integritas, 6. Operasi akses data, 7. Konsekuensi Google Sheets sebagai database, Database Design — Google Spreadsheet (+3 more)

### Community 2 - "System Architecture — Action Plan Management System"
Cohesion: 0.12
Nodes (15): 1. Ringkasan, 2. Clean Architecture, 3. Aturan dependensi, 4. Alur utama, 5. Security boundary, 6. Penanganan kegagalan, 7. Batasan dan evolusi, 8. Checklist implementasi (+7 more)

### Community 3 - "Tech Stack — Action Plan Management System"
Cohesion: 0.17
Nodes (11): 1. Prinsip pemilihan, 2. Stack yang digunakan, 3. Keputusan implementasi utama, 4. Environment variables, 5. Struktur kode yang disarankan, 6. Standar clean code, 7. Quality gate minimal, Antarmuka (+3 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 5 - "Product"
Cohesion: 0.18
Nodes (10): Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product, Product Principles, Product Purpose (+2 more)

### Community 6 - "package.json"
Cohesion: 0.08
Nodes (24): eslintConfig, dependencies, lucide-react, next, react, react-dom, name, private (+16 more)

### Community 8 - "next"
Cohesion: 0.22
Nodes (4): nextConfig, next, src_app_globals, metadata

### Community 9 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 10 - "action-plan-workspace.tsx"
Cohesion: 0.14
Nodes (26): Domain, react, ActionPlansPage(), MonitoringPage(), UsersPage(), ActionPlanWorkspace(), Field(), PlanForm() (+18 more)

### Community 11 - "icons.tsx"
Cohesion: 0.26
Nodes (14): DashboardLayout(), LoginPage(), AppShell(), navigation, ArrowRight(), Calendar(), CheckMark(), ChevronDown() (+6 more)

### Community 12 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 14 - "Design System: Action Plan Management System"
Cohesion: 0.09
Nodes (22): Buttons, Cards / Containers, Colors, Components, Design System: Action Plan Management System, Dialogs, Do:, Do's and Don'ts (+14 more)

## Knowledge Gaps
- **111 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 125 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Users()` connect `Users` to `icons.tsx`, `Tech Stack — Action Plan Management System`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `react` connect `action-plan-workspace.tsx` to `icons.tsx`, `package.json`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `Domain` connect `action-plan-workspace.tsx` to `System Architecture — Action Plan Management System`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `System Architecture — Action Plan Management System` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._