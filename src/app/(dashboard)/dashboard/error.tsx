"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="mx-auto w-full max-w-3xl py-12" aria-labelledby="dashboard-error-heading">
    <div role="alert" className="rounded-2xl border border-[#e4c8c2] bg-white p-6 shadow-sm sm:p-8">
      <AlertCircle className="size-7 text-[#b74f3b]" aria-hidden="true" />
      <h1 id="dashboard-error-heading" className="mt-4 text-xl font-semibold text-[#173c3a]">Dashboard belum dapat dimuat</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#59706f]">Koneksi ke data tim sedang lambat atau bermasalah. Data Action Plan tidak diubah. Coba muat kembali beberapa saat lagi.</p>
      <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0e6865] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#137d79]"><RefreshCw className="size-4" aria-hidden="true" />Coba lagi</button>
    </div>
  </section>;
}
