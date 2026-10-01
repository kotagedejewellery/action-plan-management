# Product Requirements Document — Action Plan Management System

| Atribut | Nilai |
| --- | --- |
| Versi | 1.0 |
| Status | Initial Requirement |
| Platform | Web application internal |
| Sumber data | Google Spreadsheet |

## 1. Ringkasan produk

Action Plan Management System adalah aplikasi web internal yang menggantikan pengisian dan pemantauan Action Plan langsung di Google Spreadsheet. Spreadsheet tetap menjadi sumber data utama; aplikasi menyediakan autentikasi, pembatasan akses berbasis peran, form yang lebih nyaman, dan monitoring oleh Admin.

Masalah yang diselesaikan adalah akses spreadsheet yang kurang terkontrol dan pengalaman input/update yang tidak konsisten. Sistem mempertahankan struktur data Action Plan yang sudah dipakai tim.

## 2. Tujuan

1. Memudahkan User membuat dan memperbarui Action Plan.
2. Memudahkan Admin memantau Action Plan seluruh User.
3. Membatasi akses data berdasarkan akun dan peran.
4. Mempertahankan Google Spreadsheet sebagai penyimpanan utama.
5. Menyediakan pengalaman yang dapat digunakan di desktop, tablet, dan mobile.

## 3. Peran dan hak akses

| Kapabilitas | Admin | User |
| --- | :---: | :---: |
| Login | Ya | Ya |
| Melihat Action Plan sendiri | Ya | Ya |
| Membuat/mengubah Action Plan sendiri | Tidak diperlukan pada v1 | Ya |
| Melihat Action Plan User lain | Ya | Tidak |
| Melihat detail Action Plan | Ya | Ya, miliknya |
| Membuat/mengubah akun | Ya | Tidak |
| Mengaktifkan/menonaktifkan akun | Ya | Tidak |

User berstatus `inactive` tidak dapat login. Setiap otorisasi harus ditegakkan di server, bukan hanya pada tampilan.

## 4. Kebutuhan fungsional

| ID | Kebutuhan |
| --- | --- |
| FR-01 | Admin dan User dapat login dengan email dan password. |
| FR-02 | Sistem menerapkan akses berbasis role (`admin`/`user`). |
| FR-03 | Admin dapat membuat dan mengubah akun User. |
| FR-04 | Admin dapat mengaktifkan atau menonaktifkan akun. |
| FR-05 | User dapat melihat daftar dan histori Action Plan miliknya. |
| FR-06 | User dapat menambahkan Action Plan. |
| FR-07 | User dapat mengubah Action Plan miliknya. |
| FR-08 | User dapat mengisi dan mengubah Status Pagi. |
| FR-09 | User dapat mengisi dan mengubah Status Sore. |
| FR-10 | User dapat memasukkan Link Hasil. |
| FR-11 | User dapat memasukkan Catatan. |
| FR-12 | Admin dapat melihat Action Plan seluruh User dengan memilih User. |
| FR-13 | Semua perubahan tersimpan pada Google Spreadsheet. |
| FR-14 | User tidak dapat mengakses data User lain. |
| FR-15 | Fungsi utama tersedia pada desktop, tablet, dan mobile. |

## 5. Data Action Plan

| Field | Wajib | Keterangan |
| --- | :---: | --- |
| Tanggal | Ya | Tanggal dibuat/dikerjakan, ditampilkan `DD/MM/YYYY`. |
| Action Plan | Ya | Deskripsi pekerjaan. |
| Status Pagi | Ya | Kondisi pekerjaan di awal hari. |
| Status Sore | Tidak | Kondisi pekerjaan di akhir hari. |
| Link Hasil | Tidak | URL atau referensi hasil kerja. |
| Catatan | Tidak | Informasi tambahan, misalnya QC atau menunggu feedback. |

Nilai status mengikuti praktik saat ini, contohnya `On Progress`, `Selesai`, dan `Belum Selesai`. Daftar nilai baku perlu dikonfirmasi sebelum form diimplementasikan.

## 6. Halaman dan navigasi

| Area | Halaman | Fungsi |
| --- | --- | --- |
| Public | Login | Autentikasi email/password. |
| User | Action Plan | Daftar milik User, tambah, dan edit. |
| Admin | Action Plan Monitoring | Memilih User dan melihat data Action Plan-nya. |
| Admin | User Management | Daftar, tambah, edit, serta aktivasi akun. |

Navigasi User: `Action Plan`, `Logout`.  
Navigasi Admin: `Action Plan`, `Users`, `Logout`.

## 7. Kebutuhan nonfungsional

- Password tidak disimpan sebagai plain text.
- Halaman internal memerlukan session yang valid.
- Aplikasi responsif untuk desktop, tablet, dan mobile.
- Form harus sederhana dan mudah digunakan.
- Google Spreadsheet adalah sumber data utama.
- Data spreadsheet existing harus tetap dapat digunakan.

## 8. Ruang lingkup

Termasuk: autentikasi, role Admin/User, pengelolaan akun, status akun, Action Plan dan histori, status pagi/sore, Link Hasil, Catatan, monitoring Admin, integrasi Google Spreadsheet, dan desain responsif.

Tidak termasuk pada versi 1: notifikasi (email/WhatsApp), approval workflow, absensi, payroll, project management, task assignment, chat, upload file, analitik kompleks, performance scoring, AI, dan automated reporting.

## 9. Kriteria penerimaan

Sistem diterima apabila Admin/User dapat login; Admin dapat mengelola akun dan melihat semua Action Plan; akun inactive ditolak saat login; User dapat membuat serta memperbarui Action Plan miliknya; isolasi data User terjaga; data disimpan di Spreadsheet dan data existing tetap dapat digunakan; serta aplikasi berjalan di desktop dan mobile.
