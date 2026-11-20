export type NoteConnectionState = "connecting" | "connected" | "reconnecting" | "unauthorized";
export type NotePersistenceState = "idle" | "saving" | "saved" | "failed";

type NoteEditorFeedbackInput = {
  connection: NoteConnectionState;
  persistence: NotePersistenceState;
};

type NoteEditorFeedback = {
  liveMessage: string;
  notice: string | null;
  saved: boolean;
};

export function noteEditorEditable(connection: NoteConnectionState): boolean {
  return connection !== "unauthorized";
}

export function noteEditorFeedback({ connection, persistence }: NoteEditorFeedbackInput): NoteEditorFeedback {
  if (connection === "unauthorized") {
    const message = "Akses kolaborasi berakhir. Muat ulang halaman untuk melanjutkan.";
    return { liveMessage: message, notice: message, saved: false };
  }
  if (connection === "reconnecting") {
    const message = "Koneksi terputus. Perubahan akan dikirim saat tersambung kembali.";
    return { liveMessage: message, notice: message, saved: false };
  }
  if (persistence === "failed") {
    const message = "Penyimpanan gagal. Periksa koneksi lalu coba lagi.";
    return { liveMessage: message, notice: message, saved: false };
  }
  if (persistence === "saved") return { liveMessage: "Perubahan tersimpan.", notice: null, saved: true };
  if (persistence === "saving") return { liveMessage: "Menyimpan perubahan.", notice: null, saved: false };
  return { liveMessage: connection === "connecting" ? "Menyambungkan editor kolaboratif." : "Editor siap digunakan.", notice: null, saved: false };
}
