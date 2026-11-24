import { deleteManagedUser, saveManagedUser } from "@/application/divisions";
import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { deleteUserInputSchema, userInputSchema } from "@/application/schemas";
import { requireAdmin } from "@/application/use-cases";
import { approvals, divisions, notes, noteWorkspaces, users, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { closeNoteCollaborationConnectionsForUser, noteCollaborationConfigured, noteCollaborationEnabled } from "@/lib/note-collaboration";

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

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const actor = await currentActor();
    requireAdmin(actor);
    const userId = (await params).userId;
    const existing = await users.findById(userId);
    if (!existing) throw new AppError("User tidak ditemukan.", "NOT_FOUND");
    const input = deleteUserInputSchema.parse(await request.json());
    if (input.confirmationEmail.toLowerCase() !== existing.email.toLowerCase()) throw new AppError("Email konfirmasi harus sesuai dengan akun yang akan dihapus.", "VALIDATION");
    const hasNoteMembership = noteCollaborationConfigured() && (await noteWorkspaces.listForUser(existing.id)).length > 0;
    await deleteManagedUser(users, divisions, weeklyPlans, approvals, actor, existing.id, hasNoteMembership);
    return new NextResponse(null, { status: 204 });
  } catch (error) { return apiError(error); }
}
