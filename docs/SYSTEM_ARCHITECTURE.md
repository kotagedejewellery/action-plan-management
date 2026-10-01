# System Architecture — Action Plan Management System

## 1. Ringkasan

Aplikasi adalah Next.js monolith yang dideploy di Vercel. Next.js menyajikan antarmuka dan menjalankan use case server-side. Google Sheets API menjadi satu-satunya jalur ke Google Spreadsheet.

```text
Browser (Admin / User)
          │ HTTPS
          ▼
Next.js on Vercel
├── Presentation: pages, components, forms
├── Application: use cases, authorization policies, ports
├── Domain: entities and business rules
└── Infrastructure: Auth.js and Google Sheets adapters
          │ Google Sheets API / service account
          ▼
Google Spreadsheet
├── Users
└── User Action Plan sheets
```

Tidak ada backend terpisah maupun database tambahan pada versi 1.

## 2. Clean Architecture

### Domain

Berisi model dan aturan bisnis murni, tanpa import Next.js, Auth.js, React, atau Google SDK.

- Entity: `User`, `ActionPlan`
- Value/enum: `UserRole`, `AccountStatus`, `ActionPlanStatus`
- Policy: kepemilikan Action Plan dan hak Admin

### Application

Berisi orkestrasi aturan bisnis dan port (interface) untuk dunia luar.

- Use case: `AuthenticateUser`, `CreateUser`, `UpdateUser`, `SetUserStatus`, `ListOwnActionPlans`, `CreateActionPlan`, `UpdateOwnActionPlan`, `ListUsers`, `ListUserActionPlansForAdmin`
- Port: `UserRepository`, `ActionPlanRepository`, `PasswordHasher`, `SessionProvider` bila diperlukan
- Otorisasi: keputusan akses dibuat di sini berdasarkan actor terautentikasi, bukan berdasarkan data dari client.

### Infrastructure

Menerapkan port application untuk teknologi tertentu.

- `GoogleSheetsUserRepository`
- `GoogleSheetsActionPlanRepository`
- `BcryptPasswordHasher`
- Auth.js configuration dan Credentials provider
- Parser/mapper antara baris sheet dan entity domain

### Presentation

Lapisan terluar yang bergantung pada Application, bukan sebaliknya.

- App Router pages/layouts
- Server actions atau route handlers
- Components dan form
- Schema validasi input serta view model

## 3. Aturan dependensi

```text
Presentation ───────► Application ───────► Domain
Infrastructure ─────► Application ───────► Domain
Domain ─────────────► (tidak ada dependensi eksternal)
```

Dependency injection dilakukan melalui factory/composition root di server: use case menerima interface repository, lalu factory memasangkan implementasi Google Sheets. Ini membuat aturan bisnis dapat diuji tanpa API Google.

## 4. Alur utama

### Login

```text
User submits email/password
  → Auth.js Credentials provider
  → AuthenticateUser reads Users sheet
  → validate password hash + active status
  → issue JWT session containing userId and role
  → redirect: admin to monitoring; user to own Action Plan
```

### User membuat atau mengubah Action Plan

```text
Authenticated User
  → server action / route handler validates Zod input
  → use case resolves actor's User record and sheet_name
  → ownership policy allows only actor's sheet
  → repository writes target row through Google Sheets API
  → application returns safe result to UI
```

### Admin monitoring

```text
Authenticated Admin
  → request User ID
  → application checks admin role
  → UserRepository resolves target sheet_name
  → ActionPlanRepository reads target sheet
  → presentation renders data
```

## 5. Security boundary

| Area | Kontrol |
| --- | --- |
| Login | bcrypt verification, generic error response, cek akun active. |
| Session | Auth.js JWT signed with `AUTH_SECRET`, cookie aman di production. |
| Otorisasi | Server-side role dan ownership policy pada setiap use case. |
| Input | Validasi Zod serta normalisasi server-side. |
| Data | `password_hash` tidak pernah dimasukkan ke DTO/UI. |
| Credential | Service account dan secret hanya melalui environment variable. |
| Link | Validasi URL dan render link dengan atribut keamanan yang sesuai. |

## 6. Penanganan kegagalan

- Error Sheets API diterjemahkan menjadi error aplikasi yang aman bagi User dan dapat dilog untuk operator.
- Jika sheet yang dipetakan tidak ditemukan, operasi dihentikan; aplikasi tidak membuat atau memilih sheet berdasarkan input User.
- Konflik edit dideteksi lewat `updated_at`; User diminta memuat ulang sebelum menimpa data yang lebih baru.
- Kegagalan validasi dilaporkan dekat pada field form, tanpa penulisan parsial.

## 7. Batasan dan evolusi

Arsitektur ini ditujukan untuk MVP dengan jumlah User dan record yang wajar. Jika kebutuhan berkembang menjadi pencarian kompleks, analytics, volume tinggi, audit kuat, atau workflow lintas User, Google Sheets perlu dievaluasi kembali sebagai sumber data. Perubahan tersebut berada di luar scope versi 1.

## 8. Checklist implementasi

1. Konfirmasi spreadsheet existing, header, dan daftar status resmi.
2. Siapkan service account dan bagikan akses spreadsheet dengan hak minimum yang diperlukan.
3. Implementasikan entity, port, dan use case beserta test otorisasi.
4. Implementasikan adapter Google Sheets dan mapping kompatibilitas data lama.
5. Konfigurasikan Auth.js Credentials provider dan proteksi route.
6. Implementasikan UI dengan workflow Impeccable sesuai `AGENTS.md`.
7. Jalankan lint, typecheck, test relevan, dan perbarui indeks Graphify.
