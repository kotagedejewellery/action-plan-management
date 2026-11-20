import { afterEach, expect, it, vi } from "vitest";

import { closeNoteCollaborationConnectionsForUser } from "@/lib/note-collaboration";

afterEach(() => { globalThis.__actionPlanNotesRuntime = undefined; });

it("closes every accessible note when an account becomes inactive", async () => {
  const close = vi.fn();
  globalThis.__actionPlanNotesRuntime = { closeNoteConnections: close };

  await closeNoteCollaborationConnectionsForUser({
    listForUser: async () => [
      { id: "workspace-a", name: "A", ownerId: "owner", createdAt: "", updatedAt: "" },
      { id: "workspace-b", name: "B", ownerId: "owner", createdAt: "", updatedAt: "" },
    ],
  }, {
    listByWorkspace: async (workspaceId) => workspaceId === "workspace-a"
      ? [{ id: "note-a", workspaceId, title: "A", createdBy: "owner", createdAt: "", updatedAt: "" }]
      : [{ id: "note-b", workspaceId, title: "B", createdBy: "owner", createdAt: "", updatedAt: "" }],
  }, "member");

  expect(close).toHaveBeenCalledWith(["note-a", "note-b"]);
});
