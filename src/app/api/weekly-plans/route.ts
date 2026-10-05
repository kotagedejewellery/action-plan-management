import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { weeklyPlanInputSchema } from "@/application/schemas";
import { createOwnWeeklyPlan, listOwnWeeklyPlans } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET() {
  try {
    return NextResponse.json(await listOwnWeeklyPlans(weeklyPlans, await currentActor()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = weeklyPlanInputSchema.parse(await request.json());
    return NextResponse.json(await createOwnWeeklyPlan(weeklyPlans, actionPlans, statuses, await currentActor(), input), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 });
  }
}
