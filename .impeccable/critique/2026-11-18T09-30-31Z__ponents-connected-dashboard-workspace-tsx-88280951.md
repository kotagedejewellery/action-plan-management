---
target: Dashboard dan Monitoring SuperAdmin
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:E:\\AI Engineer\\PT KotaGede Jewellery\\New System\\action-plan-management\\src\\presentation\\components\\connected-dashboard-workspace.tsx"
target_fingerprint: "sha256:e1fd3abd6170880dfc64bebd331da20a2a72cca424ddd8005f34bb004bf2022b"
target_path: "E:\\AI Engineer\\PT KotaGede Jewellery\\New System\\action-plan-management\\src\\presentation\\components\\connected-dashboard-workspace.tsx"
timestamp: 2026-11-18T09-30-31Z
slug: ponents-connected-dashboard-workspace-tsx-88280951
closed: true
---
## Kesehatan desain

| # | Heuristik Nielsen | Skor | Isu utama |
|---|---|---:|---|
| 1 | Visibilitas status sistem | 1/4 | Skeleton dapat terlihat seperti halaman rusak tanpa status atau tindakan pemulihan. |
| 2 | Kesesuaian dengan dunia nyata | 4/4 | Istilah pekerjaan, divisi, dan status selaras dengan operasi harian. |
| 3 | Kontrol dan kebebasan | 3/4 | Filter dan detail dapat diubah, tetapi pergantian divisi membutuhkan langkah terpisah. |
| 4 | Konsistensi dan standar | 3/4 | Sistem visual konsisten; pola periode Dashboard dan Monitoring belum seragam. |
| 5 | Pencegahan kesalahan | 3/4 | Validasi dan pembatasan akses baik; loading yang menggantung tidak memiliki jalan keluar. |
| 6 | Pengenalan, bukan ingatan | 4/4 | Konteks anggota, status, dan periode tetap terlihat. |
| 7 | Fleksibilitas dan efisiensi | 3/4 | Pencarian dan filter ada, tetapi triage lintas divisi masih berlapis. |
| 8 | Estetika dan minimalisme | 3/4 | Tenang dan rapi; kartu periode terlalu besar dan scope Monitoring berulang. |
| 9 | Pemulihan dari kesalahan | 1/4 | Tidak ada retry atau penjelasan ketika Dashboard berhenti di skeleton. |
| 10 | Bantuan dan dokumentasi | 2/4 | Copy inline baik, namun definisi operasional "Selesai" dan prioritas belum eksplisit. |
| **Total** |  | **27/40** | **Cukup; perbaikan penting diperlukan** |

## Spesifisitas desain

Pengalaman sudah terasa khusus untuk Action Plan Management: bahasa kerja Indonesia, tanggal Bangkok, status Pagi/Sore, drill-down anggota ke pekerjaan, dan identitas teal yang tenang membentuk "calm operations desk" yang kredibel. Masalah utamanya bukan gaya, melainkan prioritas keputusan: intervensi SuperAdmin tidak muncul cukup cepat, dan loading Dashboard mengikis kepercayaan.

Detektor otomatis tidak menemukan pelanggaran pada target (`0` temuan). Itu bukan bukti bahwa hierarchy sudah optimal; temuan utama ini muncul dari komposisi, urutan keputusan, dan state yang terlihat. Tidak ada false positive.

## Hal yang sudah bekerja

- Rel anggota ke detail mempertahankan orientasi: siapa yang dipilih, total progres, filter, dan daftar pekerjaan terhubung.
- Bahasa, chip status, border, dan warna teal cukup tenang untuk pekerjaan administratif yang padat.
- Monitoring sudah memiliki fondasi efisiensi yang baik: pencarian anggota, filter status, dan detail tanpa meninggalkan konteks.

## Isu prioritas

### P0 — Skeleton Dashboard menyerupai aplikasi yang rusak

Skeleton saat ini hanya berupa balok kosong, termasuk kartu filter dan panel besar, sehingga tidak memberi jawaban apakah data sedang dimuat, gagal, atau tidak tersedia. Setelah ambang singkat, tampilkan state tertunda bernama, misalnya "Dashboard Tim masih dimuat", konteks periode, alasan singkat, dan tombol **Coba lagi**. Pada loading awal yang singkat, skeleton harus tetap menyerupai toolbar periode, judul metrik, dan struktur konten akhir.

### P1 — Antrean intervensi harus berada di atas laporan deskriptif

Jumlah pekerjaan yang perlu tindak lanjut adalah keputusan utama SuperAdmin, namun saat ini kalah oleh kartu periode dan laporan progres. Tepat setelah metrik, tampilkan strip prioritas amber ringkas: jumlah, anggota/divisi terdampak atau pekerjaan terlama bila tersedia, serta CTA **Tinjau pekerjaan** menuju Monitoring dengan konteks yang sama.

### P1 — Scope divisi di Monitoring berulang dan membebani scan

"Seluruh divisi" tampil sebagai teks terpisah lalu diulang pada label/select Divisi dan tombol "Tampilkan". Jadikan satu toolbar scope: label **Cakupan**, select, tombol **Terapkan divisi**, kemudian chip konteks hasil. Terapkan pola yang sama di Dashboard agar SuperAdmin selalu memahami scope yang aktif tanpa membaca ulang.

### P2 — Kartu periode Dashboard terlalu tinggi untuk tugasnya

Presets, rentang khusus, dan ringkasan periode tidak memerlukan kartu lebar setinggi itu. Kompres menjadi toolbar satu baris: scope divisi, periode, rentang khusus, lalu ringkasan seperti "1–30 Nov 2026 · 331 Action Plan". Ruang yang dibuka dipakai untuk metrik dan antrean tindak lanjut.

### P2 — Aksi baris Monitoring perlu lebih jelas

Tautan "Lihat" lemah di samping "Buka hasil". Ganti menjadi **Lihat detail**, jaga hit area 44px, dan jadikan baris terpilih punya state aktif yang koheren dengan panel detail. Status periode, pencarian, status, dan enam kolom tetap bermanfaat, tetapi perlu dipadatkan secara progresif agar scope dan anggota tidak terasa sebagai filter tambahan yang setara.

## Risiko persona

- **SuperAdmin power user:** dua tahap scope (divisi lalu anggota) dan submit terpisah memperlambat peninjauan lintas divisi; tidak ada antrean pengecualian di Dashboard untuk memulai triage.
- **Pengguna aksesibilitas:** skeleton memiliki `aria-busy`/status, tetapi secara visual dan operasional tidak menjelaskan pemulihan. Pada pembaca layar, pesan tertunda dan aksi retry harus eksplisit.
- **SuperAdmin baru:** angka selesai/belum selesai terlihat, tetapi aturan penyelesaian belum cukup eksplisit untuk mencegah salah tafsir saat mengambil tindakan.

## Observasi kecil

- Lebar rel anggota pada desktop sudah proporsional dan tabel/card responsif adalah fondasi yang baik.
- Tidak ada bukti live DOM, keyboard, overlay, atau console karena browser automation tidak tersedia; inspeksi server lokal hanya mencapai HTML shell dan capture yang tersimpan.

## Pertanyaan untuk keputusan desain

Prioritas yang perlu diputuskan adalah apakah Dashboard terutama menjadi tempat triage cepat, atau ringkasan eksekutif. Jika triage, strip tindak lanjut dan scope terpadu menjadi fokus pertama.
