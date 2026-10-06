"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ArrowRight } from "./icons";
import { useFeedback } from "./feedback";

export function LoginForm() {
  const { notify } = useFeedback();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: String(data.get("email")), password: String(data.get("password")), redirect: false });
    setLoading(false);
    if (result?.error) { const message = "Email, password, atau status akun tidak valid."; setError(message); notify("error", "Login belum berhasil", message); return; }
    notify("success", "Login berhasil", "Mengarahkan Anda ke workspace.");
    router.replace("/");
  }
  return <form onSubmit={submit} className="mt-9 space-y-5"><label className="block text-sm font-medium text-[#294846]">Email<input className="mt-2 h-12 w-full rounded-xl border bg-white px-3 text-[#172b2d] outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" type="email" name="email" autoComplete="username" required placeholder="nama@perusahaan.com" /></label><label className="block text-sm font-medium text-[#294846]">Password<input className="mt-2 h-12 w-full rounded-xl border bg-white px-3 text-[#172b2d] outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]" type="password" name="password" autoComplete="current-password" required placeholder="Masukkan password" /></label>{error && <p className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]" role="alert">{error}</p>}<button disabled={loading} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865] disabled:opacity-60">{loading ? "Memeriksa akun..." : <>Masuk ke Action Plan <ArrowRight className="size-4" /></>}</button></form>;
}
