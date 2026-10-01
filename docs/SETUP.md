# Setup Action Plan Management

1. Salin `.env.example` menjadi `.env.local`, lalu isi credential Google Sheets yang baru/hasil rotasi.
2. Pastikan Google Sheets API aktif dan spreadsheet dibagikan ke email service account sebagai Editor.
3. Jalankan `npm run bootstrap:admin` dengan `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, dan `BOOTSTRAP_ADMIN_PASSWORD` terisi. Perintah ini hanya berjalan ketika sheet `Users` kosong.
4. Hapus `BOOTSTRAP_ADMIN_PASSWORD` dari `.env.local` setelah Admin awal berhasil dibuat.
5. Jalankan `npm run dev`, lalu masuk melalui `/login` menggunakan akun Admin tersebut.

Spreadsheet menggunakan sheet `Users` untuk akun dan `Settings` untuk daftar status custom. Tab `action_plan_<user_id>` dibuat saat Admin menambahkan akun dengan role User.
