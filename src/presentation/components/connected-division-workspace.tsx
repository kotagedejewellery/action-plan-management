"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Division, SafeUser } from "@/domain/models";
import { useFeedback } from "./feedback";
import { AccountStatus, ConfirmDialog, DialogFrame, PageHeading } from "./workspace-ui";

const field = "mt-2 block h-11 w-full rounded-xl border bg-white px-3 text-sm";
const button = "min-h-11 rounded-xl border bg-white px-4 text-sm font-semibold text-[#176d69] disabled:opacity-60";

export function ConnectedDivisionWorkspace({ initialDivisions, initialEditingId, users }: { initialDivisions: Division[]; initialEditingId?: string; users: SafeUser[] }) {
  const [divisions, setDivisions] = useState(initialDivisions);
  const [editing, setEditing] = useState<Division | "new" | null>(() => initialDivisions.find((division) => division.id === initialEditingId) ?? null);
  const { notify } = useFeedback();
  const unmapped = users.filter((user) => Boolean(user.sheetName) && !user.divisionId).length;
  async function save(input: Pick<Division, "name" | "status" | "bodUserId" | "approvalRequired"> & { updatedAt?: string }, existing?: Division) {
    const response = await fetch(existing ? `/api/divisions/${existing.id}` : "/api/divisions", { method: existing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "Divisi belum dapat disimpan.");
    setDivisions((current) => existing ? current.map((item) => item.id === existing.id ? body : item) : [...current, body]);
    setEditing(null);
    notify("success", "Divisi tersimpan", "Penugasan dan akses divisi telah diperbarui.");
  }
  async function toggleApproval(division: Division) {
    if (!window.confirm(`${division.approvalRequired ? "Nonaktifkan" : "Aktifkan"} approval hasil Action Plan untuk ${division.name}?`)) return;
    try {
      await save({ name: division.name, status: division.status, bodUserId: division.bodUserId, approvalRequired: !division.approvalRequired, updatedAt: division.updatedAt }, division);
    } catch (caught) { notify("error", "Aturan approval belum diubah", caught instanceof Error ? caught.message : "Coba lagi."); }
  }
  return <section><PageHeading title="Divisi" description="Tetapkan satu BOD untuk setiap divisi. Akun dan penugasan dikelola oleh SuperAdmin." action={<button type="button" className="min-h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865]" onClick={() => setEditing("new")}>Tambah divisi</button>} />
    <p className="mt-6 text-sm leading-6 text-[#516967]">Buat akun ber-role BOD di <Link href="/users" className="font-semibold text-[#137d79] underline underline-offset-4">Users</Link>, lalu tugaskan ke divisi. {unmapped > 0 && <span>{unmapped} akun memiliki riwayat pekerjaan yang belum dipetakan.</span>}</p>
    <div className="mt-6 divide-y rounded-2xl border bg-white">{divisions.map((division) => <article key={division.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="min-w-0 flex-1"><h2 className="break-words text-lg font-semibold text-[#173c3a]">{division.name}</h2><p className="mt-1 text-sm text-[#516967]">BOD: {users.find((user) => user.id === division.bodUserId)?.name ?? "Belum ditugaskan"}</p><p className="mt-1 text-sm text-[#516967]">{users.filter((user) => user.divisionId === division.id && user.sheetName).length} anggota dengan data pekerjaan{division.approvalRequired ? " · Approval aktif" : ""}</p></div><AccountStatus status={division.status} /><div className="flex flex-wrap gap-2"><button className={button} onClick={() => void toggleApproval(division)}>{division.approvalRequired ? "Nonaktifkan approval" : "Aktifkan approval"}</button><button className={button} onClick={() => setEditing(division)} aria-label={`Kelola ${division.name}`}>Kelola</button></div></article>)}{!divisions.length && <div className="p-6 text-sm leading-6 text-[#516967]">Belum ada divisi. Tambahkan divisi dan BOD, lalu petakan akun lama melalui halaman Users. Data lama tetap tersimpan.</div>}</div>
    {editing && <DivisionForm division={editing === "new" ? undefined : editing} divisions={divisions} users={users} onCancel={() => setEditing(null)} onSave={save} />}
  </section>;
}

function DivisionForm({ division, divisions, users, onCancel, onSave }: { division?: Division; divisions: Division[]; users: SafeUser[]; onCancel: () => void; onSave: (input: Pick<Division, "name" | "status" | "bodUserId" | "approvalRequired"> & { updatedAt?: string }, existing?: Division) => Promise<void> }) {
  const [name, setName] = useState(division?.name ?? "");
  const [bodUserId, setBodUserId] = useState(division?.bodUserId ?? "");
  const [status, setStatus] = useState<Division["status"]>(division?.status ?? "inactive");
  const [approvalRequired] = useState(Boolean(division?.approvalRequired));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [discard, setDiscard] = useState(false);
  const dirty = name !== (division?.name ?? "") || bodUserId !== (division?.bodUserId ?? "") || status !== (division?.status ?? "inactive") || approvalRequired !== Boolean(division?.approvalRequired);
  const close = () => { if (saving) return; if (dirty) setDiscard(true); else onCancel(); };
  const candidates = users.filter((user) => user.role === "bod" && user.status === "active" && (!user.divisionId || user.divisionId === division?.id) && !divisions.some((item) => item.id !== division?.id && item.bodUserId === user.id));
  async function persist() {
    setConfirming(false); setSaving(true); setError("");
    try { await onSave({ name, bodUserId, status, approvalRequired, updatedAt: division?.updatedAt }, division); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Divisi belum dapat disimpan."); }
    finally { setSaving(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); setConfirming(true); }
  return <><DialogFrame title={division ? "Kelola divisi" : "Tambah divisi"} description="Divisi aktif wajib memiliki satu BOD aktif. Satu BOD hanya menangani satu divisi." onClose={close}><form onSubmit={submit} className="mt-6 space-y-4" aria-busy={saving}><fieldset disabled={saving} className="space-y-4"><label className="block text-sm font-medium text-[#294846]">Nama divisi<input className={field} value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={100} /></label><label className="block text-sm font-medium text-[#294846]">BOD penanggung jawab<select className={field} value={bodUserId} onChange={(event) => setBodUserId(event.target.value)} required={status === "active"}><option value="">Belum ditugaskan</option>{candidates.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select></label>{!candidates.length && <p className="text-sm text-[#516967]">Belum ada BOD yang tersedia. Simpan divisi nonaktif, lalu buat akun BOD di halaman Users.</p>}<label className="block text-sm font-medium text-[#294846]">Status divisi<select className={field} value={status} onChange={(event) => setStatus(event.target.value as Division["status"])}><option value="inactive">Nonaktif</option><option value="active">Aktif</option></select></label><p className="text-sm leading-6 text-[#516967]">Divisi nonaktif menutup akses BOD dan pengisian pekerjaan anggotanya. Riwayat tetap tersimpan.</p></fieldset>{error && <p role="alert" className="rounded-xl bg-[#fff1d7] p-3 text-sm text-[#9a5b16]">{error}</p>}<div className="flex justify-end gap-3 border-t pt-5"><button type="button" className={button} disabled={saving} onClick={close}>Batal</button><button className="min-h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={saving || !dirty}>{saving ? "Menyimpan…" : "Simpan divisi"}</button></div></form></DialogFrame>{confirming && <ConfirmDialog title="Simpan akses divisi?" description={<div className="space-y-2"><p>{name} akan berstatus {status === "active" ? "aktif" : "nonaktif"}, dengan BOD {users.find((user) => user.id === bodUserId)?.name ?? "belum ditugaskan"}.</p>{division?.bodUserId !== bodUserId && division?.bodUserId && <p>BOD sebelumnya akan kehilangan akses ke divisi ini.</p>}</div>} confirmLabel="Simpan perubahan" onCancel={() => setConfirming(false)} onConfirm={() => void persist()} />}{discard && <ConfirmDialog title="Batalkan perubahan divisi?" description="Perubahan yang belum disimpan akan hilang." confirmLabel="Batalkan perubahan" onCancel={() => setDiscard(false)} onConfirm={onCancel} />}</>;
}
