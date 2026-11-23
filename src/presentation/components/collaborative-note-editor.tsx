"use client";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Check, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { noteEditorEditable, noteEditorFeedback, type NoteConnectionState, type NotePersistenceState } from "./note-editor-feedback";

type Note = { id: string; title: string };
type Actor = { id: string; name: string };

type Session = { token: string };
type Collaborator = { id: string; name: string; color: string; editing: boolean };
const colors = ["#137d79", "#265b9b", "#9a5b16", "#8a4d83", "#277145"];

function endpoint() {
  return `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/notes/collaboration`;
}

async function fetchSession(noteId: string): Promise<Session> {
  const response = await fetch(`/api/notes/${noteId}/session`, { cache: "no-store" });
  if (response.ok) return response.json() as Promise<Session>;
  const body = await response.json() as { error?: string };
  throw new Error(body.error ?? "Sesi kolaborasi tidak tersedia.");
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
}

function LiveEditor({ note, actor }: { note: Note; actor: Actor }) {
  const [connection, setConnection] = useState<NoteConnectionState>("connecting");
  const [persistence, setPersistence] = useState<NotePersistenceState>("idle");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const provider = useMemo(() => new HocuspocusProvider({
    url: endpoint(), name: note.id, token: async () => {
      console.info("[notes-realtime-client] session_requested");
      try {
        const session = await fetchSession(note.id);
        console.info("[notes-realtime-client] session_ready");
        return session.token;
      } catch (error) {
        console.error("[notes-realtime-client] session_failed", error);
        throw error;
      }
    },
    onOpen: () => console.info("[notes-realtime-client] socket_opened"),
    onOutgoingMessage: ({ message }) => console.info("[notes-realtime-client] message_sent", { type: message.description }),
    onStatus: ({ status }) => setConnection(status === "connected" ? "connected" : "connecting"),
    onSynced: () => setConnection("connected"),
    onUnsyncedChanges: ({ number }) => { if (number > 0) setPersistence("saving"); },
    onStateless: ({ payload }) => {
      try {
        const message = JSON.parse(payload) as { type?: string; status?: string };
        if (message.type === "persistence") setPersistence(message.status === "saved" ? "saved" : "failed");
      } catch { /* Stateless messages from other extensions are ignored. */ }
    },
    onAuthenticationFailed: () => { console.warn("[notes-realtime-client] authentication_rejected"); setConnection("unauthorized"); },
    onClose: ({ event }) => {
      console.warn("[notes-realtime-client] socket_closed", { code: event.code });
      if (event.code === 4205) setConnection("unauthorized");
    },
  }), [note.id]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: provider.document }),
      CollaborationCaret.configure({ provider, user: { id: actor.id, name: actor.name, color: colors[actor.id.charCodeAt(0) % colors.length] } }),
    ],
    editorProps: { attributes: { class: "min-h-[22rem] px-5 py-5 text-sm leading-7 text-[#244542] outline-none sm:px-7" } },
  }, [provider]);

  useEffect(() => {
    const awareness = provider.awareness;
    if (!awareness) return;
    const updateCollaborators = () => {
      const users = [...awareness.getStates().values()].flatMap((state) => {
        const user = state.user;
        return typeof user?.id === "string" && typeof user?.name === "string" && typeof user?.color === "string"
          ? [{ id: user.id, name: user.name, color: user.color, editing: Boolean(state.cursor) }]
          : [];
      });
      setCollaborators([...new Map(users.map((user) => [user.id, user])).values()]);
    };
    awareness.on("change", updateCollaborators);
    updateCollaborators();
    return () => { console.info("[notes-realtime-client] editor_unmounted"); awareness.off("change", updateCollaborators); provider.destroy(); };
  }, [provider]);

  useEffect(() => {
    if (connection !== "connecting") return;
    const timeout = window.setTimeout(() => setConnection((current) => current === "connecting" ? "reconnecting" : current), 3_000);
    return () => window.clearTimeout(timeout);
  }, [connection]);
  useEffect(() => {
    if (persistence !== "saved") return;
    const timeout = window.setTimeout(() => setPersistence("idle"), 1_500);
    return () => window.clearTimeout(timeout);
  }, [persistence]);
  useEffect(() => { editor?.setEditable(noteEditorEditable(connection)); }, [connection, editor]);

  const feedback = noteEditorFeedback({ connection, persistence });
  const activeCollaborators = collaborators.filter((user) => user.id !== actor.id);
  const editingCollaborator = activeCollaborators.find((user) => user.editing);

  return <section className="overflow-hidden rounded-2xl border border-[#dce5e4] bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5e4] px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2" aria-label="Format teks">
        <button type="button" className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${editor?.isActive("bold") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal">B</button>
        <button type="button" className={`grid size-9 place-items-center rounded-lg text-sm italic ${editor?.isActive("italic") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring">I</button>
        <button type="button" className={`grid size-9 place-items-center rounded-lg ${editor?.isActive("bulletList") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar berpoin"><List aria-hidden className="size-4" /></button>
      </div>
      <div className="flex min-w-0 items-center gap-3 text-xs text-[#667c7c]">
        {activeCollaborators.length > 0 && <div className="flex min-w-0 items-center gap-2" aria-label={`${activeCollaborators.map((user) => user.name).join(", ")} sedang aktif di catatan ini`}>
          <div className="flex -space-x-2">{activeCollaborators.slice(0, 4).map((user) => <span key={user.id} title={user.name} className="grid size-7 place-items-center rounded-full border-2 border-white text-xs font-bold text-white" style={{ backgroundColor: user.color }}>{initials(user.name)}</span>)}</div>
          <span className="truncate">{(editingCollaborator ?? activeCollaborators[0]).name} {editingCollaborator ? "sedang menulis" : "sedang melihat"}</span>
        </div>}
        {feedback.saved && <span className="inline-flex items-center text-[#206b43]" title="Perubahan tersimpan"><Check aria-hidden className="size-4" /><span className="sr-only">Perubahan tersimpan</span></span>}
        <span className="sr-only" role="status" aria-live="polite">{feedback.liveMessage}</span>
      </div>
    </div>
    {feedback.notice && <div className={`border-b px-5 py-3 text-sm ${connection === "unauthorized" || persistence === "failed" ? "border-[#f2d3ce] bg-[#fff4f1] text-[#8b3c31]" : "border-[#f5dfad] bg-[#fff9ed] text-[#8a5b17]"}`} role="alert"><div className="flex flex-wrap items-center justify-between gap-3"><span>{feedback.notice}</span>{connection === "unauthorized" && <button type="button" className="font-semibold underline underline-offset-2" onClick={() => window.location.reload()}>Muat ulang</button>}</div></div>}
    <EditorContent editor={editor} />
  </section>;
}

export function CollaborativeNoteEditor({ note, actor }: { note: Note; actor: Actor }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/notes/${note.id}/session`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<Session> : Promise.reject(new Error((await response.json() as { error?: string }).error ?? "Sesi kolaborasi tidak tersedia.")))
      .then(setSession).catch((reason: unknown) => { if ((reason as { name?: string }).name !== "AbortError") setError(reason instanceof Error ? reason.message : "Sesi kolaborasi tidak tersedia."); });
    return () => controller.abort();
  }, [note.id]);
  if (error) return <p className="rounded-xl border border-[#f2d3ce] bg-[#fff4f1] px-4 py-3 text-sm text-[#8b3c31]">{error}</p>;
  if (!session) return <div className="grid min-h-80 place-items-center rounded-2xl border border-[#dce5e4] bg-white text-sm text-[#667c7c]" role="status">Menyiapkan editor kolaboratif...</div>;
  return <LiveEditor key={note.id} note={note} actor={actor} />;
}
