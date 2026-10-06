# System Architecture — Action Plan Management System

## 1. Ringkasan

Aplikasi adalah Next.js monolith dalam container Docker di VPS. Traefik menerima HTTPS untuk `apm.kotagedejewellery.tech` dan meneruskan request ke container aplikasi. Next.js menyajikan antarmuka serta menjalankan use case server-side; Google Sheets adalah sumber data dan Google Drive menyimpan lampiran.

```text
Browser (Admin / User)
          │ HTTPS
          ▼
Traefik (TLS / Let's Encrypt)
          │ Docker network: proxy
          ▼
Next.js container
├── Presentation: pages, components, forms
├── Application: use cases, authorization policies, ports
├── Domain: entities and business rules
└── Infrastructure: Auth.js, Google Sheets, Google Drive adapters
          ├── Google Sheets API / service account
          └── Google Drive API / OAuth refresh token
          ▼
Google Spreadsheet
├── Users, Settings, Weekly Plans
└── User Action Plan sheets
```

Tidak ada backend terpisah maupun database tambahan pada versi 1.

## 2. Clean Architecture

### Domain

Berisi model dan aturan bisnis murni, tanpa import Next.js, Auth.js, React, atau Google SDK.

- Entity: `User`, `ActionPlan`, `WeeklyPlan`, `ActionPlanStatus`
- Value/enum: `UserRole`, `AccountStatus`
- Policy: kepemilikan Action Plan dan hak Admin

### Application

Berisi orkestrasi aturan bisnis dan port (interface) untuk dunia luar.

- Use case: login, User/Status management, Action Plan, Weekly Plan, dan lampiran
- Port: `UserRepository`, `ActionPlanRepository`, `WeeklyPlanRepository`, `StatusRepository`, `AttachmentStorage`
- Otorisasi: keputusan akses dibuat di sini berdasarkan actor terautentikasi, bukan berdasarkan data dari client.

### Infrastructure

Menerapkan port application untuk teknologi tertentu.

- `GoogleSheetsUserRepository`
- `GoogleSheetsActionPlanRepository`
- Auth.js configuration dan Credentials provider
- Google Drive attachment storage
- Parser/mapper antara baris sheet dan entity domain

### Presentation

Lapisan terluar yang bergantung pada Application, bukan sebaliknya.

- App Router pages/layouts
- Route handlers
- Components dan form
- Schema validasi input serta view model

## 3. Aturan dependensi

```text
Presentation ───────► Application ───────► Domain
Infrastructure ─────► Application ───────► Domain
Domain ─────────────► (tidak ada dependensi eksternal)
```

Composition root di server memasangkan port application dengan adapter Google. Ini membuat aturan bisnis dapat diuji tanpa API Google.

## 4. Alur utama

### Login

```text
User submits email/password
  → Auth.js Credentials provider
  → AuthenticateUser reads Users sheet
  → validate password hash + active status
  → issue JWT session containing userId and role
  → redirect: admin to dashboard; user to own Action Plan
```

### User membuat atau mengubah Action Plan

```text
Authenticated User
  → route handler validates Zod input
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

### Weekly Plan dan lampiran

```text
Weekly Plan dibuat
  → Action Plan harian dibuat untuk setiap hari kerja terpilih
  → planned_action_plan_ids disinkronkan saat relasi Action Plan berubah

File upload
  → validasi tipe, ukuran, maksimum tiga file
  → Google Drive root/users/<nama--user-id>/<action-plan-id>
  → metadata file disimpan pada Action Plan
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
| Lampiran | OAuth Drive hanya di server; Admin hanya dapat pratinjau gambar. |
| Link | Validasi URL dan render link dengan atribut keamanan yang sesuai. |

## 6. Penanganan kegagalan

- Error Sheets/Drive diterjemahkan menjadi pesan aman. Quota `429` menjadi `503` dengan arahan menunggu sekitar satu menit.
- Jika sheet yang dipetakan tidak ditemukan, operasi dihentikan; aplikasi tidak membuat atau memilih sheet berdasarkan input User.
- Konflik edit dideteksi lewat `updated_at`; User diminta memuat ulang sebelum menimpa data yang lebih baru.
- Kegagalan validasi dilaporkan dekat pada field form, tanpa penulisan parsial.
- Cache pembacaan Sheets berlaku 30 detik; `Users` 5 detik untuk mengurangi quota sambil menjaga status akun cepat terbaca.

## 7. Deployment

1. Push ke `main` menjalankan `npm ci`, TypeScript, ESLint, dan Vitest di GitHub Actions.
2. Setelah lulus, workflow SSH ke VPS lalu menjalankan `git pull --ff-only`, Docker build, dan `docker compose up -d --force-recreate --wait`.
3. Traefik merutekan domain ke port internal 3000. Docker healthcheck memanggil `GET /api/health`.

GitHub Secrets: `VPS_HOST`, `VPS_USER`, dan `VPS_SSH_KEY`.

## 8. Batasan dan evolusi

Arsitektur ini ditujukan untuk MVP dengan jumlah User dan record yang wajar. Jika kebutuhan berkembang menjadi pencarian kompleks, analytics, volume tinggi, audit kuat, atau workflow lintas User, Google Sheets perlu dievaluasi kembali sebagai sumber data. Perubahan tersebut berada di luar scope versi 1.

## 9. Checklist operasional

1. Konfirmasi spreadsheet existing, header, dan daftar status resmi.
2. Siapkan service account dan bagikan akses spreadsheet dengan hak minimum yang diperlukan.
3. Konfigurasikan Drive OAuth dan simpan refresh token hanya di environment server.
4. Pastikan `.env` produksi lengkap sebelum container direstart.
5. Jalankan lint, typecheck, test relevan, dan perbarui indeks Graphify sebelum deploy.
