import { afterEach, describe, expect, it } from "vitest";

import { createNoteSession, readNoteSession } from "@/lib/note-session";

const initialSecret = process.env.NOTES_COLLABORATION_SECRET;

afterEach(() => {
  if (initialSecret === undefined) delete process.env.NOTES_COLLABORATION_SECRET;
  else process.env.NOTES_COLLABORATION_SECRET = initialSecret;
});

describe("Note collaboration session", () => {
  it("binds a short-lived session to one note and one user", () => {
    process.env.NOTES_COLLABORATION_SECRET = "test-only-secret";
    const token = createNoteSession("note-1", "user-1");
    expect(readNoteSession(token)).toMatchObject({ noteId: "note-1", userId: "user-1" });
  });

  it("rejects a token when its contents are modified", () => {
    process.env.NOTES_COLLABORATION_SECRET = "test-only-secret";
    const token = createNoteSession("note-1", "user-1");
    expect(readNoteSession(`${token.slice(0, -1)}x`)).toBeNull();
  });
});
