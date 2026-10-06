import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { weeklyPlanInputSchema } from "@/application/schemas";
import { createOwnWeeklyPlan, listOwnWeeklyPlans } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET() {
  try {
    return NextResponse.json(await listOwnWeeklyPlans(weeklyPlans, await currentActor()));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = weeklyPlanInputSchema.parse(await request.json());
    return NextResponse.json(await createOwnWeeklyPlan(weeklyPlans, actionPlans, statuses, await currentActor(), input), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
