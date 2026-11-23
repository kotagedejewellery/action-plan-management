# Database Design — Google Spreadsheet

## 1. Model penyimpanan

Satu Google Spreadsheet menjadi sumber data utama. Sheet `Users` menyimpan akun, `Divisions` menyimpan divisi dan penanggung jawab BOD, `Settings` menyimpan status custom, `Weekly Plans` menyimpan target mingguan, dan setiap User memiliki satu sheet Action Plan yang ditentukan melalui `Users.sheet_name`. Google Drive menyimpan binary lampiran; spreadsheet hanya menyimpan metadatanya.

```text
Action Plan Management Spreadsheet
├── Users
├── Settings
├── Weekly Plans
├── action_plan_<user-uuid>
└── action_plan_<user-uuid> lainnya
```

Desain ini mempertahankan pola spreadsheet existing. Aplikasi tidak membuat database lain pada versi 1.

## 2. Sheet `Users`

| Kolom | Tipe aplikasi | Wajib | Aturan |
| --- | --- | :---: | --- |
| `id` | UUID/string | Ya | Identitas internal yang unik dan tidak berubah. |
| `name` | string | Ya | Nama tampilan User. |
| `email` | string | Ya | Unik secara case-insensitive, dipakai untuk login. |
| `password_hash` | string | Ya | Hasil bcrypt; tidak pernah dikirim ke client. |
| `role` | enum | Ya | `admin` (SuperAdmin), `bod`, atau `user`. |
| `status` | enum | Ya | Hanya `active` atau `inactive`. |
| `sheet_name` | string | Ya untuk role user | Nama tab Action Plan yang telah ada. Tidak boleh dipakai dua User. |
| `created_at` | ISO 8601 UTC | Ya | Waktu akun dibuat. |
| `updated_at` | ISO 8601 UTC | Ya | Waktu perubahan terakhir. |
| `division_id` (J) | UUID/string | Untuk User baru | Divisi anggota; pemetaan awal akun lama boleh kosong dan harus ditinjau SuperAdmin. |

`email` dinormalisasi (trim + lowercase) sebelum dibandingkan atau disimpan. `sheet_name` harus divalidasi terhadap daftar sheet yang diizinkan dan tidak boleh dibentuk dari input request tanpa otorisasi.

## 3. Sheet `Settings`

| Kolom | Tipe aplikasi | Aturan |
| --- | --- | --- |
| `id` | UUID | Identitas status. |
| `label` | string | Unik case-insensitive; tidak diubah agar riwayat aman. |
| `is_active` | boolean | Hanya status aktif yang dapat dipilih pada form. |
| `created_at` | ISO 8601 UTC | Waktu pembuatan. |
| `updated_at` | ISO 8601 UTC | Waktu perubahan terakhir. |
| `is_completed` | boolean | Menentukan Action Plan selesai/Riwayat. |

Admin dapat menambah, mengaktifkan, menonaktifkan, dan menetapkan status final. Minimal satu status harus tetap aktif.

## 4. Sheet Action Plan per User

Enam kolom bisnis existing dipertahankan di awal agar data lama tetap kompatibel. Kolom teknis ditambahkan di sebelah kanan oleh aplikasi.

| Urutan | Kolom | Tipe aplikasi | Wajib | Keterangan |
| ---: | --- | --- | :---: | --- |
| 1 | `tanggal` | `YYYY-MM-DD` | Ya | Disimpan canonical ISO date, ditampilkan sebagai `DD/MM/YYYY`. |
| 2 | `action_plan` | string | Ya | Deskripsi pekerjaan. |
| 3 | `status_pagi` | string/enum | Ya | Status awal hari. |
| 4 | `status_sore` | string/enum | Tidak | Status akhir hari. |
| 5 | `link_hasil` | URL/string | Tidak | Link hasil kerja. |
| 6 | `catatan` | string | Tidak | Catatan tambahan. |
| 7 | `record_id` | UUID/string | Ya untuk data baru | Identitas record stabil untuk update. |
| 8 | `created_at` | ISO 8601 UTC | Ya untuk data baru | Waktu record dibuat. |
| 9 | `updated_at` | ISO 8601 UTC | Ya untuk data baru | Waktu perubahan terakhir. |
| 10 | `deleted_at` | ISO 8601 UTC | Tidak | Diisi untuk soft-delete Action Plan mandiri. |
| 11 | `deleted_by` | UUID | Tidak | Actor yang melakukan soft-delete. |
| 12 | `weekly_plan_id` | UUID | Tidak | Relasi opsional ke Weekly Plan. |
| 13 | `lampiran` | JSON array | Tidak | Metadata Google Drive: `id`, `name`, `mimeType`. |

