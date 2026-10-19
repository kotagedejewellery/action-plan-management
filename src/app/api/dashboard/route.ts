import { NextResponse } from "next/server";

import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";
import { loadDashboard } from "@/presentation/server/dashboard";

export async function GET() {
  try {
    return NextResponse.json(await loadDashboard(await currentActor()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
