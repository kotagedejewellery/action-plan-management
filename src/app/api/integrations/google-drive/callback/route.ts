import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { requireAdmin } from "@/application/use-cases";
import { configuredDriveFolderId, googleDriveOAuthClient } from "@/infrastructure/google-drive/oauth";
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
    const existingFolderId = configuredDriveFolderId();
    const folder = existingFolderId ? null : await google.drive({ version: "v3", auth }).files.create({ requestBody: { name: "Action Plan Attachments", mimeType: "application/vnd.google-apps.folder" }, fields: "id" });
    const folderId = existingFolderId ?? folder?.data.id;
    if (!folderId) throw new Error("Google Drive tidak mengembalikan Folder ID.");

    const response = NextResponse.json({ message: "Google Drive terhubung. Simpan nilai ini di environment server segera; endpoint koneksi akan terkunci setelah Refresh Token dikonfigurasi.", GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token, GOOGLE_DRIVE_FOLDER_ID: folderId }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
    response.cookies.delete("google-drive-oauth-state");
    return response;
  } catch (error) {
    const response = apiError(error);
    response.headers.set("cache-control", "no-store");
    return response;
  }
}
