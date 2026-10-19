# Instruksi Agen — Action Plan Management

## Urutan kerja

1. Baca seluruh `AGENTS.md` sebelum melakukan analisis, perubahan, atau menjalankan perintah proyek lainnya.
2. Untuk setiap pekerjaan software engineering, pilih skill Matt Pocock terpasang yang paling relevan, baca seluruh `SKILL.md`, lalu ikuti workflow-nya. Muat hanya skill yang relevan dengan task.
3. Untuk pekerjaan kode, gunakan Ponytail sebagai standar analisis dependency dan dampak perubahan. Gunakan level `full` untuk perubahan behavior, business logic, data flow, permission, shared code, bug, atau refactor. Analisis perubahan trivial dapat proporsional.
4. Gunakan pembaruan dan/atau kueri Graphify sebelum memahami atau mengubah kode/arsitektur yang non-trivial. Baca source langsung hanya jika konteks Graphify belum cukup.
5. Setelah satu perubahan logis selesai, perbarui indeks Graphify sebelum handoff. Ini berlaku untuk kode, konfigurasi, dan dokumentasi.
6. Untuk pekerjaan yang membentuk, mengubah, atau meninjau UI/UX, gunakan Impeccable. Jalankan `impeccable context` satu kali per sesi sebelum perubahan UI dan ikuti arahannya.

## Batas perubahan

1. Pilih solusi paling sederhana yang menyelesaikan requirement sepenuhnya.
2. Jaga scope. Jangan melakukan refactor, cleanup, improvement, atau inisialisasi lain yang tidak diminta.
3. Pertahankan behavior existing. Ubah API contract, URL, schema, permission, UX flow, default value, atau behavior hanya jika diperlukan oleh task.
4. Ikuti architecture, convention, component, utility, dan dependency existing sebelum membuat pola baru.
5. Gunakan stack existing; tambah dependency hanya jika kebutuhan tidak dapat diselesaikan secara wajar dengannya.
6. Berhenti ketika acceptance criteria terpenuhi.

## Perbaikan bug

1. Temukan root cause, bukan hanya gejala.
2. Sebelum mengedit, telusuri caller, shared component, handler, utility, repository/query, test, dan alur lain yang menggunakan pola yang sama.
3. Perbaiki seluruh kasus dalam scope yang memiliki root cause yang sama.
4. Laporkan kasus yang terlihat mirip tetapi memiliki behavior berbeda; jangan otomatis mengubahnya. Jika perbaikan membutuhkan perluasan scope, minta klarifikasi sebelum melanjutkan bagian tersebut.
5. Tambahkan atau jalankan test yang membuktikan bug tidak muncul kembali.

## Perlindungan data dan penyimpanan

Google Spreadsheet adalah sumber data utama; Google Drive menyimpan lampiran. Data existing tidak boleh dianggap disposable, termasuk data pengembangan lokal dan spreadsheet percobaan.

Tanpa persetujuan eksplisit user, jangan:

- reset, menghapus, atau membuat ulang spreadsheet maupun tab yang berisi data;
- mengosongkan range, melakukan truncate, atau delete massal;
- menghapus file/folder Drive secara massal atau permanen;
- menghapus Docker volume yang menyimpan data;
- menjalankan seed/bootstrap yang menimpa atau menghapus data existing;
- membuat migrasi destruktif; atau
- mengubah migrasi lama yang sudah digunakan pada environment shared, staging, atau production.

Gunakan migrasi forward-only dan non-destructive secara default. Sebelum migrasi, seed/bootstrap, atau mutasi data berisiko:

1. Verifikasi environment, spreadsheet ID, tab/range, dan target Drive yang akan disentuh.
2. Pahami dampaknya terhadap data existing dan relasi User, Weekly Plan, Action Plan, serta lampiran.
3. Pilih solusi non-destructive dan pertahankan kompatibilitas kolom bisnis lama, ID record, serta pemetaan sheet milik User.

Jika satu-satunya solusi berisiko kehilangan data, berhenti, jelaskan target serta risikonya, dan minta persetujuan eksplisit.

Deploy, build, startup, CI/CD, Dockerfile, entrypoint, dan post-deploy tidak boleh mereset penyimpanan atau menghapus data existing. Bootstrap Admin hanya untuk inisialisasi ketika sheet `Users` kosong, sesuai `docs/SETUP.md`.

