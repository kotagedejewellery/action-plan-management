# Penerapan multi-divisi

Panduan ini untuk pemilik environment dan SuperAdmin. Implementasi lokal tidak menjalankan perubahan pada spreadsheet atau Drive nyata.

## Persiapan dan tinjauan

1. Verifikasi environment, Spreadsheet ID dari konfigurasi, tab Users, Settings, Weekly Plans, seluruh `sheet_name`, dan folder Drive yang dipakai. Jangan menyalin credential ke laporan.
2. Simpan backup spreadsheet dan catat jumlah akun, sheet, Action Plan, Weekly Plan serta metadata lampiran. Jangan menghapus atau membuat ulang tab existing.
3. Tinjau daftar pemetaan `akun → divisi → Lead BOD/BOD Monitor` bersama penanggung jawab. Setiap divisi aktif perlu satu Lead BOD aktif dan dapat memiliki BOD Monitor tambahan; setiap BOD hanya satu divisi. Perpindahan anggota setelah pemetaan tidak tersedia; pastikan pemetaan pertama benar.
4. Pastikan kolom J Users kosong atau sudah berheader `division_id`. Jika berisi kolom bisnis lain atau data tanpa header, hentikan penerapan dan selesaikan pemetaan kolom secara terencana; aplikasi menolak menimpanya. Tab Divisions existing harus memakai header A:F `id`, `name`, `bod_user_id`, `status`, `created_at`, `updated_at`; kolom G dan H hanya ditambahkan oleh penyimpanan divisi eksplisit sebagai `approval_required` dan `bod_monitor_user_ids`.
5. Jadwalkan penyiapan akses sebelum membuka layanan kembali. User/BOD yang belum memiliki divisi aktif tidak dapat mengakses pekerjaan. SuperAdmin tetap dapat memantau pekerjaan lama secara global.

## Penyiapan melalui aplikasi

1. Login sebagai akun Admin existing, yang sekarang ditampilkan sebagai SuperAdmin. Jangan bootstrap atau mengganti akun lama.
2. Pada Users, buat akun BOD aktif; akun BOD tidak membuat sheet pekerjaan baru. Jika menggunakan akun anggota existing sebagai BOD, riwayat dan afiliasinya tetap, dan akun hanya dapat memantau sejak role berubah.
3. Pada Divisi, buat divisi dan pilih Lead BOD yang tersedia; tambahkan BOD Monitor bila diperlukan. Divisi dapat disimpan nonaktif terlebih dahulu. Aktifkan setelah Lead BOD siap; tinjau konfirmasi akses sebelum menyimpan.
4. Pada Users, pilih filter Belum dipetakan. Filter ini mencakup semua akun yang masih memiliki sheet pekerjaan, termasuk mantan User yang telah menjadi BOD atau SuperAdmin. Buka akun existing, tentukan divisi aktif, lalu tinjau konfirmasi pemetaan awal. Untuk BOD yang sudah ditugaskan, pilih divisi penugasannya; server menolak pemetaan ke divisi lain. Konfirmasi menyebut divisi yang akan mendapat akses BOD ke seluruh riwayat akun. Simpan tanpa mengubah ID, hash, `sheet_name`, rencana atau lampiran. Ulangi sesuai pemetaan yang telah disetujui.
5. Tinjau jumlah akun belum dipetakan dan daftar anggota per divisi. Akun baru ber-role User wajib mempunyai divisi aktif. Akun lama yang belum dipetakan tetap dapat dikelola SuperAdmin untuk metadata/status, tetapi akses pekerjaannya tertutup.

Jika akun lama dipromosikan menjadi BOD sebelum dipetakan, tetapkan BOD pada divisi terlebih dahulu, lalu kembali ke Users untuk memetakan riwayatnya melalui form yang sama. Pemetaan tidak dilakukan otomatis dan tidak mengubah role, ID atau sheet pekerjaan.

Penambahan `Users!J1` dan tab Divisions hanya terjadi pada operasi pengelolaan yang diminta secara eksplisit. Tidak ada pengisian divisi secara tebakan, migrasi massal, perubahan tab kerja, reset atau penghapusan data.

## Pemeriksaan sebelum layanan dibuka

- Login Lead BOD A: hanya anggota dan pekerjaan divisi A muncul pada dashboard, Monitoring, detail dan preview gambar. Coba URL anggota/lampiran divisi B; harus ditolak. Jika approval aktif, hanya Lead BOD yang dapat menyetujui atau menolak hasil.
- Login BOD Monitor A: lakukan pemeriksaan cakupan yang sama; BOD Monitor tidak boleh mengubah pekerjaan, akun, divisi, status, integrasi, atau membuat keputusan approval.
- Login User: hanya pekerjaan sendiri yang dapat dibaca/diubah. Periksa satu rencana mingguan dan lampiran existing pada akun yang memang disiapkan untuk pengujian; jangan melakukan penghapusan pada data nyata.
- Login SuperAdmin: seluruh divisi dan filter tersedia, termasuk riwayat belum dipetakan pada tampilan global. Pastikan ID, `sheet_name`, jumlah dan relasi pekerjaan sama dengan inventaris awal.
- Penggantian Lead BOD atau BOD Monitor dilakukan di Divisi dan dikonfirmasi; BOD lama kehilangan scope pada permintaan berikutnya. Jangan menonaktifkan BOD aktif sebelum melepas atau mengganti penugasannya. Penonaktifan divisi menutup akses BOD serta workspace anggota tanpa menghapus riwayat.

Unit test menggunakan repository/Google API tiruan. Browser test memakai data sintetis dan server UI lokal, sehingga pemeriksaan OAuth, sesi Next.js, quota, spreadsheet dan Drive nyata tetap diperlukan di environment pengujian yang disetujui.

## Batas operasi dan pemulihan

Gunakan satu proses/container aplikasi. Antrean perubahan akses dan invalidasi cache bersifat lokal; tambah lock dan invalidasi bersama sebelum menjalankan beberapa replica/worker. Perubahan lewat aplikasi menginvalidasi cache lokal; edit langsung Users/Divisions dapat menunggu TTL 5 detik dan melewati validasi aplikasi.

Jika simpan gagal, data form dipertahankan. Muat ulang sebelum mengulang konflik data agar tidak menimpa penugasan terbaru. Jika akses salah, tutup akses akun/divisi melalui SuperAdmin dan tinjau pemetaan; jangan menghapus sheet atau mencoba memindahkan anggota melalui edit langsung. Kesalahan afiliasi yang sudah tersimpan memerlukan rencana koreksi tersendiri yang disetujui, karena perpindahan divisi tidak tersedia pada tahap awal.

Rollback kode harus ditinjau sebagai perubahan permission: versi dua role tidak menjamin pembatasan BOD/divisi. Jangan membuka layanan memakai versi lama tanpa pemeriksaan akses, dan jangan menghapus kolom J atau tab Divisions untuk rollback. Backup bukan izin untuk menimpa data yang telah berubah.
