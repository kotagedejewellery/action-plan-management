import { Client } from "pg";

const databaseUrl = process.env.NOTES_DATABASE_URL;
if (!databaseUrl) throw new Error("NOTES_DATABASE_URL wajib diisi sebelum memeriksa skema Notes.");

const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  const result = await client.query("SELECT to_regclass('public.note_images') AS note_images");
  if (!result.rows[0]?.note_images) throw new Error("Skema gambar Notes belum tersedia. Jalankan npm run migrate:notes terlebih dahulu.");
  console.log("Skema Catatan Kolaboratif siap.");
} finally {
  await client.end();
}
