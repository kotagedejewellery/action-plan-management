import { NextResponse } from "next/server";

import { inviteNoteWorkspaceMember, listNoteWorkspaceMembers } from "@/application/notes";
import { noteInviteInputSchema } from "@/application/schemas";
import { noteWorkspaces, users } from "@/infrastructure/container";
import { publishNoteWorkspaceChange } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

type Context = { params: Promise<{ workspaceId: string }> };

export async function GET(_request: Request, { params }: Context) {
  try { return NextResponse.json(await listNoteWorkspaceMembers(noteWorkspaces, users, await currentActor(), (await params).workspaceId), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const workspaceId = (await params).workspaceId;
    const member = await inviteNoteWorkspaceMember(noteWorkspaces, users, await currentActor(), workspaceId, noteInviteInputSchema.parse(await request.json()).email);
    publishNoteWorkspaceChange((await noteWorkspaces.listMembers(workspaceId)).map((item) => item.userId));
    return NextResponse.json(member, { status: 201 });
  }
  catch (error) { return apiError(error); }
}
