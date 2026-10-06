import { redirect } from "next/navigation";

import { ConnectedActionPlanWorkspace } from "@/presentation/components/connected-action-plan-workspace";
import { listOwnWeeklyPlans, listVisiblePlans } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function ActionPlansPage() {
  const actor = await currentActor();
  if (actor.role !== "user") redirect("/dashboard");
  const statusList = await statuses.list();
  const plans = await listVisiblePlans(actionPlans, statuses, actor, null, "active");
  const userWeeklyPlans = await listOwnWeeklyPlans(weeklyPlans, actor);
  return <ConnectedActionPlanWorkspace initialPlans={plans} weeklyPlans={userWeeklyPlans} statusOptions={statusList.filter((status) => status.isActive).map((status) => status.label)} completedStatusLabels={statusList.filter((status) => status.isCompleted).map((status) => status.label)} />;
}
