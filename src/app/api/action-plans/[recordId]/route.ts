import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { actionPlanInputSchema } from "@/application/schemas";
import { saveOwnActionPlan } from "@/application/use-cases";
import { actionPlans, statuses } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    const actor = await currentActor();
    const input = actionPlanInputSchema.parse(await request.json());
    const current = await actionPlans.findById(actor.sheetName, (await params).recordId);
    if (!current) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
    const plan = await saveOwnActionPlan(actionPlans, statuses, actor, { ...current, date: input.date, task: input.task, morningStatus: input.morningStatus, afternoonStatus: input.afternoonStatus || undefined, resultLink: input.resultLink || undefined, note: input.note || undefined, updatedAt: new Date().toISOString() }, input.updatedAt);
    return NextResponse.json(plan);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError && error.code === "CONFLICT" ? 409 : 400 }); }
}
