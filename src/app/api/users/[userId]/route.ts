import { saveManagedUser } from "@/application/divisions";
import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { userInputSchema } from "@/application/schemas";
import { requireAdmin } from "@/application/use-cases";
import { users, divisions, notes, noteWorkspaces } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { closeNoteCollaborationConnectionsForUser, noteCollaborationEnabled } from "@/lib/note-collaboration";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const actor = await currentActor();
    requireAdmin(actor);
    const existing = await users.findById((await params).userId);
    if (!existing) throw new AppError("User tidak ditemukan.", "NOT_FOUND");
    const parsed = userInputSchema.parse(await request.json());
    const saved = await saveManagedUser(users, divisions, actor, parsed, existing.id);
    if (existing.status === "active" && saved.status === "inactive" && noteCollaborationEnabled()) await closeNoteCollaborationConnectionsForUser(noteWorkspaces, notes, existing.id);
    return NextResponse.json(saved);
  } catch (error) { return apiError(error); }
}
