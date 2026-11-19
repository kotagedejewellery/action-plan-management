"use client";

export default function DashboardLoading() {
  return <section className="w-full" aria-busy="true" aria-label="Memuat Dashboard Tim">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 role="status" className="text-lg font-semibold text-[#173c3a]">Memuat Dashboard Tim…</h1><p className="mt-1 text-sm text-[#59706f]">Kami sedang menyiapkan ringkasan progres dan tindak lanjut tim.</p></div>
      <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center rounded-xl border bg-white px-3 text-sm font-semibold text-[#294846] transition-colors hover:bg-[#f1f5f4]">Coba lagi</button>
    </div>
    <div className="mt-5 flex flex-wrap items-center gap-3 border-y bg-white px-4 py-3"><div className="h-10 w-48 rounded-xl bg-[#e4ecea] motion-safe:animate-pulse" /><div className="h-10 w-36 rounded-xl bg-[#e4ecea] motion-safe:animate-pulse" /><div className="h-4 w-52 rounded bg-[#e4ecea] motion-safe:animate-pulse" /></div>
    <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">{["Total Action Plan", "Selesai", "Penyelesaian", "Belum selesai"].map((label) => <div key={label} className="min-h-40 rounded-2xl border bg-white p-4 sm:p-5"><span className="text-xs font-medium text-[#59706f]">{label}</span><div className="mt-4 h-9 w-16 rounded bg-[#e4ecea] motion-safe:animate-pulse" /><div className="mt-3 h-4 w-28 rounded bg-[#e4ecea] motion-safe:animate-pulse" /></div>)}</div>
    <div className="mt-5 rounded-2xl border bg-white p-5 sm:p-6"><div className="h-5 w-48 rounded bg-[#e4ecea] motion-safe:animate-pulse" /><div className="mt-3 h-4 max-w-md rounded bg-[#e4ecea] motion-safe:animate-pulse" /><div className="mt-6 space-y-4">{[0, 1, 2].map((item) => <div key={item} className="flex items-center gap-3"><div className="size-10 rounded-full bg-[#e4ecea] motion-safe:animate-pulse" /><div className="min-w-0 flex-1"><div className="h-4 max-w-xs rounded bg-[#e4ecea] motion-safe:animate-pulse" /><div className="mt-2 h-2 rounded bg-[#e4ecea] motion-safe:animate-pulse" /></div></div>)}</div></div>
  </section>;
}
