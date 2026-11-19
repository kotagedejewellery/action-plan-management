import { NextResponse } from "next/server";

import { listMemberApprovalStates } from "@/application/approvals";
import { actionPlans, approvals, users } from "@/infrastructure/container";
import { apiError } from "@/presentation/server/api-error";
import { currentActor } from "@/presentation/server/actor";

export async function GET(request: Request) {
  try {
    const actor = await currentActor();
    const userId = new URL(request.url).searchParams.get("userId") ?? actor.id;
    const owner = await users.findById(userId);
    return NextResponse.json(await listMemberApprovalStates(approvals, actionPlans, actor, owner), { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiError(error); }
}
