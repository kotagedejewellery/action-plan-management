import { redirect } from "next/navigation";

import { listVisiblePlans, requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { ConnectedMonitoringWorkspace } from "@/presentation/components/connected-monitoring-workspace";
import { actionPlans, statuses, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function MonitoringPage({ searchParams }: { searchParams: Promise<{ userId?: string; recordId?: string; from?: string; to?: string }> }) {
  const actor = await currentActor();
  try { requireAdmin(actor); } catch { redirect("/action-plans"); }
  const params = await searchParams;
  const userList = (await users.list()).filter((user) => user.role === "user");
  const selectedUser = userList.find((user) => user.id === params.userId) ?? userList[0];
  const plans = selectedUser ? await listVisiblePlans(actionPlans, statuses, actor, selectedUser, "all") : [];
  const date = (value?: string) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value ?? "" : "";
  return <ConnectedMonitoringWorkspace users={userList.map(toSafeUser)} initialPlans={plans} initialSelectedId={selectedUser?.id ?? ""} initialRecordId={plans.some((plan) => plan.id === params.recordId) ? params.recordId ?? "" : ""} initialDateFrom={date(params.from)} initialDateTo={date(params.to)} />;
}
