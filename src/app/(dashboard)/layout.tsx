import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppError } from "@/application/errors";
import { AppShell } from "@/presentation/components/app-shell";
import { DataUnavailable } from "@/presentation/components/data-unavailable";
import { currentActor } from "@/presentation/server/actor";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let actor;
  try {
    actor = await currentActor();
  } catch (error) {
    if (error instanceof AppError && error.code === "FORBIDDEN") redirect("/login");
    return <DataUnavailable />;
  }
  const workspacePeriod = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date());
  return <AppShell actor={actor} workspacePeriod={workspacePeriod}>{children}</AppShell>;
}
