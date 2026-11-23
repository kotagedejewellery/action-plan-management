import { randomUUID } from "node:crypto";

import { requireActiveActor } from "./access";
import { AppError } from "./errors";
import type { NoteRepository, NoteWorkspaceRepository, UserRepository } from "./ports";
import type { Actor, CollaborativeNote, NoteWorkspace, NoteWorkspaceMember } from "@/domain/models";

type WorkspaceInput = { name: string };
type NoteInput = { title: string };
type NoteRenameInput = NoteInput & { titleUpdatedAt: string };

function nonEmpty(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new AppError(`${label} wajib diisi.`, "VALIDATION");
  return normalized;
}

async function membership(repository: NoteWorkspaceRepository, workspaceId: string, userId: string): Promise<NoteWorkspaceMember> {
  const workspace = await repository.findById(workspaceId);
  if (!workspace) throw new AppError("Workspace catatan tidak ditemukan.", "NOT_FOUND");
  const member = (await repository.listMembers(workspaceId)).find((item) => item.userId === userId);
  if (!member) throw new AppError("Akses ke workspace catatan ditolak.", "FORBIDDEN");
  return member;
}

async function owner(repository: NoteWorkspaceRepository, actor: Actor, workspaceId: string): Promise<void> {
  if ((await membership(repository, workspaceId, actor.id)).role !== "owner") throw new AppError("Hanya Owner workspace yang dapat mengelola anggota.", "FORBIDDEN");
}

export async function listVisibleNoteWorkspaces(repository: NoteWorkspaceRepository, actor: Actor): Promise<NoteWorkspace[]> {
  requireActiveActor(actor);
  return repository.listForUser(actor.id);
}

export async function createNoteWorkspace(repository: NoteWorkspaceRepository, actor: Actor, input: WorkspaceInput): Promise<NoteWorkspace> {
  requireActiveActor(actor);
  const now = new Date().toISOString();
  const workspace: NoteWorkspace = { id: randomUUID(), name: nonEmpty(input.name, "Nama workspace"), ownerId: actor.id, createdAt: now, updatedAt: now };
  return repository.createWithOwner(workspace, { workspaceId: workspace.id, userId: actor.id, role: "owner", createdAt: now });
}

export async function inviteNoteWorkspaceMember(repository: NoteWorkspaceRepository, users: UserRepository, actor: Actor, workspaceId: string, email: string): Promise<NoteWorkspaceMember> {
  requireActiveActor(actor);
  await owner(repository, actor, workspaceId);
  const invited = await users.findByEmail(nonEmpty(email, "Email"));
  if (!invited || invited.status !== "active") throw new AppError("Akun aktif tidak ditemukan.", "NOT_FOUND");
  const members = await repository.listMembers(workspaceId);
  const existing = members.find((member) => member.userId === invited.id);
  if (existing) return existing;
  return repository.addMember({ workspaceId, userId: invited.id, role: "member", createdAt: new Date().toISOString() });
}

export async function removeNoteWorkspaceMember(repository: NoteWorkspaceRepository, actor: Actor, workspaceId: string, userId: string): Promise<void> {
  requireActiveActor(actor);
  await owner(repository, actor, workspaceId);
  if (actor.id === userId) throw new AppError("Owner tidak dapat menghapus dirinya sendiri dari workspace.", "VALIDATION");
  const target = (await repository.listMembers(workspaceId)).find((member) => member.userId === userId);
  if (!target) throw new AppError("Anggota workspace tidak ditemukan.", "NOT_FOUND");
  if (target.role === "owner") throw new AppError("Owner workspace tidak dapat dihapus.", "VALIDATION");
  await repository.removeMember(workspaceId, userId);
}

export async function deleteNoteWorkspace(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, workspaceId: string, confirmationName: string): Promise<{ memberIds: string[]; noteIds: string[] }> {
  requireActiveActor(actor);
  await owner(workspaces, actor, workspaceId);
  const workspace = await workspaces.findById(workspaceId);
  if (!workspace || nonEmpty(confirmationName, "Nama workspace") !== workspace.name) throw new AppError("Ketik nama workspace dengan tepat untuk mengonfirmasi penghapusan.", "VALIDATION");
  const [members, workspaceNotes] = await Promise.all([workspaces.listMembers(workspaceId), notes.listByWorkspace(workspaceId)]);
  await workspaces.remove(workspaceId);
  return { memberIds: members.map((member) => member.userId), noteIds: workspaceNotes.map((note) => note.id) };
}

export async function listWorkspaceNotes(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, workspaceId: string): Promise<CollaborativeNote[]> {
  requireActiveActor(actor);
  await membership(workspaces, workspaceId, actor.id);
  return notes.listByWorkspace(workspaceId);
}

export async function listNoteWorkspaceMembers(repository: NoteWorkspaceRepository, users: UserRepository, actor: Actor, workspaceId: string): Promise<Array<NoteWorkspaceMember & { name: string; email: string }>> {
  requireActiveActor(actor);
  await membership(repository, workspaceId, actor.id);
  const [members, accounts] = await Promise.all([repository.listMembers(workspaceId), users.list()]);
  return members.flatMap((member) => {
    const account = accounts.find((item) => item.id === member.userId);
    return account ? [{ ...member, name: account.name, email: account.email }] : [];
  });
}

export async function createNote(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, workspaceId: string, input: NoteInput): Promise<CollaborativeNote> {
  requireActiveActor(actor);
  await membership(workspaces, workspaceId, actor.id);
  const now = new Date().toISOString();
  return notes.create({ id: randomUUID(), workspaceId, title: nonEmpty(input.title, "Judul catatan"), createdBy: actor.id, createdAt: now, updatedAt: now, titleUpdatedAt: now });
}

export async function deleteNote(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, noteId: string): Promise<void> {
  requireActiveActor(actor);
  const note = await notes.findById(noteId);
  if (!note) throw new AppError("Catatan tidak ditemukan.", "NOT_FOUND");
  await owner(workspaces, actor, note.workspaceId);
  await notes.remove(noteId);
}

export async function renameNote(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, noteId: string, input: NoteRenameInput): Promise<CollaborativeNote> {
  const note = await assertCanAccessNote(workspaces, notes, actor, noteId);
  const titleUpdatedAt = new Date().toISOString();
  const renamed = await notes.updateTitle({ ...note, title: nonEmpty(input.title, "Judul catatan"), updatedAt: titleUpdatedAt, titleUpdatedAt }, input.titleUpdatedAt);
  if (!renamed) throw new AppError("Judul telah diubah anggota lain. Muat data terbaru lalu coba lagi.", "CONFLICT");
  return renamed;
}

export async function assertCanAccessNote(workspaces: NoteWorkspaceRepository, notes: NoteRepository, actor: Actor, noteId: string): Promise<CollaborativeNote> {
  requireActiveActor(actor);
  const note = await notes.findById(noteId);
  if (!note) throw new AppError("Catatan tidak ditemukan.", "NOT_FOUND");
  await membership(workspaces, note.workspaceId, actor.id);
  return note;
}
