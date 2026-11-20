import { NextResponse } from "next/server";

import { createNoteWorkspace, listVisibleNoteWorkspaces } from "@/application/notes";
import { noteWorkspaceInputSchema } from "@/application/schemas";
import { noteWorkspaces } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

export async function GET() {
  try { return NextResponse.json(await listVisibleNoteWorkspaces(noteWorkspaces, await currentActor()), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try { return NextResponse.json(await createNoteWorkspace(noteWorkspaces, await currentActor(), noteWorkspaceInputSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return apiError(error); }
}
