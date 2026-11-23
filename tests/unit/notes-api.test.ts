import { beforeEach, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/infrastructure/container", () => ({
  users: { findById: vi.fn() },
  divisions: { list: vi.fn() },
  noteWorkspaces: { findById: vi.fn(), listMembers: vi.fn(), removeMember: vi.fn(), remove: vi.fn() },
  notes: { findById: vi.fn(), listByWorkspace: vi.fn(), remove: vi.fn(), updateTitle: vi.fn() },
}));

import { auth } from "@/auth";
import { divisions, noteWorkspaces, notes, users } from "@/infrastructure/container";
import { DELETE as removeMember } from "@/app/api/notes/workspaces/[workspaceId]/members/[userId]/route";
import { DELETE as removeNote, PATCH as renameNote } from "@/app/api/notes/[noteId]/route";
import { DELETE as removeWorkspace } from "@/app/api/notes/workspaces/[workspaceId]/route";

const owner = { id: "owner", name: "Owner", email: "owner@example.test", passwordHash: "hash", role: "user" as const, status: "active" as const, sheetName: "", createdAt: "", updatedAt: "" };
const workspace = { id: "workspace-1", name: "Strategi", ownerId: "owner", createdAt: "", updatedAt: "" };
const timestamp = "2026-11-23T00:00:00.000Z";

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(auth).mockResolvedValue({ user: { id: "owner" } } as never);
  vi.mocked(users.findById).mockResolvedValue(owner);
  vi.mocked(divisions.list).mockResolvedValue([]);
  vi.mocked(noteWorkspaces.findById).mockResolvedValue(workspace);
  vi.mocked(noteWorkspaces.listMembers).mockResolvedValue([
    { workspaceId: workspace.id, userId: "owner", role: "owner", createdAt: "" },
    { workspaceId: workspace.id, userId: "member", role: "member", createdAt: "" },
  ]);
  vi.mocked(notes.listByWorkspace).mockResolvedValue([{ id: "note-1", workspaceId: workspace.id, title: "Keputusan", createdBy: "owner", createdAt: timestamp, updatedAt: timestamp, titleUpdatedAt: timestamp }]);
  vi.mocked(notes.findById).mockResolvedValue({ id: "note-1", workspaceId: workspace.id, title: "Keputusan", createdBy: "owner", createdAt: timestamp, updatedAt: timestamp, titleUpdatedAt: timestamp });
  vi.mocked(notes.updateTitle).mockImplementation(async (note) => note);
});

it("closes active document connections after member access is revoked", async () => {
  const close = vi.fn();
  Object.assign(globalThis, { __actionPlanNotesRuntime: { closeNoteConnections: close, ready: async () => true } });

  const response = await removeMember(new Request("http://localhost"), { params: Promise.resolve({ workspaceId: workspace.id, userId: "member" }) });

  expect(response.status).toBe(204);
  expect(noteWorkspaces.removeMember).toHaveBeenCalledWith(workspace.id, "member");
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("closes active document connections after a note is deleted", async () => {
  const close = vi.fn();
  Object.assign(globalThis, { __actionPlanNotesRuntime: { closeNoteConnections: close, ready: async () => true } });

  const response = await removeNote(new Request("http://localhost"), { params: Promise.resolve({ noteId: "note-1" }) });

  expect(response.status).toBe(204);
  expect(notes.remove).toHaveBeenCalledWith("note-1");
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("renames a note through the protected route", async () => {
  const response = await renameNote(new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ title: "Keputusan final", titleUpdatedAt: timestamp }) }), { params: Promise.resolve({ noteId: "note-1" }) });

  expect(response.status).toBe(200);
  expect(notes.updateTitle).toHaveBeenCalledWith(expect.objectContaining({ id: "note-1", title: "Keputusan final" }), timestamp);
});

it("requires an exact workspace-name confirmation before permanently deleting a workspace", async () => {
  const rejected = await removeWorkspace(new Request("http://localhost", { method: "DELETE", body: JSON.stringify({ confirmationName: "Salah" }) }), { params: Promise.resolve({ workspaceId: workspace.id }) });

  expect(rejected.status).toBe(400);
  expect(noteWorkspaces.remove).not.toHaveBeenCalled();
});

it("closes every workspace document after its owner confirms permanent deletion", async () => {
  const close = vi.fn();
  Object.assign(globalThis, { __actionPlanNotesRuntime: { closeNoteConnections: close, ready: async () => true } });

  const response = await removeWorkspace(new Request("http://localhost", { method: "DELETE", body: JSON.stringify({ confirmationName: workspace.name }) }), { params: Promise.resolve({ workspaceId: workspace.id }) });

  expect(response.status).toBe(204);
  expect(noteWorkspaces.remove).toHaveBeenCalledWith(workspace.id);
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("refuses permanent workspace deletion from a member", async () => {
  vi.mocked(auth).mockResolvedValue({ user: { id: "member" } } as never);
  vi.mocked(users.findById).mockResolvedValue({ ...owner, id: "member", name: "Member", email: "member@example.test" });

  const response = await removeWorkspace(new Request("http://localhost", { method: "DELETE", body: JSON.stringify({ confirmationName: workspace.name }) }), { params: Promise.resolve({ workspaceId: workspace.id }) });

  expect(response.status).toBe(403);
  expect(noteWorkspaces.remove).not.toHaveBeenCalled();
});
