import { NextResponse } from "next/server";

import { deleteNoteWorkspace } from "@/application/notes";
import { noteWorkspaceDeleteInputSchema } from "@/application/schemas";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { closeNoteCollaborationConnections } from "@/lib/note-collaboration";
import { publishNoteWorkspaceChange } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ workspaceId: string }> };

export async function DELETE(request: Request, { params }: Context) {
  try {
    const result = await deleteNoteWorkspace(noteWorkspaces, notes, await currentActor(), (await params).workspaceId, noteWorkspaceDeleteInputSchema.parse(await request.json()).confirmationName);
    closeNoteCollaborationConnections(result.noteIds);
    publishNoteWorkspaceChange(result.memberIds);
    return new NextResponse(null, { status: 204 });
  }
  catch (error) { return apiError(error); }
}
