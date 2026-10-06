import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { actionPlanInputSchema } from "@/application/schemas";
import { deleteOwnActionPlan, saveOwnActionPlan } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    const actor = await currentActor();
    const input = actionPlanInputSchema.parse(await request.json());
    const current = await actionPlans.findById(actor.sheetName, (await params).recordId);
    if (!current) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
    const plan = await saveOwnActionPlan(actionPlans, statuses, weeklyPlans, actor, { ...current, date: input.date, task: input.task, morningStatus: input.morningStatus, afternoonStatus: input.afternoonStatus || undefined, resultLink: input.resultLink || undefined, note: input.note || undefined, weeklyPlanId: input.weeklyPlanId || undefined, updatedAt: new Date().toISOString() }, input.updatedAt);
    return NextResponse.json(plan);
  } catch (error) { return apiError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    await deleteOwnActionPlan(actionPlans, await currentActor(), (await params).recordId);
    return new NextResponse(null, { status: 204 });
  } catch (error) { return apiError(error); }
}
