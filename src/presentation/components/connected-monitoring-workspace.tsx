"use client";

import { useMemo, useState } from "react";

import type { ActionPlan, SafeUser } from "@/domain/models";
import { useFeedback } from "./feedback";
import { ExternalLink, Search } from "./icons";
import { PageHeading, StatusBadge } from "./workspace-ui";

type Scope = "all" | "active" | "history";

function displayDate(value: string) { return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(`${value}T00:00:00`)); }

export function ConnectedMonitoringWorkspace({ users, initialPlans }: { users: SafeUser[]; initialPlans: ActionPlan[] }) {
  const { notify } = useFeedback();
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? "");
  const [plans, setPlans] = useState(initialPlans);
  const [scope, setScope] = useState<Scope>("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = users.find((user) => user.id === selectedId);
  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const searchable = `${plan.task} ${plan.note ?? ""} ${plan.morningStatus} ${plan.afternoonStatus ?? ""}`.toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (!dateFrom || plan.date >= dateFrom) && (!dateTo || plan.date <= dateTo);
    });
  }, [plans, query, dateFrom, dateTo]);
  const hasFilters = Boolean(query || dateFrom || dateTo);

  async function loadPlans(userId: string, nextScope: Scope) {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/action-plans?userId=${encodeURIComponent(userId)}&scope=${nextScope}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Data tidak dapat dimuat.");
      setPlans(body);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Data tidak dapat dimuat.";
      setError(message); notify("error", "Monitoring belum dimuat", message);
    } finally { setLoading(false); }
  }

  function selectUser(id: string) { setSelectedId(id); void loadPlans(id, scope); }
  function selectScope(nextScope: Scope) { setScope(nextScope); if (selectedId) void loadPlans(selectedId, nextScope); }

  return <section className="w-full max-w-none"><PageHeading title="Monitoring" description="Pantau Action Plan aktif dan riwayat seluruh User tanpa perlu berpindah akun." />{users.length === 0 ? <div className="mt-8 rounded-2xl border bg-white p-10 text-center"><p className="font-semibold text-[#294846]">Belum ada User aktif.</p><p className="mt-1 text-sm text-[#748886]">Tambahkan akun User dari halaman Users untuk memulai monitoring.</p></div> : <div className="mt-8 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]"><aside className="rounded-2xl border bg-white p-3 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><p className="px-2 pb-3 pt-1 text-xs font-semibold tracking-[0.06em] text-[#7b8f8d]">USER AKTIF</p><div className="space-y-1">{users.map((user) => <button key={user.id} onClick={() => selectUser(user.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === user.id ? "bg-[#e3f3f0]" : "hover:bg-[#f5f8f7]"}`}><span className="grid size-9 place-items-center rounded-full bg-[#eef3f2] text-xs font-bold text-[#627876]">{user.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#294846]">{user.name}</span><span className="mt-0.5 block text-xs text-[#778a88]">{user.email}</span></span></button>)}</div></aside><div><div className="flex items-center gap-3 border-y py-4"><span className="grid size-10 place-items-center rounded-full bg-[#c8ebe7] text-sm font-bold text-[#155f5c]">{selected?.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold text-[#244542]">{selected?.name}</p><p className="truncate text-sm text-[#748886]">{selected?.email}</p></div></div><div className="mt-5 flex flex-col gap-4"><div className="flex flex-wrap gap-2" aria-label="Filter status Action Plan">{([ ["all", "Semua"], ["active", "Aktif"], ["history", "Selesai"] ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => selectScope(value)} className={`h-10 rounded-xl px-4 text-sm font-semibold transition ${scope === value ? "bg-[#e3f3f0] text-[#116b67]" : "border bg-white text-[#59706f] hover:bg-[#f1f5f4]"}`}>{label}</button>)}</div><div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-end"><label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]"><span>TANGGAL DARI</span><input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40" /></label><label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]"><span>TANGGAL SAMPAI</span><input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40" /></label></div><div className="flex w-full gap-2 sm:w-auto"><label className="relative block min-w-0 flex-1 sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" /><span className="sr-only">Cari Action Plan, catatan, atau status</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none focus:border-[#137d79]" placeholder="Cari Action Plan atau status" /></label>{hasFilters && <button type="button" onClick={() => { setQuery(""); setDateFrom(""); setDateTo(""); }} className="h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-[#59706f] hover:bg-[#eef4f3]">Reset</button>}</div></div></div>{error && <p className="mt-4 rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]"><tr><th className="px-5 py-3.5">TANGGAL</th><th className="px-5 py-3.5">ACTION PLAN</th><th className="px-5 py-3.5">PAGI</th><th className="px-5 py-3.5">SORE</th><th className="px-5 py-3.5">HASIL</th></tr></thead><tbody>{filteredPlans.map((plan) => <tr key={plan.id} className="border-b last:border-0"><td className="whitespace-nowrap px-5 py-4 text-sm text-[#627876]">{displayDate(plan.date)}</td><td className="px-5 py-4"><p className="font-medium text-[#244542]">{plan.task}</p>{plan.note && <p className="mt-1 text-sm text-[#7c8f8d]">{plan.note}</p>}</td><td className="px-5 py-4"><StatusBadge status={plan.morningStatus} /></td><td className="px-5 py-4"><StatusBadge status={plan.afternoonStatus} /></td><td className="px-5 py-4">{plan.resultLink ? <a href={plan.resultLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-[#137d79] hover:underline">Buka <ExternalLink className="size-3.5" /></a> : <span className="text-sm text-[#9aa9a8]">—</span>}</td></tr>)}</tbody></table></div>{!loading && filteredPlans.length === 0 && <div className="p-10 text-center text-sm text-[#748886]">{hasFilters ? "Tidak ada Action Plan yang sesuai filter." : "Belum ada Action Plan untuk User ini."}</div>}{loading && <div className="p-10 text-center text-sm text-[#748886]">Memuat Action Plan...</div>}</div></div></div>}</section>;
}
