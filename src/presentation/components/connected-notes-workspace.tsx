"use client";

import { useEffect, useRef, useState } from "react";

import { CollaborativeNoteEditor } from "./collaborative-note-editor";
import { useFeedback } from "./feedback";
import { ConfirmDialog, DialogFrame, PageHeading } from "./workspace-ui";

type Workspace = { id: string; name: string; ownerId: string; updatedAt: string };
type Note = { id: string; workspaceId: string; title: string; createdBy: string; updatedAt: string; titleUpdatedAt: string };
type Member = { userId: string; role: "owner" | "member"; name: string; email: string };
type Actor = { id: string; name: string };
const refreshInterval = 60_000;

class NotesRequestError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "content-type": "application/json", ...options?.headers }, cache: "no-store" });
  if (!response.ok) throw new NotesRequestError((await response.json() as { error?: string }).error ?? "Permintaan tidak dapat diproses.", response.status);
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export function ConnectedNotesWorkspace({ actor }: { actor: Actor }) {
  const { notify } = useFeedback();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [noteId, setNoteId] = useState<string>();
  const [newWorkspaceOpen, setNewWorkspaceOpen] = useState(false);
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [renaming, setRenaming] = useState<Note>();
  const [deleting, setDeleting] = useState<Note>();
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);
  const [workspaceDeletionName, setWorkspaceDeletionName] = useState("");
  const [removingMember, setRemovingMember] = useState<Member>();
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [eventRefresh, setEventRefresh] = useState(0);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const workspaceDeletionInputRef = useRef<HTMLInputElement>(null);

  const selectedWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);
  const selectedNote = notes.find((note) => note.id === noteId);
  const isOwner = selectedWorkspace?.ownerId === actor.id;

  const loadWorkspaces = async () => {
    try {
      const items = await request<Workspace[]>("/api/notes/workspaces");
      setLoadError("");
      setWorkspaces(items);
      setWorkspaceId((current) => current && items.some((workspace) => workspace.id === current) ? current : items[0]?.id);
    } catch (error) { const message = error instanceof Error ? error.message : "Coba lagi."; setLoadError(message); notify("error", "Catatan belum tersedia", message); }
  };
  const loadWorkspace = async (id: string) => {
    try {
      const [nextNotes, nextMembers] = await Promise.all([request<Note[]>(`/api/notes/workspaces/${id}/notes`), request<Member[]>(`/api/notes/workspaces/${id}/members`)]);
      setNotes(nextNotes); setMembers(nextMembers);
      setNoteId((current) => current && nextNotes.some((note) => note.id === current) ? current : nextNotes[0]?.id);
    } catch (error) { notify("error", "Workspace tidak dapat dibuka", error instanceof Error ? error.message : "Coba lagi."); }
  };

  useEffect(() => {
    let active = true;
    let firstLoad = true;
    const refresh = () => {
      void request<Workspace[]>("/api/notes/workspaces").then((items) => {
        if (!active) return;
        setLoadError("");
        setWorkspaces(items);
        setWorkspaceId((current) => current && items.some((workspace) => workspace.id === current) ? current : items[0]?.id);
      }).catch((error: unknown) => {
        if (active && firstLoad) { const message = error instanceof Error ? error.message : "Coba lagi."; setLoadError(message); notify("error", "Catatan belum tersedia", message); }
      }).finally(() => { firstLoad = false; });
    };
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    const interval = window.setInterval(refresh, refreshInterval);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => { active = false; window.clearInterval(interval); window.removeEventListener("focus", refreshWhenVisible); document.removeEventListener("visibilitychange", refreshWhenVisible); };
  }, [notify, eventRefresh]);
  useEffect(() => {
    if (!workspaceId) return;
    let active = true;
    let firstLoad = true;
    const refresh = () => {
      void Promise.all([request<Note[]>(`/api/notes/workspaces/${workspaceId}/notes`), request<Member[]>(`/api/notes/workspaces/${workspaceId}/members`)]).then(([nextNotes, nextMembers]) => {
        if (!active) return;
        setNotes(nextNotes); setMembers(nextMembers);
        setNoteId((current) => current && nextNotes.some((note) => note.id === current) ? current : nextNotes[0]?.id);
      }).catch((error: unknown) => {
        if (active && firstLoad) notify("error", "Workspace tidak dapat dibuka", error instanceof Error ? error.message : "Coba lagi.");
      }).finally(() => { firstLoad = false; });
    };
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    const interval = window.setInterval(refresh, refreshInterval);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => { active = false; window.clearInterval(interval); window.removeEventListener("focus", refreshWhenVisible); document.removeEventListener("visibilitychange", refreshWhenVisible); };
  }, [workspaceId, notify, eventRefresh]);
  useEffect(() => {
    const source = new EventSource("/api/notes/events");
    const refresh = () => setEventRefresh((current) => current + 1);
    source.addEventListener("refresh", refresh);
    return () => { source.removeEventListener("refresh", refresh); source.close(); };
  }, []);

  const submitWorkspace = async (form: FormData) => {
    setBusy(true);
    try { const workspace = await request<Workspace>("/api/notes/workspaces", { method: "POST", body: JSON.stringify({ name: form.get("name") }) }); setNewWorkspaceOpen(false); await loadWorkspaces(); setWorkspaceId(workspace.id); notify("success", "Workspace dibuat", "Anda menjadi Owner workspace ini."); }
    catch (error) { notify("error", "Workspace gagal dibuat", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const submitNote = async (form: FormData) => {
    if (!workspaceId) return;
    setBusy(true);
    try { const note = await request<Note>(`/api/notes/workspaces/${workspaceId}/notes`, { method: "POST", body: JSON.stringify({ title: form.get("title") }) }); setNewNoteOpen(false); await loadWorkspace(workspaceId); setNoteId(note.id); notify("success", "Catatan dibuat", "Anda dapat mulai menulis bersama."); }
    catch (error) { notify("error", "Catatan gagal dibuat", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const submitInvite = async (form: FormData) => {
    if (!workspaceId) return;
    setBusy(true);
    try { await request(`/api/notes/workspaces/${workspaceId}/members`, { method: "POST", body: JSON.stringify({ email: form.get("email") }) }); setInviteOpen(false); await loadWorkspace(workspaceId); notify("success", "Anggota ditambahkan", "Akses workspace aktif sekarang."); }
    catch (error) { notify("error", "Undangan gagal", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const deleteSelectedNote = async () => {
    if (!deleting || !workspaceId) return;
    setBusy(true);
    try { await request(`/api/notes/${deleting.id}`, { method: "DELETE" }); setDeleting(undefined); await loadWorkspace(workspaceId); notify("success", "Catatan dihapus", "Dokumen dan data kolaborasinya telah dihapus."); }
    catch (error) { notify("error", "Catatan gagal dihapus", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const submitRename = async (form: FormData) => {
    if (!renaming || !workspaceId) return;
    setBusy(true);
    try { await request<Note>(`/api/notes/${renaming.id}`, { method: "PATCH", body: JSON.stringify({ title: form.get("title"), titleUpdatedAt: renaming.titleUpdatedAt }) }); setRenaming(undefined); await loadWorkspace(workspaceId); notify("success", "Nama catatan diperbarui", "Anggota workspace akan melihat judul terbaru."); }
    catch (error) { if (error instanceof NotesRequestError && error.status === 409) { setRenaming(undefined); await loadWorkspace(workspaceId); } notify("error", "Nama catatan belum diperbarui", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const deleteSelectedWorkspace = async () => {
    if (!selectedWorkspace || workspaceDeletionName !== selectedWorkspace.name) return;
    setBusy(true);
    try { await request(`/api/notes/workspaces/${selectedWorkspace.id}`, { method: "DELETE", body: JSON.stringify({ confirmationName: workspaceDeletionName }) }); setDeletingWorkspace(false); setWorkspaceDeletionName(""); setWorkspaceId(undefined); setNotes([]); setMembers([]); await loadWorkspaces(); notify("success", "Workspace dihapus", "Catatan dan akses anggota di workspace ini telah dihapus permanen."); }
    catch (error) { notify("error", "Workspace belum dihapus", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };
  const removeMember = async () => {
    if (!removingMember || !workspaceId) return;
    setBusy(true);
    try { await request(`/api/notes/workspaces/${workspaceId}/members/${removingMember.userId}`, { method: "DELETE" }); setRemovingMember(undefined); await loadWorkspace(workspaceId); notify("success", "Akses anggota dicabut", "Anggota tidak lagi dapat membuka workspace ini."); }
    catch (error) { notify("error", "Akses anggota belum dicabut", error instanceof Error ? error.message : "Coba lagi."); }
    finally { setBusy(false); }
  };

  return <div className="space-y-7">
    <PageHeading title="Catatan Kolaboratif" description="Ruang kerja privat untuk menulis dan menyunting bersama secara langsung." action={<button type="button" className="h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865]" onClick={() => setNewWorkspaceOpen(true)}>Workspace baru</button>} />
    <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-[#dce5e4] bg-white p-3 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.04em] text-[#667c7c]">Workspace Anda</p>
        {workspaces.length ? <div className="space-y-1">{workspaces.map((workspace) => <button key={workspace.id} type="button" onClick={() => setWorkspaceId(workspace.id)} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${workspace.id === workspaceId ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#244542] hover:bg-[#f1f5f4]"}`}>{workspace.name}</button>)}</div> : <p className="px-2 py-5 text-sm leading-6 text-[#667c7c]">Belum ada workspace. Buat ruang pertama untuk mulai berkolaborasi.</p>}
      </aside>
      <section className="min-w-0 space-y-5">
        {loadError && !workspaces.length ? <div className="rounded-2xl border border-[#f2d3ce] bg-white p-7 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><h2 className="text-xl font-semibold tracking-[-0.025em] text-[#173c3a]">Catatan belum tersedia</h2><p className="mt-2 text-sm leading-6 text-[#667c7c]">{loadError}</p><button type="button" className="mt-5 h-10 rounded-xl border border-[#dce5e4] px-3 text-sm font-semibold text-[#315452] hover:bg-[#f1f5f4]" onClick={() => void loadWorkspaces()}>Coba lagi</button></div> : selectedWorkspace ? <>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dce5e4] bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] sm:flex-row sm:items-center">
            <div><h2 className="text-xl font-semibold tracking-[-0.025em] text-[#173c3a]">{selectedWorkspace.name}</h2><p className="mt-1 text-sm text-[#667c7c]">{members.length} anggota · Akses hanya melalui membership workspace.</p></div>
            <div className="flex flex-wrap gap-2"><button type="button" className="h-10 rounded-xl border border-[#dce5e4] px-3 text-sm font-semibold text-[#315452] hover:bg-[#f1f5f4]" onClick={() => setNewNoteOpen(true)}>Catatan baru</button>{isOwner && <button type="button" className="h-10 rounded-xl border border-[#dce5e4] px-3 text-sm font-semibold text-[#315452] hover:bg-[#f1f5f4]" onClick={() => setInviteOpen(true)}>Undang anggota</button>}{isOwner && <button type="button" className="h-10 rounded-xl px-3 text-sm font-semibold text-[#a34c3f] hover:bg-[#fff5f2]" onClick={() => { setWorkspaceDeletionName(""); setDeletingWorkspace(true); }}>Hapus workspace</button>}</div>
          </div>
          <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-[#dce5e4] bg-white p-3"><p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.04em] text-[#667c7c]">Catatan</p>{notes.length ? notes.map((note) => <button type="button" key={note.id} onClick={() => setNoteId(note.id)} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-semibold ${note.id === noteId ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#244542] hover:bg-[#f1f5f4]"}`}>{note.title}</button>) : <p className="px-2 py-4 text-sm text-[#667c7c]">Belum ada catatan.</p>}<div className="mt-5 border-t border-[#dce5e4] px-2 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.04em] text-[#667c7c]">Anggota</p><div className="mt-2 space-y-2">{members.map((member) => <div key={member.userId} className="flex min-w-0 items-center justify-between gap-2"><p className="truncate text-sm text-[#59706f]" title={member.email}>{member.name}{member.role === "owner" ? " · Owner" : ""}</p>{isOwner && member.role !== "owner" && <button type="button" className="shrink-0 text-xs font-semibold text-[#a34c3f] hover:underline" onClick={() => setRemovingMember(member)}>Hapus</button>}</div>)}</div></div></aside>
            <div className="min-w-0">{selectedNote ? <><div className="mb-3 flex items-start justify-between gap-4"><h3 className="text-xl font-semibold tracking-[-0.025em] text-[#173c3a]">{selectedNote.title}</h3><div className="flex shrink-0 items-center gap-3"><button type="button" className="text-sm font-semibold text-[#315452] hover:underline" onClick={() => setRenaming(selectedNote)}>Ubah nama</button>{isOwner && <button type="button" className="text-sm font-semibold text-[#a34c3f] hover:underline" onClick={() => setDeleting(selectedNote)}>Hapus catatan</button>}</div></div><CollaborativeNoteEditor key={selectedNote.id} note={selectedNote} actor={actor} /></> : <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#c8d9d6] bg-white p-8 text-center text-sm leading-6 text-[#667c7c]">Pilih catatan atau buat catatan baru untuk mulai menulis bersama.</div>}</div>
          </div>
        </> : <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-[#c8d9d6] bg-white p-8 text-center text-sm leading-6 text-[#667c7c]">Pilih atau buat workspace untuk memulai Catatan Kolaboratif.</div>}
      </section>
    </div>
    {newWorkspaceOpen && <DialogFrame title="Workspace baru" description="Anda menjadi Owner dan dapat mengundang anggota setelah workspace dibuat." onClose={() => !busy && setNewWorkspaceOpen(false)}><form action={submitWorkspace} aria-busy={busy} className="mt-6 space-y-5"><label className="block text-sm font-semibold text-[#315452]">Nama workspace<input required name="name" minLength={2} maxLength={100} className="mt-2 h-11 w-full rounded-xl border border-[#dce5e4] px-3 text-sm outline-none focus:border-[#137d79]" /></label><button disabled={busy} className="h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Membuat..." : "Buat workspace"}</button></form></DialogFrame>}
    {newNoteOpen && <DialogFrame title="Catatan baru" description="Anggota workspace dapat menyunting isi catatan ini secara realtime." onClose={() => !busy && setNewNoteOpen(false)}><form action={submitNote} aria-busy={busy} className="mt-6 space-y-5"><label className="block text-sm font-semibold text-[#315452]">Judul catatan<input required name="title" minLength={1} maxLength={200} className="mt-2 h-11 w-full rounded-xl border border-[#dce5e4] px-3 text-sm outline-none focus:border-[#137d79]" /></label><button disabled={busy} className="h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Membuat..." : "Buat catatan"}</button></form></DialogFrame>}
    {inviteOpen && <DialogFrame title="Undang anggota" description="Masukkan email akun aktif. Undangan langsung memberi akses tanpa mengubah role atau divisi." onClose={() => !busy && setInviteOpen(false)}><form action={submitInvite} aria-busy={busy} className="mt-6 space-y-5"><label className="block text-sm font-semibold text-[#315452]">Email akun<input required type="email" name="email" className="mt-2 h-11 w-full rounded-xl border border-[#dce5e4] px-3 text-sm outline-none focus:border-[#137d79]" /></label><button disabled={busy} className="h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Menambahkan..." : "Tambah anggota"}</button></form></DialogFrame>}
    {renaming && <DialogFrame title="Ubah nama catatan" description="Nama terbaru akan terlihat oleh seluruh anggota workspace." onClose={() => !busy && setRenaming(undefined)} initialFocusRef={renameInputRef}><form action={submitRename} aria-busy={busy} className="mt-6 space-y-5"><label className="block text-sm font-semibold text-[#315452]">Nama catatan<input ref={renameInputRef} required name="title" minLength={1} maxLength={200} defaultValue={renaming.title} className="mt-2 h-11 w-full rounded-xl border border-[#dce5e4] px-3 text-sm outline-none focus:border-[#137d79]" /></label><button disabled={busy} className="h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Menyimpan..." : "Simpan nama"}</button></form></DialogFrame>}
    {deletingWorkspace && selectedWorkspace && <DialogFrame title="Hapus workspace?" description="Seluruh catatan, dokumen kolaboratif, dan akses anggota akan dihapus permanen." onClose={() => !busy && setDeletingWorkspace(false)} initialFocusRef={workspaceDeletionInputRef}><form action={deleteSelectedWorkspace} aria-busy={busy} className="mt-6 space-y-5"><p className="text-sm leading-6 text-[#667c7c]">Anda akan menghapus {notes.length} catatan dan mencabut akses {members.length} anggota. Ketik <strong className="font-semibold text-[#173c3a]">{selectedWorkspace.name}</strong> untuk mengonfirmasi.</p><label className="block text-sm font-semibold text-[#315452]">Nama workspace<input ref={workspaceDeletionInputRef} required name="workspaceName" minLength={2} maxLength={100} value={workspaceDeletionName} onChange={(event) => setWorkspaceDeletionName(event.target.value)} autoComplete="off" className="mt-2 h-11 w-full rounded-xl border border-[#dce5e4] px-3 text-sm outline-none focus:border-[#a34c3f]" /></label><button disabled={busy || workspaceDeletionName !== selectedWorkspace.name} className="h-11 rounded-xl bg-[#a34c3f] px-4 text-sm font-semibold text-white hover:bg-[#8b3c31] disabled:opacity-60">{busy ? "Menghapus..." : "Hapus workspace permanen"}</button></form></DialogFrame>}
    {deleting && <ConfirmDialog title="Hapus catatan?" description="Dokumen kolaboratif dan seluruh perubahan tersimpannya akan dihapus permanen." confirmLabel="Hapus catatan" confirming={busy} destructive onCancel={() => setDeleting(undefined)} onConfirm={deleteSelectedNote} />}
    {removingMember && <ConfirmDialog title="Hapus anggota?" description={`${removingMember.name} tidak lagi dapat membuka workspace ini.`} confirmLabel="Hapus anggota" confirming={busy} destructive onCancel={() => setRemovingMember(undefined)} onConfirm={removeMember} />}
  </div>;
}
