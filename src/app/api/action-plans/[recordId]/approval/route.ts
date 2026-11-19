import { NextResponse } from "next/server";

import { submitForApproval } from "@/application/approvals";
import { apiError } from "@/presentation/server/api-error";
import { actionPlans, approvals, divisions } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function POST(_request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    return NextResponse.json(await submitForApproval(approvals, actionPlans, divisions, await currentActor(), (await params).recordId), { status: 201 });
  } catch (error) { return apiError(error); }
}