### Kompatibilitas data existing

- Baris lama dengan enam kolom tetap dapat dibaca dan ditampilkan.
- Saat sheet lama pertama kali dibaca, baris tanpa `record_id` dimigrasikan batch dengan UUID dan timestamp pada kolom G:I; waktu asal yang tidak tersedia memakai waktu migrasi.
- Aplikasi mencari record berdasarkan `record_id`, bukan nomor baris. Nomor baris spreadsheet bukan primary key karena dapat berubah ketika pengguna spreadsheet menyisipkan/menghapus baris.
- Header lama yang menggunakan label tampilan (`Tanggal`, `Action Plan`, dan seterusnya) dipetakan di adapter Sheets. Header fisik tidak perlu diubah jika sudah dipakai tim.

## 5. Sheet `Weekly Plans`

| Kolom | Tipe aplikasi | Keterangan |
| --- | --- | --- |
| `id` | UUID | Identitas Weekly Plan. |
| `user_id` | UUID | Pemilik. |
| `judul` | string | Target mingguan. |
| `week_start` / `week_end` | `YYYY-MM-DD` | Periode Senin sampai Minggu. |
| `catatan` | string | Opsional. |
| `created_at` / `updated_at` | ISO 8601 UTC | Metadata dan deteksi konflik edit. |
| `deleted_at` / `deleted_by` | legacy | Tidak dipakai oleh penghapusan saat ini. |
| `planned_action_plan_ids` | JSON UUID array | Indeks relasi Action Plan harian. |

Pembuatan Weekly Plan membuat Action Plan harian untuk hari kerja yang dipilih. Saat Action Plan ditautkan atau dilepas, `planned_action_plan_ids` disinkronkan oleh application layer. Edit Weekly Plan menolak data dengan `updated_at` yang sudah berubah.

## 6. Relasi dan isolasi data

```text
Users (1) ──── (1) User Action Plan Sheet
          sheet_name

```

Users (1) memiliki banyak Weekly Plan; setiap Weekly Plan memiliki banyak Action Plan harian. Satu Action Plan dapat memiliki maksimal tiga metadata lampiran Google Drive.

Pada setiap operasi User, aplikasi mengambil `sheet_name` dari akun terautentikasi di sheet `Users`; request client tidak boleh menentukan target sheet. SuperAdmin boleh memilih seluruh User; BOD hanya anggota divisinya. Target tetap di-resolve lewat `Users.id` dan diperiksa cakupannya sebelum membaca sheet atau lampiran.

## 7. Validasi integritas

| Data | Validasi |
| --- | --- |
| `Users.id` / `record_id` | Unik dan tidak kosong untuk record baru. |
| Email | Format email valid dan unik. |
| Role | `admin`, `bod`, atau `user`. |
| Status akun | `active` atau `inactive`. |
| Tanggal | Tanggal kalender valid. |
| Action Plan | Setelah trim tidak kosong. |
| Link Hasil | URL valid bila terisi; scheme yang diizinkan `https`/`http`. |
| Status Pagi | Wajib dan berasal dari daftar status yang disetujui. |

Google Sheets tidak menyediakan constraint database relasional. Semua validasi dan aturan keunikan ditegakkan oleh application layer sebelum penulisan.

