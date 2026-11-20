import { NextResponse } from "next/server";

import { deleteNote } from "@/application/notes";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { closeNoteCollaborationConnections } from "@/lib/note-collaboration";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ noteId: string }> };

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const noteId = (await params).noteId;
    await deleteNote(noteWorkspaces, notes, await currentActor(), noteId);
    closeNoteCollaborationConnections([noteId]);
    return new NextResponse(null, { status: 204 });
  }
  catch (error) { return apiError(error); }
}
