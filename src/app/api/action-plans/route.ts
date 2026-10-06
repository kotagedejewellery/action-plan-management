import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { actionPlanInputSchema } from "@/application/schemas";
import { listVisiblePlans, saveOwnActionPlan, type ActionPlanScope } from "@/application/use-cases";
import { actionPlans, statuses, users, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET(request: Request) {
  try {
    const actor = await currentActor();
    const params = new URL(request.url).searchParams;
    const targetId = params.get("userId");
    const requestedScope = params.get("scope");
    const scope: ActionPlanScope = requestedScope === "active" || requestedScope === "history" ? requestedScope : actor.role === "user" ? "active" : "all";
    const target = targetId ? await users.findById(targetId) : actor.role === "user" ? await users.findById(actor.id) : null;
    return NextResponse.json(await listVisiblePlans(actionPlans, statuses, actor, target, scope));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const actor = await currentActor();
    const input = actionPlanInputSchema.parse(await request.json());
    const timestamp = new Date().toISOString();
    const plan = await saveOwnActionPlan(actionPlans, statuses, weeklyPlans, actor, { id: crypto.randomUUID(), date: input.date, task: input.task, morningStatus: input.morningStatus, afternoonStatus: input.afternoonStatus || undefined, resultLink: input.resultLink || undefined, note: input.note || undefined, weeklyPlanId: input.weeklyPlanId || undefined, createdAt: timestamp, updatedAt: timestamp });
    return NextResponse.json(plan, { status: 201 });
  } catch (error) { return apiError(error); }
}
