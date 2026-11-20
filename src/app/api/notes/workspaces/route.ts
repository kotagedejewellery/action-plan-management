import { NextResponse } from "next/server";

import { createNoteWorkspace, listVisibleNoteWorkspaces } from "@/application/notes";
import { noteWorkspaceInputSchema } from "@/application/schemas";
import { noteWorkspaces } from "@/infrastructure/container";
import { publishNoteWorkspaceChange } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

export async function GET() {
  try { return NextResponse.json(await listVisibleNoteWorkspaces(noteWorkspaces, await currentActor()), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const actor = await currentActor();
    const workspace = await createNoteWorkspace(noteWorkspaces, actor, noteWorkspaceInputSchema.parse(await request.json()));
    publishNoteWorkspaceChange([actor.id]);
    return NextResponse.json(workspace, { status: 201 });
  }
  catch (error) { return apiError(error); }
}
