import { NextResponse } from "next/server";

import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";
import { loadDashboard } from "@/presentation/server/dashboard";

export async function GET(request?: Request) {
  try {
    const params = request ? new URL(request.url).searchParams : undefined;
    const from = params?.get("from");
    const to = params?.get("to");
    const preset = params?.get("preset");
    return NextResponse.json(await loadDashboard(
      await currentActor(),
      params?.get("divisionId") || undefined,
      params && (from !== null || to !== null) ? { from: from ?? "", to: to ?? "" } : undefined,
      preset === "week" || preset === "month" ? preset : undefined,
    ), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
