import { DivisionUnavailable } from "@/presentation/components/division-unavailable";
import { redirect } from "next/navigation";

import { ConnectedActionPlanWorkspace } from "@/presentation/components/connected-action-plan-workspace";
import { listOwnWeeklyPlans, listVisiblePlans } from "@/application/use-cases";
import { approvalStates } from "@/application/approvals";
import { actionPlans, approvals, divisions, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function ActionPlansPage() {
  const actor = await currentActor();
  if (actor.role !== "user") redirect("/dashboard");
  if (!actor.divisionId) return <DivisionUnavailable />;
  const [statusList, plans, userWeeklyPlans, divisionList] = await Promise.all([statuses.list(), listVisiblePlans(actionPlans, statuses, actor, null, "active"), listOwnWeeklyPlans(weeklyPlans, actor), divisions.list()]);
  const approvalRequired = divisionList.some((division) => division.id === actor.divisionId && division.approvalRequired);
  const states = approvalRequired ? approvalStates(plans, await approvals.list()) : {};
  return <ConnectedActionPlanWorkspace initialPlans={plans} weeklyPlans={userWeeklyPlans} statusOptions={statusList.filter((status) => status.isActive).map((status) => status.label)} completedStatusLabels={statusList.filter((status) => status.isCompleted).map((status) => status.label)} approvalRequired={approvalRequired} initialApprovalStates={states} />;
}
