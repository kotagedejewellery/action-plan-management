import Link from "next/link";

export function DivisionUnavailable() {
  return <section className="max-w-2xl rounded-2xl border bg-white p-6"><h1 className="text-2xl font-semibold text-[#173c3a]">Akses divisi belum tersedia</h1><p className="mt-3 text-sm leading-6 text-[#516967]">Akun Anda belum terhubung ke divisi aktif. Hubungi SuperAdmin untuk memeriksa penugasan divisi. Data pekerjaan tetap tersimpan.</p><Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-semibold text-[#137d79]">Periksa kembali akses</Link></section>;
}
