import { describe, expect, it } from "vitest";

import { createNote, createNoteWorkspace, inviteNoteWorkspaceMember, listVisibleNoteWorkspaces, removeNoteWorkspaceMember } from "@/application/notes";
import type { NoteRepository, NoteWorkspaceRepository, UserRepository } from "@/application/ports";
import type { Actor, NoteWorkspace, NoteWorkspaceMember, User } from "@/domain/models";

const now = "2026-11-20T00:00:00.000Z";
const actor = (id: string): Actor => ({ id, name: id, email: `${id}@example.test`, role: "user", status: "active", sheetName: "" });
const user = (id: string, status: User["status"] = "active"): User => ({ id, name: id, email: `${id}@example.test`, passwordHash: "hash", role: "user", status, sheetName: "", createdAt: now, updatedAt: now });

function setup() {
  const workspaces: NoteWorkspace[] = [];
  const members: NoteWorkspaceMember[] = [];
  const notes: { id: string; workspaceId: string; title: string; createdBy: string; createdAt: string; updatedAt: string }[] = [];
  const users = [user("owner"), user("member"), user("inactive", "inactive")];
  const workspaceRepository: NoteWorkspaceRepository = {
    listForUser: async (userId) => workspaces.filter((workspace) => members.some((member) => member.workspaceId === workspace.id && member.userId === userId)),
    findById: async (id) => workspaces.find((workspace) => workspace.id === id) ?? null,
    createWithOwner: async (workspace, owner) => { workspaces.push(workspace); members.push(owner); return workspace; },
    listMembers: async (workspaceId) => members.filter((member) => member.workspaceId === workspaceId),
    addMember: async (member) => { members.push(member); return member; },
    removeMember: async (workspaceId, userId) => { const index = members.findIndex((member) => member.workspaceId === workspaceId && member.userId === userId); if (index >= 0) members.splice(index, 1); },
  };
  const noteRepository: NoteRepository = {
    listByWorkspace: async (workspaceId) => notes.filter((note) => note.workspaceId === workspaceId),
    findById: async (id) => notes.find((note) => note.id === id) ?? null,
    create: async (note) => { notes.push(note); return note; },
    updateTitle: async (note) => { const index = notes.findIndex((item) => item.id === note.id); notes[index] = note; return note; },
    remove: async (id) => { const index = notes.findIndex((note) => note.id === id); if (index >= 0) notes.splice(index, 1); },
  };
  const userRepository: UserRepository = { list: async () => users, findById: async (id) => users.find((item) => item.id === id) ?? null, findByEmail: async (email) => users.find((item) => item.email === email) ?? null, create: async (item) => item, update: async (item) => item, createActionPlanSheet: async () => undefined };
  return { workspaces, members, notes, workspaceRepository, noteRepository, userRepository };
}

describe("Collaborative Notes", () => {
  it("creates a workspace owned by its active creator and shows it only to members", async () => {
    const fixture = setup();
    const workspace = await createNoteWorkspace(fixture.workspaceRepository, actor("owner"), { name: "Catatan strategi" });

    expect((await listVisibleNoteWorkspaces(fixture.workspaceRepository, actor("owner"))).map((item) => item.id)).toEqual([workspace.id]);
    expect(await listVisibleNoteWorkspaces(fixture.workspaceRepository, actor("member"))).toEqual([]);
    expect(fixture.members).toContainEqual(expect.objectContaining({ workspaceId: workspace.id, userId: "owner", role: "owner" }));
  });

  it("lets only an owner invite active accounts and then lets the member create a note", async () => {
    const fixture = setup();
    const workspace = await createNoteWorkspace(fixture.workspaceRepository, actor("owner"), { name: "Catatan strategi" });
    await inviteNoteWorkspaceMember(fixture.workspaceRepository, fixture.userRepository, actor("owner"), workspace.id, "member@example.test");
    await expect(createNote(fixture.workspaceRepository, fixture.noteRepository, actor("member"), workspace.id, { title: "Keputusan rapat" })).resolves.toMatchObject({ workspaceId: workspace.id, createdBy: "member" });
    await expect(inviteNoteWorkspaceMember(fixture.workspaceRepository, fixture.userRepository, actor("member"), workspace.id, "inactive@example.test")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("denies accounts outside the workspace and never lets an owner remove themself", async () => {
    const fixture = setup();
    const workspace = await createNoteWorkspace(fixture.workspaceRepository, actor("owner"), { name: "Catatan strategi" });
    await expect(createNote(fixture.workspaceRepository, fixture.noteRepository, actor("member"), workspace.id, { title: "Tidak boleh" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(removeNoteWorkspaceMember(fixture.workspaceRepository, actor("owner"), workspace.id, "owner")).rejects.toMatchObject({ code: "VALIDATION" });
  });
});
