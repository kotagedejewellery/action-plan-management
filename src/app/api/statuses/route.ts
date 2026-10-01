import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { statusInputSchema } from "@/application/schemas";
import { createStatus, requireAdmin } from "@/application/use-cases";
import { statuses } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET() { try { await currentActor(); return NextResponse.json(await statuses.list()); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 401 }); } }
export async function POST(request: Request) { try { requireAdmin(await currentActor()); const input = statusInputSchema.parse(await request.json()); return NextResponse.json(await createStatus(statuses, input.label, input.isCompleted), { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError && error.code === "CONFLICT" ? 409 : 400 }); } }
