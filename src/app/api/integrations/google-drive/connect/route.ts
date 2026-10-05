import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { requireAdmin } from "@/application/use-cases";
import { driveScope, googleDriveOAuthClient } from "@/infrastructure/google-drive/oauth";
import { currentActor } from "@/presentation/server/actor";

export async function GET() {
  requireAdmin(await currentActor());
  const state = randomBytes(32).toString("hex");
  const authorizationUrl = googleDriveOAuthClient().generateAuthUrl({ access_type: "offline", prompt: "consent", scope: [driveScope], state });
  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("google-drive-oauth-state", state, { httpOnly: true, maxAge: 600, path: "/api/integrations/google-drive", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return response;
}
