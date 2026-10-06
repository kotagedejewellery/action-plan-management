"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import type { ActionPlan, SafeUser } from "@/domain/models";
import { useFeedback } from "./feedback";
import { ExternalLink, Search } from "./icons";
import { DialogFrame, PageHeading, StatusBadge } from "./workspace-ui";

type Scope = "all" | "active" | "history";

function displayDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(`${value}T00:00:00`));
}

function displayTimestamp(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));
}

export function ConnectedMonitoringWorkspace({
  users,
  initialPlans,
  initialSelectedId,
  initialRecordId,
  initialDateFrom,
  initialDateTo,
}: {
  users: SafeUser[];
  initialPlans: ActionPlan[];
  initialSelectedId: string;
  initialRecordId: string;
  initialDateFrom: string;
  initialDateTo: string;
}) {
  const { notify } = useFeedback();
  const [selectedId, setSelectedId] = useState(initialSelectedId || users[0]?.id || "");
  const [plans, setPlans] = useState(initialPlans);
  const [scope, setScope] = useState<Scope>("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [detailId, setDetailId] = useState(initialRecordId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const requestController = useRef<AbortController | null>(null);
  const selected = users.find((user) => user.id === selectedId);
  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const searchable =
        `${plan.task} ${plan.note ?? ""} ${plan.morningStatus} ${plan.afternoonStatus ?? ""}`.toLowerCase();
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (!dateFrom || plan.date >= dateFrom) &&
        (!dateTo || plan.date <= dateTo)
      );
    });
  }, [plans, query, dateFrom, dateTo]);
  const hasFilters = Boolean(query || dateFrom || dateTo);
  const selectedPlan = plans.find((plan) => plan.id === detailId);
  const imageAttachments = selectedPlan?.attachments?.filter((attachment) => attachment.mimeType.startsWith("image/")) ?? [];
  const documentAttachments = selectedPlan?.attachments?.filter((attachment) => !attachment.mimeType.startsWith("image/")) ?? [];

  useEffect(() => () => requestController.current?.abort(), []);

  async function loadPlans(userId: string, nextScope: Scope) {
    const currentRequestId = ++requestId.current;
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/action-plans?userId=${encodeURIComponent(userId)}&scope=${nextScope}`,
        { signal: controller.signal },
      );
      const body = await response.json();
      if (currentRequestId !== requestId.current) return;
      if (!response.ok)
        throw new Error(body.error ?? "Data tidak dapat dimuat.");
      setPlans(body);
    } catch (caught) {
      if (currentRequestId !== requestId.current || (caught instanceof Error && caught.name === "AbortError")) return;
      const message =
        caught instanceof Error ? caught.message : "Data tidak dapat dimuat.";
      setError(message);
      notify("error", "Monitoring belum dimuat", message);
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }

  function selectUser(id: string) {
    setDetailId("");
    setSelectedId(id);
    void loadPlans(id, scope);
  }
  function selectScope(nextScope: Scope) {
    setDetailId("");
    setScope(nextScope);
    if (selectedId) void loadPlans(selectedId, nextScope);
  }

  return (
    <section className="w-full max-w-none">
      <PageHeading
        title="Monitoring"
        description="Pantau Action Plan aktif dan riwayat seluruh User tanpa perlu berpindah akun."
      />
      {users.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
          <p className="font-semibold text-[#294846]">Belum ada User aktif.</p>
          <p className="mt-1 text-sm text-[#748886]">
            Tambahkan akun User dari halaman Users untuk memulai monitoring.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden rounded-2xl border bg-white p-3 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)] xl:block">
            <p className="px-2 pb-3 pt-1 text-xs font-semibold tracking-[0.06em] text-[#7b8f8d]">
              USER AKTIF
            </p>
            <div className="space-y-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === user.id ? "bg-[#e3f3f0]" : "hover:bg-[#f5f8f7]"}`}
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[#eef3f2] text-xs font-bold text-[#627876]">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#294846]">
                      {user.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#778a88]">
                      {user.email}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
          <div className="min-w-0">
            <label className="block xl:hidden">
              <span className="text-xs font-semibold tracking-[0.04em] text-[#718583]">
                PILIH USER
              </span>
              <select
                value={selectedId}
                onChange={(event) => selectUser(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-[#294846] outline-none focus:border-[#137d79]"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden items-center gap-3 border-y py-4 xl:flex">
              <span className="grid size-10 place-items-center rounded-full bg-[#c8ebe7] text-sm font-bold text-[#155f5c]">
                {selected?.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#244542]">
                  {selected?.name}
                </p>
                <p className="truncate text-sm text-[#748886]">
                  {selected?.email}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <div
                className="flex flex-wrap gap-2"
                aria-label="Filter status Action Plan"
              >
                {(
                  [
                    ["all", "Semua"],
                    ["active", "Aktif"],
                    ["history", "Selesai"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectScope(value)}
                    className={`h-10 rounded-xl px-4 text-sm font-semibold transition ${scope === value ? "bg-[#e3f3f0] text-[#116b67]" : "border bg-white text-[#59706f] hover:bg-[#f1f5f4]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-end">
                  <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]">
                    <span>TANGGAL DARI</span>
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo || undefined}
                      onChange={(event) => setDateFrom(event.target.value)}
                      className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40"
                    />
                  </label>
                  <label className="block text-xs font-semibold tracking-[0.04em] text-[#718583]">
                    <span>TANGGAL SAMPAI</span>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="mt-1.5 block h-10 w-full rounded-xl border bg-white px-3 text-sm font-normal text-[#294846] outline-none focus:border-[#137d79] lg:w-40"
                    />
                  </label>
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <label className="relative block min-w-0 flex-1 sm:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" />
                    <span className="sr-only">
                      Cari Action Plan, catatan, atau status
                    </span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none focus:border-[#137d79]"
                      placeholder="Cari Action Plan atau status"
                    />
                  </label>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setDateFrom("");
                        setDateTo("");
                      }}
                      className="h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-[#59706f] hover:bg-[#eef4f3]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
            {error && (
              <p
                className="mt-4 rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[840px] text-left">
                  <thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]">
                    <tr>
                      <th className="px-5 py-3.5">TANGGAL</th>
                      <th className="px-5 py-3.5">ACTION PLAN</th>
                      <th className="px-5 py-3.5">PAGI</th>
                      <th className="px-5 py-3.5">SORE</th>
                      <th className="px-5 py-3.5">HASIL</th>
                      <th className="px-5 py-3.5 text-right">DETAIL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id} className="border-b last:border-0">
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#627876]">
                          {displayDate(plan.date)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#244542]">
                            {plan.task}
                          </p>
                          {plan.note && (
                            <p className="mt-1 text-sm text-[#7c8f8d]">
                              {plan.note}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={plan.morningStatus} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={plan.afternoonStatus} />
                        </td>
                        <td className="px-5 py-4">
                          {plan.resultLink ? (
                            <a
                              href={plan.resultLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-[#137d79] hover:underline"
                            >
                              Buka <ExternalLink className="size-3.5" />
                            </a>
                          ) : (
                            <span className="text-sm text-[#9aa9a8]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button type="button" onClick={() => setDetailId(plan.id)} className="h-9 rounded-lg px-3 text-sm font-semibold text-[#137d79] hover:bg-[#e8f3f1] focus:outline-none focus:ring-3 focus:ring-[#c8ebe7] focus:ring-offset-2">Lihat</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y md:hidden">
                {filteredPlans.map((plan) => (
                  <article key={plan.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#748886]">
                          {displayDate(plan.date)}
                        </p>
                        <h2 className="mt-1 font-semibold leading-6 text-[#244542]">
                          {plan.task}
                        </h2>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => setDetailId(plan.id)} className="inline-flex h-9 items-center rounded-lg px-2 text-sm font-semibold text-[#137d79] hover:bg-[#e8f3f1] focus:outline-none focus:ring-3 focus:ring-[#c8ebe7]">Detail</button>
                        {plan.resultLink && <a href={plan.resultLink} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-[#137d79] hover:bg-[#e8f3f1] hover:underline">Buka <ExternalLink className="size-3.5" /></a>}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge status={plan.morningStatus} />
                      <StatusBadge status={plan.afternoonStatus} />
                    </div>
                    {plan.note && (
                      <p className="mt-3 text-sm leading-6 text-[#748886]">
                        {plan.note}
                      </p>
                    )}
                  </article>
                ))}
              </div>
              {!loading && filteredPlans.length === 0 && (
                <div className="p-10 text-center text-sm text-[#748886]">
                  {hasFilters
                    ? "Tidak ada Action Plan yang sesuai filter."
                    : "Belum ada Action Plan untuk User ini."}
                </div>
              )}
              {loading && (
                <div className="p-10 text-center text-sm text-[#748886]">
                  Memuat Action Plan...
                </div>
              )}
            </div>
            {selectedPlan && (
              <DialogFrame title="Detail Action Plan" description={`${selected?.name ?? "User"} · ${displayDate(selectedPlan.date)}`} onClose={() => setDetailId("")}>
                <div className="mt-6 space-y-6">
                  <section>
                    <h3 className="text-sm font-semibold text-[#294846]">Action Plan</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#516967]">{selectedPlan.task}</p>
                  </section>
                  <dl className="grid gap-4 border-y border-[#dce5e4] py-4 sm:grid-cols-2">
                    <div><dt className="text-xs font-semibold tracking-[0.04em] text-[#718583]">STATUS PAGI</dt><dd className="mt-2"><StatusBadge status={selectedPlan.morningStatus} /></dd></div>
                    <div><dt className="text-xs font-semibold tracking-[0.04em] text-[#718583]">STATUS SORE</dt><dd className="mt-2"><StatusBadge status={selectedPlan.afternoonStatus} /></dd></div>
                  </dl>
                  {selectedPlan.note && <section><h3 className="text-sm font-semibold text-[#294846]">Catatan</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#667c7c]">{selectedPlan.note}</p></section>}
                  {selectedPlan.resultLink && <section><h3 className="text-sm font-semibold text-[#294846]">Link hasil</h3><a href={selectedPlan.resultLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#137d79] hover:underline">Buka hasil <ExternalLink className="size-3.5" /></a></section>}
                  {imageAttachments.length > 0 && <section><h3 className="text-sm font-semibold text-[#294846]">Lampiran gambar</h3><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{imageAttachments.map((attachment) => <figure key={attachment.id} className="overflow-hidden rounded-xl border bg-[#f7faf9]"><Image unoptimized src={`/api/action-plans/${selectedPlan.id}/attachments/${attachment.id}?userId=${encodeURIComponent(selectedId)}`} alt={`Lampiran: ${attachment.name}`} width={240} height={240} className="aspect-square w-full object-cover" /><figcaption className="truncate px-2 py-2 text-xs text-[#667c7c]">{attachment.name}</figcaption></figure>)}</div></section>}
                  {documentAttachments.length > 0 && <section><h3 className="text-sm font-semibold text-[#294846]">Dokumen</h3><ul className="mt-3 divide-y rounded-xl border bg-[#f7faf9]">{documentAttachments.map((attachment) => <li key={attachment.id} className="truncate px-3 py-2 text-sm text-[#516967]" title={attachment.mimeType}>{attachment.name}</li>)}</ul></section>}
                  <dl className="grid gap-3 border-t border-[#dce5e4] pt-4 text-xs text-[#748886] sm:grid-cols-2"><div><dt>Dibuat</dt><dd className="mt-1 font-medium text-[#516967]">{displayTimestamp(selectedPlan.createdAt)}</dd></div><div><dt>Terakhir diperbarui</dt><dd className="mt-1 font-medium text-[#516967]">{displayTimestamp(selectedPlan.updatedAt)}</dd></div></dl>
                </div>
              </DialogFrame>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