## 8. Operasi akses data

| Use case | Sheet | Operasi |
| --- | --- | --- |
| Login | `Users` | Cari `email`, cek `status` dan `password_hash`. |
| Kelola User | `Users` | Tambah/perbarui akun. |
| Daftar User | `Users` | Baca akun tanpa `password_hash`. |
| List Action Plan | Sheet milik akun / User pilihan Admin | Baca dan urutkan tanggal menurun. |
| Tambah Action Plan | Sheet milik akun | Append satu baris. |
| Edit Action Plan | Sheet milik akun | Cari `record_id`, update hanya baris target. |
| Weekly Plan | `Weekly Plans` dan sheet User | Buat target serta Action Plan harian terkait. |
| Lampiran | Google Drive + kolom `lampiran` | Simpan file dan metadata untuk Action Plan. |

## 9. Kebijakan penghapusan

| Objek | Kebijakan |
| --- | --- |
| Action Plan mandiri | Soft-delete; record tidak tampil namun tetap ada di sheet. |
| Lampiran yang dihapus dari Action Plan | Dipindahkan ke Sampah Google Drive dan metadata dihapus. |
| Weekly Plan | Hard-delete permanen. |
| Action Plan dan lampiran yang terhubung Weekly Plan | Hard-delete permanen bersama Weekly Plan. |

## 10. Konsekuensi Google Sheets sebagai database

- Tidak ada transaksi multi-sheet dan foreign key; operasi dibuat sekecil mungkin serta memiliki penanganan error yang jelas.
- Edit bersamaan pada baris yang sama berpotensi last-write-wins. Untuk v1, aplikasi mengirim `updated_at` terakhir dan menolak update jika nilainya telah berubah, sehingga User diminta memuat ulang.
- Akses langsung manusia ke spreadsheet tetap dimungkinkan, tetapi perubahan header/kolom harus dikontrol karena dapat mengganggu adapter.
- Spreadsheet dan credential service account harus dibackup/dikelola oleh pemilik Workspace.

## 11. Divisi dan kompatibilitas akun lama

Sheet `Divisions`, kolom A:G, berisi `id`, `name`, `bod_user_id`, `status`, `created_at`, `updated_at`, `approval_required`. Kolom G default `false`; sheet A:F lama tetap dapat dibaca tanpa mutasi. Kolom G hanya ditambahkan saat SuperAdmin secara eksplisit menyimpan divisi. Nama divisi unik tanpa membedakan huruf besar/kecil. Satu divisi aktif wajib memiliki satu BOD aktif; satu akun BOD hanya ditugaskan pada satu divisi. Divisi nonaktif dapat disimpan tanpa BOD untuk persiapan. Penggantian BOD menutup akses BOD lama pada permintaan berikutnya. BOD yang masih memimpin divisi aktif tidak dapat dinonaktifkan atau diubah role-nya sebelum penggantian.

`Users.division_id` adalah afiliasi pekerjaan anggota, bukan sumber penugasan BOD. Penugasan BOD di-resolve dari `Divisions.bod_user_id`. Afiliasi anggota dipertahankan saat role berubah agar riwayat tetap terikat pada divisi semula. Perpindahan divisi anggota tidak tersedia; pemetaan pertama akun lama diperbolehkan dan harus dikonfirmasi, termasuk akun yang sudah berganti role tetapi masih memiliki sheet pekerjaan. Pemetaan awal riwayat BOD harus sesuai penugasan divisinya, baik melalui form maupun API. Sheet, ID, hash password, relasi Weekly Plan dan lampiran tetap sama. Action Plan tidak memerlukan kolom divisi tambahan selama afiliasi anggota tetap.

