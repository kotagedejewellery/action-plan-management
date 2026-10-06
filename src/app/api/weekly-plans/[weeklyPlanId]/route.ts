import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { weeklyPlanUpdateSchema } from "@/application/schemas";
import { deleteOwnWeeklyPlan, updateOwnWeeklyPlan } from "@/application/use-cases";
import { actionPlans, attachments, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ weeklyPlanId: string }> }) {
  try {
    const plan = await updateOwnWeeklyPlan(weeklyPlans, await currentActor(), (await params).weeklyPlanId, weeklyPlanUpdateSchema.parse(await request.json()));
    return NextResponse.json(plan);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ weeklyPlanId: string }> }) {
  try {
    await deleteOwnWeeklyPlan(weeklyPlans, actionPlans, attachments, await currentActor(), (await params).weeklyPlanId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
