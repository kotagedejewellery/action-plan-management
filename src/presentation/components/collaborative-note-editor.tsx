"use client";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useMemo, useState } from "react";

type Note = { id: string; title: string };
type Actor = { id: string; name: string };

type Session = { token: string };
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

function LiveEditor({ note, actor }: { note: Note; actor: Actor }) {
  const [status, setStatus] = useState("Menyambungkan...");
  const [collaborators, setCollaborators] = useState<Array<{ id: string; name: string }>>([]);
  const provider = useMemo(() => new HocuspocusProvider({
    url: endpoint(), name: note.id, token: async () => (await fetchSession(note.id)).token,
    onStatus: ({ status: next }) => setStatus(next === "connected" ? "Terhubung" : "Koneksi terputus, mencoba menyambung..."),
    onSynced: () => setStatus("Terhubung"),
    onUnsyncedChanges: ({ number }) => { if (number > 0) setStatus("Menyimpan perubahan..."); },
    onStateless: ({ payload }) => {
      try {
        const message = JSON.parse(payload) as { type?: string; status?: string };
        if (message.type === "persistence") setStatus(message.status === "saved" ? "Tersimpan" : "Penyimpanan gagal. Perubahan belum tersimpan.");
      } catch { /* Stateless messages from other extensions are ignored. */ }
    },
    onAuthenticationFailed: () => setStatus("Akses kolaborasi berakhir. Muat ulang halaman."),
    onClose: ({ event }) => { if (event.code === 4205) window.location.reload(); },
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
      const users = [...awareness.getStates().values()].flatMap((state) => typeof state.user?.id === "string" && typeof state.user?.name === "string" ? [{ id: state.user.id, name: state.user.name }] : []);
      setCollaborators([...new Map(users.map((user) => [user.id, user])).values()]);
    };
    awareness.on("change", updateCollaborators);
    updateCollaborators();
    return () => { awareness.off("change", updateCollaborators); provider.destroy(); };
  }, [provider]);

  return <section className="overflow-hidden rounded-2xl border border-[#dce5e4] bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5e4] px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2" aria-label="Format teks">
        <button type="button" className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${editor?.isActive("bold") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal">B</button>
        <button type="button" className={`grid size-9 place-items-center rounded-lg text-sm italic ${editor?.isActive("italic") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring">I</button>
        <button type="button" className={`grid size-9 place-items-center rounded-lg text-sm ${editor?.isActive("bulletList") ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4]"}`} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar berpoin">•</button>
      </div>
      <div className="flex items-center gap-3 text-xs text-[#667c7c]" role="status"><span>{status}</span>{collaborators.some((user) => user.id !== actor.id) && <span>{collaborators.filter((user) => user.id !== actor.id).map((user) => user.name).join(", ")} sedang membuka</span>}</div>
    </div>
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
