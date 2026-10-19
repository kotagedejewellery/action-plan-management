# Brief Proyek Action Plan Management

Ditinjau: 19 Oktober 2026. Brief ini membedakan pemahaman dari dokumentasi, verifikasi implementasi, dan hal yang belum diuji pada layanan nyata.

## Tujuan dan pengguna

Aplikasi internal KotaGede Jewellery untuk mencatat pekerjaan harian, merencanakan pekerjaan mingguan, memantau penyelesaian tim, serta menyimpan hasil pekerjaan dan lampiran. Pengguna memiliki akun masing-masing; Admin memantau tim dan mengelola akun serta status pekerjaan. Google Spreadsheet tetap menjadi sumber data utama. [Sumber: README](../README.md), [arsitektur](SYSTEM_ARCHITECTURE.md).

## Alur dan aturan yang sudah diverifikasi pada implementasi

- User membuat, mengubah, dan menghapus Action Plan miliknya. Data mencakup tanggal, deskripsi, status pagi/sore, link hasil, catatan, dan lampiran. Riwayat pekerjaan selesai mengikuti `isCompleted` pada status sore. [Sumber: use case](../src/application/use-cases.ts).
- Weekly Plan menggunakan minggu yang dimulai Senin dan membuat Action Plan harian pada hari kerja yang dipilih. Action Plan yang masih terhubung tidak boleh dihapus sendiri. Penghapusan Weekly Plan menghapus permanen rencana mingguan, Action Plan terkait, dan file lampirannya. Action Plan mandiri memakai soft-delete. [Sumber: use case](../src/application/use-cases.ts), [kebijakan data](DATABASE_DESIGN.md#9-kebijakan-penghapusan).
- Admin memiliki dashboard ringkasan total, selesai, persentase penyelesaian, keterlambatan, tren, serta rekap per User. Ada perlindungan agar Admin aktif terakhir dan status aktif terakhir tidak dinonaktifkan. [Sumber: analitik dashboard](../src/application/dashboard-analytics.ts), [use case](../src/application/use-cases.ts).
- Login memakai Auth.js Credentials dan password bcrypt. Actor dibaca kembali dari data akun untuk memastikan akun masih aktif; hak akses dan kepemilikan ditegakkan di server. [Sumber: autentikasi](../src/auth.ts), [actor](../src/presentation/server/actor.ts), [use case](../src/application/use-cases.ts).

## Arsitektur dan teknologi

Satu aplikasi Next.js menangani antarmuka dan API server. Kode dipisah menjadi `domain` untuk model/aturan bisnis, `application` untuk use case dan kontrak repository, `infrastructure` untuk integrasi, serta `presentation` untuk halaman/komponen. Integrasi Google dipasang di sisi server; aturan bisnis dapat diuji tanpa memanggil Google. [Sumber: arsitektur](SYSTEM_ARCHITECTURE.md).

Dependensi yang diperiksa mencakup Next.js 16.3.7, React 19.2.8, TypeScript 5, Tailwind CSS 4, Auth.js 5 beta, Zod 4, dan Vitest 3. Dokumentasi menetapkan Node.js 24 Alpine, Google APIs, Docker Compose, Traefik, serta GitHub Actions untuk deployment VPS. [Sumber: package.json](../package.json), [tech stack](TECH_STACK.md).

## Penyimpanan dan integrasi menurut dokumentasi

- Satu spreadsheet berisi `Users`, `Settings`, `Weekly Plans`, dan satu tab Action Plan per User yang dipetakan melalui `Users.sheet_name`. Server menentukan tab dari akun, bukan dari input client. [Sumber: desain database](DATABASE_DESIGN.md#1-model-penyimpanan).
- Enam kolom bisnis spreadsheet lama dipertahankan. Kolom teknis menambahkan ID stabil, timestamp, soft-delete, relasi Weekly Plan, dan metadata lampiran. Dokumentasi menjelaskan migrasi ID/timestamp saat membaca data lama; proses migrasi ini belum diuji pada spreadsheet nyata dalam tinjauan ini. [Sumber: kompatibilitas data](DATABASE_DESIGN.md#4-sheet-action-plan-per-user).
- Google Sheets menggunakan service account; Google Drive menggunakan OAuth refresh token akun pemilik Drive. Binary lampiran berada di Drive, metadata berada di spreadsheet. Batas yang didokumentasikan adalah tiga file per Action Plan, 10 MB per file, dengan tipe gambar, PDF, dan dokumen Office yang diizinkan. [Sumber: tech stack](TECH_STACK.md#3-keputusan-implementasi-utama), [setup](SETUP.md#2-google-drive-untuk-lampiran).
- Pembacaan dicache 30 detik, sedangkan akun lima detik. Konflik edit memakai `updated_at`; Google Sheets tetap tidak menyediakan transaksi multi-sheet atau foreign key. Cache memori mengasumsikan satu container aplikasi. [Sumber: arsitektur](SYSTEM_ARCHITECTURE.md#6-penanganan-kegagalan), [konsekuensi database](DATABASE_DESIGN.md#10-konsekuensi-google-sheets-sebagai-database).

## Kebutuhan operasional

Untuk menjalankan sistem diperlukan spreadsheet yang dibagikan kepada service account, credential server, Admin awal, serta konfigurasi OAuth Drive. Bootstrap Admin dijalankan sekali ketika `Users` kosong; password bootstrap kemudian dihapus dari environment. Pengembangan lokal menggunakan `npm ci` dan `npm run dev`. [Sumber: setup](SETUP.md).

Konfigurasi deployment yang diperiksa memakai VPS, Docker Compose, network `proxy`, DNS `apm.kotagedejewellery.tech`, dan Traefik untuk HTTPS. Push ke `main` menjalankan TypeScript, ESLint, dan Vitest sebelum deploy melalui SSH. `/api/health` digunakan untuk pemeriksaan container. Status deployment dan koneksi layanan produksi belum diverifikasi. [Sumber: workflow](../.github/workflows/deploy.yml), [Dockerfile](../Dockerfile), [Compose](../compose.yml), [setup deployment](SETUP.md#4-deployment-vps).

## Batas pemahaman dan risiko utama

Fondasi proyek adalah workspace operasional dengan Google Sheets, cocok untuk penggunaan internal berukuran wajar. Pertumbuhan volume, penulisan bersamaan, kebutuhan audit, atau workflow lintas User memerlukan peninjauan ulang penyimpanan. Penghapusan Weekly Plan beserta turunannya bersifat permanen; pemilik sistem perlu memahami kebijakan ini dan mengelola backup spreadsheet serta credential. [Sumber: batas arsitektur](SYSTEM_ARCHITECTURE.md#8-batasan-dan-evolusi), [kebijakan dan batas penyimpanan](DATABASE_DESIGN.md#9-kebijakan-penghapusan).

PRD masih berjudul Initial Requirement v1 dan belum mencakup seluruh fitur implementasi, termasuk Weekly Plan, dashboard, dan lampiran. Dokumen tersebut perlu dibaca bersama dokumentasi teknis dan kode saat menjadikan kebutuhan sebagai acuan kerja berikutnya. [Sumber: PRD](PRD.md), [use case](../src/application/use-cases.ts), [analitik dashboard](../src/application/dashboard-analytics.ts).

`npm.cmd test` berhasil: empat file pengujian, 17 test lulus. Tinjauan ini belum menjalankan alur browser, OAuth, operasi file, migrasi data lama, atau deployment produksi. Tidak ada credential maupun data produksi yang dibaca; tidak ada kode aplikasi yang diubah.
