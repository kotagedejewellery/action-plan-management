import type { DashboardPlan } from "@/application/dashboard-analytics";
import { listVisiblePlans } from "@/application/use-cases";
import { requireMonitorActor, visibleMembers } from "@/application/access";
import { AppError } from "@/application/errors";
import { toSafeUser, type Actor } from "@/domain/models";
import { approvalState } from "@/application/approvals";
import { actionPlans, approvals, statuses, users, weeklyPlans, divisions } from "@/infrastructure/container";
import { bangkokDate } from "@/lib/bangkok-date";

export async function loadDashboard(actor: Actor, divisionId?: string) {
  requireMonitorActor(actor);
  const divisionList = await divisions.list();
  const allDivisions = actor.role === "admin" ? divisionList : [];
  if (actor.role === "admin" && divisionId && !allDivisions.some((division) => division.id === divisionId)) throw new AppError("Divisi tidak ditemukan.", "NOT_FOUND");
  const userList = visibleMembers(actor, await users.list(), divisionId);
  const ownerIds = new Set(userList.map((user) => user.id));
  const plans: DashboardPlan[] = [];
  for (const user of userList) {
    const ownPlans = await listVisiblePlans(actionPlans, statuses, actor, user, "all");
    plans.push(...ownPlans.map((plan) => ({ ...plan, ownerId: user.id, ownerName: user.name })));
  }
  const approvalEnabledMembers = new Set(userList.filter((user) => divisionList.some((division) => division.id === user.divisionId && division.approvalRequired)).map((user) => user.id));
  const approvalEvents = await approvals.list();
  const pendingApprovals = plans.filter((plan) => approvalEnabledMembers.has(plan.ownerId) && approvalState(plan, approvalEvents).status === "menunggu");
  const canApprove = actor.role === "bod" && divisionList.some((division) => division.id === actor.divisionId && division.bodUserId === actor.id && division.approvalRequired);
  return {
    canManageUsers: actor.role === "admin",
    canApprove,
    users: userList.map(toSafeUser), plans,
    pendingApprovals,
    weeklyPlans: (await weeklyPlans.list()).filter((plan) => ownerIds.has(plan.userId)),
    completedStatusLabels: (await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label),
    today: bangkokDate(), loadedAt: new Date().toISOString(),
    divisionId: actor.role === "bod" ? actor.divisionId : divisionId || "",
    scopeLabel: actor.role === "bod" ? actor.divisionName : allDivisions.find((division) => division.id === divisionId)?.name ?? "Seluruh divisi",
  };
}
