import { requireMonitorActor, visibleMembers } from "@/application/access";
import { DivisionFilter } from "@/presentation/components/division-filter";
import { DivisionUnavailable } from "@/presentation/components/division-unavailable";
import { redirect } from "next/navigation";

import { listVisiblePlans } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { ConnectedMonitoringWorkspace } from "@/presentation/components/connected-monitoring-workspace";
import { actionPlans, statuses, users, divisions } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { bangkokDate } from "@/lib/bangkok-date";
import { dashboardPeriodInputSchema } from "@/application/schemas";

export default async function MonitoringPage({ searchParams }: { searchParams: Promise<{ userId?: string; recordId?: string; from?: string; to?: string; divisionId?: string }> }) {
  const actor = await currentActor();
  if (actor.role === "user") redirect("/action-plans");
  if (actor.role === "bod" && !actor.divisionId) return <DivisionUnavailable />;
  requireMonitorActor(actor);
  const params = await searchParams;
  const userList = visibleMembers(actor, await users.list(), params.divisionId);
  const allDivisions = actor.role === "admin" ? await divisions.list() : [];
  const scopeLabel = actor.role === "bod" ? actor.divisionName : allDivisions.find((division) => division.id === params.divisionId)?.name ?? "Seluruh divisi";
  const selectedUser = userList.find((user) => user.id === params.userId) ?? userList[0];
  const plans = selectedUser ? await listVisiblePlans(actionPlans, statuses, actor, selectedUser, "all") : [];
  const completedStatusLabels = (await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label);
  const period = dashboardPeriodInputSchema.safeParse({ from: params.from || "0001-01-01", to: params.to || "9999-12-31" });
  return <ConnectedMonitoringWorkspace key={`${actor.id}:${actor.role}:${actor.divisionId ?? params.divisionId ?? "all"}`} canManageUsers={actor.role === "admin"} scopeLabel={scopeLabel} divisionFilter={actor.role === "admin" ? <DivisionFilter divisions={allDivisions} selectedId={params.divisionId} action="/monitoring" /> : undefined} users={userList.map(toSafeUser)} initialPlans={plans} initialSelectedId={selectedUser?.id ?? ""} initialRecordId={plans.some((plan) => plan.id === params.recordId) ? params.recordId ?? "" : ""} initialDateFrom={period.success ? params.from ?? "" : ""} initialDateTo={period.success ? params.to ?? "" : ""} completedStatusLabels={completedStatusLabels} today={bangkokDate()} />;
}
