import { google } from "googleapis";

function required(name: "GOOGLE_SHEET_ID" | "GOOGLE_SERVICE_ACCOUNT_EMAIL" | "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY") {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} belum dikonfigurasi.`);
  return value;
}

export function spreadsheetId() {
  return required("GOOGLE_SHEET_ID");
}

export function sheetsClient() {
  const auth = new google.auth.JWT({ email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"), key: required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  return google.sheets({ version: "v4", auth });
}
