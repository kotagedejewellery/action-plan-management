# Setup Action Plan Management

## 1. Google Sheets dan Admin awal

1. Aktifkan Google Sheets API pada Google Cloud project.
2. Buat service account sesuai kebijakan organisasi, lalu bagikan spreadsheet aplikasi kepada `GOOGLE_SERVICE_ACCOUNT_EMAIL` sebagai **Editor**.
3. Salin `.env.example` menjadi `.env.local` untuk lokal, atau `.env` pada direktori aplikasi di VPS.
4. Isi `AUTH_SECRET`, `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, dan `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
5. Isi `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, serta `BOOTSTRAP_ADMIN_PASSWORD` dan jalankan `npm run bootstrap:admin` sekali ketika sheet `Users` masih kosong.
6. Hapus `BOOTSTRAP_ADMIN_PASSWORD` setelah akun Admin awal berhasil dibuat.

Spreadsheet menggunakan `Users` untuk akun, `Settings` untuk status custom, `Weekly Plans` untuk target mingguan, dan `action_plan_<user_id>` untuk data User.

## 2. Google Drive untuk lampiran

1. Aktifkan Google Drive API. Konfigurasikan Google Auth Platform sebagai **External**, tambahkan akun pemilik Drive sebagai Test user bila aplikasi belum dipublikasikan, dan gunakan scope `https://www.googleapis.com/auth/drive.file`.
2. Buat OAuth Client tipe **Web application** dan tambahkan redirect URI persis seperti `GOOGLE_OAUTH_REDIRECT_URI`, misalnya:

   ```text
   https://apm.kotagedejewellery.tech/api/integrations/google-drive/callback
   ```

3. Isi `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, dan `GOOGLE_OAUTH_REDIRECT_URI`; biarkan refresh token dan folder ID kosong pada koneksi pertama.
4. Deploy atau restart aplikasi, login sebagai Admin, lalu buka `/api/integrations/google-drive/connect`.
5. Login memakai akun Google pemilik Drive dan setujui akses. Callback menampilkan `GOOGLE_OAUTH_REFRESH_TOKEN` serta `GOOGLE_DRIVE_FOLDER_ID` sekali saja.
6. Simpan kedua nilai tersebut di `.env` server dan jalankan `docker compose up -d --build`.

Untuk rotasi token, hapus refresh token dari environment secara terencana, deploy ulang, lalu ulangi koneksi. Jangan pernah memasukkan token ke Git.

## 3. Menjalankan lokal

```bash
npm ci
npm run dev
```

Buka `http://localhost:3000`. Gunakan `.env.local`; jangan menaruh credential produksi pada komputer yang tidak dipercaya.

## 4. Deployment VPS

Direktori deployment workflow adalah:

```text
/opt/apps/sistem-action-plan/action-plan-management
```

Prasyarat: Docker Engine, Docker Compose plugin, Docker network eksternal `proxy`, file `.env` produksi, dan DNS `apm.kotagedejewellery.tech` yang mengarah ke Traefik/VPS.

Deploy manual:

```bash
git pull --ff-only origin main
docker compose build
docker compose up -d --force-recreate --wait
docker compose logs --tail=100 app
```

Push ke `main` akan menjalankan TypeScript, lint, dan Vitest sebelum GitHub Actions deploy melalui SSH. GitHub Secrets yang dibutuhkan: `VPS_HOST`, `VPS_USER`, dan `VPS_SSH_KEY`.

### Mengaktifkan Catatan Kolaboratif

Catatan Kolaboratif adalah modul tambahan dan tidak aktif tanpa environment baru. Tambahkan `NOTES_COLLABORATION_SECRET`, `NOTES_POSTGRES_USER`, dan `NOTES_POSTGRES_PASSWORD` yang kuat ke `.env`, lalu isi `NOTES_DATABASE_URL` dengan hostname `notes-db` seperti `.env.example`.

Pada aktivasi pertama, build image lebih dulu, tunggu database sehat, lalu jalankan migrasi sekali secara eksplisit. Jalankan perintah migrasi yang sama pada setiap rilis yang menambah skema Notes; migrasi bersifat forward-only dan tidak diaktifkan otomatis saat startup:

```bash
docker compose -f compose.yml -f compose.notes.yml build app
docker compose -f compose.yml -f compose.notes.yml up -d --wait notes-db
docker compose -f compose.yml -f compose.notes.yml run --rm app npm run migrate:notes
docker compose -f compose.yml -f compose.notes.yml run --rm app npm run check:notes
docker compose -f compose.yml -f compose.notes.yml up -d --force-recreate --wait app
```

Database Notes hanya terhubung ke network internal `notes`; aplikasi tetap juga terhubung ke `proxy` untuk Traefik. Setelah aktivasi awal, deployment otomatis biasa dengan `compose.yml` tetap dapat menjangkau database Notes melalui network internal itu. Jangan gunakan `docker compose -f compose.yml -f compose.notes.yml down -v` karena menghapus volume `notes_postgres_data`. Deployment tidak mengubah Spreadsheet atau data Action Plan. Ketika fitur gambar Notes digunakan, file baru saja yang disimpan privat pada folder `notes/` di Google Drive root; tidak ada file atau folder lama yang diubah saat deploy maupun migrasi.

### Backup dan pemulihan Notes

Buat backup sebelum upgrade berisiko dan simpan hasilnya di lokasi aman di luar VPS:

```bash
mkdir -p backups
docker compose -f compose.yml -f compose.notes.yml exec -T notes-db sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > backups/notes-$(date +%F-%H%M%S).dump
```

Uji pemulihan hanya pada database Notes pengganti. Perintah berikut **menimpa database target**, sehingga jangan pernah dijalankan pada data produksi yang masih aktif tanpa backup terverifikasi:

```bash
docker compose -f compose.yml -f compose.notes.yml exec -T notes-db sh -c 'pg_restore -U "$POSTGRES_USER" --clean --if-exists -d "$POSTGRES_DB"' < backups/notes-YYYY-MM-DD-HHMMSS.dump
```

## 5. Pemulihan gangguan umum

| Gejala | Tindakan |
| --- | --- |
| Batas permintaan Google Sheets/Drive | Tunggu sekitar satu menit; jangan refresh berulang. |
| Akses Google tidak tersedia | Periksa API aktif, credential, dan izin service account/OAuth. |
| Lampiran gagal | Periksa Drive OAuth environment, tipe file, dan ukuran maksimal 10 MB. |
| Semua user gagal login | Periksa akses Sheets, `GOOGLE_SHEET_ID`, serta `docker compose logs --tail=100 app`. |
| Logout menuju localhost | Hapus `AUTH_URL`/`NEXTAUTH_URL` lama yang bernilai localhost dan pastikan Traefik meneruskan domain publik. |

Endpoint kesehatan produksi: `https://apm.kotagedejewellery.tech/api/health`.

## 6. Penerapan multi-divisi

Akun `admin` existing tetap menjadi SuperAdmin tanpa mengganti ID atau password. Sebelum membuka akses User/BOD setelah pembaruan, siapkan pemetaan akun dan ikuti `docs/MULTI_DIVISION_ROLLOUT.md`. Akun User yang belum dipetakan tidak dapat mengisi pekerjaan sampai ditetapkan ke divisi aktif. Tidak ada bootstrap atau backfill otomatis saat deploy; jangan menjalankan bootstrap Admin pada Users yang sudah berisi data.