Pembacaan Users sembilan kolom tetap didukung tanpa perubahan data. Kolom J ditambahkan sebagai `division_id` hanya pada mutasi akun yang diminta SuperAdmin; kolom J tidak dikenal atau berisi data tanpa header ditolak untuk mencegah penimpaan. Pembacaan ketika tab Divisions belum ada menghasilkan daftar kosong tanpa membuat tab. Penambahan divisi secara eksplisit membuat tab yang belum ada beserta header; header tab existing yang berbeda ditolak. Tidak ada backfill, reset, penghapusan, atau bootstrap saat startup/deploy.

User dan BOD tanpa divisi aktif tidak memperoleh akses pekerjaan. SuperAdmin tetap dapat memantau riwayat akun yang belum dipetakan melalui cakupan global. BOD dapat memantau anggota nonaktif dan riwayat mantan User yang tetap memiliki sheet dalam divisinya; BOD tidak dapat mengubah pekerjaan atau akun. Preview gambar memakai pemeriksaan anggota, record dan ID lampiran; respons binary tidak boleh dicache browser. File non-gambar mengikuti batas existing: hanya pemilik yang mengunduh melalui aplikasi.

Lihat `docs/MULTI_DIVISION_ROLLOUT.md` sebelum mengubah pemetaan environment nyata.

## 12. Sheet `Action Plan Approvals`

Tab ini dibuat secara lazy hanya ketika User pertama kali mengajukan approval, sehingga deploy atau pembacaan data tidak mengubah Spreadsheet. Sheet yang sudah ada harus memiliki header persis sesuai skema; header berbeda ditolak tanpa menulis atau menghapus data. Setiap baris adalah event append-only: `id`, `action_plan_id`, `owner_id`, `division_id`, `plan_updated_at`, `decision`, `note`, `actor_id`, `created_at`.

`decision` bernilai `submitted`, `approved`, atau `rejected`. Status yang berlaku adalah event terakhir berdasarkan urutan append pada `action_plan_id` dengan `plan_updated_at` yang sama. Karena itu edit Action Plan setelah submit atau keputusan otomatis membuat event lama kedaluwarsa dan User perlu mengajukan ulang. Action Plan yang sudah disetujui tidak dapat diajukan ulang tanpa perubahan. Hanya BOD canonical pada divisi dengan `approval_required=true` yang dapat membuat event `approved` atau `rejected`; alasan penolakan wajib diisi. Bukti submit minimal berupa `link_hasil` atau satu lampiran yang telah tersimpan.

## 13. PostgreSQL Catatan Kolaboratif

Catatan Kolaboratif tidak memakai Spreadsheet karena dokumen Yjs memerlukan persistence biner dan penyatuan edit concurrent. Database ini terpisah dari Spreadsheet Action Plan; satu-satunya referensi lintas storage adalah `Users.id`, yang tetap divalidasi aplikasi ketika modul diakses.

| Tabel | Isi |
| --- | --- |
| `note_workspaces` | Workspace, nama, Owner, dan timestamp. |
| `note_workspace_members` | Membership eksplisit dengan role lokal `owner` atau `member`. |
| `notes` | Metadata note: workspace, judul, pembuat, timestamp isi, dan `title_updated_at` untuk konflik rename judul. |
| `note_documents` | State dokumen Yjs dalam `BYTEA`; bukan JSON atau HTML sebagai sumber utama. |

Owner dapat mengundang/menghapus member, menghapus note, serta menghapus workspace; member dapat membuat, mengedit isi, dan mengganti judul note. SuperAdmin dan BOD tidak menerima akses otomatis hanya karena role/divisinya. Rename judul membandingkan `title_updated_at`, sehingga perubahan judul bersamaan ditolak tanpa memengaruhi sinkronisasi isi Yjs yang memakai `updated_at`. Penghapusan note merupakan aksi eksplisit Owner dan menghapus dokumen Yjs melalui foreign key cascade. Penghapusan workspace juga permanen dan mencascade membership, seluruh note, serta dokumen Yjs terkait; endpoint hanya melanjutkan setelah nama workspace yang tepat dikirim ulang. Tidak ada migrasi startup: `npm run migrate:notes` dijalankan secara eksplisit.
