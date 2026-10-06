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

## 5. Pemulihan gangguan umum

| Gejala | Tindakan |
| --- | --- |
| Batas permintaan Google Sheets/Drive | Tunggu sekitar satu menit; jangan refresh berulang. |
| Akses Google tidak tersedia | Periksa API aktif, credential, dan izin service account/OAuth. |
| Lampiran gagal | Periksa Drive OAuth environment, tipe file, dan ukuran maksimal 10 MB. |
| Semua user gagal login | Periksa akses Sheets, `GOOGLE_SHEET_ID`, serta `docker compose logs --tail=100 app`. |
| Logout menuju localhost | Hapus `AUTH_URL`/`NEXTAUTH_URL` lama yang bernilai localhost dan pastikan Traefik meneruskan domain publik. |

Endpoint kesehatan produksi: `https://apm.kotagedejewellery.tech/api/health`.
