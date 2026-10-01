# Database Design — Google Spreadsheet

## 1. Model penyimpanan

Satu Google Spreadsheet menjadi sumber data utama. Sheet `Users` menyimpan akun. Setiap User memiliki satu sheet Action Plan yang ditentukan melalui `Users.sheet_name`.

```text
Action Plan Management Spreadsheet
├── Users
├── Hafidh
├── Bagas
└── <sheet User lainnya>
```

Desain ini mempertahankan pola spreadsheet existing. Aplikasi tidak membuat database lain pada versi 1.

## 2. Sheet `Users`

| Kolom | Tipe aplikasi | Wajib | Aturan |
| --- | --- | :---: | --- |
| `id` | UUID/string | Ya | Identitas internal yang unik dan tidak berubah. |
| `name` | string | Ya | Nama tampilan User. |
| `email` | string | Ya | Unik secara case-insensitive, dipakai untuk login. |
| `password_hash` | string | Ya | Hasil bcrypt; tidak pernah dikirim ke client. |
| `role` | enum | Ya | Hanya `admin` atau `user`. |
| `status` | enum | Ya | Hanya `active` atau `inactive`. |
| `sheet_name` | string | Ya untuk role user | Nama tab Action Plan yang telah ada. Tidak boleh dipakai dua User. |
| `created_at` | ISO 8601 UTC | Ya | Waktu akun dibuat. |
| `updated_at` | ISO 8601 UTC | Ya | Waktu perubahan terakhir. |

`email` dinormalisasi (trim + lowercase) sebelum dibandingkan atau disimpan. `sheet_name` harus divalidasi terhadap daftar sheet yang diizinkan dan tidak boleh dibentuk dari input request tanpa otorisasi.

## 3. Sheet Action Plan per User

Enam kolom bisnis existing dipertahankan di awal agar data lama tetap kompatibel. Tiga kolom teknis ditambahkan di sebelah kanan oleh aplikasi.

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

### Kompatibilitas data existing

- Baris lama dengan enam kolom tetap dapat dibaca dan ditampilkan.
- Saat baris lama pertama kali diedit melalui aplikasi, `record_id`, `created_at`, dan `updated_at` diisi secara lazily; `created_at` dapat memakai waktu migrasi bila waktu asal tidak tersedia.
- Aplikasi mencari record berdasarkan `record_id`, bukan nomor baris. Nomor baris spreadsheet bukan primary key karena dapat berubah ketika pengguna spreadsheet menyisipkan/menghapus baris.
- Header lama yang menggunakan label tampilan (`Tanggal`, `Action Plan`, dan seterusnya) dipetakan di adapter Sheets. Header fisik tidak perlu diubah jika sudah dipakai tim.

## 4. Relasi dan isolasi data

```text
Users (1) ──── (1) User Action Plan Sheet
          sheet_name
```

Pada setiap operasi User, aplikasi mengambil `sheet_name` dari akun terautentikasi di sheet `Users`; request client tidak boleh menentukan target sheet. Admin boleh memilih User, tetapi target tetap di-resolve lewat `Users.id` di server.

## 5. Validasi integritas

| Data | Validasi |
| --- | --- |
| `Users.id` / `record_id` | Unik dan tidak kosong untuk record baru. |
| Email | Format email valid dan unik. |
| Role | `admin` atau `user`. |
| Status akun | `active` atau `inactive`. |
| Tanggal | Tanggal kalender valid. |
| Action Plan | Setelah trim tidak kosong. |
| Link Hasil | URL valid bila terisi; scheme yang diizinkan `https`/`http`. |
| Status Pagi | Wajib dan berasal dari daftar status yang disetujui. |

Google Sheets tidak menyediakan constraint database relasional. Semua validasi dan aturan keunikan ditegakkan oleh application layer sebelum penulisan.

## 6. Operasi akses data

| Use case | Sheet | Operasi |
| --- | --- | --- |
| Login | `Users` | Cari `email`, cek `status` dan `password_hash`. |
| Kelola User | `Users` | Tambah/perbarui akun. |
| Daftar User | `Users` | Baca akun tanpa `password_hash`. |
| List Action Plan | Sheet milik akun / User pilihan Admin | Baca dan urutkan tanggal menurun. |
| Tambah Action Plan | Sheet milik akun | Append satu baris. |
| Edit Action Plan | Sheet milik akun | Cari `record_id`, update hanya baris target. |

## 7. Konsekuensi Google Sheets sebagai database

- Tidak ada transaksi multi-sheet dan foreign key; operasi dibuat sekecil mungkin serta memiliki penanganan error yang jelas.
- Edit bersamaan pada baris yang sama berpotensi last-write-wins. Untuk v1, aplikasi mengirim `updated_at` terakhir dan menolak update jika nilainya telah berubah, sehingga User diminta memuat ulang.
- Akses langsung manusia ke spreadsheet tetap dimungkinkan, tetapi perubahan header/kolom harus dikontrol karena dapat mengganggu adapter.
- Spreadsheet dan credential service account harus dibackup/dikelola oleh pemilik Workspace.
