import bcrypt from "bcryptjs";
import nextEnv from "@next/env";
import { google } from "googleapis";
import { randomUUID } from "node:crypto";

nextEnv.loadEnvConfig(process.cwd());

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} wajib diisi sebelum menjalankan bootstrap:admin.`);
  return value;
};

const sheets = google.sheets({ version: "v4", auth: new google.auth.JWT({ email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"), key: required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"] }) });
const spreadsheetId = required("GOOGLE_SHEET_ID");
const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Users!A2:A" });
if ((existing.data.values ?? []).some((row) => row[0])) throw new Error("Bootstrap hanya dapat dijalankan ketika sheet Users belum memiliki akun.");

const timestamp = new Date().toISOString();
await sheets.spreadsheets.values.append({ spreadsheetId, range: "Users!A:I", valueInputOption: "RAW", requestBody: { values: [[randomUUID(), required("BOOTSTRAP_ADMIN_NAME"), required("BOOTSTRAP_ADMIN_EMAIL").trim().toLowerCase(), await bcrypt.hash(required("BOOTSTRAP_ADMIN_PASSWORD"), 12), "admin", "active", "", timestamp, timestamp]] } });
console.log("Admin awal berhasil dibuat. Hapus BOOTSTRAP_ADMIN_PASSWORD dari environment setelah selesai.");
