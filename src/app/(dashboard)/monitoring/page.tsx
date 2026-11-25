import { requireMonitorActor, visibleMembers } from "@/application/access";
import { DivisionFilter } from "@/presentation/components/division-filter";
import { DivisionUnavailable } from "@/presentation/components/division-unavailable";
import { redirect } from "next/navigation";

import { listVisiblePlans } from "@/application/use-cases";
import { approvalStates } from "@/application/approvals";
import { toSafeUser } from "@/domain/models";
import { ConnectedMonitoringWorkspace } from "@/presentation/components/connected-monitoring-workspace";
import { actionPlans, approvals, statuses, users, divisions } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { bangkokDate } from "@/lib/bangkok-date";
import { dashboardPeriodInputSchema } from "@/application/schemas";

export default async function MonitoringPage({ searchParams }: { searchParams: Promise<{ userId?: string; recordId?: string; from?: string; to?: string; divisionId?: string; scope?: string }> }) {
  const actor = await currentActor();
  if (actor.role === "user") redirect("/action-plans");
  if (actor.role === "bod" && !actor.divisionId) return <DivisionUnavailable />;
  requireMonitorActor(actor);
  const params = await searchParams;
  const userList = visibleMembers(actor, await users.list(), params.divisionId);
  const divisionList = await divisions.list();
  const allDivisions = actor.role === "admin" ? divisionList : [];
  const scopeLabel = actor.role === "bod" ? actor.divisionName : allDivisions.find((division) => division.id === params.divisionId)?.name ?? "Seluruh divisi";
  const selectedUser = userList.find((user) => user.id === params.userId) ?? userList[0];
  const plans = selectedUser ? await listVisiblePlans(actionPlans, statuses, actor, selectedUser, "all") : [];
  const completedStatusLabels = (await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label);
  const period = dashboardPeriodInputSchema.safeParse({ from: params.from || "0001-01-01", to: params.to || "9999-12-31" });
  const initialScope = params.scope === "active" || params.scope === "history" ? params.scope : "all";
  const canViewApproval = actor.role === "admin" || actor.role === "bod";
  const approvalUserIds = userList.filter((user) => divisionList.some((division) => division.id === user.divisionId && division.approvalRequired)).map((user) => user.id);
  const canApprove = actor.role === "bod" && divisionList.some((division) => division.id === actor.divisionId && division.bodUserId === actor.id && division.approvalRequired);
  const initialApprovalStates = canViewApproval && selectedUser && approvalUserIds.includes(selectedUser.id) ? approvalStates(plans, await approvals.list()) : {};
  return <ConnectedMonitoringWorkspace key={`${actor.id}:${actor.role}:${actor.divisionId ?? params.divisionId ?? "all"}`} canManageUsers={actor.role === "admin"} canViewApproval={canViewApproval} canApprove={canApprove} approvalUserIds={approvalUserIds} initialApprovalStates={initialApprovalStates} scopeLabel={scopeLabel} divisionFilter={actor.role === "admin" ? <DivisionFilter divisions={allDivisions} selectedId={params.divisionId} action="/monitoring" /> : undefined} users={userList.map(toSafeUser)} initialPlans={plans} initialSelectedId={selectedUser?.id ?? ""} initialRecordId={plans.some((plan) => plan.id === params.recordId) ? params.recordId ?? "" : ""} initialDateFrom={period.success ? params.from ?? "" : ""} initialDateTo={period.success ? params.to ?? "" : ""} initialScope={initialScope} completedStatusLabels={completedStatusLabels} today={bangkokDate()} />;
}
