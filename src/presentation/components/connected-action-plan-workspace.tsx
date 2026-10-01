"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { ActionPlan } from "@/domain/models";
import { useFeedback } from "./feedback";
import { ExternalLink, Pencil, Plus, Search, Trash } from "./icons";
import { ConfirmDialog, DialogFrame, PageHeading, StatusBadge } from "./workspace-ui";

type Draft = Omit<ActionPlan, "id" | "createdAt" | "updatedAt"> & { updatedAt?: string };
type View = "active" | "history";

function displayDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(value + "T00:00:00"));
}

function getWeekBounds(value: string) {
  const matched = /^(\d{4})-W(\d{2})$/.exec(value);
  if (!matched) return null;

  const year = Number(matched[1]);
  const week = Number(matched[2]);
  if (week < 1 || week > 53) return null;

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - ((januaryFourth.getUTCDay() + 6) % 7) + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return { from: monday.toISOString().slice(0, 10), to: sunday.toISOString().slice(0, 10) };
}

export function ConnectedActionPlanWorkspace({ initialPlans, statusOptions, completedStatusLabels, view = "active" }: { initialPlans: ActionPlan[]; statusOptions: string[]; completedStatusLabels: string[]; view?: View }) {
  const { notify } = useFeedback();
  const [plans, setPlans] = useState(initialPlans);
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null | "new">(null);
  const [deletingPlan, setDeletingPlan] = useState<ActionPlan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isHistory = view === "history";
  const weekBounds = useMemo(() => getWeekBounds(week), [week]);
  const filterFrom = weekBounds?.from ?? dateFrom;
  const filterTo = weekBounds?.to ?? dateTo;

  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const searchable = [plan.task, plan.note ?? "", plan.morningStatus, plan.afternoonStatus ?? ""].join(" ").toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (!filterFrom || plan.date >= filterFrom)
        && (!filterTo || plan.date <= filterTo);
    });
  }, [plans, query, filterFrom, filterTo]);

  async function save(plan: Draft, id?: string) {
    const response = await fetch(id ? "/api/action-plans/" + id : "/api/action-plans", { method: id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(plan) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "Action Plan tidak dapat disimpan.");
    const isCompleted = Boolean(body.afternoonStatus && completedStatusLabels.includes(body.afternoonStatus));
    const belongsInCurrentView = isHistory ? isCompleted : !isCompleted;
    setPlans((current) => belongsInCurrentView ? (id ? current.map((item) => item.id === id ? body : item) : [body, ...current]) : current.filter((item) => item.id !== id));
    setEditingPlan(null);
    notify("success", id ? "Action Plan diperbarui" : "Action Plan ditambahkan", isHistory && id ? "Perubahan tersimpan. Status yang tidak final akan tampil di Action Plan aktif." : "Perubahan telah tersimpan.");
  }

  async function removePlan() {
    if (!deletingPlan) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/action-plans/" + deletingPlan.id, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Action Plan tidak dapat dihapus.");
      }
      setPlans((current) => current.filter((plan) => plan.id !== deletingPlan.id));
      setDeletingPlan(null);
      notify("success", "Action Plan dihapus", "Data tidak lagi tampil di workspace dan tetap tersimpan untuk audit.");
    } catch (caught) {
      notify("error", "Action Plan belum dihapus", caught instanceof Error ? caught.message : "Action Plan tidak dapat dihapus.");
    } finally {
      setDeleting(false);
    }
  }

  const title = isHistory ? "Riwayat" : "Action Plan";
  const description = isHistory ? "Lihat dan kelola Action Plan yang sudah diselesaikan." : "Kelola rencana kerja dan pembaruan progres Anda di satu tempat.";
  const hasFilters = Boolean(query || week || dateFrom || dateTo);
  const resetFilters = () => {
    setQuery("");
    setWeek("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <section className="w-full max-w-none">
      <PageHeading
        title={title}
        description={description}
        action={!isHistory ? <button onClick={() => setEditingPlan("new")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]"><Plus className="size-4" />Tambah Action Plan</button> : undefined}
      />
      <div className="mt-8 flex flex-col gap-3 border-y border-[#dce5e4] py-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-end">
          <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]"><span>MINGGU</span><input type="week" value={week} onChange={(event) => { setWeek(event.target.value); setDateFrom(""); setDateTo(""); }} className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40" /></label>
          <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]"><span>TANGGAL DARI</span><input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => { setDateFrom(event.target.value); setWeek(""); }} className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40" /></label>
          <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]"><span>TANGGAL SAMPAI</span><input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => { setDateTo(event.target.value); setWeek(""); }} className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40" /></label>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <label className="relative block min-w-0 flex-1 sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" /><span className="sr-only">Cari Action Plan, catatan, atau status</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" placeholder="Cari Action Plan atau status" /></label>
          {hasFilters && <button type="button" onClick={resetFilters} className="h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-[#59706f] hover:bg-[#eef4f3]">Reset</button>}
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]"><tr><th className="px-5 py-3.5">TANGGAL</th><th className="px-5 py-3.5">ACTION PLAN</th><th className="px-5 py-3.5">STATUS PAGI</th><th className="px-5 py-3.5">STATUS SORE</th><th className="px-5 py-3.5">HASIL</th><th className="px-5 py-3.5 text-right">AKSI</th></tr></thead>
            <tbody>{filteredPlans.map((plan) => <tr key={plan.id} className="border-b last:border-0 hover:bg-[#fbfcfc]"><td className="whitespace-nowrap px-5 py-4 text-sm text-[#627876]">{displayDate(plan.date)}</td><td className="max-w-sm px-5 py-4"><p className="font-medium text-[#234441]">{plan.task}</p>{plan.note && <p className="mt-1 truncate text-sm text-[#7c8f8d]">{plan.note}</p>}</td><td className="px-5 py-4"><StatusBadge status={plan.morningStatus} /></td><td className="px-5 py-4"><StatusBadge status={plan.afternoonStatus} /></td><td className="px-5 py-4">{plan.resultLink ? <a className="inline-flex items-center gap-1.5 text-sm font-medium text-[#137d79] hover:underline" href={plan.resultLink} target="_blank" rel="noreferrer">Buka link <ExternalLink className="size-3.5" /></a> : <span className="text-sm text-[#9aa9a8]">Belum ada</span>}</td><td className="px-5 py-4 text-right"><div className="inline-flex gap-1"><button onClick={() => setEditingPlan(plan)} className="inline-flex size-9 items-center justify-center rounded-lg text-[#4f6967] transition hover:bg-[#e8f3f1] hover:text-[#137d79]" aria-label={"Edit " + plan.task}><Pencil className="size-4" /></button><button onClick={() => setDeletingPlan(plan)} className="inline-flex size-9 items-center justify-center rounded-lg text-[#7d5a54] transition hover:bg-[#f9ece9] hover:text-[#9a4639]" aria-label={"Hapus " + plan.task}><Trash className="size-4" /></button></div></td></tr>)}</tbody>
          </table>
        </div>
        <div className="divide-y md:hidden">{filteredPlans.map((plan) => <article key={plan.id} className="p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-[#748886]">{displayDate(plan.date)}</p><h2 className="mt-1 font-semibold leading-6 text-[#234441]">{plan.task}</h2></div><div className="flex shrink-0 gap-1"><button onClick={() => setEditingPlan(plan)} className="grid size-9 place-items-center rounded-lg border text-[#4f6967]" aria-label={"Edit " + plan.task}><Pencil className="size-4" /></button><button onClick={() => setDeletingPlan(plan)} className="grid size-9 place-items-center rounded-lg border text-[#7d5a54]" aria-label={"Hapus " + plan.task}><Trash className="size-4" /></button></div></div><div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={plan.morningStatus} /><StatusBadge status={plan.afternoonStatus} /></div>{plan.note && <p className="mt-3 text-sm leading-6 text-[#748886]">{plan.note}</p>}</article>)}</div>
        {filteredPlans.length === 0 && <div className="p-12 text-center"><p className="font-semibold text-[#294846]">{hasFilters ? "Tidak ada Action Plan yang sesuai filter." : isHistory ? "Belum ada Action Plan selesai." : "Belum ada Action Plan."}</p><p className="mt-1 text-sm text-[#748886]">{hasFilters ? "Ubah kata kunci, minggu, atau rentang tanggal, lalu coba lagi." : isHistory ? "Action Plan akan muncul di sini saat Status Sore ditandai sebagai selesai." : "Tambah Action Plan untuk memulai pencatatan."}</p></div>}
      </div>
      {editingPlan && <PlanForm plan={editingPlan === "new" ? undefined : editingPlan} statusOptions={statusOptions} onCancel={() => setEditingPlan(null)} onSave={save} />}
      {deletingPlan && <ConfirmDialog title="Hapus Action Plan?" description={"Action Plan " + deletingPlan.task + " pada " + displayDate(deletingPlan.date) + " tidak lagi tampil di aplikasi. Data tetap disimpan untuk audit."} confirmLabel="Hapus Action Plan" confirming={deleting} destructive onCancel={() => setDeletingPlan(null)} onConfirm={() => void removePlan()} />}
    </section>
  );
}

