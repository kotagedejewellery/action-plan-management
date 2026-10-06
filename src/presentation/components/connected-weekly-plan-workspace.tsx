"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import type { ActionPlan, WeeklyPlan } from "@/domain/models";
import { bangkokDate } from "@/lib/bangkok-date";
import { useFeedback } from "./feedback";
import { Plus } from "./icons";
import { ConfirmDialog, DialogFrame, PageHeading, StatusBadge } from "./workspace-ui";

type WeeklyStats = { children: ActionPlan[]; completed: number; total: number };

function displayDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(value + "T00:00:00"));
}

function currentWeek() {
  const [year, month, day] = bangkokDate().split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function weekStart(value: string) {
  const match = /^(\d{4})-W(\d{2})$/.exec(value);
  if (!match) return "";
  const januaryFourth = new Date(Date.UTC(Number(match[1]), 0, 4));
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - ((januaryFourth.getUTCDay() + 6) % 7) + (Number(match[2]) - 1) * 7);
  return monday.toISOString().slice(0, 10);
}

function mondayThisWeek() {
  return weekStart(currentWeek());
}

function weeklyStatus(plan: WeeklyPlan, stats: WeeklyStats, today: string) {
  if (stats.total > 0 && stats.completed === stats.total) return { label: "Selesai", className: "bg-[#dff3e6] text-[#206b43]" };
  if (plan.weekEnd < today) return { label: "Perlu perhatian", className: "bg-[#fff1d7] text-[#9a5b16]" };
  if (stats.completed > 0) return { label: "Dalam progres", className: "bg-[#e5efff] text-[#265b9b]" };
  return { label: "Belum dimulai", className: "bg-[#eef3f2] text-[#59706f]" };
}

