import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { statusUpdateSchema } from "@/application/schemas";
import { requireAdmin, updateStatus } from "@/application/use-cases";
import { statuses } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ statusId: string }> }) {
  try {
    requireAdmin(await currentActor());
    return NextResponse.json(await updateStatus(statuses, (await params).statusId, statusUpdateSchema.parse(await request.json())));
  } catch (error) {
    return apiError(error);
  }
}
