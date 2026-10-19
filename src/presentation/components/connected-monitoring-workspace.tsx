"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { dashboardPeriodInputSchema } from "@/application/schemas";
import type { ActionPlan, SafeUser } from "@/domain/models";
import { bangkokDate } from "@/lib/bangkok-date";
import { useFeedback } from "./feedback";
import { ExternalLink, Search } from "./icons";
import { MonitoringDetailPanel } from "./monitoring-detail-panel";
import { PageHeading, StatusBadge } from "./workspace-ui";

type Scope = "all" | "active" | "history";
type Period = { from: string; to: string };
type Preset = "all" | "today" | "week" | "month" | "custom";
const pageSize = 20;
const fieldClass = "h-11 min-w-0 w-full rounded-xl border bg-white px-3 text-sm text-[#294846] placeholder:text-[#516967] focus:border-[#137d79]";
const quietButton = "inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-[#516967] transition-colors motion-reduce:transition-none hover:bg-[#eef4f3] disabled:cursor-not-allowed disabled:opacity-50";

function displayDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(`${value}T00:00:00+07:00`));
}

function presetPeriod(preset: Exclude<Preset, "custom">, today: string): Period {
  if (preset === "all") return { from: "", to: "" };
  if (preset === "today") return { from: today, to: today };
  const start = new Date(`${today}T00:00:00Z`);
  if (preset === "week") start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7);
  else start.setUTCDate(1);
  const end = new Date(start);
  if (preset === "week") end.setUTCDate(end.getUTCDate() + 6);
  else end.setUTCMonth(end.getUTCMonth() + 1, 0);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
}

function periodLabel(period: Period) {
  if (!period.from && !period.to) return "Semua tanggal";
  if (!period.from) return `Sampai ${displayDate(period.to)}`;
  if (!period.to) return `Sejak ${displayDate(period.from)}`;
  return period.from === period.to ? displayDate(period.from) : `${displayDate(period.from)} – ${displayDate(period.to)}`;
}

function PlanStatus({ status, completedStatusLabels }: { status?: string; completedStatusLabels: string[] }) {
  return status ? <span className="break-words md:whitespace-nowrap"><StatusBadge status={status} completedStatusLabels={completedStatusLabels} /></span> : <span className="text-xs text-[#516967]">Belum diisi</span>;
}

