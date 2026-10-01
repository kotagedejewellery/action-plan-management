import Link from "next/link";

import { ArrowRight, CheckMark } from "@/presentation/components/icons";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f8] p-4 sm:p-4 lg:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] w-full overflow-hidden rounded-2xl border bg-white shadow-[0_24px_60px_-38px_rgba(26,55,54,0.38)] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between bg-[#173c3a] p-8 text-white sm:p-12">
          <div>
            <div className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#c8ebe7] text-[#173c3a]">AP</span>Action Plan</div>
            <div className="mt-24 max-w-md lg:mt-40"><h1 className="text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Pekerjaan harian, tetap bergerak dengan jelas.</h1><p className="mt-5 max-w-sm text-base leading-7 text-[#c4d8d5]">Catat rencana, perbarui progres, dan simpan hasil kerja dalam satu alur yang rapi.</p></div>
          </div>
          <p className="text-sm text-[#a9c5c1]">Internal workspace · Action Plan Management System</p>
        </section>
        <section className="flex items-center px-6 py-12 sm:px-12 lg:px-12"><div className="w-full max-w-md"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#173c3a]">Masuk ke workspace</h2><p className="mt-3 text-sm leading-6 text-[#667c7c]">Gunakan akun yang sudah diberikan oleh Admin.</p><form className="mt-9 space-y-5"><label className="block text-sm font-medium text-[#294846]">Email<input className="mt-2 h-12 w-full rounded-xl border bg-white px-3 text-[#172b2d] outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" type="email" name="email" autoComplete="username" required placeholder="nama@perusahaan.com" /></label><label className="block text-sm font-medium text-[#294846]">Password<input className="mt-2 h-12 w-full rounded-xl border bg-white px-3 text-[#172b2d] outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" type="password" name="password" autoComplete="current-password" required placeholder="Masukkan password" /></label><Link className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]" href="/action-plans">Masuk ke Action Plan <ArrowRight className="size-4" /></Link></form><div className="mt-8 border-t pt-6 text-sm text-[#667c7c]"><p className="flex items-center gap-2"><CheckMark className="size-4 text-[#137d79]" /> Akses dibatasi sesuai role akun.</p></div></div></section>
      </div>
    </main>
  );
}
