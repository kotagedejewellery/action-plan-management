import { redirect } from "next/navigation";

import { listOwnWeeklyPlans, listVisiblePlans } from "@/application/use-cases";
import { actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { ConnectedWeeklyPlanWorkspace } from "@/presentation/components/connected-weekly-plan-workspace";
import { currentActor } from "@/presentation/server/actor";

function todayInBangkok() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default async function WeeklyPlansPage() {
  const actor = await currentActor();
  if (actor.role !== "user") redirect("/monitoring");
  const [plans, weeklyPlanList, statusList] = await Promise.all([
    listVisiblePlans(actionPlans, statuses, actor, null, "all"),
    listOwnWeeklyPlans(weeklyPlans, actor),
    statuses.list(),
  ]);
  return <ConnectedWeeklyPlanWorkspace initialWeeklyPlans={weeklyPlanList} initialActionPlans={plans} statusOptions={statusList.filter((status) => status.isActive).map((status) => status.label)} completedStatusLabels={statusList.filter((status) => status.isCompleted).map((status) => status.label)} today={todayInBangkok()} />;
}