export function ConnectedMonitoringWorkspace({ users, initialPlans, initialSelectedId, initialRecordId, initialDateFrom, initialDateTo, completedStatusLabels, today }: {
  users: SafeUser[]; initialPlans: ActionPlan[]; initialSelectedId: string; initialRecordId: string;
  initialDateFrom: string; initialDateTo: string; completedStatusLabels: string[]; today: string;
}) {
  const { notify } = useFeedback();
  const [selectedId, setSelectedId] = useState(initialSelectedId || users[0]?.id || "");
  const [data, setData] = useState({ userId: selectedId, plans: initialPlans });
  const [scope, setScope] = useState<Scope>("all");
  const [query, setQuery] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);
  const [{ period, draft, preset }, setFilters] = useState(() => {
    const period = { from: initialDateFrom, to: initialDateTo };
    return { period, draft: period, preset: (initialDateFrom || initialDateTo ? "custom" : "all") as Preset };
  });
  const [workDate, setWorkDate] = useState(today);
  const [customOpen, setCustomOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const [detailId, setDetailId] = useState(initialRecordId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; accessDenied: boolean } | null>(null);
  const requestId = useRef(0);
  const requestController = useRef<AbortController | null>(null);
  const detailOpener = useRef<HTMLButtonElement | null>(null);
  const memberToggle = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const selected = users.find((user) => user.id === selectedId);
  const sameMember = data.userId === selectedId;
  const showData = sameMember && !loading && !error?.accessDenied;
  const visibleMembers = users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(memberQuery.trim().toLowerCase()));
  const { matching, filtered, completed } = useMemo(() => {
    const matching = !sameMember ? [] : data.plans.filter((plan) => (
      (!period.from || plan.date >= period.from) && (!period.to || plan.date <= period.to) &&
      `${plan.task} ${plan.note ?? ""} ${plan.morningStatus} ${plan.afternoonStatus ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())
    )).sort((first, second) => second.date.localeCompare(first.date) || second.createdAt.localeCompare(first.createdAt) || first.id.localeCompare(second.id));
    const isCompleted = (plan: ActionPlan) => Boolean(plan.afternoonStatus && completedStatusLabels.includes(plan.afternoonStatus));
    const completed = matching.filter(isCompleted).length;
    return { matching, completed, filtered: matching.filter((plan) => scope === "all" || (scope === "history" ? isCompleted(plan) : !isCompleted(plan))) };
  }, [sameMember, data.plans, period, query, completedStatusLabels, scope]);
  const [page, setPage] = useState(() => Math.max(1, Math.floor(filtered.findIndex((plan) => plan.id === initialRecordId) / pageSize) + 1));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagePlans = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedPlan = showData ? pagePlans.find((plan) => plan.id === detailId) : undefined;
  const selectedPlanId = selectedPlan?.id;
  const hasFilters = Boolean(query || period.from || period.to || scope !== "all");
  const draftChanged = draft.from !== period.from || draft.to !== period.to;

  useEffect(() => () => requestController.current?.abort(), []);
  useEffect(() => {
    if (!selectedPlanId) return;
    const row = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-plan-row]") ?? []).find((element) => element.dataset.planRow === selectedPlanId && element.getClientRects().length > 0);
    row?.scrollIntoView({ block: "nearest", inline: "start" });
  }, [selectedPlanId]);

  function openDetail(id: string, opener: HTMLButtonElement) {
    detailOpener.current = opener;
    setDetailId(id);
  }

  function closeDetail() {
    const id = detailId;
    const opener = detailOpener.current;
    setDetailId("");
    requestAnimationFrame(() => {
      const target = opener?.isConnected ? opener : Array.from(list.current?.querySelectorAll<HTMLButtonElement>("[data-plan-detail]") ?? []).find((element) => element.dataset.planDetail === id && element.getClientRects().length > 0);
      target?.scrollIntoView({ block: "nearest", inline: "nearest" });
      target?.focus({ preventScroll: true });
    });
  }

  async function loadPlans(userId: string) {
    const currentRequestId = ++requestId.current;
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true); setError((current) => current?.accessDenied ? current : null); setDetailId("");
    try {
      const response = await fetch(`/api/action-plans?userId=${encodeURIComponent(userId)}&scope=all`, { signal: controller.signal });
      const body = await response.json().catch(() => null);
      if (currentRequestId !== requestId.current) return;
      if (!response.ok) {
        setError((current) => ({ message: body?.error ?? "Data tidak dapat dimuat.", accessDenied: Boolean(current?.accessDenied || response.status === 401 || response.status === 403) }));
        return;
      }
      if (!Array.isArray(body)) throw new Error("Invalid response");
      setData({ userId, plans: body });
      setError(null);
      const dateHeader = response.headers.get("x-workspace-date");
      const nextDate = dateHeader && dashboardPeriodInputSchema.safeParse({ from: dateHeader, to: dateHeader }).success ? dateHeader : bangkokDate();
      setWorkDate(nextDate);
      setFilters((current) => {
        if (current.preset === "custom") return current;
        const next = presetPeriod(current.preset, nextDate);
        const dirty = current.draft.from !== current.period.from || current.draft.to !== current.period.to;
        return { ...current, period: next, draft: dirty ? current.draft : next };
      });
      notify("success", "Monitoring diperbarui", "Data anggota berhasil dimuat. Perubahan terbaru dapat memerlukan hingga 30 detik.");
    } catch (caught) {
      if (currentRequestId !== requestId.current || (caught instanceof Error && caught.name === "AbortError")) return;
      setError((current) => ({ message: "Koneksi terputus atau layanan sedang bermasalah. Coba muat kembali data anggota.", accessDenied: Boolean(current?.accessDenied) }));
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }

  function selectUser(id: string) {
    if (memberPickerOpen) requestAnimationFrame(() => {
      const toggle = memberToggle.current;
      const target = toggle?.getClientRects().length ? toggle : Array.from(document.querySelectorAll<HTMLButtonElement>("[data-member-id]")).find((element) => element.dataset.memberId === id && element.getClientRects().length > 0);
      target?.focus({ preventScroll: true });
    });
    setMemberPickerOpen(false); setMemberQuery("");
    if (id === selectedId) return;
    setSelectedId(id); setPage(1);
    void loadPlans(id);
  }

  function choosePeriod(value: Exclude<Preset, "custom">) {
    const date = bangkokDate();
    const next = presetPeriod(value, date);
    setWorkDate(date); setFilters({ period: next, draft: next, preset: value }); setDateError(""); setCustomOpen(false); setPage(1); setDetailId("");
  }

  function applyPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = dashboardPeriodInputSchema.safeParse({ from: draft.from || "0001-01-01", to: draft.to || "9999-12-31" });
    if (!result.success) { setDateError(result.error.issues[0]?.message ?? "Periksa rentang tanggal."); return; }
    setFilters({ period: draft, draft, preset: draft.from || draft.to ? "custom" : "all" }); setPage(1); setDetailId(""); setDateError(""); setCustomOpen(false);
  }

  function clearFilters() { choosePeriod("all"); setQuery(""); setScope("all"); }

  function renderMemberPicker() {
    return <>
      <label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#516967]" /><span className="sr-only">Cari anggota</span><input className={`${fieldClass} pl-9`} value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="Cari anggota…" /></label>
      <div className="mt-3 max-h-72 space-y-1 overflow-y-auto overscroll-contain xl:max-h-[calc(100dvh-290px)]" aria-label="Daftar anggota">
        {visibleMembers.map((user) => <button key={user.id} type="button" data-member-id={user.id} aria-pressed={selectedId === user.id} onClick={() => selectUser(user.id)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selectedId === user.id ? "bg-[#e3f3f0] text-[#173c3a]" : "text-[#294846] hover:bg-[#f1f5f4]"}`}>
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#eef3f2] text-xs font-semibold text-[#516967]" aria-hidden="true">{user.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span>
          <span className="min-w-0 flex-1"><span className="block break-words text-sm font-semibold">{user.name}</span><span className="mt-1 block truncate text-xs text-[#516967]" title={user.email}>{user.email}</span>{user.status === "inactive" && <span className="mt-1 block text-xs text-[#516967]">Akun nonaktif</span>}</span>
        </button>)}
        {visibleMembers.length === 0 && <p className="px-3 py-6 text-sm text-[#516967]">Anggota tidak ditemukan. Coba nama atau email lain.</p>}
      </div>
    </>;
  }

  function renderDate(plan: ActionPlan) {
    return <><time dateTime={plan.date} className="whitespace-nowrap text-xs text-[#516967]">{displayDate(plan.date)}</time>{plan.date > workDate && <span className="mt-1 block text-xs text-[#516967]">Mendatang</span>}{plan.date === workDate && <span className="mt-1 block text-xs font-medium text-[#173c3a]">Hari ini</span>}</>;
  }

  function renderResult(plan: ActionPlan) {
    return <div className="space-y-1 text-xs text-[#516967]">{plan.resultLink ? <a href={plan.resultLink} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1 whitespace-nowrap font-semibold text-[#137d79] underline-offset-4 hover:underline">Buka hasil <ExternalLink className="size-3.5" /></a> : <span>Belum ada link</span>}{Boolean(plan.attachments?.length) && <button type="button" onClick={(event) => openDetail(plan.id, event.currentTarget)} aria-label={`Lihat ${plan.attachments!.length} lampiran: ${plan.task}`} className="block min-h-9 text-left font-medium text-[#137d79] underline-offset-4 hover:underline">{plan.attachments!.length} lampiran</button>}</div>;
  }

  return <section className={`w-full min-w-0 ${selectedPlan ? "xl:pr-[460px]" : ""}`}>
    <PageHeading title="Monitoring" description="Tinjau rencana, progres, dan hasil kerja setiap anggota tim." action={users.length ? <button type="button" className={`${quietButton} border bg-white`} disabled={loading} onClick={() => void loadPlans(selectedId)}>{loading ? "Memuat data…" : "Perbarui data"}</button> : undefined} />
    <p className="mt-3 text-xs leading-5 text-[#516967]">Perubahan terbaru dapat memerlukan hingga 30 detik.</p>
    {users.length === 0 ? <div className="mt-7 rounded-2xl border bg-white p-10 text-center"><h2 className="font-semibold text-[#173c3a]">Belum ada anggota tim</h2><p className="mt-2 text-sm text-[#516967]">Tambahkan akun User untuk mulai meninjau pekerjaan.</p><a href="/users" className={`${quietButton} mt-4 text-[#137d79]`}>Buka Users</a></div> : <div className={`mt-7 grid items-start gap-6 ${selectedPlan ? "" : "xl:grid-cols-[240px_minmax(0,1fr)]"}`}>
      <aside className={`sticky top-24 hidden rounded-2xl border bg-white p-3 ${selectedPlan ? "" : "xl:block"}`} aria-label="Pemilih anggota"><div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold text-[#173c3a]">Anggota tim</h2><span className="text-xs tabular-nums text-[#516967]">{users.length} anggota</span></div>{renderMemberPicker()}</aside>
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-white">
        <header className="border-b p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words text-lg font-semibold text-[#173c3a]">{selected?.name}</h2><p className="mt-1 break-all text-xs text-[#516967]">{selected?.email}{selected?.status === "inactive" ? " · Akun nonaktif" : ""}</p></div><button type="button" ref={memberToggle} className={`${quietButton} shrink-0 border ${selectedPlan ? "" : "xl:hidden"}`} aria-expanded={memberPickerOpen} aria-controls="mobile-member-picker" onClick={() => setMemberPickerOpen(!memberPickerOpen)}>Ganti anggota</button></div>
          {memberPickerOpen && <div id="mobile-member-picker" className={`mt-4 border-t pt-4 ${selectedPlan ? "" : "xl:hidden"}`}>{renderMemberPicker()}</div>}
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums text-[#516967]" aria-live="polite">{loading ? "Memuat ringkasan anggota…" : showData ? <><span><strong className="font-semibold text-[#173c3a]">{matching.length}</strong> pekerjaan</span><span><strong className="font-semibold text-[#206b43]">{completed}</strong> selesai</span><span><strong className="font-semibold text-[#173c3a]">{matching.length - completed}</strong> belum selesai</span></> : "Ringkasan belum tersedia."}</p>
          <p className="mt-1 text-xs text-[#516967]">Sesuai periode dan pencarian terpilih · selesai berdasarkan status sore.</p>
        </header>
        <div className="space-y-4 border-b p-5 sm:p-6">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Periode pekerjaan">{([["all", "Semua tanggal"], ["today", "Hari ini"], ["week", "Minggu ini"], ["month", "Bulan ini"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={preset === value} onClick={() => choosePeriod(value)} className={`${quietButton} aria-pressed:bg-[#173c3a] aria-pressed:text-white aria-pressed:hover:bg-[#24514e]`}>{label}</button>)}<button type="button" aria-expanded={customOpen} aria-controls="monitoring-custom-period" onClick={() => setCustomOpen(!customOpen)} className={`${quietButton} ${preset === "custom" ? "bg-[#e3f3f0] text-[#173c3a]" : ""}`}>Rentang khusus</button></div>
          {customOpen && <form id="monitoring-custom-period" onSubmit={applyPeriod} noValidate className="border-y py-4">
            <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="min-w-0 text-xs font-medium text-[#516967]">Dari tanggal<input type="date" value={draft.from} onChange={(event) => setFilters((current) => ({ ...current, draft: { ...current.draft, from: event.target.value } }))} className={`${fieldClass} mt-1.5`} aria-invalid={Boolean(dateError)} aria-describedby={dateError ? "monitoring-date-error" : undefined} /></label>
              <label className="min-w-0 text-xs font-medium text-[#516967]">Sampai tanggal<input type="date" value={draft.to} onChange={(event) => setFilters((current) => ({ ...current, draft: { ...current.draft, to: event.target.value } }))} className={`${fieldClass} mt-1.5`} aria-invalid={Boolean(dateError)} aria-describedby={dateError ? "monitoring-date-error" : undefined} /></label>
              <button type="submit" className={`${quietButton} bg-[#137d79] text-white hover:bg-[#0e6865]`}>Terapkan</button>
            </div>
            {dateError && <p id="monitoring-date-error" role="alert" className="mt-3 text-sm text-[#9a5b16]">{dateError}</p>}
            <p className="mt-2 text-xs text-[#516967]">{draftChanged ? "Perubahan tanggal belum diterapkan." : "Kosongkan salah satu tanggal untuk rentang terbuka."}</p>
          </form>}
          <label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#516967]" /><span className="sr-only">Cari pekerjaan, catatan, atau status</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); setDetailId(""); }} className={`${fieldClass} pl-9`} placeholder="Cari pekerjaan, catatan, atau status…" /></label>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Status pekerjaan">{([["all", "Semua", matching.length], ["active", "Belum selesai", matching.length - completed], ["history", "Selesai", completed]] as const).map(([value, label, count]) => <button key={value} type="button" aria-pressed={scope === value} onClick={() => { setScope(value); setPage(1); setDetailId(""); }} className={`${quietButton} gap-2 aria-pressed:bg-[#e3f3f0] aria-pressed:text-[#173c3a] aria-pressed:hover:bg-[#d4ebe7]`}>{label}<span className="text-xs tabular-nums">{showData ? count : "…"}</span></button>)}</div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3"><p className="min-w-0 break-words text-xs text-[#516967]" role="status">{periodLabel(period)}{query.trim() ? ` · Pencarian: “${query.trim()}”` : ""}</p>{hasFilters && <button type="button" onClick={clearFilters} className={`${quietButton} min-h-9 text-xs`}>Hapus filter</button>}</div>
        </div>
        {error && <div role="alert" className="m-5 rounded-xl bg-[#fff1d7] p-4 text-sm text-[#704212] sm:m-6"><p className="font-semibold">Data anggota belum diperbarui</p><p className="mt-1">{error.message}</p>{error.accessDenied ? <><p className="mt-2">Masuk kembali untuk memeriksa sesi Anda. Hubungi Admin jika akun dinonaktifkan atau hak akses berubah.</p><a href="/login" className={`${quietButton} mt-2 text-[#704212] underline`}>Masuk kembali</a></> : <><p className="mt-2">{sameMember ? "Data sebelumnya untuk anggota ini tetap ditampilkan." : "Data anggota ini belum tersedia. Data anggota sebelumnya tidak ditampilkan."}</p><button type="button" className={`${quietButton} mt-2 text-[#704212] underline`} onClick={() => void loadPlans(selectedId)}>Coba lagi</button></>}</div>}
        <div ref={list} aria-busy={loading} aria-label="Pekerjaan anggota">
          {loading ? <div role="status" className="p-5 sm:p-6"><p className="text-sm text-[#516967]">Memuat pekerjaan {selected?.name}…</p><div className="mt-5 space-y-5 motion-safe:animate-pulse" aria-hidden="true">{[0, 1, 2, 3].map((row) => <div key={row} className="flex gap-5 border-t pt-5"><span className="h-4 w-20 rounded bg-[#eef3f2]" /><span className="h-4 flex-1 rounded bg-[#eef3f2]" /><span className="h-4 w-16 rounded bg-[#eef3f2]" /></div>)}</div></div> : showData && filtered.length > 0 ? <>
            <div className="hidden max-h-[640px] overflow-auto md:block" tabIndex={0} aria-label="Tabel pekerjaan, dapat digulir">
              <table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">Action Plan {selected?.name}, {periodLabel(period)}</caption><thead className="sticky top-0 z-10 border-b bg-[#f7faf9] text-xs text-[#516967]"><tr>{["Tanggal", "Action Plan", "Pagi", "Sore", "Hasil", "Detail"].map((label) => <th key={label} scope="col" className="px-4 py-4 font-semibold">{label}</th>)}</tr></thead>
                <tbody>{pagePlans.map((plan) => <tr key={plan.id} data-plan-row={plan.id} className={`border-t transition-colors hover:bg-[#f7faf9] ${detailId === plan.id ? "bg-[#e3f3f0]" : ""}`} aria-selected={detailId === plan.id}>
                  <td className="px-4 py-4 align-top">{renderDate(plan)}</td><td className="w-full min-w-52 max-w-lg px-4 py-4 align-top"><p className="break-words font-medium text-[#173c3a]">{plan.task}</p>{plan.note && <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-[#516967]">{plan.note}</p>}</td>
                  <td className="px-4 py-4 align-top"><PlanStatus status={plan.morningStatus} completedStatusLabels={completedStatusLabels} /></td><td className="px-4 py-4 align-top"><PlanStatus status={plan.afternoonStatus} completedStatusLabels={completedStatusLabels} /></td><td className="px-4 py-3 align-top">{renderResult(plan)}</td><td className="px-3 py-3 align-top"><button type="button" onClick={(event) => openDetail(plan.id, event.currentTarget)} data-plan-detail={plan.id} aria-label={`Lihat detail: ${plan.task}`} className={`${quietButton} text-[#137d79]`}>Lihat</button></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="divide-y md:hidden">{pagePlans.map((plan) => <article key={plan.id} data-plan-row={plan.id} className={`p-5 ${detailId === plan.id ? "bg-[#e3f3f0]" : ""}`}><div>{renderDate(plan)}</div><h3 className="mt-2 break-words text-sm font-semibold leading-6 text-[#173c3a]">{plan.task}</h3><dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#516967]"><div><dt>Pagi</dt><dd className="mt-1"><PlanStatus status={plan.morningStatus} completedStatusLabels={completedStatusLabels} /></dd></div><div><dt>Sore</dt><dd className="mt-1"><PlanStatus status={plan.afternoonStatus} completedStatusLabels={completedStatusLabels} /></dd></div></dl>{plan.note && <p className="mt-3 line-clamp-2 break-words text-xs leading-5 text-[#516967]">{plan.note}</p>}<div className="mt-3 flex items-end justify-between gap-3">{renderResult(plan)}<button type="button" onClick={(event) => openDetail(plan.id, event.currentTarget)} data-plan-detail={plan.id} aria-label={`Lihat detail: ${plan.task}`} className={`${quietButton} shrink-0 text-[#137d79]`}>Lihat detail</button></div></article>)}</div>
            <nav aria-label="Halaman pekerjaan" className="flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:px-6"><p className="text-xs tabular-nums text-[#516967]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} pekerjaan</p><div className="flex items-center gap-2"><button type="button" className={quietButton} disabled={currentPage === 1} onClick={() => { setPage(currentPage - 1); setDetailId(""); }}>Sebelumnya</button><span className="text-xs tabular-nums text-[#516967]">{currentPage}/{pageCount}</span><button type="button" className={quietButton} disabled={currentPage === pageCount} onClick={() => { setPage(currentPage + 1); setDetailId(""); }}>Berikutnya</button></div></nav>
          </> : !error && <div className="p-10 text-center"><h3 className="text-sm font-semibold text-[#173c3a]">{data.plans.length === 0 ? "Belum ada pekerjaan untuk anggota ini" : "Tidak ada pekerjaan yang sesuai filter"}</h3><p className="mt-2 text-sm leading-6 text-[#516967]">{data.plans.length === 0 ? "Rencana dan hasil kerja akan tampil setelah anggota menambahkan Action Plan." : "Coba ubah periode, status, atau kata pencarian."}</p>{hasFilters && <button type="button" className={`${quietButton} mt-3 text-[#137d79]`} onClick={clearFilters}>Hapus filter</button>}</div>}
        </div>
      </div>
    </div>}
    {selectedPlan && <MonitoringDetailPanel plan={selectedPlan} userId={selectedId} memberName={selected?.name ?? "Anggota"} completedStatusLabels={completedStatusLabels} onClose={closeDetail} />}
  </section>;
}
