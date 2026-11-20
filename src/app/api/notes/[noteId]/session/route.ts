import { NextResponse } from "next/server";

import { assertCanAccessNote } from "@/application/notes";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { createNoteSession } from "@/lib/note-session";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ noteId: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const actor = await currentActor();
    const note = await assertCanAccessNote(noteWorkspaces, notes, actor, (await params).noteId);
    return NextResponse.json({ token: createNoteSession(note.id, actor.id) }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return apiError(error); }
}