Kebijakan penghapusan aplikasi mengacu pada `docs/DATABASE_DESIGN.md`: Action Plan mandiri memakai soft-delete; penghapusan lampiran individual memindahkannya ke Sampah Drive; penghapusan Weekly Plan menghapus permanen rencana tersebut, Action Plan terkait, dan file lampirannya. Mengembangkan atau menguji fitur ini bukan izin untuk menjalankan penghapusan pada data nyata.

## Validasi dan performa

Uji secara proporsional terhadap risiko perubahan. Prioritaskan test untuk:

- business logic;
- permission, access control, dan isolasi data antar-User;
- calculation, status penyelesaian, dan tanggal;
- mutasi data serta relasi Weekly Plan–Action Plan–lampiran;
- migrasi dan kompatibilitas data spreadsheet lama;
- shared behavior; dan
- bug regression.

Pilih pemeriksaan yang relevan dari script dan konfigurasi proyek. Perubahan dokumentasi cukup diperiksa konsistensi instruksi, referensi file, dan diff-nya. Klaim validasi harus sesuai dengan pemeriksaan yang benar-benar dijalankan; bedakan unit test dari pengujian integrasi Google atau produksi.

Optimasi hanya jika relevan terhadap task atau bottleneck. Prioritasnya:

1. Hilangkan pekerjaan, request Google API, pembacaan sheet, atau render yang tidak diperlukan.
2. Gunakan batch/range yang tepat dan hindari pola N+1 per User atau record.
3. Batasi data yang dibaca/dikirim dan gunakan pagination untuk dataset besar bila diperlukan.
4. Deduplicate request dan gunakan caching bila invalidasinya jelas; perhatikan quota Google dan cache per container.
5. Lazy-load komponen/media berat dan optimalkan image.
6. Gunakan code splitting, memoization, CDN, atau background job hanya bila dibutuhkan.

Jangan mengorbankan simplicity, freshness data, atau isolasi akses demi micro-optimization.

## Klarifikasi dan konteks proyek

Minta klarifikasi dan tunggu jawaban jika ambiguitas dapat mengubah hasil secara material, seperti business rule, permission, operasi destruktif, interpretasi data, scope, atau behavior dengan beberapa pilihan valid. Tentukan detail rutin dari codebase, test, dokumentasi, design system, atau convention existing.

Baca dokumentasi sesuai kebutuhan task:

- Product atau business rule: `PRODUCT.md` dan `docs/PRD.md`. PRD masih memuat requirement awal; jika berbeda dengan implementasi atau dokumentasi terbaru dan memengaruhi hasil, klarifikasi acuan yang berlaku.
- Architecture, dependency, atau integration: `docs/TECH_STACK.md` dan `docs/SYSTEM_ARCHITECTURE.md`.
- UI/UX: `DESIGN.md`, selain workflow Impeccable.
- Data, schema, migrasi, atau penghapusan: `docs/DATABASE_DESIGN.md` dan adapter/migrasi terkait setelah konteks Graphify diperoleh.
- Setup, credential, atau deployment: `docs/SETUP.md` dan konfigurasi deployment yang relevan. Jangan menyalin nilai secret ke kode, dokumentasi, log, atau respons.

Jangan membaca seluruh dokumentasi tanpa alasan.

Jika Graphify, Impeccable, test, build, atau tool wajib gagal:

1. Laporkan perintah dan error yang relevan tanpa membocorkan secret.
2. Jangan mengklaim proses berhasil atau membuat hasil tiruan.
3. Gunakan alternatif existing yang setara jika tersedia; jangan memasang tool lain tanpa kebutuhan atau persetujuan.
4. Jika langkah wajib tetap tidak dapat diselesaikan, laporkan batas verifikasi dan minta arahan sebelum pekerjaan yang bergantung padanya.

Jika dua aturan proyek bertentangan, gunakan urutan:

```text
1. Keselamatan data
2. Security dan permission
3. Correctness
4. Scope / acceptance criteria
5. Existing behavior
6. Existing architecture
7. Regression prevention
8. Testing
9. Performance
10. Cleanup / improvement
```

## Prinsip akhir

```text
Understand
→ Trace
→ Change minimally
→ Protect data
→ Test
→ Validate
→ Stop
```
