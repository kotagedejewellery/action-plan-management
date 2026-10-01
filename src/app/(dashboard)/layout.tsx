import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/presentation/components/app-shell";
import { currentActor } from "@/presentation/server/actor";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let actor;
  try {
    actor = await currentActor();
  } catch {
    redirect("/login");
  }
  return <AppShell actor={actor}>{children}</AppShell>;
}
