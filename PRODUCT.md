# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router dan TypeScript; Tailwind CSS serta shadcn/ui untuk UI; Auth.js untuk autentikasi; Google Sheets API sebagai sumber data; Vercel untuk deployment.

## Users

- **User:** anggota tim internal yang membuat dan memperbarui Action Plan harian, terutama dari desktop.
- **Admin:** pengelola internal yang memantau Action Plan seluruh User dan mengelola akun mereka.

## Product Purpose

Menggantikan pengisian Action Plan langsung di Google Spreadsheet dengan aplikasi web yang lebih mudah digunakan dan memiliki akses berbasis role, sambil mempertahankan spreadsheet sebagai sumber data utama.

## Positioning

Satu alur kerja internal yang menghubungkan pencatatan pagi, pembaruan sore, hasil kerja, dan monitoring Admin tanpa menambah sistem manajemen proyek di luar kebutuhan Action Plan.

## Operating Context

User mengisi rencana kerja serta progres harian. Admin berpindah antar User untuk memeriksa Action Plan tanpa masuk menggunakan akun User tersebut. Aplikasi diprioritaskan untuk desktop, namun harus tetap responsif di tablet dan mobile.

## Capabilities and Constraints

- Role `admin` dan `user`, akun `active`/`inactive`, login email/password.
- User hanya dapat melihat dan mengubah Action Plan miliknya; Admin memantau seluruh User dan mengelola akun.
- Data Action Plan memuat tanggal, Action Plan, Status Pagi, Status Sore, Link Hasil, dan Catatan.
- Tidak mencakup notifikasi, approval, penugasan, upload file, analitik kompleks, atau modul di luar PRD versi 1.
- Arah UI: profesional, clean, fresh, sederhana, serta desktop-first.

## Evidence on Hand

PRD, tech stack, database design, dan system architecture tersedia pada direktori `docs/`. Belum ada logo, asset visual, brand guideline, atau data produksi; data demo akan bersifat sintetis dan diberi konteks UI internal.

## Product Principles

1. Update progres harus cepat dan jelas pada hari kerja yang sibuk.
2. Hak akses harus tampak sederhana bagi User namun selalu ditegakkan oleh sistem.
3. Informasi penting harus mudah dipindai sebelum memperluas detail.
4. Fitur hanya dibuat bila mendukung Action Plan versi 1 secara langsung.

