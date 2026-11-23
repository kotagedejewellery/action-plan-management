import { beforeEach, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/infrastructure/container", () => ({
  users: { findById: vi.fn() },
  divisions: { list: vi.fn() },
  noteWorkspaces: { findById: vi.fn(), listMembers: vi.fn(), removeMember: vi.fn(), remove: vi.fn() },
  notes: { findById: vi.fn(), listByWorkspace: vi.fn(), remove: vi.fn(), updateTitle: vi.fn() },
  noteImages: { findById: vi.fn(), listByNote: vi.fn(), countByNote: vi.fn(), countByWorkspace: vi.fn(), create: vi.fn(), remove: vi.fn() },
  noteImageStorage: { download: vi.fn(), trash: vi.fn(), restore: vi.fn(), upload: vi.fn() },
}));

import { auth } from "@/auth";
import { divisions, noteImageStorage, noteImages, noteWorkspaces, notes, users } from "@/infrastructure/container";
import { DELETE as removeMember } from "@/app/api/notes/workspaces/[workspaceId]/members/[userId]/route";
import { DELETE as removeNote, PATCH as renameNote } from "@/app/api/notes/[noteId]/route";
import { POST as uploadImage } from "@/app/api/notes/[noteId]/images/route";
import { DELETE as removeImage, GET as readImage } from "@/app/api/notes/[noteId]/images/[imageId]/route";
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
  vi.mocked(noteImages.listByNote).mockResolvedValue([]);
  vi.mocked(noteImages.countByNote).mockResolvedValue(0);
  vi.mocked(noteImages.countByWorkspace).mockResolvedValue(0);
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
  expect(noteImageStorage.trash).not.toHaveBeenCalled();
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("renames a note through the protected route", async () => {
  const response = await renameNote(new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ title: "Keputusan final", titleUpdatedAt: timestamp }) }), { params: Promise.resolve({ noteId: "note-1" }) });

  expect(response.status).toBe(200);
  expect(notes.updateTitle).toHaveBeenCalledWith(expect.objectContaining({ id: "note-1", title: "Keputusan final" }), timestamp);
});

it("stores only a valid image and serves it through the protected note route", async () => {
  vi.mocked(noteImageStorage.upload).mockResolvedValue({ id: "drive-image-1", name: "diagram.png", mimeType: "image/png" });
  vi.mocked(noteImages.create).mockImplementation(async (image) => image);
  vi.mocked(noteImages.findById).mockResolvedValue({ id: "image-1", noteId: "note-1", driveFileId: "drive-image-1", name: "diagram.png", mimeType: "image/png", sizeBytes: 8, createdBy: "owner", createdAt: timestamp });
  vi.mocked(noteImageStorage.download).mockResolvedValue(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const form = new FormData();
  form.append("image", new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "diagram.png", { type: "image/png" }));

  const created = await uploadImage(new Request("http://localhost", { method: "POST", body: form }), { params: Promise.resolve({ noteId: "note-1" }) });
  const served = await readImage(new Request("http://localhost"), { params: Promise.resolve({ noteId: "note-1", imageId: "image-1" }) });

  expect(created.status).toBe(201);
  expect(noteImageStorage.upload).toHaveBeenCalledWith(expect.objectContaining({ folder: { workspaceId: workspace.id, noteId: "note-1" }, mimeType: "image/png" }));
  expect(served.headers.get("cache-control")).toBe("private, no-store");
  expect(served.headers.get("content-type")).toBe("image/png");
});

it("removes an image through membership-protected route", async () => {
  vi.mocked(noteImages.findById).mockResolvedValue({ id: "image-1", noteId: "note-1", driveFileId: "drive-image-1", name: "diagram.png", mimeType: "image/png", sizeBytes: 8, createdBy: "owner", createdAt: timestamp });

  const response = await removeImage(new Request("http://localhost", { method: "DELETE" }), { params: Promise.resolve({ noteId: "note-1", imageId: "image-1" }) });

  expect(response.status).toBe(204);
  expect(noteImageStorage.trash).toHaveBeenCalledWith("drive-image-1");
  expect(noteImages.remove).toHaveBeenCalledWith("image-1");
});

it("refuses image reads outside the workspace", async () => {
  vi.mocked(auth).mockResolvedValue({ user: { id: "outsider" } } as never);
  vi.mocked(users.findById).mockResolvedValue({ ...owner, id: "outsider", email: "outsider@example.test" });
  vi.mocked(noteWorkspaces.listMembers).mockResolvedValue([]);

  const response = await readImage(new Request("http://localhost"), { params: Promise.resolve({ noteId: "note-1", imageId: "image-1" }) });

  expect(response.status).toBe(403);
  expect(noteImageStorage.download).not.toHaveBeenCalled();
});

it("rejects a file whose bytes do not match its claimed image type", async () => {
  const form = new FormData();
  form.append("image", new File(["not a png"], "diagram.png", { type: "image/png" }));

  const response = await uploadImage(new Request("http://localhost", { method: "POST", body: form }), { params: Promise.resolve({ noteId: "note-1" }) });

  expect(response.status).toBe(400);
  expect(noteImageStorage.upload).not.toHaveBeenCalled();
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
  expect(noteImageStorage.trash).not.toHaveBeenCalled();
  expect(close).toHaveBeenCalledWith(["note-1"]);
});

it("refuses permanent workspace deletion from a member", async () => {
  vi.mocked(auth).mockResolvedValue({ user: { id: "member" } } as never);
  vi.mocked(users.findById).mockResolvedValue({ ...owner, id: "member", name: "Member", email: "member@example.test" });

  const response = await removeWorkspace(new Request("http://localhost", { method: "DELETE", body: JSON.stringify({ confirmationName: workspace.name }) }), { params: Promise.resolve({ workspaceId: workspace.id }) });

  expect(response.status).toBe(403);
  expect(noteWorkspaces.remove).not.toHaveBeenCalled();
});
