import { CheckMark } from "@/presentation/components/icons";
import { LoginForm } from "@/presentation/components/login-form";

export default function LoginPage() {
  return <main className="min-h-screen bg-[#f6f8f8] p-4 sm:p-6"><section className="flex min-h-[calc(100vh-2rem)] items-center justify-center rounded-2xl border bg-white px-6 py-12 shadow-[0_24px_60px_-38px_rgba(26,55,54,0.38)] sm:min-h-[calc(100vh-3rem)] sm:px-12"><div className="w-full max-w-md"><div className="flex items-center gap-3 font-semibold tracking-tight text-[#173c3a]"><span className="grid size-9 place-items-center rounded-xl bg-[#173c3a] text-sm font-bold text-[#d7f1ed]">AP</span>Action Plan</div><div className="mt-12"><h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#173c3a]">Masuk ke workspace</h1><p className="mt-3 text-sm leading-6 text-[#667c7c]">Gunakan akun yang sudah diberikan oleh Admin.</p><LoginForm /><div className="mt-8 border-t pt-6 text-sm text-[#667c7c]"><p className="flex items-center gap-2"><CheckMark className="size-4 text-[#137d79]" />Akses dibatasi sesuai role akun.</p></div></div></div></section></main>;
}
