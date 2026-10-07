"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { Actor } from "@/domain/models";
import { useFeedback } from "./feedback";
import {
  Calendar,
  Chart,
  Close,
  Grid,
  History,
  LogOut,
  Menu,
  Users,
} from "./icons";
import { ConfirmDialog } from "./workspace-ui";

const baseNavigation = [
  {
    href: "/action-plans",
    label: "Action Plan",
    icon: Calendar,
    roles: ["user"],
  },
  { href: "/weekly-plans", label: "Rencana Mingguan", icon: Calendar, roles: ["user"] },
  { href: "/history", label: "Riwayat", icon: History, roles: ["user"] },
  { href: "/dashboard", label: "Dashboard", icon: Chart, roles: ["admin"] },
  { href: "/monitoring", label: "Monitoring", icon: Grid, roles: ["admin"] },
  { href: "/users", label: "Users", icon: Users, roles: ["admin"] },
];

export function AppShell({
  children,
  actor,
  workspacePeriod,
}: {
  children: ReactNode;
  actor: Actor;
  workspacePeriod: string;
}) {
  const pathname = usePathname();
  const { notify } = useFeedback();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isNavigating = pendingHref !== null && pendingHref !== pathname;
  const navigation = baseNavigation.filter((item) =>
    item.roles.includes(actor.role),
  );
  const homeHref = actor.role === "admin" ? "/dashboard" : "/action-plans";
  const initials = (actor.name.trim().match(/\S+/g) ?? [actor.email])
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("id-ID");
  const roleLabel = actor.role === "admin" ? "Admin" : "User";
  const accountLabel = `${roleLabel} ${actor.status === "active" ? "aktif" : "nonaktif"}`;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirectTo: "/login" });
    } catch {
      setSigningOut(false);
      notify(
        "error",
        "Gagal keluar",
        "Sesi belum diakhiri. Silakan coba lagi.",
      );
    }
  };

  const sidebar = (
    <aside className="flex h-full w-60 flex-col border-r bg-white px-4 py-5 2xl:w-72">
      <div className="flex items-center justify-between px-2">
        <Link
          className="flex items-center gap-3 font-semibold tracking-tight text-[#173c3a]"
          href={homeHref}
          onClick={() => { setMobileMenuOpen(false); if (pathname !== homeHref) setPendingHref(homeHref); }}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#173c3a] text-sm font-bold text-[#d7f1ed]">
            AP
          </span>
          <span>Action Plan</span>
        </Link>
        <button
          className="grid size-9 place-items-center rounded-lg text-[#667c7c] lg:hidden"
          aria-label="Tutup navigasi"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Close className="size-5" />
        </button>
      </div>

      <nav className="mt-10 space-y-1" aria-label="Navigasi utama" aria-busy={isNavigating}>
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${active ? "bg-[#e3f3f0] text-[#116b67]" : "text-[#59706f] hover:bg-[#f1f5f4] hover:text-[#244542]"}`}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => { setMobileMenuOpen(false); if (!active) setPendingHref(href); }}
            >
              <Icon className="size-[18px]" />
              {label}
              {isNavigating && pendingHref === href && <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold" role="status"><span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /><span className="sr-only">Memuat {label}</span></span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="rounded-xl bg-[#f2f6f5] p-3">
          <div className="flex items-center gap-3">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c8ebe7] text-xs font-bold text-[#155f5c]"
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#244542]">
                {actor.name}
              </p>
              <p className="text-xs text-[#748886]">{accountLabel}</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#667c7c] transition hover:bg-[#f1f5f4] hover:text-[#244542]"
          onClick={() => {
            setMobileMenuOpen(false);
            setLogoutConfirmationOpen(true);
          }}
        >
          <LogOut className="size-[18px]" />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="min-h-screen bg-[#f6f8f8] lg:flex">
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:block">
          {sidebar}
        </div>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#173c3a]/25 lg:hidden">
            <div className="h-full shadow-[16px_0_48px_-22px_rgba(23,60,58,0.45)]">
              {sidebar}
            </div>
          </div>
        )}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-60 2xl:ml-72">
          <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-7">
            <button
              className="grid size-10 place-items-center rounded-xl border bg-white text-[#32514f] lg:hidden"
              aria-label="Buka navigasi"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <p className="hidden text-sm text-[#6c807f] sm:block">
              Workspace · {workspacePeriod}
            </p>
            <div className="ml-auto flex min-w-0 items-center gap-3">
              <span className="hidden truncate text-sm font-medium text-[#3a5856] sm:inline">
                {actor.name}
              </span>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c8ebe7] text-xs font-bold text-[#155f5c]"
                aria-label={`Akun ${actor.name}`}
              >
                {initials}
              </span>
            </div>
          </header>
          <main className="flex-1 px-4 py-7 sm:px-7 lg:px-7 lg:py-7 xl:px-8">
            {children}
          </main>
        </div>
      </div>
      {logoutConfirmationOpen && (
        <ConfirmDialog
          title="Keluar dari akun?"
          description="Anda perlu login kembali untuk mengakses workspace ini."
          confirmLabel="Keluar"
          confirming={signingOut}
          onCancel={() => setLogoutConfirmationOpen(false)}
          onConfirm={handleSignOut}
        />
      )}
    </>
  );
}
