import { afterEach, expect, it, vi } from "vitest";

import { publishNoteWorkspaceChange, subscribeToNoteWorkspaceChanges } from "@/lib/note-workspace-events";

afterEach(() => { globalThis.__actionPlanNoteWorkspaceEvents = undefined; });

it("notifies only the workspace members affected by a metadata change", () => {
  const owner = vi.fn();
  const member = vi.fn();
  const outsider = vi.fn();
  const stopOwner = subscribeToNoteWorkspaceChanges("owner", owner);
  subscribeToNoteWorkspaceChanges("member", member);
  subscribeToNoteWorkspaceChanges("outsider", outsider);

  publishNoteWorkspaceChange(["owner", "member", "member"]);

  expect(owner).toHaveBeenCalledOnce();
  expect(member).toHaveBeenCalledOnce();
  expect(outsider).not.toHaveBeenCalled();
  stopOwner();
});
