import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { weeklyPlanUpdateSchema } from "@/application/schemas";
import { archiveOwnWeeklyPlan, updateOwnWeeklyPlan } from "@/application/use-cases";
import { weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ weeklyPlanId: string }> }) {
  try {
    const plan = await updateOwnWeeklyPlan(weeklyPlans, await currentActor(), (await params).weeklyPlanId, weeklyPlanUpdateSchema.parse(await request.json()));
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ weeklyPlanId: string }> }) {
  try {
    await archiveOwnWeeklyPlan(weeklyPlans, await currentActor(), (await params).weeklyPlanId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 });
  }
}
