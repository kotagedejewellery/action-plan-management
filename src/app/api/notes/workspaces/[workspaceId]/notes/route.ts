import { NextResponse } from "next/server";

import { createNote, listWorkspaceNotes } from "@/application/notes";
import { noteInputSchema } from "@/application/schemas";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { publishNoteWorkspaceChange } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ workspaceId: string }> };

export async function GET(_request: Request, { params }: Context) {
  try { return NextResponse.json(await listWorkspaceNotes(noteWorkspaces, notes, await currentActor(), (await params).workspaceId), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const actor = await currentActor();
    const workspaceId = (await params).workspaceId;
    const note = await createNote(noteWorkspaces, notes, actor, workspaceId, noteInputSchema.parse(await request.json()));
    publishNoteWorkspaceChange((await noteWorkspaces.listMembers(workspaceId)).map((member) => member.userId));
    return NextResponse.json(note, { status: 201 });
  }
  catch (error) { return apiError(error); }
}
