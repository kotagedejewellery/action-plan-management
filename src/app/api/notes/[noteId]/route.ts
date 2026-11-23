import { NextResponse } from "next/server";

import { deleteNote, renameNote } from "@/application/notes";
import { noteRenameInputSchema } from "@/application/schemas";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { closeNoteCollaborationConnections } from "@/lib/note-collaboration";
import { publishNoteWorkspaceChange } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ noteId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const actor = await currentActor();
    const note = await renameNote(noteWorkspaces, notes, actor, (await params).noteId, noteRenameInputSchema.parse(await request.json()));
    publishNoteWorkspaceChange((await noteWorkspaces.listMembers(note.workspaceId)).map((member) => member.userId));
    return NextResponse.json(note);
  }
  catch (error) { return apiError(error); }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const noteId = (await params).noteId;
    const note = await notes.findById(noteId);
    await deleteNote(noteWorkspaces, notes, await currentActor(), noteId);
    closeNoteCollaborationConnections([noteId]);
    if (note) publishNoteWorkspaceChange((await noteWorkspaces.listMembers(note.workspaceId)).map((member) => member.userId));
    return new NextResponse(null, { status: 204 });
  }
  catch (error) { return apiError(error); }
}