function PlanForm({ plan, statusOptions, onCancel, onSave }: { plan?: ActionPlan; statusOptions: string[]; onCancel: () => void; onSave: (plan: Draft, id?: string) => Promise<void> }) {
  const { notify } = useFeedback(); const [error, setError] = useState(""); const [saving, setSaving] = useState(false); const [dirty, setDirty] = useState(false); const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const requestClose = () => { if (dirty && !saving) setDiscardConfirmationOpen(true); else onCancel(); };
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setError(""); const data = new FormData(event.currentTarget); try { await onSave({ date: String(data.get("date")), task: String(data.get("task")), morningStatus: String(data.get("morningStatus")), afternoonStatus: String(data.get("afternoonStatus")) || undefined, resultLink: String(data.get("resultLink")) || undefined, note: String(data.get("note")) || undefined, updatedAt: plan?.updatedAt }, plan?.id); setDirty(false); } catch (caught) { const message = caught instanceof Error ? caught.message : "Action Plan tidak dapat disimpan."; setError(message); notify("error", "Action Plan belum tersimpan", message); } finally { setSaving(false); } }
  return <><DialogFrame title={plan ? "Edit Action Plan" : "Tambah Action Plan"} description="Simpan progres agar mudah dipantau kembali." onClose={requestClose}><form onSubmit={submit} onChange={() => setDirty(true)} className="mt-6 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Tanggal"><input name="date" type="date" required defaultValue={plan?.date ?? new Date().toISOString().slice(0, 10)} /></Field><Field label="Status Pagi"><select name="morningStatus" required defaultValue={plan?.morningStatus ?? statusOptions[0]}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></Field></div><Field label="Action Plan"><textarea name="task" required defaultValue={plan?.task} placeholder="Jelaskan pekerjaan yang akan dilakukan" rows={3} /></Field><Field label="Status Sore"><select name="afternoonStatus" defaultValue={plan?.afternoonStatus ?? ""}><option value="">Belum diperbarui</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></Field><Field label="Link Hasil"><input name="resultLink" type="url" defaultValue={plan?.resultLink} placeholder="https://..." /></Field><Field label="Catatan"><textarea name="note" defaultValue={plan?.note} placeholder="Tambahkan konteks bila diperlukan" rows={2} /></Field>{error && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={requestClose} disabled={saving} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60">Batal</button><button disabled={saving || statusOptions.length === 0} className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Action Plan"}</button></div></form></DialogFrame>{discardConfirmationOpen && <ConfirmDialog title="Batalkan perubahan?" description="Perubahan Action Plan yang belum disimpan akan hilang." confirmLabel="Batalkan perubahan" onCancel={() => setDiscardConfirmationOpen(false)} onConfirm={onCancel} />}</>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-[#294846]"><span>{label}</span><span className="mt-2 block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#137d79] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select:focus]:border-[#137d79] [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:p-3 [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea:focus]:border-[#137d79]">{children}</span></label>;
}
