"use client";

type DataUnavailableProps = { onRetry?: () => void; description?: string };

export function DataUnavailable({ onRetry, description = "Koneksi ke data Action Plan sedang mencapai batas sementara. Tunggu sekitar satu menit, lalu coba lagi. Sesi Anda tetap aman." }: DataUnavailableProps) {
  return <main className="grid min-h-dvh place-items-center bg-[#f6f8f8] px-5 py-8"><section className="w-full max-w-md rounded-2xl border border-[#dce5e4] bg-white p-7 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]"><h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#172b2d]">Data sedang sibuk</h1><p className="mt-3 text-sm leading-6 text-[#667c7c]">{description}</p><button type="button" onClick={onRetry ?? (() => window.location.reload())} className="mt-6 h-11 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865] focus:outline-none focus:ring-3 focus:ring-[#c8ebe7] focus:ring-offset-3">Coba lagi</button></section></main>;
}
