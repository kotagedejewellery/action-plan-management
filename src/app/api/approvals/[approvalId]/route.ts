import { NextResponse } from "next/server";

import { decideApproval } from "@/application/approvals";
import { approvalDecisionSchema } from "@/application/schemas";
import { actionPlans, approvals, divisions, users } from "@/infrastructure/container";
import { apiError } from "@/presentation/server/api-error";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const input = approvalDecisionSchema.parse(await request.json());
    return NextResponse.json(await decideApproval(approvals, actionPlans, users, divisions, await currentActor(), (await params).approvalId, input.decision, input.note));
  } catch (error) { return apiError(error); }
}
