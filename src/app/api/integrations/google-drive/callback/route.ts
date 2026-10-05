import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { requireAdmin } from "@/application/use-cases";
import { googleDriveOAuthClient } from "@/infrastructure/google-drive/oauth";
import { currentActor } from "@/presentation/server/actor";
import { google } from "googleapis";

export async function GET(request: Request) {
  try {
    requireAdmin(await currentActor());
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const expectedState = cookieStore.get("google-drive-oauth-state")?.value;
    if (!code || !state || !expectedState || state !== expectedState) throw new AppError("Otorisasi Google Drive tidak valid atau telah kedaluwarsa. Mulai ulang koneksi.", "FORBIDDEN");

    const auth = googleDriveOAuthClient();
    const { tokens } = await auth.getToken(code);
    if (!tokens.refresh_token) throw new AppError("Google tidak mengembalikan Refresh Token. Cabut akses aplikasi di Akun Google lalu ulangi koneksi.", "VALIDATION");
    auth.setCredentials(tokens);
    const folder = await google.drive({ version: "v3", auth }).files.create({ requestBody: { name: "Action Plan Attachments", mimeType: "application/vnd.google-apps.folder" }, fields: "id" });
    if (!folder.data.id) throw new Error("Google Drive tidak mengembalikan Folder ID.");

    const response = NextResponse.json({ message: "Google Drive terhubung. Simpan kedua nilai berikut di environment server dan jangan bagikan Refresh Token.", GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token, GOOGLE_DRIVE_FOLDER_ID: folder.data.id }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
    response.cookies.delete("google-drive-oauth-state");
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Koneksi Google Drive gagal." }, { status: error instanceof AppError ? 400 : 500, headers: { "cache-control": "no-store" } });
  }
}
