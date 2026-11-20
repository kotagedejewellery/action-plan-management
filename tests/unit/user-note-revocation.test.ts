import { beforeEach, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/application/divisions", () => ({ saveManagedUser: vi.fn() }));
vi.mock("@/infrastructure/container", () => ({
  users: { findById: vi.fn() },
  divisions: { list: vi.fn() },
  noteWorkspaces: { listForUser: vi.fn() },
  notes: { listByWorkspace: vi.fn() },
}));

import { auth } from "@/auth";
import { saveManagedUser } from "@/application/divisions";
import { divisions, notes, noteWorkspaces, users } from "@/infrastructure/container";
import { PATCH } from "@/app/api/users/[userId]/route";

const admin = { id: "admin", name: "Admin", email: "admin@example.test", passwordHash: "hash", role: "admin" as const, status: "active" as const, sheetName: "", createdAt: "", updatedAt: "" };
const member = { id: "member", name: "Member", email: "member@example.test", passwordHash: "hash", role: "user" as const, status: "active" as const, sheetName: "action_plan_member", createdAt: "", updatedAt: "" };

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(auth).mockResolvedValue({ user: { id: admin.id } } as never);
  vi.mocked(users.findById).mockImplementation(async (id) => id === admin.id ? admin : id === member.id ? member : null);
  vi.mocked(divisions.list).mockResolvedValue([]);
  vi.mocked(saveManagedUser).mockResolvedValue({ ...member, status: "inactive" });
  vi.mocked(noteWorkspaces.listForUser).mockResolvedValue([{ id: "workspace-1", name: "Strategi", ownerId: "owner", createdAt: "", updatedAt: "" }]);
  vi.mocked(notes.listByWorkspace).mockResolvedValue([{ id: "note-1", workspaceId: "workspace-1", title: "Keputusan", createdBy: "owner", createdAt: "", updatedAt: "" }]);
});

it("closes the member's active Notes when SuperAdmin deactivates the account", async () => {
  const close = vi.fn();
  globalThis.__actionPlanNotesRuntime = { closeNoteConnections: close };
  const response = await PATCH(new Request("http://localhost", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: member.name, email: member.email, role: member.role, status: "inactive" }) }), { params: Promise.resolve({ userId: member.id }) });

  expect(response.status).toBe(200);
  expect(close).toHaveBeenCalledWith(["note-1"]);
});
