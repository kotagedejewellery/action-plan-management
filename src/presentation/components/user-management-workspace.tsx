"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { teamMembers, type TeamMember } from "@/presentation/data/demo-data";
import { Pencil, Plus, Search } from "./icons";
import { AccountStatus, DialogFrame, PageHeading } from "./workspace-ui";

export function UserManagementWorkspace() {
  const [members, setMembers] = useState(teamMembers);
  const [query, setQuery] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null | "new">(null);
  const filteredMembers = members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()));
  const saveMember = (member: TeamMember) => { setMembers((current) => current.some((item) => item.id === member.id) ? current.map((item) => item.id === member.id ? member : item) : [...current, member]); setEditingMember(null); };
  return <section className="w-full max-w-none"><PageHeading title="Users" description="Kelola akun yang dapat mengakses Action Plan workspace." action={<button onClick={() => setEditingMember("new")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]"><Plus className="size-4" />Tambah User</button>} /><div className="mt-8 flex justify-end border-y py-4"><label className="relative block w-full sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" /><span className="sr-only">Cari User</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" placeholder="Cari nama atau email" /></label></div><div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]"><tr><th className="px-5 py-3.5">USER</th><th className="px-5 py-3.5">ROLE</th><th className="px-5 py-3.5">STATUS</th><th className="px-5 py-3.5 text-right">AKSI</th></tr></thead><tbody>{filteredMembers.map((member) => <tr key={member.id} className="border-b last:border-0 hover:bg-[#fbfcfc]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#edf3f2] text-xs font-bold text-[#526d69]">{member.initials}</span><div><p className="font-medium text-[#244542]">{member.name}</p><p className="mt-0.5 text-sm text-[#748886]">{member.email}</p></div></div></td><td className="px-5 py-4"><span className="rounded-full bg-[#f0f4f3] px-2.5 py-1 text-xs font-semibold text-[#526b68]">{member.role}</span></td><td className="px-5 py-4"><AccountStatus status={member.status} /></td><td className="px-5 py-4 text-right"><button onClick={() => setEditingMember(member)} className="inline-flex size-9 items-center justify-center rounded-lg text-[#4f6967] transition hover:bg-[#e8f3f1] hover:text-[#137d79]" aria-label={`Edit ${member.name}`}><Pencil className="size-4" /></button></td></tr>)}</tbody></table></div></div>{editingMember && <UserForm member={editingMember === "new" ? undefined : editingMember} onCancel={() => setEditingMember(null)} onSave={saveMember} />}</section>;
}

function UserForm({ member, onCancel, onSave }: { member?: TeamMember; onCancel: () => void; onSave: (member: TeamMember) => void }) {
  const [passwordError, setPasswordError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (!member && !password) {
      setPasswordError("Password wajib diisi untuk user baru.");
      return;
    }

    if (password && password.length < 8) {
      setPasswordError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak sama.");
      return;
    }

    setPasswordError("");
    const name = String(data.get("name"));
    onSave({ id: member?.id ?? `user-${Date.now()}`, initials: name.slice(0, 1).toUpperCase(), name, email: String(data.get("email")), role: data.get("role") as TeamMember["role"], status: data.get("status") as TeamMember["status"], planCount: member?.planCount ?? 0 });
  }

  return <DialogFrame title={member ? "Edit User" : "Tambah User"} description="Atur role, status akses, dan password akun internal." onClose={onCancel}><form onSubmit={submit} className="mt-6 space-y-4"><UserField label="Nama"><input name="name" required defaultValue={member?.name} placeholder="Nama lengkap" /></UserField><UserField label="Email"><input name="email" required type="email" defaultValue={member?.email} placeholder="nama@perusahaan.com" /></UserField><div className="grid gap-4 sm:grid-cols-2"><UserField label={member ? "Password baru" : "Password"}><input name="password" type="password" autoComplete="new-password" required={!member} minLength={8} placeholder={member ? "Kosongkan bila tidak diubah" : "Minimal 8 karakter"} /></UserField><UserField label="Konfirmasi password"><input name="confirmPassword" type="password" autoComplete="new-password" required={!member} minLength={8} placeholder={member ? "Ulangi bila mengubah password" : "Ulangi password"} /></UserField></div><p className="text-xs leading-5 text-[#748886]">{member ? "Isi kedua field hanya untuk mengganti password. Password lama tidak ditampilkan." : "Gunakan minimal 8 karakter. Password akan diproses aman saat integrasi login diaktifkan."}</p>{passwordError && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{passwordError}</p>}<div className="grid gap-4 sm:grid-cols-2"><UserField label="Role"><select name="role" defaultValue={member?.role ?? "User"}><option>User</option><option>Admin</option></select></UserField><UserField label="Status"><select name="status" defaultValue={member?.status ?? "Active"}><option>Active</option><option>Inactive</option></select></UserField></div><div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onCancel} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4]">Batal</button><button className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865]">Simpan User</button></div></form></DialogFrame>;
}

function UserField({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-sm font-medium text-[#294846]"><span>{label}</span><span className="mt-2 block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#137d79] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select:focus]:border-[#137d79]">{children}</span></label>; }
