import { describe, expect, it } from "vitest";

import { noteEditorEditable, noteEditorFeedback } from "@/presentation/components/note-editor-feedback";

describe("noteEditorFeedback", () => {
  it("keeps normal editing feedback visually quiet", () => {
    expect(noteEditorFeedback({ connection: "connected", persistence: "saving" })).toEqual({
      liveMessage: "Menyimpan perubahan.",
      notice: null,
      saved: false,
    });
  });

  it("only surfaces an actionable warning for a disconnected or failed editor", () => {
    expect(noteEditorFeedback({ connection: "reconnecting", persistence: "saving" })).toEqual({
      liveMessage: "Koneksi terputus. Perubahan akan dikirim saat tersambung kembali.",
      notice: "Koneksi terputus. Perubahan akan dikirim saat tersambung kembali.",
      saved: false,
    });
    expect(noteEditorFeedback({ connection: "connected", persistence: "failed" })).toEqual({
      liveMessage: "Penyimpanan gagal. Periksa koneksi lalu coba lagi.",
      notice: "Penyimpanan gagal. Periksa koneksi lalu coba lagi.",
      saved: false,
    });
  });

  it("shows the saved confirmation without retaining a status label", () => {
    expect(noteEditorFeedback({ connection: "connected", persistence: "saved" })).toEqual({
      liveMessage: "Perubahan tersimpan.",
      notice: null,
      saved: true,
    });
  });

  it("prevents local edits after collaboration access is revoked", () => {
    expect(noteEditorEditable("connected")).toBe(true);
    expect(noteEditorEditable("unauthorized")).toBe(false);
  });
});
