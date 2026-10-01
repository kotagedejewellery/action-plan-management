# Tech Stack — Action Plan Management System

## 1. Prinsip pemilihan

Stack ini mengikuti PRD dan sengaja ringkas: satu aplikasi Next.js yang menangani UI dan server-side logic, dengan Google Spreadsheet sebagai sumber data. Tidak ada backend terpisah, message broker, ORM, atau database tambahan pada versi 1.

## 2. Stack yang digunakan

| Lapisan | Teknologi | Peran |
| --- | --- | --- |
| Runtime | Node.js LTS | Runtime aplikasi dan tooling. |
| Framework | Next.js + App Router | Web application, routing, server rendering, dan route handlers. |
| Bahasa | TypeScript strict mode | Kontrak data dan keamanan tipe. |
| UI | React, Tailwind CSS, shadcn/ui | Komponen antarmuka yang konsisten dan responsif. |
| Form & validasi | React Hook Form + Zod | Pengelolaan form dan validasi input bersama client/server. |
| Autentikasi | Auth.js Credentials provider + JWT session | Login email/password dan session tanpa database session tambahan. |
| Password | bcryptjs | Hash serta verifikasi password. |
| Integrasi data | Google Sheets API (`googleapis`) | Membaca dan menulis spreadsheet melalui service account. |
| Pengujian | Vitest | Unit test domain dan use case. |
| Pengujian alur kritis | Playwright | End-to-end untuk login dan isolasi akses saat dibutuhkan. |
| Quality gate | ESLint, Prettier, TypeScript compiler | Konsistensi dan pencegahan kesalahan dasar. |
| Deployment | Vercel | Hosting aplikasi Next.js dan pengelolaan environment variable. |

Versi paket dipasang menggunakan versi stabil yang saling kompatibel saat implementasi, lalu dikunci pada lockfile proyek.

## 3. Keputusan implementasi utama

### Autentikasi

- Auth.js memakai Credentials provider untuk email/password dari sheet `Users`.
- Password dibuat dan diverifikasi hanya di server menggunakan hash bcrypt.
- Session JWT memuat `userId`, `role`, dan `status`; data otoritatif tetap diverifikasi dari sumber data ketika diperlukan untuk operasi sensitif.
- Login gagal untuk akun yang tidak ditemukan, password tidak cocok, atau `status = inactive`.

### Google Sheets

- Aplikasi memakai satu service account dengan akses hanya pada spreadsheet yang ditentukan.
- Spreadsheet dibagikan kepada email service account; credential JSON disimpan sebagai environment variable terenkripsi di Vercel, tidak pernah di-commit.
- Semua akses Sheets berada di adapter infrastructure, sehingga domain dan use case tidak bergantung pada SDK Google.

### Antarmuka

- Server Components digunakan secara default untuk halaman baca.
- Client Components hanya digunakan pada elemen interaktif seperti form, dialog, filter, dan tabel yang memerlukan state browser.
- Implementasi UI wajib mengikuti `AGENTS.md`: konteks Impeccable dimuat sebelum setiap perubahan UI.

## 4. Environment variables

| Variabel | Fungsi |
| --- | --- |
| `AUTH_SECRET` | Secret untuk signing/enkripsi session Auth.js. |
| `GOOGLE_SHEET_ID` | ID spreadsheet utama. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email service account Google. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Private key service account. |

Nilai nyata hanya boleh ada di `.env.local` untuk lokal dan environment configuration Vercel untuk deployment.

## 5. Struktur kode yang disarankan

```text
src/
  app/                    # Pages, layouts, server actions/route handlers
  domain/                 # Entity, value object, aturan bisnis murni
  application/            # Use case dan port/repository interface
  infrastructure/         # Adapter Google Sheets, Auth.js, konfigurasi
  presentation/           # Components, form schema, view model
  shared/                 # Utility yang benar-benar lintas lapisan
tests/
  unit/
  e2e/
```

Aturan dependensi: `presentation` dan `infrastructure` bergantung pada `application`; `application` bergantung pada `domain`; `domain` tidak bergantung pada framework atau SDK eksternal.

## 6. Standar clean code

- Satu use case menangani satu intent bisnis, misalnya `CreateActionPlan` atau `DeactivateUser`.
- Route handler/server action hanya mengautentikasi, memvalidasi input, memanggil use case, lalu membentuk respons.
- Repository interface berada pada application layer; implementasi Google Sheets berada di infrastructure layer.
- Validasi Zod berlaku di batas masuk aplikasi. Entity/use case tetap menjaga invariant bisnis.
- Gunakan nama yang menjelaskan intent; hindari helper generik dan abstraksi yang belum diperlukan.
- Tidak ada akses Google Sheets langsung dari component UI.

## 7. Quality gate minimal

| Risiko | Verifikasi minimal |
| --- | --- |
| Aturan bisnis dan otorisasi | Unit test use case dan policy akses. |
| Login/nonaktif | Unit/integration test autentikasi. |
| Alur utama | E2E login, tambah Action Plan, edit, dan pemisahan data User. |
| Perubahan umum | Lint, typecheck, dan test suite yang relevan. |
