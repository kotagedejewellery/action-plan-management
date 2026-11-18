import { NextResponse } from "next/server";
import { requireAdmin } from "@/application/access";
import { saveDivision } from "@/application/divisions";
import { divisionInputSchema } from "@/application/schemas";
import { divisions, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

export async function GET() {
  try { requireAdmin(await currentActor()); return NextResponse.json(await divisions.list(), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try { const actor = await currentActor(); requireAdmin(actor); return NextResponse.json(await saveDivision(divisions, users, actor, divisionInputSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return apiError(error); }
}
