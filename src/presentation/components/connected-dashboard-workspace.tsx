"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  summarizeDashboard,
  type DashboardPlan,
} from "@/application/dashboard-analytics";
import type { SafeUser, WeeklyPlan } from "@/domain/models";
import { PageHeading, StatusBadge } from "./workspace-ui";

type Preset = "week" | "month" | "custom";

function startOfWeek(date: string) {
  const current = new Date(date + "T00:00:00Z");
  current.setUTCDate(current.getUTCDate() - ((current.getUTCDay() + 6) % 7));
  return current.toISOString().slice(0, 10);
}

function startOfMonth(date: string) {
  return date.slice(0, 8) + "01";
}

function displayShortDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value + "T00:00:00"));
}

function monitoringHref(userId: string, from: string, to: string, recordId?: string) {
  const params = new URLSearchParams({ userId, from, to });
  if (recordId) params.set("recordId", recordId);
  return `/monitoring?${params}`;
}

export function ConnectedDashboardWorkspace({
  users,
  plans,
  weeklyPlans,
  completedStatusLabels,
  today,
}: {
  users: SafeUser[];
  plans: DashboardPlan[];
  weeklyPlans: WeeklyPlan[];
  completedStatusLabels: string[];
  today: string;
}) {
  const [preset, setPreset] = useState<Preset>("month");
  const [dateFrom, setDateFrom] = useState(startOfMonth(today));
  const [dateTo, setDateTo] = useState(today);
  const summary = useMemo(
    () =>
      summarizeDashboard(
        users,
        plans,
        completedStatusLabels,
        dateFrom,
        dateTo,
        today,
      ),
    [users, plans, completedStatusLabels, dateFrom, dateTo, today],
  );
  const maxUserTotal = Math.max(...summary.byUser.map((user) => user.total), 1);
  const maxDailyTotal = Math.max(...summary.trend.map((day) => day.total), 1);
  const activeTrendDays = summary.trend.filter((day) => day.total > 0);
  const weeklySummary = useMemo(() => weeklyPlans.filter((plan) => !plan.deletedAt && plan.weekStart <= dateTo && plan.weekEnd >= dateFrom).map((plan) => {
    const children = plans.filter((daily) => daily.weeklyPlanId === plan.id && !daily.deletedAt);
    const completed = children.filter((daily) => Boolean(daily.afternoonStatus && completedStatusLabels.includes(daily.afternoonStatus))).length;
    const total = plan.plannedActionPlanIds.length || children.length;
    return { ...plan, ownerName: users.find((user) => user.id === plan.userId)?.name ?? "User", completed, total };
  }).sort((a, b) => a.weekEnd.localeCompare(b.weekEnd)), [weeklyPlans, plans, completedStatusLabels, users, dateFrom, dateTo]);

  function setPeriod(nextPreset: Exclude<Preset, "custom">) {
    setPreset(nextPreset);
    setDateFrom(
      nextPreset === "week" ? startOfWeek(today) : startOfMonth(today),
    );
    setDateTo(today);
  }

  return (
    <section className="w-full max-w-none">
      <PageHeading
        title="Dashboard"
        description="Ringkasan progres Action Plan seluruh User pada periode yang dipilih."
      />
      <p className="sr-only" role="status">Menampilkan {summary.total} Action Plan dari {displayShortDate(dateFrom)} sampai {displayShortDate(dateTo)}.</p>

      <div className="mt-8 flex flex-col gap-4 border-y border-[#dce5e4] py-4 xl:flex-row xl:items-end xl:justify-between">
        <div
          className="flex flex-wrap gap-2"
          aria-label="Pilih periode Dashboard"
        >
          <button
            type="button"
            onClick={() => setPeriod("week")}
            className={
              "h-10 rounded-xl px-4 text-sm font-semibold transition " +
              (preset === "week"
                ? "bg-[#e3f3f0] text-[#116b67]"
                : "border bg-white text-[#59706f] hover:bg-[#f1f5f4]")
            }
          >
            Minggu ini
          </button>
          <button
            type="button"
            onClick={() => setPeriod("month")}
            className={
              "h-10 rounded-xl px-4 text-sm font-semibold transition " +
              (preset === "month"
                ? "bg-[#e3f3f0] text-[#116b67]"
                : "border bg-white text-[#59706f] hover:bg-[#f1f5f4]")
            }
          >
            Bulan ini
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]">
            <span>TANGGAL DARI</span>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={(event) => {
                setPreset("custom");
                setDateFrom(event.target.value);
              }}
              className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79]"
            />
          </label>
          <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]">
            <span>TANGGAL SAMPAI</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              max={today}
              onChange={(event) => {
                setPreset("custom");
                setDateTo(event.target.value);
              }}
              className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79]"
            />
          </label>
        </div>
      </div>

      <section
        className="mt-6 overflow-hidden rounded-2xl bg-[#173c3a] text-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.45)]"
        aria-live="polite"
      >
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            {summary.overdue.length === 0 ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#c8ebe7]" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#ffd88c]" aria-hidden="true" />
            )}
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {summary.overdue.length === 0
                  ? "Operasional terkendali"
                  : "Perlu perhatian"}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#d6e8e6]">
                {summary.overdue.length === 0
                  ? "Tidak ada Action Plan sebelum hari ini yang belum berstatus final."
                  : summary.overdue.length +
                    " Action Plan sebelum hari ini belum berstatus final. Prioritaskan tindak lanjut berikut."}
              </p>
            </div>
          </div>
          {summary.overdue.length > 5 && (
            <p className="shrink-0 text-sm text-[#c8ebe7]">
              Menampilkan 5 prioritas
            </p>
          )}
        </div>
        {summary.overdue.length > 0 && (
          <div className="border-t border-white/15">
            {summary.overdue.slice(0, 5).map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{plan.task}</p>
                  <p className="mt-1 text-sm text-[#c8ebe7]">
                    {plan.ownerName} · {displayShortDate(plan.date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusBadge status={plan.morningStatus} />
                  <StatusBadge status={plan.afternoonStatus} />
                  <Link href={monitoringHref(plan.ownerId, plan.date, plan.date, plan.id)} className="rounded-lg px-2 py-1 text-sm font-semibold text-[#c8ebe7] hover:bg-white/10 hover:text-white">Lihat detail</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Ringkasan periode
        </h2>
        <dl className="grid divide-y overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <Metric label="User aktif" value={summary.activeUsers} />
          <Metric label="Action Plan" value={summary.total} />
          <Metric label="Selesai" value={summary.completed} />
          <Metric label="Penyelesaian" value={summary.completionRate + "%"} />
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] sm:p-6" aria-labelledby="weekly-heading">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="weekly-heading" className="text-lg font-semibold text-[#244542]">Rencana mingguan</h2><p className="mt-1 text-sm text-[#748886]">Target mingguan yang periodenya beririsan dengan filter Dashboard.</p></div><p className="text-sm font-semibold text-[#176d69]">{weeklySummary.length} rencana</p></div>
        {weeklySummary.length ? <div className="mt-5 divide-y rounded-xl border">{weeklySummary.map((plan) => <article key={plan.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold text-[#294846]">{plan.title}</p><p className="mt-1 text-sm text-[#748886]">{plan.ownerName} · {displayShortDate(plan.weekStart)} – {displayShortDate(plan.weekEnd)}</p></div><p className="shrink-0 text-sm font-semibold tabular-nums text-[#176d69]">{plan.completed} / {plan.total} selesai</p></article>)}</div> : <EmptyCopy text="Tidak ada rencana mingguan pada periode ini." />}
      </section>

      <div className="mt-6 grid gap-6 xl:items-start xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="rounded-2xl border bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] sm:p-6 xl:self-start">
          <div>
            <h2 className="text-lg font-semibold text-[#244542]">
              Progres per User
            </h2>
            <p className="mt-1 text-sm text-[#748886]">
              Teal menunjukkan Action Plan selesai; latar menunjukkan total
              rencana kerja.
            </p>
          </div>
          <div className="mt-6 space-y-5">
            {summary.byUser.map((user) => (
              <div key={user.userId}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="truncate text-sm font-semibold text-[#294846]">
                    {user.name}
                  </p>
                  <div className="flex shrink-0 items-center gap-3"><p className="text-xs font-semibold tabular-nums text-[#51716e]">{user.total === 0 ? "Belum ada rencana" : user.completed + " / " + user.total + " selesai"}</p><Link href={monitoringHref(user.userId, dateFrom, dateTo)} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#137d79] hover:bg-[#e8f3f1]">Lihat</Link></div>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e8eeee]">
                  <div
                    className="h-full rounded-full bg-[#a9dcd6]"
                    style={{
                      width: String((user.total / maxUserTotal) * 100) + "%",
                    }}
                  >
                    <div
                      className="h-full rounded-full bg-[#137d79]"
                      style={{
                        width:
                          user.total === 0
                            ? "0%"
                            : String((user.completed / user.total) * 100) + "%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {summary.byUser.length === 0 && (
            <EmptyCopy text="Belum ada User untuk ditampilkan." />
          )}
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#244542]">
              Tren harian
            </h2>
            <p className="mt-1 text-sm text-[#748886]">
              Total rencana kerja dan bagian yang sudah selesai setiap hari.
            </p>
          </div>
          {activeTrendDays.length < 2 ? (
            <div className="mt-6 border-y border-[#dce5e4] py-5">
              {activeTrendDays[0] ? <><p className="text-sm font-semibold text-[#294846]">Aktivitas pada {displayShortDate(activeTrendDays[0].date)}</p><p className="mt-1 text-sm text-[#748886]">{activeTrendDays[0].total} Action Plan · {activeTrendDays[0].completed} selesai</p></> : <p className="text-sm text-[#748886]">Belum ada Action Plan pada periode ini.</p>}
            </div>
          ) : <><div className="mt-6 overflow-x-auto"><div className="grid min-w-[360px] items-end gap-1.5" style={{ gridTemplateColumns: "repeat(" + summary.trend.length + ", minmax(0, 1fr))" }}>{summary.trend.map((day) => <div key={day.date} className="min-w-0" title={displayShortDate(day.date) + ": " + day.completed + " dari " + day.total + " selesai"}><div className="relative h-40"><div className="absolute inset-x-0 bottom-0 rounded-t bg-[#e8eeee]" style={{ height: String((day.total / maxDailyTotal) * 100) + "%" }} /><div className="absolute inset-x-0 bottom-0 rounded-t bg-[#137d79]" style={{ height: String((day.completed / maxDailyTotal) * 100) + "%" }} /></div><p className="mt-2 truncate text-center text-xs text-[#778a88]">{new Date(day.date + "T00:00:00").getUTCDate()}</p></div>)}</div></div><div className="mt-4 flex gap-4 text-xs text-[#748886]"><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-[#137d79]" />Selesai</span><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-[#e8eeee]" />Total</span></div></>}
        </section>
      </div>

    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-5">
      <dt className="text-sm text-[#748886]">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight text-[#244542]">
        {value}
      </dd>
    </div>
  );
}

function EmptyCopy({ text }: { text: string }) {
  return <p className="p-8 text-center text-sm text-[#748886]">{text}</p>;
}
