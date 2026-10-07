import { redirect } from "next/navigation";

import { listOwnArchivedWeeklyPlans, listOwnWeeklyPlans, listVisiblePlans } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { ConnectedWeeklyPlanWorkspace } from "@/presentation/components/connected-weekly-plan-workspace";
import { currentActor } from "@/presentation/server/actor";
import { bangkokDate } from "@/lib/bangkok-date";

export default async function WeeklyPlansPage() {
  const actor = await currentActor();
  if (actor.role !== "user") redirect("/dashboard");
  const [plans, weeklyPlanList, archivedWeeklyPlanList, statusList] = await Promise.all([
    listVisiblePlans(actionPlans, statuses, actor, null, "all"),
    listOwnWeeklyPlans(weeklyPlans, actor),
    listOwnArchivedWeeklyPlans(weeklyPlans, actor),
    statuses.list(),
  ]);
  return <ConnectedWeeklyPlanWorkspace initialWeeklyPlans={weeklyPlanList} initialArchivedWeeklyPlans={archivedWeeklyPlanList} initialActionPlans={plans} statusOptions={statusList.filter((status) => status.isActive).map((status) => status.label)} completedStatusLabels={statusList.filter((status) => status.isCompleted).map((status) => status.label)} today={bangkokDate()} />;
}
