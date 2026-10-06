export default function DashboardLoading() {
  return <section className="w-full max-w-none" aria-busy="true" aria-live="polite"><span className="sr-only">Memuat halaman...</span><div className="h-9 w-56 animate-pulse rounded-lg bg-[#e8eeee]" /><div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-[#eef3f2]" /><div className="mt-8 h-14 animate-pulse rounded-2xl border bg-white" /><div className="mt-6 h-72 animate-pulse rounded-2xl border bg-white" /></section>;
}
