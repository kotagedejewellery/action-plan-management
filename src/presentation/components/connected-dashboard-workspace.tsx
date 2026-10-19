"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowDown, ArrowRight, CalendarDays, CheckCircle2, ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";

import { summarizeDashboard, type DashboardPlan } from "@/application/dashboard-analytics";
import { dashboardPeriodInputSchema } from "@/application/schemas";
import type { SafeUser, WeeklyPlan } from "@/domain/models";
import { useFeedback } from "./feedback";
import { PageHeading, StatusBadge } from "./workspace-ui";

type DashboardData = {
  users: SafeUser[];
  plans: DashboardPlan[];
  weeklyPlans: WeeklyPlan[];
  completedStatusLabels: string[];
  today: string;
  loadedAt: string;
};
type Preset = "week" | "month" | "custom";
type Scope = "all" | "completed" | "pending";
const scopeLabels = { all: "Semua Action Plan", completed: "Action Plan selesai", pending: "Action Plan belum selesai" };
const quietButton = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border bg-white px-3 text-sm font-semibold text-[#294846] transition-colors hover:bg-[#f1f5f4] disabled:cursor-wait disabled:opacity-60";

function startOfWeek(date: string) {
  const current = new Date(`${date}T00:00:00Z`);
  current.setUTCDate(current.getUTCDate() - ((current.getUTCDay() + 6) % 7));
  return current.toISOString().slice(0, 10);
}

function presetPeriod(preset: Exclude<Preset, "custom">, today: string) {
  return { from: preset === "week" ? startOfWeek(today) : `${today.slice(0, 8)}01`, to: today };
}

function displayDate(value: string, year = false) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "short", ...(year ? { year: "numeric" } : {}), timeZone: "Asia/Bangkok",
  }).format(new Date(`${value}T00:00:00Z`));
}

function monitoringHref(userId: string, from: string, to: string, recordId?: string) {
  const params = new URLSearchParams({ userId, from, to });
  if (recordId) params.set("recordId", recordId);
  return `/monitoring?${params}`;
}

