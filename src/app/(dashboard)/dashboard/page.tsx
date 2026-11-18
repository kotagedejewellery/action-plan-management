import { redirect } from "next/navigation";
import { requireMonitorActor } from "@/application/access";
import { divisions } from "@/infrastructure/container";
import { ConnectedDashboardWorkspace } from "@/presentation/components/connected-dashboard-workspace";
import { DivisionFilter } from "@/presentation/components/division-filter";
import { DivisionUnavailable } from "@/presentation/components/division-unavailable";
import { currentActor } from "@/presentation/server/actor";
import { loadDashboard } from "@/presentation/server/dashboard";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ divisionId?: string }> }) {
  const actor = await currentActor();
  if (actor.role === "user") redirect("/action-plans");
  if (actor.role === "bod" && !actor.divisionId) return <DivisionUnavailable />;
  requireMonitorActor(actor);
  const { divisionId } = await searchParams;
  const data = await loadDashboard(actor, divisionId);
  const filter = actor.role === "admin" ? <DivisionFilter divisions={await divisions.list()} selectedId={divisionId} action="/dashboard" /> : undefined;
  return <ConnectedDashboardWorkspace key={`${actor.id}:${actor.role}:${data.divisionId ?? "all"}`} {...data} divisionFilter={filter} />;
}
