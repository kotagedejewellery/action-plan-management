import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { statusInputSchema } from "@/application/schemas";
import { createStatus, requireAdmin } from "@/application/use-cases";
import { statuses } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET() { try { await currentActor(); return NextResponse.json(await statuses.list()); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { requireAdmin(await currentActor()); const input = statusInputSchema.parse(await request.json()); return NextResponse.json(await createStatus(statuses, input.label, input.isCompleted), { status: 201 }); } catch (error) { return apiError(error); } }