export function ConnectedWeeklyPlanWorkspace({ initialWeeklyPlans, initialActionPlans, statusOptions, completedStatusLabels, today }: { initialWeeklyPlans: WeeklyPlan[]; initialActionPlans: ActionPlan[]; statusOptions: string[]; completedStatusLabels: string[]; today: string }) {
  const { notify } = useFeedback();
  const [weeklyPlans, setWeeklyPlans] = useState(initialWeeklyPlans);
  const [actionPlans, setActionPlans] = useState(initialActionPlans);
  const [creating, setCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWeeklyPlan, setEditingWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [archivingWeeklyPlan, setArchivingWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [updating, setUpdating] = useState(false);

  const planStats = useMemo(() => new Map(weeklyPlans.map((weeklyPlan) => {
    const children = actionPlans.filter((plan) => plan.weeklyPlanId === weeklyPlan.id && !plan.deletedAt).sort((a, b) => a.date.localeCompare(b.date));
    const plannedIds = new Set(weeklyPlan.plannedActionPlanIds);
    const additionalChildren = children.filter((plan) => !plannedIds.has(plan.id));
    const completed = children.filter((plan) => Boolean(plan.afternoonStatus && completedStatusLabels.includes(plan.afternoonStatus))).length;
    const total = weeklyPlan.plannedActionPlanIds.length ? weeklyPlan.plannedActionPlanIds.length + additionalChildren.length : children.length;
    return [weeklyPlan.id, { children, total, completed } satisfies WeeklyStats];
  })), [actionPlans, completedStatusLabels, weeklyPlans]);

  async function createWeeklyPlan(input: { title: string; weekStart: string; weekdays: number[]; morningStatus: string; note?: string }) {
    setCreating(true);
    try {
      const response = await fetch("/api/weekly-plans", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Rencana mingguan tidak dapat dibuat.");
      setWeeklyPlans((current) => [body.weeklyPlan, ...current]);
      setActionPlans((current) => [...body.actionPlans, ...current]);
      setFormOpen(false);
      notify("success", "Rencana mingguan dibuat", `${body.actionPlans.length} Action Plan harian telah disiapkan.`);
    } catch (error) {
      notify("error", "Rencana mingguan belum dibuat", error instanceof Error ? error.message : "Silakan coba lagi.");
      throw error;
    } finally {
      setCreating(false);
    }
  }

  async function updateWeeklyPlan(input: { title: string; note?: string; updatedAt?: string }) {
    if (!editingWeeklyPlan) return;
    setUpdating(true);
    try {
      const response = await fetch("/api/weekly-plans/" + editingWeeklyPlan.id, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...input, updatedAt: editingWeeklyPlan.updatedAt }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Rencana mingguan tidak dapat diperbarui.");
      setWeeklyPlans((current) => current.map((plan) => plan.id === body.id ? body : plan));
      setEditingWeeklyPlan(null);
      notify("success", "Rencana mingguan diperbarui", "Target dan catatan telah disimpan. Action Plan harian tidak berubah.");
    } catch (error) {
      notify("error", "Rencana mingguan belum diperbarui", error instanceof Error ? error.message : "Silakan coba lagi.");
      throw error;
    } finally {
      setUpdating(false);
    }
  }

  async function archiveWeeklyPlan() {
    if (!archivingWeeklyPlan) return;
    setUpdating(true);
    try {
      const response = await fetch("/api/weekly-plans/" + archivingWeeklyPlan.id, { method: "DELETE" });
      if (!response.ok) { const body = await response.json(); throw new Error(body.error ?? "Rencana mingguan tidak dapat diarsipkan."); }
      setWeeklyPlans((current) => current.filter((plan) => plan.id !== archivingWeeklyPlan.id));
      setArchivingWeeklyPlan(null);
      notify("success", "Rencana mingguan dihapus permanen", "Seluruh Action Plan harian yang terhubung juga telah dihapus permanen.");
    } catch (error) {
      notify("error", "Rencana mingguan belum diarsipkan", error instanceof Error ? error.message : "Silakan coba lagi.");
    } finally {
      setUpdating(false);
    }
  }

  return <section className="w-full max-w-none">
    <PageHeading title="Rencana Mingguan" description="Kelompokkan target kerja mingguan dan pantau progres Action Plan harian yang terhubung." action={<button type="button" onClick={() => setFormOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]"><Plus className="size-4" />Tambah Rencana Mingguan</button>} />
    <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
      {weeklyPlans.length === 0 ? <div className="p-12 text-center"><p className="font-semibold text-[#294846]">Belum ada rencana mingguan.</p><p className="mt-1 text-sm text-[#748886]">Buat rencana untuk menyiapkan Action Plan harian dalam satu minggu kerja.</p></div> : <div className="divide-y">{weeklyPlans.map((weeklyPlan) => {
        const stats = planStats.get(weeklyPlan.id) ?? { children: [], total: 0, completed: 0 };
        return <article key={weeklyPlan.id} className="px-5 py-5 sm:px-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h2 className="font-semibold text-[#244542]">{weeklyPlan.title}</h2><p className="mt-1 text-sm text-[#748886]">{displayDate(weeklyPlan.weekStart)} – {displayDate(weeklyPlan.weekEnd)}</p>{weeklyPlan.note && <p className="mt-3 text-sm leading-6 text-[#617876]">{weeklyPlan.note}</p>}</div><div className="flex items-center gap-2"><p className="shrink-0 text-sm font-semibold tabular-nums text-[#176d69]">{stats.completed} / {stats.total} selesai</p><button type="button" onClick={() => setEditingWeeklyPlan(weeklyPlan)} className="rounded-lg px-2 py-1 text-sm font-semibold text-[#176d69] hover:bg-[#e8f3f1]">Edit</button><button type="button" onClick={() => setArchivingWeeklyPlan(weeklyPlan)} className="rounded-lg px-2 py-1 text-sm font-semibold text-[#9a4639] hover:bg-[#f9ece9]">Hapus</button></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8eeee]"><div className="h-full rounded-full bg-[#137d79] transition-[width] duration-300" style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }} /></div></article>;
      })}</div>}
    </div>
    {weeklyPlans.length > 0 && <section className="mt-6" aria-label="Rincian Action Plan mingguan"><h2 className="text-lg font-semibold text-[#244542]">Rincian Action Plan</h2><div className="mt-3 divide-y overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">{weeklyPlans.map((weeklyPlan) => { const stats = planStats.get(weeklyPlan.id) ?? { children: [], total: 0, completed: 0 }; const status = weeklyStatus(weeklyPlan, stats, today); return <details key={weeklyPlan.id} className="group px-5 py-4 sm:px-6"><summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3"><span className="font-semibold text-[#294846]">{weeklyPlan.title}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span></summary><div className="mt-4 divide-y rounded-xl border">{stats.children.map((plan) => <div key={plan.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-[#294846]">{plan.task}</p><p className="mt-1 text-xs text-[#748886]">{displayDate(plan.date)}</p></div><div className="flex flex-wrap gap-2"><StatusBadge status={plan.morningStatus} /><StatusBadge status={plan.afternoonStatus} /></div></div>)}{stats.children.length === 0 && <p className="px-4 py-3 text-sm text-[#748886]">Belum ada Action Plan yang terhubung.</p>}</div><Link href="/action-plans" className="mt-4 inline-flex text-sm font-semibold text-[#137d79] hover:underline">Kelola Action Plan aktif</Link></details>; })}</div></section>}
    {formOpen && <WeeklyPlanForm statusOptions={statusOptions} saving={creating} onCancel={() => setFormOpen(false)} onSave={createWeeklyPlan} />}
    {editingWeeklyPlan && <WeeklyPlanEditForm plan={editingWeeklyPlan} saving={updating} onCancel={() => setEditingWeeklyPlan(null)} onSave={updateWeeklyPlan} />}
    {archivingWeeklyPlan && <ConfirmDialog title="Hapus rencana mingguan secara permanen?" description="Rencana mingguan dan seluruh Action Plan harian yang terhubung akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus permanen" confirming={updating} destructive onCancel={() => setArchivingWeeklyPlan(null)} onConfirm={() => void archiveWeeklyPlan()} />}
  </section>;
}

function WeeklyPlanForm({ statusOptions, saving, onCancel, onSave }: { statusOptions: string[]; saving: boolean; onCancel: () => void; onSave: (input: { title: string; weekStart: string; weekdays: number[]; morningStatus: string; note?: string }) => Promise<void> }) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await onSave({ title: String(data.get("title")), weekStart: String(data.get("weekStart")), weekdays: data.getAll("weekdays").map(Number), morningStatus: String(data.get("morningStatus")), note: String(data.get("note")) || undefined });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rencana mingguan tidak dapat disimpan.");
    }
  }
  return <DialogFrame title="Tambah Rencana Mingguan" description="Sistem akan membuat Action Plan harian untuk hari kerja yang Anda pilih." onClose={saving ? () => undefined : onCancel}><form onSubmit={submit} className="mt-6 space-y-4"><Field label="Target Mingguan"><textarea name="title" required placeholder="Contoh: Follow up pelanggan prioritas" rows={3} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Mulai Minggu (Senin)"><input name="weekStart" type="date" required defaultValue={mondayThisWeek()} /></Field><Field label="Status Pagi Awal"><select name="morningStatus" required defaultValue={statusOptions[0]}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></Field></div><fieldset><legend className="text-sm font-medium text-[#294846]">Hari kerja</legend><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{[["1", "Senin"], ["2", "Selasa"], ["3", "Rabu"], ["4", "Kamis"], ["5", "Jumat"]].map(([value, label]) => <label key={value} className="inline-flex items-center gap-2 text-sm text-[#59706f]"><input type="checkbox" name="weekdays" value={value} defaultChecked />{label}</label>)}</div></fieldset><Field label="Catatan"><textarea name="note" placeholder="Konteks atau hasil yang diharapkan (opsional)" rows={2} /></Field>{error && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60">Batal</button><button disabled={saving || statusOptions.length === 0} className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60">{saving ? "Membuat..." : "Buat Action Plan"}</button></div></form></DialogFrame>;
}

function WeeklyPlanEditForm({ plan, saving, onCancel, onSave }: { plan: WeeklyPlan; saving: boolean; onCancel: () => void; onSave: (input: { title: string; note?: string; updatedAt?: string }) => Promise<void> }) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try { await onSave({ title: String(data.get("title")), note: String(data.get("note")) || undefined }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Rencana mingguan tidak dapat disimpan."); }
  }
  return <DialogFrame title="Edit Rencana Mingguan" description="Perubahan tidak mengubah Action Plan harian yang sudah dibuat." onClose={saving ? () => undefined : onCancel}><form onSubmit={submit} className="mt-6 space-y-4"><Field label="Target Mingguan"><textarea name="title" required defaultValue={plan.title} rows={3} /></Field><Field label="Catatan"><textarea name="note" defaultValue={plan.note} rows={2} /></Field>{error && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60">Batal</button><button disabled={saving} className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button></div></form></DialogFrame>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-[#294846]"><span>{label}</span><span className="mt-2 block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#137d79] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select:focus]:border-[#137d79] [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:p-3 [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea:focus]:border-[#137d79]">{children}</span></label>;
}
