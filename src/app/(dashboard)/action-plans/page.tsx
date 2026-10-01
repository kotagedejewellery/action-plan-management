import { redirect } from "next/navigation";

import { ConnectedActionPlanWorkspace } from "@/presentation/components/connected-action-plan-workspace";
import { actionPlans, statuses } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function ActionPlansPage() {
  const actor = await currentActor();
  if (actor.role !== "user") redirect("/monitoring");
  const [plans, statusList] = await Promise.all([actionPlans.list(actor.sheetName), statuses.list()]);
  return <ConnectedActionPlanWorkspace initialPlans={plans} statusOptions={statusList.filter((status) => status.isActive).map((status) => status.label)} />;
}
