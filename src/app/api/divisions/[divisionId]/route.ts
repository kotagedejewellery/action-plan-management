import { requireAdmin } from "@/application/access";
import { NextResponse } from "next/server";
import { saveDivision } from "@/application/divisions";
import { divisionInputSchema } from "@/application/schemas";
import { divisions, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

export async function PATCH(request: Request, { params }: { params: Promise<{ divisionId: string }> }) {
  try { const actor = await currentActor(); requireAdmin(actor); return NextResponse.json(await saveDivision(divisions, users, actor, divisionInputSchema.parse(await request.json()), (await params).divisionId)); }
  catch (error) { return apiError(error); }
}
