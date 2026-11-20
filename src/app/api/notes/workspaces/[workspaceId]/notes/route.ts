import { NextResponse } from "next/server";

import { createNote, listWorkspaceNotes } from "@/application/notes";
import { noteInputSchema } from "@/application/schemas";
import { noteWorkspaces, notes } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ workspaceId: string }> };

export async function GET(_request: Request, { params }: Context) {
  try { return NextResponse.json(await listWorkspaceNotes(noteWorkspaces, notes, await currentActor(), (await params).workspaceId), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request, { params }: Context) {
  try { return NextResponse.json(await createNote(noteWorkspaces, notes, await currentActor(), (await params).workspaceId, noteInputSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return apiError(error); }
}
