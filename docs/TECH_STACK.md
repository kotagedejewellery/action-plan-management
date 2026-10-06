# Tech Stack — Action Plan Management System

## 1. Prinsip pemilihan

Stack ini sengaja ringkas: satu aplikasi Next.js yang menangani UI dan server-side logic, dengan Google Spreadsheet sebagai sumber data dan Google Drive sebagai penyimpanan lampiran. Tidak ada backend terpisah, message broker, ORM, atau database tambahan.

## 2. Stack yang digunakan

| Lapisan | Teknologi | Peran |
| --- | --- | --- |
| Runtime | Node.js 24 Alpine | Runtime container produksi dan CI. |
| Framework | Next.js + App Router | Web application, routing, server rendering, dan route handlers. |
| Bahasa | TypeScript strict mode | Kontrak data dan keamanan tipe. |
| UI | React 19, Tailwind CSS 4, lucide-react | Komponen antarmuka konsisten dan responsif. |
| Form & validasi | Native form React + Zod | Pengelolaan input browser dan validasi batas API. |
| Autentikasi | Auth.js Credentials provider + JWT session | Login email/password dan session tanpa database session tambahan. |
| Password | bcryptjs | Hash serta verifikasi password. |
| Integrasi data | Google Sheets API (`googleapis`) | Membaca dan menulis spreadsheet melalui service account. |
| Lampiran | Google Drive API (`googleapis`) + OAuth refresh token | Upload, baca, pindah ke Sampah, dan hapus permanen file. |
| Pengujian | Vitest | Unit test domain dan use case. |
| Quality gate | ESLint, TypeScript compiler | Konsistensi dan pencegahan kesalahan dasar. |
| Deployment | Docker Compose, Traefik, GitHub Actions, VPS | Build, TLS, reverse proxy, dan deployment produksi. |
| Dokumentasi kode | Graphify | Indeks arsitektur yang diperbarui setiap perubahan proyek. |

Versi paket dipasang menggunakan versi stabil yang saling kompatibel saat implementasi, lalu dikunci pada lockfile proyek.

## 3. Keputusan implementasi utama

### Autentikasi

- Auth.js memakai Credentials provider untuk email/password dari sheet `Users`.
- Password dibuat dan diverifikasi hanya di server menggunakan hash bcrypt.
- Session JWT memuat `userId`, `role`, dan `status`; data otoritatif tetap diverifikasi dari sumber data ketika diperlukan untuk operasi sensitif.
- Login gagal untuk akun yang tidak ditemukan, password tidak cocok, atau `status = inactive`.

### Google Sheets

- Aplikasi memakai satu service account dengan akses hanya pada spreadsheet yang ditentukan.
- Spreadsheet dibagikan kepada email service account; credential disimpan sebagai environment variable server dan tidak pernah di-commit.
- Semua akses Sheets berada di adapter infrastructure, sehingga domain dan use case tidak bergantung pada SDK Google.
- Pembacaan dicache di memori container selama 30 detik; sheet `Users` selama 5 detik agar perubahan status akun cepat berlaku.
- Error quota atau gangguan Google diterjemahkan menjadi pesan aman; quota memberi respons `503` dan arahan menunggu sekitar satu menit.

### Google Drive

- Google Drive memakai OAuth refresh token akun pemilik Drive, bukan service-account key.
- Folder dikelola otomatis dengan pola `root/users/<nama--user-id>/<action-plan-id>/`.
- File yang diterima: JPG, PNG, WebP, PDF, Word, Excel, dan PowerPoint; maksimal tiga file per Action Plan dan 10 MB per file.

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
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID OAuth Google Drive. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Client secret OAuth Google Drive. |
| `GOOGLE_OAUTH_REDIRECT_URI` | Callback HTTPS Google Drive OAuth. |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Refresh token Drive hasil koneksi pertama. |
| `GOOGLE_DRIVE_FOLDER_ID` | Folder root lampiran Drive. |
| `BOOTSTRAP_ADMIN_NAME` / `EMAIL` / `PASSWORD` | Hanya untuk membuat Admin pertama saat `Users` kosong. |

Nilai nyata hanya boleh ada di `.env.local` untuk lokal dan `.env` pada direktori deployment Docker. `AUTH_URL` dan `NEXTAUTH_URL` tidak diperlukan oleh kode saat ini karena Auth.js menggunakan `trustHost: true`.

## 5. Struktur kode yang disarankan

```text
src/
  app/                    # Pages, layouts, route handlers
  domain/                 # Entity, value object, aturan bisnis murni
  application/            # Use case dan port/repository interface
  infrastructure/         # Adapter Google Sheets, Auth.js, konfigurasi
  presentation/           # Components, form schema, view model
  lib/                    # Utility kecil lintas lapisan, misalnya tanggal Bangkok
tests/
  unit/
```

Aturan dependensi: `presentation` dan `infrastructure` bergantung pada `application`; `application` bergantung pada `domain`; `domain` tidak bergantung pada framework atau SDK eksternal.

## 6. Standar clean code

- Satu use case menangani satu intent bisnis, misalnya `CreateActionPlan` atau `DeactivateUser`.
- Route handler hanya mengautentikasi, memvalidasi input, memanggil use case, lalu membentuk respons.
- Repository interface berada pada application layer; implementasi Google Sheets berada di infrastructure layer.
- Validasi Zod berlaku di batas masuk aplikasi. Entity/use case tetap menjaga invariant bisnis.
- Gunakan nama yang menjelaskan intent; hindari helper generik dan abstraksi yang belum diperlukan.
- Tidak ada akses Google Sheets langsung dari component UI.

## 7. Quality gate minimal

| Risiko | Verifikasi minimal |
| --- | --- |
| Aturan bisnis dan otorisasi | Unit test use case dan policy akses. |
| Login/nonaktif | Unit/integration test autentikasi. |
| Tanggal dan error integrasi | Unit test kalender Bangkok dan pemetaan error quota Google. |
| Perubahan umum | Lint, typecheck, dan test suite yang relevan. |
