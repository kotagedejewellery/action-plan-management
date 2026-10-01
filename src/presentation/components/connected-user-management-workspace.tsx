"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import type { ActionPlanStatus, SafeUser } from "@/domain/models";
import { useFeedback } from "./feedback";
import { Pencil, Plus, Search } from "./icons";
import { AccountStatus, ConfirmDialog, DialogFrame, PageHeading } from "./workspace-ui";

type UserInput = { name: string; email: string; role: "admin" | "user"; status: "active" | "inactive"; password?: string };

export function ConnectedUserManagementWorkspace({ initialUsers, initialStatuses }: { initialUsers: SafeUser[]; initialStatuses: ActionPlanStatus[] }) {
  const { notify } = useFeedback();
  const [members, setMembers] = useState(initialUsers);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [query, setQuery] = useState("");
  const [editingMember, setEditingMember] = useState<SafeUser | "new" | null>(null);
  const filteredMembers = useMemo(() => members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase())), [members, query]);

  async function saveMember(input: UserInput, member?: SafeUser) {
    const response = await fetch(member ? `/api/users/${member.id}` : "/api/users", { method: member ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "User tidak dapat disimpan.");
    setMembers((current) => member ? current.map((item) => item.id === member.id ? body : item) : [...current, body]);
    setEditingMember(null);
    notify("success", member ? "User diperbarui" : "User ditambahkan", "Perubahan akses telah tersimpan.");
  }

  async function addStatus(label: string, isCompleted: boolean) {
    const response = await fetch("/api/statuses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ label, isCompleted }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "Status tidak dapat ditambahkan.");
    setStatuses((current) => [...current, body]);
    notify("success", "Status ditambahkan", body.isCompleted ? `Status ${body.label} akan memindahkan Action Plan ke Riwayat.` : `Status ${body.label} siap dipakai oleh seluruh User.`);
  }

  return <section className="w-full max-w-none"><PageHeading title="Users" description="Kelola akun, status akses, dan pilihan status Action Plan." action={<button onClick={() => setEditingMember("new")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]"><Plus className="size-4" />Tambah User</button>} /><div className="mt-8 flex justify-end border-y py-4"><label className="relative block w-full sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" /><span className="sr-only">Cari User</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" placeholder="Cari nama atau email" /></label></div><div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]"><tr><th className="px-5 py-3.5">USER</th><th className="px-5 py-3.5">ROLE</th><th className="px-5 py-3.5">STATUS</th><th className="px-5 py-3.5 text-right">AKSI</th></tr></thead><tbody>{filteredMembers.map((member) => <tr key={member.id} className="border-b last:border-0 hover:bg-[#fbfcfc]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#edf3f2] text-xs font-bold text-[#526d69]">{member.name.slice(0, 1).toUpperCase()}</span><div><p className="font-medium text-[#244542]">{member.name}</p><p className="mt-0.5 text-sm text-[#748886]">{member.email}</p></div></div></td><td className="px-5 py-4"><span className="rounded-full bg-[#f0f4f3] px-2.5 py-1 text-xs font-semibold text-[#526b68]">{member.role === "admin" ? "Admin" : "User"}</span></td><td className="px-5 py-4"><AccountStatus status={member.status} /></td><td className="px-5 py-4 text-right"><button onClick={() => setEditingMember(member)} className="inline-flex size-9 items-center justify-center rounded-lg text-[#4f6967] transition hover:bg-[#e8f3f1] hover:text-[#137d79]" aria-label={`Edit ${member.name}`}><Pencil className="size-4" /></button></td></tr>)}</tbody></table></div>{filteredMembers.length === 0 && <div className="p-10 text-center text-sm text-[#748886]">Tidak ada user yang ditemukan.</div>}</div><section className="mt-8 rounded-2xl border bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-lg font-semibold text-[#244542]">Status Action Plan</h2><p className="mt-1 text-sm text-[#748886]">Tambahkan pilihan status yang dapat dipakai oleh seluruh User.</p></div><StatusForm onAdd={addStatus} /></div><div className="mt-4 flex flex-wrap gap-2">{statuses.filter((status) => status.isActive).map((status) => <span key={status.id} className="rounded-full bg-[#edf3f2] px-3 py-1.5 text-sm font-medium text-[#35625e]">{status.label}</span>)}</div></section>{editingMember && <UserForm member={editingMember === "new" ? undefined : editingMember} onCancel={() => setEditingMember(null)} onSave={saveMember} />}</section>;
}

function StatusForm({ onAdd }: { onAdd: (label: string, isCompleted: boolean) => Promise<void> }) {
  const { notify } = useFeedback();
  const [label, setLabel] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(""); try { await onAdd(label, isCompleted); setLabel(""); setIsCompleted(false); } catch (caught) { const message = caught instanceof Error ? caught.message : "Status tidak dapat ditambahkan."; setError(message); notify("error", "Status belum ditambahkan", message); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="flex flex-col gap-2 sm:items-end"><div className="flex gap-2"><input value={label} onChange={(event) => setLabel(event.target.value)} required maxLength={50} className="h-10 rounded-xl border px-3 text-sm outline-none focus:border-[#137d79]" placeholder="Contoh: Tertunda" /><button disabled={saving} className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Menambah..." : "Tambah status"}</button></div><label className="flex items-center gap-2 text-xs text-[#667c7c]"><input type="checkbox" checked={isCompleted} onChange={(event) => setIsCompleted(event.target.checked)} className="size-4 rounded border-[#b8c9c7] text-[#137d79]" />Status selesai — pindahkan Action Plan ke Riwayat</label>{error && <p className="text-sm text-[#9a5b16]" role="alert">{error}</p>}</form>;
}

function UserForm({ member, onCancel, onSave }: { member?: SafeUser; onCancel: () => void; onSave: (input: UserInput, member?: SafeUser) => Promise<void> }) {
  const { notify } = useFeedback();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const [accessConfirmationOpen, setAccessConfirmationOpen] = useState(false);
  const [pendingInput, setPendingInput] = useState<UserInput | null>(null);
  const [accessChanges, setAccessChanges] = useState<string[]>([]);

  const requestClose = () => {
    if (dirty && !saving) setDiscardConfirmationOpen(true);
    else onCancel();
  };

  async function persist(input: UserInput) {
    setSaving(true);
    setError("");
    try { await onSave(input, member); setDirty(false); }
    catch (caught) { const message = caught instanceof Error ? caught.message : "User tidak dapat disimpan."; setError(message); notify("error", "User belum tersimpan", message); }
    finally { setSaving(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    if (!member && !password) { setError("Password wajib diisi untuk user baru."); notify("error", "Password wajib diisi", "Masukkan password untuk akun baru."); return; }
    if (password && password !== confirmPassword) { setError("Konfirmasi password tidak sama."); notify("error", "Konfirmasi password berbeda", "Ulangi password yang sama."); return; }
    const input: UserInput = { name: String(data.get("name")), email: String(data.get("email")), role: data.get("role") as UserInput["role"], status: data.get("status") as UserInput["status"], password: password || undefined };
    const changes = member ? [input.role !== member.role && `Role berubah dari ${member.role === "admin" ? "Admin" : "User"} menjadi ${input.role === "admin" ? "Admin" : "User"}.`, input.status !== member.status && (input.status === "inactive" ? "Akun akan dinonaktifkan dan tidak dapat login." : "Akun akan diaktifkan kembali."), Boolean(input.password) && "Password akun akan diganti."].filter((change): change is string => Boolean(change)) : [];
    if (changes.length > 0) { setPendingInput(input); setAccessChanges(changes); setAccessConfirmationOpen(true); return; }
    await persist(input);
  }

  return <><DialogFrame title={member ? "Edit User" : "Tambah User"} description="Atur role, status akses, dan password akun internal." onClose={requestClose}><form onSubmit={submit} onChange={() => setDirty(true)} className="mt-6 space-y-4"><UserField label="Nama"><input name="name" required defaultValue={member?.name} placeholder="Nama lengkap" /></UserField><UserField label="Email"><input name="email" required type="email" defaultValue={member?.email} placeholder="nama@perusahaan.com" /></UserField><div className="grid gap-4 sm:grid-cols-2"><UserField label={member ? "Password baru" : "Password"}><input name="password" type="password" autoComplete="new-password" required={!member} minLength={8} placeholder={member ? "Kosongkan bila tidak diubah" : "Minimal 8 karakter"} /></UserField><UserField label="Konfirmasi password"><input name="confirmPassword" type="password" autoComplete="new-password" required={!member} minLength={8} placeholder={member ? "Ulangi bila mengubah password" : "Ulangi password"} /></UserField></div><p className="text-xs leading-5 text-[#748886]">{member ? "Isi kedua field hanya untuk mengganti password. Password lama tidak ditampilkan." : "Gunakan minimal 8 karakter."}</p><div className="grid gap-4 sm:grid-cols-2"><UserField label="Role"><select name="role" defaultValue={member?.role ?? "user"}><option value="user">User</option><option value="admin">Admin</option></select></UserField><UserField label="Status"><select name="status" defaultValue={member?.status ?? "active"}><option value="active">Active</option><option value="inactive">Inactive</option></select></UserField></div>{error && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={requestClose} disabled={saving} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60">Batal</button><button disabled={saving} className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan User"}</button></div></form></DialogFrame>{discardConfirmationOpen && <ConfirmDialog title="Batalkan perubahan?" description="Perubahan User yang belum disimpan akan hilang." confirmLabel="Batalkan perubahan" onCancel={() => setDiscardConfirmationOpen(false)} onConfirm={onCancel} />}{accessConfirmationOpen && <ConfirmDialog title="Simpan perubahan akses?" description={<ul className="list-disc space-y-1 pl-5">{accessChanges.map((change) => <li key={change}>{change}</li>)}</ul>} confirmLabel="Simpan perubahan" confirming={saving} onCancel={() => { setAccessConfirmationOpen(false); setPendingInput(null); }} onConfirm={() => { if (pendingInput) { setAccessConfirmationOpen(false); void persist(pendingInput); } }} />}</>;
}

function UserField({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm font-medium text-[#294846]"><span>{label}</span><span className="mt-2 block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#137d79] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select:focus]:border-[#137d79]">{children}</span></label>; }
