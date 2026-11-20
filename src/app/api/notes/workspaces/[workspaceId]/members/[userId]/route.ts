import { NextResponse } from "next/server";

import { removeNoteWorkspaceMember } from "@/application/notes";
import { noteWorkspaces } from "@/infrastructure/container";
import { notes } from "@/infrastructure/container";
import { closeNoteCollaborationConnections } from "@/lib/note-collaboration";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ workspaceId: string; userId: string }> };

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const input = await params;
    await removeNoteWorkspaceMember(noteWorkspaces, await currentActor(), input.workspaceId, input.userId);
    closeNoteCollaborationConnections((await notes.listByWorkspace(input.workspaceId)).map((note) => note.id));
    return new NextResponse(null, { status: 204 });
  } catch (error) { return apiError(error); }
}
