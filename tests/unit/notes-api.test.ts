import { beforeEach, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/infrastructure/container", () => ({
  users: { findById: vi.fn() },
  divisions: { list: vi.fn() },
  noteWorkspaces: { findById: vi.fn(), listMembers: vi.fn(), removeMember: vi.fn() },
  notes: { findById: vi.fn(), listByWorkspace: vi.fn(), remove: vi.fn() },
}));

import { auth } from "@/auth";
import { divisions, noteWorkspaces, notes, users } from "@/infrastructure/container";
import { DELETE as removeMember } from "@/app/api/notes/workspaces/[workspaceId]/members/[userId]/route";
import { DELETE as removeNote } from "@/app/api/notes/[noteId]/route";

const owner = { id: "owner", name: "Owner", email: "owner@example.test", passwordHash: "hash", role: "user" as const, status: "active" as const, sheetName: "", createdAt: "", updatedAt: "" };
const workspace = { id: "workspace-1", name: "Strategi", ownerId: "owner", createdAt: "", updatedAt: "" };

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
  vi.mocked(notes.listByWorkspace).mockResolvedValue([{ id: "note-1", workspaceId: workspace.id, title: "Keputusan", createdBy: "owner", createdAt: "", updatedAt: "" }]);
  vi.mocked(notes.findById).mockResolvedValue({ id: "note-1", workspaceId: workspace.id, title: "Keputusan", createdBy: "owner", createdAt: "", updatedAt: "" });
});

it("closes active document connections after member access is revoked", async () => {
  const close = vi.fn();
  Object.assign(globalThis, { __actionPlanNotesRuntime: { closeNoteConnections: close } });

  const response = await removeMember(new Request("http://localhost"), { params: Promise.resolve({ workspaceId: workspace.id, userId: "member" }) });

  expect(response.status).toBe(204);
  expect(noteWorkspaces.removeMember).toHaveBeenCalledWith(workspace.id, "member");
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("closes active document connections after a note is deleted", async () => {
  const close = vi.fn();
  Object.assign(globalThis, { __actionPlanNotesRuntime: { closeNoteConnections: close } });

  const response = await removeNote(new Request("http://localhost"), { params: Promise.resolve({ noteId: "note-1" }) });

  expect(response.status).toBe(204);
  expect(notes.remove).toHaveBeenCalledWith("note-1");
  expect(close).toHaveBeenCalledWith(["note-1"]);
});
