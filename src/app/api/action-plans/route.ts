import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { actionPlanInputSchema } from "@/application/schemas";
import { listVisiblePlans, saveOwnActionPlan } from "@/application/use-cases";
import { actionPlans, statuses, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET(request: Request) {
  try {
    const actor = await currentActor();
    const targetId = new URL(request.url).searchParams.get("userId");
    const target = targetId ? await users.findById(targetId) : actor.role === "user" ? await users.findById(actor.id) : null;
    return NextResponse.json(await listVisiblePlans(actionPlans, actor, target));
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 403 : 400 }); }
}

export async function POST(request: Request) {
  try {
    const actor = await currentActor();
    const input = actionPlanInputSchema.parse(await request.json());
    const timestamp = new Date().toISOString();
    const plan = await saveOwnActionPlan(actionPlans, statuses, actor, { id: crypto.randomUUID(), date: input.date, task: input.task, morningStatus: input.morningStatus, afternoonStatus: input.afternoonStatus || undefined, resultLink: input.resultLink || undefined, note: input.note || undefined, createdAt: timestamp, updatedAt: timestamp });
    return NextResponse.json(plan, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 }); }
}
