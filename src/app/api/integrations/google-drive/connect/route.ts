import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { requireAdmin } from "@/application/use-cases";
import { driveScope, googleDriveOAuthClient } from "@/infrastructure/google-drive/oauth";
import { apiError } from "@/presentation/server/api-error";
import { currentActor } from "@/presentation/server/actor";

export async function GET() {
  try {
    requireAdmin(await currentActor());
    if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) return NextResponse.json({ error: "Google Drive sudah terhubung. Hapus Refresh Token dari environment hanya saat perlu melakukan rotasi kredensial." }, { status: 409, headers: { "cache-control": "no-store" } });
    const state = randomBytes(32).toString("hex");
    const authorizationUrl = googleDriveOAuthClient().generateAuthUrl({ access_type: "offline", prompt: "consent", scope: [driveScope], state });
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set("google-drive-oauth-state", state, { httpOnly: true, maxAge: 600, path: "/api/integrations/google-drive", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) {
    const response = apiError(error);
    response.headers.set("cache-control", "no-store");
    return response;
  }
}