export function ConnectedDashboardWorkspace(initialData: DashboardData) {
  const [data, setData] = useState(initialData);
  const { users, plans, weeklyPlans, completedStatusLabels, today, loadedAt } = data;
  const { notify } = useFeedback();
  const [{ preset, period, draft }, setFilters] = useState(() => {
    const period = presetPeriod("month", today);
    return { preset: "month" as Preset, period, draft: period };
  });
  const [customOpen, setCustomOpen] = useState(false);
  const [dateErrors, setDateErrors] = useState<{ from?: string; to?: string }>({});
  const [scope, setScope] = useState<Scope | null>(null);
  const scopeTrigger = useRef<HTMLElement | null>(null);
  const [memberLimit, setMemberLimit] = useState(6);
  const [weeklyLimit, setWeeklyLimit] = useState(4);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<{ message: string; accessDenied: boolean } | null>(null);
  const summary = useMemo(() => summarizeDashboard(users, plans, completedStatusLabels, period.from, period.to, today), [users, plans, completedStatusLabels, period, today]);
  const periodPlans = plans.filter((plan) => plan.date >= period.from && plan.date <= period.to);
  const isCompleted = (plan: DashboardPlan) => Boolean(plan.afternoonStatus && completedStatusLabels.includes(plan.afternoonStatus));
  const scopedPlans = periodPlans.filter((plan) => scope === "completed" ? isCompleted(plan) : scope === "pending" ? !isCompleted(plan) : true);
  const weeklySummary = weeklyPlans.filter((plan) => !plan.deletedAt && plan.weekStart <= period.to && plan.weekEnd >= period.from).map((plan) => {
    const children = plans.filter((daily) => daily.weeklyPlanId === plan.id && !daily.deletedAt);
    return { ...plan, children, ownerName: users.find((user) => user.id === plan.userId)?.name ?? "User", completed: children.filter(isCompleted).length, total: plan.plannedActionPlanIds.length || children.length };
  }).sort((a, b) => a.weekEnd.localeCompare(b.weekEnd));
  const draftChanged = draft.from !== period.from || draft.to !== period.to;

  function selectScope(next: Scope) {
    scopeTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setScope(scope === next ? null : next);
  }

  function closeScope() {
    setScope(null);
    scopeTrigger.current?.focus();
  }

  function selectPeriod(nextPreset: Exclude<Preset, "custom">) {
    const next = presetPeriod(nextPreset, today);
    setFilters({ preset: nextPreset, period: next, draft: next });
    setDateErrors({});
  }

  function applyPeriod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = dashboardPeriodInputSchema.safeParse(draft);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setDateErrors({ from: errors.from?.[0], to: errors.to?.[0] });
      return;
    }
    if (draft.to > today) {
      setDateErrors({ to: "Tanggal akhir tidak boleh melewati hari ini." });
      return;
    }
    setDateErrors({});
    setFilters((current) => ({ ...current, period: parsed.data, preset: "custom" }));
  }

  async function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store", signal: AbortSignal.timeout(30_000) });
      const result = await response.json();
      if (!response.ok) {
        setRefreshError({ message: result.error ?? "Data belum dapat diperbarui. Coba lagi.", accessDenied: response.status === 401 || response.status === 403 });
        return;
      }
      setData(result);
      setFilters((current) => {
        if (current.preset === "custom") return current;
        const next = presetPeriod(current.preset, result.today);
        const editing = current.draft.from !== current.period.from || current.draft.to !== current.period.to;
        return { ...current, period: next, draft: editing ? current.draft : next };
      });
      notify("success", "Dashboard diperbarui", "Ringkasan tim berhasil dimuat kembali.");
    } catch (error) {
      setRefreshError({ message: error instanceof Error && error.name === "Error" ? error.message : "Koneksi terputus atau terlalu lama. Coba lagi beberapa saat lagi.", accessDenied: false });
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <section className="w-full min-w-0 pb-2">
      <PageHeading title="Dashboard Tim" description="Satu pandangan untuk memahami progres dan hasil kerja seluruh tim." action={
        <button type="button" onClick={refresh} disabled={refreshing} className={`${quietButton} h-11 shrink-0`}>
          <RefreshCw className={`size-4 ${refreshing ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" />
          {refreshing ? "Memperbarui…" : "Perbarui data"}
        </button>
      } />
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-[#59706f]">
        <span>Dimuat {new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date(loadedAt))} WIB</span>
        <span aria-hidden="true">·</span><span>Perubahan terbaru dapat memerlukan hingga 30 detik.</span>
      </div>
      {refreshError && <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4c8c2] bg-[#fff4f1] p-4 text-sm text-[#813d32]"><div className="max-w-3xl"><p>{refreshError.message} Data sebelumnya tetap ditampilkan.</p>{refreshError.accessDenied && <p className="mt-1">Masuk kembali untuk memeriksa sesi Anda. Hubungi Admin jika akun dinonaktifkan atau hak akses berubah.</p>}</div>{refreshError.accessDenied ? <Link href="/login" className="inline-flex min-h-10 items-center rounded-lg px-3 font-semibold underline underline-offset-4">Masuk kembali</Link> : <button type="button" disabled={refreshing} onClick={refresh} className="min-h-10 rounded-lg px-3 font-semibold underline underline-offset-4 disabled:opacity-60">Coba lagi</button>}</div>}

      <form onSubmit={applyPeriod} noValidate className="mt-6 rounded-2xl border bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-fit rounded-xl bg-[#f1f5f4] p-1" role="group" aria-label="Pilih periode Dashboard">
            {(["week", "month"] as const).map((value) => <button key={value} type="button" aria-pressed={preset === value} onClick={() => selectPeriod(value)} className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${preset === value ? "bg-[#173c3a] text-white" : "text-[#59706f] hover:bg-[#e3ecea]"}`}>{value === "week" ? "Minggu ini" : "Bulan ini"}</button>)}
          </div>
          <button type="button" className={quietButton} aria-expanded={customOpen} aria-controls="dashboard-custom-period" onClick={() => setCustomOpen(!customOpen)}><CalendarDays className="size-4" aria-hidden="true" />Rentang khusus<ChevronDown className={`size-4 transition-transform motion-reduce:transition-none ${customOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button>
        </div>
          <div id="dashboard-custom-period" hidden={!customOpen} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <DateField label="Dari tanggal" name="from" value={draft.from} max={draft.to || today} error={dateErrors.from} onChange={(value) => setFilters((current) => ({ ...current, draft: { ...current.draft, from: value } }))} />
            <DateField label="Sampai tanggal" name="to" value={draft.to} min={draft.from} max={today} error={dateErrors.to} onChange={(value) => setFilters((current) => ({ ...current, draft: { ...current.draft, to: value } }))} />
            <button type="submit" className={`${quietButton} self-start sm:mt-6`}>Terapkan<ArrowRight className="size-4" aria-hidden="true" /></button>
          </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs leading-5 text-[#59706f]">
          <p role="status" aria-live="polite" aria-atomic="true" className="inline-flex flex-wrap items-center gap-x-2"><CalendarDays className="size-3.5 shrink-0" aria-hidden="true" /><span>{displayDate(period.from, true)} – {displayDate(period.to, true)} · <strong className="font-semibold text-[#294846]">{summary.total} Action Plan</strong></span></p>
          {draftChanged && <span>Perubahan tanggal belum diterapkan.</span>}
        </div>
      </form>

      <section className="mt-5" aria-label="Ringkasan progres tim" aria-busy={refreshing}>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Metric label="Total Action Plan" value={summary.total} detail="Pada periode terpilih" active={scope === "all"} onClick={() => selectScope("all")} />
          <Metric label="Selesai" value={summary.completed} detail="Status sore final" active={scope === "completed"} onClick={() => selectScope("completed")} />
          <Metric label="Penyelesaian" value={summary.total ? `${summary.completionRate}%` : "—"} detail={summary.total ? `${summary.completed} dari ${summary.total} selesai` : "Belum ada pekerjaan"} emphasis />
          <Metric label="Belum selesai" value={summary.total - summary.completed} detail="Termasuk hari ini" active={scope === "pending"} onClick={() => selectScope("pending")} />
        </div>
        <section id="dashboard-plan-list" hidden={!scope} className="mt-4 rounded-2xl border bg-white p-4 sm:p-5" aria-labelledby="plan-list-heading"><div className="flex items-start justify-between gap-4"><div><h2 id="plan-list-heading" className="font-semibold text-[#173c3a]">{scopeLabels[scope ?? "all"]}</h2><p className="mt-1 text-xs text-[#59706f]">{scopedPlans.length} pekerjaan pada periode terpilih</p></div><button type="button" onClick={closeScope} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4]">Tutup daftar</button></div>{scope && <PlanList key={`${scope}-${period.from}-${period.to}`} plans={scopedPlans} from={period.from} to={period.to} completedStatusLabels={completedStatusLabels} />}</section>
      </section>

      <div className="mt-6 grid items-start gap-5 min-[1280px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border bg-white" aria-labelledby="team-heading">
          <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6"><div><h2 id="team-heading" className="text-lg font-semibold tracking-tight text-[#173c3a]">Progres anggota tim</h2><p className="mt-1 text-sm text-[#59706f]">Buka anggota untuk melihat ringkasan pekerjaannya.</p></div><span className="rounded-lg bg-[#f1f5f4] px-2.5 py-1.5 text-xs font-medium text-[#59706f]">{users.length} anggota · {summary.activeUsers} aktif</span></div>
          {summary.byUser.length ? <div className="divide-y border-t">{summary.byUser.slice(0, memberLimit).map((member) => {
            const percent = member.total ? Math.round(member.completed / member.total * 100) : 0;
            const ownPlans = periodPlans.filter((plan) => plan.ownerId === member.userId);
            return <details key={`${member.userId}-${period.from}-${period.to}`} className="group">
              <summary className="cursor-pointer list-none p-5 transition-colors marker:hidden hover:bg-[#f8faf9] group-open:bg-[#f8faf9] sm:px-6 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e3f3f0] text-sm font-semibold text-[#17635f]" aria-hidden="true">{member.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toLocaleUpperCase("id-ID")}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#294846]">{member.name}</span><span className="mt-0.5 block text-xs text-[#59706f]">{member.total ? `${member.completed} dari ${member.total} selesai` : "Belum ada rencana pada periode ini"}</span></span>
                  <span className="shrink-0 text-lg font-semibold tabular-nums tracking-tight text-[#173c3a]">{member.total ? `${percent}%` : "—"}</span>
                  <ChevronDown className="size-4 shrink-0 text-[#59706f] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                </div>
                <div className="mt-3 sm:ml-[52px]"><Progress value={percent} label={`${member.name}: ${member.completed} dari ${member.total} pekerjaan selesai`} /></div>
              </summary>
              <div className="border-t border-dashed bg-[#f8faf9] px-5 pb-5 pt-1 sm:px-6"><PlanList plans={ownPlans} from={period.from} to={period.to} completedStatusLabels={completedStatusLabels} /><Link href={monitoringHref(member.userId, period.from, period.to)} className={`${quietButton} mt-4 w-full sm:w-auto`}>Buka Monitoring<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
            </details>;
          })}</div> : <EmptyCopy title="Belum ada anggota tim" text="Akun User yang sudah dibuat akan muncul di sini." action={<Link href="/users" className={quietButton}>Buka pengelolaan akun<ArrowRight className="size-4" aria-hidden="true" /></Link>} />}
          {summary.byUser.length > memberLimit && <div className="border-t p-4 text-center"><button type="button" className={quietButton} onClick={() => setMemberLimit(memberLimit + 6)}>Tampilkan lebih banyak ({summary.byUser.length - memberLimit})<ArrowDown className="size-4" aria-hidden="true" /></button></div>}
        </section>
        <DailyTrend key={`${period.from}-${period.to}`} trend={summary.trend} />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-white" aria-labelledby="weekly-heading">
        <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6"><div><h2 id="weekly-heading" className="text-lg font-semibold tracking-tight text-[#173c3a]">Rencana mingguan</h2><p className="mt-1 text-sm text-[#59706f]">Progres satu minggu penuh untuk rencana yang beririsan dengan periode terpilih.</p></div><span className="rounded-lg bg-[#f1f5f4] px-2.5 py-1.5 text-xs font-medium text-[#59706f]">{weeklySummary.length} rencana</span></div>
        {weeklySummary.length ? <div className="divide-y border-t">{weeklySummary.slice(0, weeklyLimit).map((plan) => <details key={plan.id} className="group"><summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 transition-colors hover:bg-[#f8faf9] sm:px-6 [&::-webkit-details-marker]:hidden"><span className="min-w-0 flex-1 basis-48"><span className="block break-words text-sm font-semibold text-[#294846]">{plan.title}</span><span className="mt-1 block text-xs leading-5 text-[#59706f]">{plan.ownerName} · {displayDate(plan.weekStart, true)} – {displayDate(plan.weekEnd, true)}</span></span><span className="min-w-0 flex-1 basis-32 sm:max-w-52"><span className="mb-2 block text-xs font-semibold tabular-nums text-[#294846]">{plan.completed} / {plan.total} selesai</span><Progress value={plan.total ? Math.min(100, Math.round(plan.completed / plan.total * 100)) : 0} label={`${plan.title}: ${plan.completed} dari ${plan.total} selesai`} /></span><ChevronDown className="size-4 shrink-0 text-[#59706f] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><div className="border-t border-dashed bg-[#f8faf9] px-5 pb-3 sm:px-6">{plan.note && <p className="pt-4 text-sm text-[#59706f]">{plan.note}</p>}<PlanList plans={plan.children} from={plan.weekStart} to={plan.weekEnd} completedStatusLabels={completedStatusLabels} /></div></details>)}</div> : <EmptyCopy title="Belum ada rencana mingguan" text="Rencana dengan periode minggu yang sesuai akan ditampilkan di sini." />}
        {weeklySummary.length > weeklyLimit && <div className="border-t p-4 text-center"><button type="button" className={quietButton} onClick={() => setWeeklyLimit(weeklyLimit + 4)}>Tampilkan lebih banyak ({weeklySummary.length - weeklyLimit})<ArrowDown className="size-4" aria-hidden="true" /></button></div>}
      </section>

      <section className="mt-5" aria-label="Pekerjaan yang perlu ditindaklanjuti">
        {summary.total === 0 ? <div className="flex items-start gap-3 rounded-xl border border-dashed p-4 text-sm text-[#59706f]"><CalendarDays className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><p>Belum ada Action Plan pada periode ini. Pilih periode lain untuk melihat progres tim.</p></div> : summary.overdue.length ? <details className="group overflow-hidden rounded-2xl border border-[#e8d6b3] bg-[#fffbf2]"><summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden"><AlertCircle className="size-5 shrink-0 text-[#95601a]" aria-hidden="true" /><span className="flex-1"><span className="block text-sm font-semibold text-[#754b18]">{summary.overdue.length} pekerjaan perlu tindak lanjut</span><span className="mt-1 block text-xs leading-5 text-[#754b18]">Belum selesai dari tanggal sebelum hari ini, dalam periode terpilih.</span></span><ChevronDown className="size-4 shrink-0 text-[#754b18] transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><div className="border-t border-[#e8d6b3] px-5 pb-3"><PlanList key={`${period.from}-${period.to}`} plans={summary.overdue} from={period.from} to={period.to} completedStatusLabels={completedStatusLabels} /></div></details> : <div className="flex items-start gap-3 rounded-xl border bg-white p-4 text-sm text-[#294846]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#137d79]" aria-hidden="true" /><p>{summary.completed === summary.total ? "Seluruh Action Plan pada periode ini sudah selesai." : "Tidak ada pekerjaan sebelum hari ini yang belum selesai pada periode ini."}</p></div>}
      </section>
    </section>
  );
}

function DateField({ label, name, value, min, max, error, onChange }: { label: string; name: string; value: string; min?: string; max: string; error?: string; onChange: (value: string) => void }) {
  return <label className="block min-w-0 text-xs font-medium text-[#59706f]"><span>{label}</span><input type="date" name={name} value={value} min={min} max={max} required aria-invalid={Boolean(error)} aria-describedby={error ? `dashboard-${name}-error` : undefined} onChange={(event) => onChange(event.target.value)} className={`mt-1.5 block h-10 w-full min-w-0 rounded-xl border bg-white px-3 text-sm text-[#294846] ${error ? "border-[#b15646]" : "focus:border-[#137d79]"}`} />{error && <span id={`dashboard-${name}-error`} role="alert" className="mt-2 block max-w-56 text-xs leading-5 text-[#963f30]">{error}</span>}</label>;
}

function Metric({ label, value, detail, active = false, emphasis = false, onClick }: { label: string; value: number | string; detail: string; active?: boolean; emphasis?: boolean; onClick?: () => void }) {
  const className = `relative min-w-0 rounded-2xl border p-4 text-left sm:p-5 ${emphasis ? "border-[#c8e1dd] bg-[#e3f3f0]" : active ? "border-[#137d79] bg-[#f1f8f6]" : "bg-white"} ${onClick ? "transition-colors hover:border-[#8bbcb5] hover:bg-[#f1f8f6]" : ""}`;
  const content = <><span className="block text-xs font-medium text-[#59706f] sm:text-sm">{label}</span><span className="mt-3 block text-3xl font-semibold tracking-tight text-[#173c3a] tabular-nums sm:text-4xl">{value}</span><span className="mt-2 block text-xs leading-5 text-[#59706f]">{detail}</span>{onClick && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#137d79]">{active ? "Tutup daftar" : "Lihat pekerjaan"}<ArrowRight className="size-3" aria-hidden="true" /></span>}</>;
  return onClick ? <button type="button" className={className} onClick={onClick} aria-expanded={active} aria-controls="dashboard-plan-list">{content}</button> : <div className={className}>{content}</div>;
}

function Progress({ value, label }: { value: number; label: string }) {
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className="h-1.5 overflow-hidden rounded-full bg-[#e4ecea]"><div className="h-full rounded-full bg-[#137d79] transition-[width] duration-200 ease-out motion-reduce:transition-none" style={{ width: `${value}%` }} /></div>;
}

function PlanList({ plans, from, to, completedStatusLabels }: { plans: DashboardPlan[]; from: string; to: string; completedStatusLabels: string[] }) {
  const [limit, setLimit] = useState(5);
  if (!plans.length) return <p className="py-5 text-sm text-[#59706f]">Tidak ada pekerjaan pada daftar ini.</p>;
  return <><ul className="mt-2 divide-y">{plans.slice(0, limit).map((plan) => <li key={plan.id} className="flex flex-wrap items-start justify-between gap-3 py-4"><div className="min-w-0 flex-1 basis-48"><Link href={monitoringHref(plan.ownerId, from, to, plan.id)} className="break-words text-sm font-semibold text-[#176d68] underline-offset-4 hover:underline">{plan.task}<span className="sr-only"> — lihat detail</span></Link><p className="mt-1 text-xs leading-5 text-[#59706f]">{plan.ownerName} · {displayDate(plan.date, true)}</p></div><div className="flex shrink-0 flex-col items-start gap-1.5 text-xs"><span className="flex items-center gap-2"><span className="w-8 text-[#59706f]">Pagi</span><StatusBadge completedStatusLabels={completedStatusLabels} status={plan.morningStatus} /></span><span className="flex items-center gap-2"><span className="w-8 text-[#59706f]">Sore</span>{plan.afternoonStatus ? <StatusBadge completedStatusLabels={completedStatusLabels} status={plan.afternoonStatus} /> : <span className="text-[#59706f]">Belum diisi</span>}</span></div></li>)}</ul>{plans.length > limit && <button type="button" className="mb-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#137d79] hover:bg-[#e3f3f0]" onClick={() => setLimit(limit + 5)}>Tampilkan lebih banyak ({plans.length - limit})<ArrowDown className="size-4" aria-hidden="true" /></button>}</>;
}

function DailyTrend({ trend }: { trend: { date: string; total: number; completed: number }[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scroller.current;
    const selected = container?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (container && selected) container.scrollLeft += selected.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - selected.offsetWidth) / 2;
  }, [trend]);
  const [selectedDate, setSelectedDate] = useState("");
  const selected = trend.find((day) => day.date === selectedDate) ?? trend.findLast((day) => day.total > 0) ?? trend[trend.length - 1];
  const max = Math.max(...trend.map((day) => day.total), 1);
  const hasData = trend.some((day) => day.total > 0);
  const tickEvery = Math.max(1, Math.ceil(trend.length / 6));
  return <section className="min-w-0 rounded-2xl border bg-white p-5 sm:p-6" aria-labelledby="trend-heading"><h2 id="trend-heading" className="text-lg font-semibold tracking-tight text-[#173c3a]">Tren harian</h2><p className="mt-1 text-sm text-[#59706f]">Rencana dan hasil kerja per tanggal pekerjaan.</p>
    {hasData && selected ? <><div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f1f5f4] px-3 py-3 text-xs text-[#59706f]"><span className="font-semibold text-[#294846]">{displayDate(selected.date, true)}</span><span className="tabular-nums"><strong className="font-semibold text-[#176d68]">{selected.completed} selesai</strong> / {selected.total} rencana</span></div><div className="mt-5 flex gap-3"><div className="flex h-40 shrink-0 flex-col justify-between text-xs tabular-nums text-[#59706f]" aria-hidden="true"><span>{max}</span><span>{Math.round(max / 2)}</span><span>0</span></div><div ref={scroller} className="min-w-0 flex-1 overflow-x-auto pb-2"><div className="relative" style={{ minWidth: `${Math.max(240, trend.length * 28)}px` }}><div className="pointer-events-none absolute inset-x-0 top-0 h-40 border-y"><div className="absolute inset-x-0 top-1/2 border-t border-dashed" /></div><div className="relative grid h-[190px] gap-1" style={{ gridTemplateColumns: `repeat(${trend.length}, minmax(0, 1fr))` }}>{trend.map((day, index) => <button key={day.date} type="button" aria-pressed={day.date === selected.date} aria-label={`${displayDate(day.date, true)}: ${day.completed} dari ${day.total} pekerjaan selesai`} onMouseEnter={() => setSelectedDate(day.date)} onFocus={() => setSelectedDate(day.date)} onClick={() => setSelectedDate(day.date)} className={`group relative min-w-6 rounded-md hover:bg-[#e3f3f0]/50 focus-visible:outline-offset-[-2px] ${day.date === selected.date ? "bg-[#e3f3f0]/60" : ""}`}><span className="absolute inset-x-0.5 top-0 h-40"><span className="absolute inset-x-0 bottom-0 min-h-px rounded-t bg-[#d6e5e2]" style={{ height: `${day.total / max * 100}%` }} /><span className="absolute inset-x-0 bottom-0 rounded-t bg-[#137d79] group-hover:bg-[#0e6865]" style={{ height: `${day.completed / max * 100}%` }} /></span><span className="absolute inset-x-0 bottom-0 h-6 pt-1 text-center text-xs text-[#59706f]">{index % tickEvery === 0 || index === trend.length - 1 ? Number(day.date.slice(-2)) : ""}</span></button>)}</div></div></div></div><div className="mt-4 flex flex-wrap gap-4 text-xs text-[#59706f]"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#137d79]" />Selesai</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#d6e5e2]" />Total rencana</span></div><p className="mt-3 text-xs leading-5 text-[#59706f]">Sentuh atau fokuskan batang untuk melihat angkanya. Geser grafik untuk tanggal lainnya.</p></> : <EmptyCopy title="Belum ada aktivitas" text="Grafik akan menampilkan pekerjaan pada periode yang dipilih." />}
  </section>;
}

function EmptyCopy({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="px-5 py-9 text-center"><CalendarDays className="mx-auto size-6 text-[#59706f]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-[#294846]">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#59706f]">{text}</p>{action && <div className="mt-4">{action}</div>}</div>;
}
