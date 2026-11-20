import { createHmac, timingSafeEqual } from "node:crypto";

import { AppError } from "@/application/errors";

type NoteSession = { noteId: string; userId: string; expiresAt: number };

function secret(): string {
  const value = process.env.NOTES_COLLABORATION_SECRET;
  if (!value) throw new AppError("Catatan Kolaboratif belum dikonfigurasi di server.", "UNAVAILABLE");
  return value;
}

function signature(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createNoteSession(noteId: string, userId: string): string {
  const payload = Buffer.from(JSON.stringify({ noteId, userId, expiresAt: Date.now() + 60_000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readNoteSession(token: string): NoteSession | null {
  const [payload, received] = token.split(".");
  if (!payload || !received) return null;
  const expected = signature(payload);
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as NoteSession;
    return typeof value.noteId === "string" && typeof value.userId === "string" && typeof value.expiresAt === "number" && value.expiresAt > Date.now() ? value : null;
  } catch {
    return null;
  }
}
