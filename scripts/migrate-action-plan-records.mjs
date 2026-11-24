import nextEnv from "@next/env";
import { google } from "googleapis";
import { randomUUID } from "node:crypto";

nextEnv.loadEnvConfig(process.cwd());

const apply = process.argv.includes("--apply");
const headers = ["tanggal", "action_plan", "status_pagi", "status_sore", "link_hasil", "catatan", "record_id", "created_at", "updated_at", "deleted_at", "deleted_by", "weekly_plan_id", "lampiran"];
const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} wajib diisi sebelum memeriksa Action Plan.`);
  return value;
};
const rangeSheetName = (sheetName) => sheetName.includes(" ") ? `'${sheetName.replaceAll("'", "''")}'` : sheetName;
const sheets = google.sheets({ version: "v4", auth: new google.auth.JWT({
  email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"), key: required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"],
}) });
const spreadsheetId = required("GOOGLE_SHEET_ID");
const users = (await sheets.spreadsheets.values.get({ spreadsheetId, range: "Users!A:J" })).data.values ?? [];
const sheetNames = [...new Set(users.slice(1).map((row) => String(row[6] ?? "").trim()).filter(Boolean))];
let legacyRecordCount = 0;

for (const sheetName of sheetNames) {
  const name = rangeSheetName(sheetName);
  const values = (await sheets.spreadsheets.values.get({ spreadsheetId, range: `${name}!A:M` })).data.values ?? [];
  const legacyRows = values.slice(1).map((row, index) => ({ row, rowNumber: index + 2 })).filter(({ row }) => row[0] && !row[6]);
  legacyRecordCount += legacyRows.length;
  console.log(`[action-plan-migration] ${sheetName}: ${legacyRows.length} record legacy.`);
  if (!apply || !legacyRows.length) continue;

  const currentHeaders = values[0] ?? [];
  const nextHeaders = headers.map((header, index) => currentHeaders[index] || header);
  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        ...(nextHeaders.some((header, index) => currentHeaders[index] !== header) ? [{ range: `${name}!A1:M1`, values: [nextHeaders] }] : []),
        ...legacyRows.map(({ rowNumber }) => ({ range: `${name}!G${rowNumber}:I${rowNumber}`, values: [[randomUUID(), timestamp, timestamp]] })),
      ],
    },
  });
}

console.log(apply ? `Migrasi Action Plan selesai: ${legacyRecordCount} record diperbarui.` : `Pemeriksaan selesai: ${legacyRecordCount} record legacy ditemukan. Jalankan npm run migrate:action-plans untuk memperbarui.`);
