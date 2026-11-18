import { saveManagedUser } from "@/application/divisions";
import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { userInputSchema } from "@/application/schemas";
import { requireAdmin } from "@/application/use-cases";
import { users, divisions } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const actor = await currentActor();
    requireAdmin(actor);
    const existing = await users.findById((await params).userId);
    if (!existing) throw new AppError("User tidak ditemukan.", "NOT_FOUND");
    const parsed = userInputSchema.parse(await request.json());
    return NextResponse.json(await saveManagedUser(users, divisions, actor, parsed, existing.id));
  } catch (error) { return apiError(error); }
}
