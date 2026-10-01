import { redirect } from "next/navigation";

import { requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { ConnectedMonitoringWorkspace } from "@/presentation/components/connected-monitoring-workspace";
import { actionPlans, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function MonitoringPage() {
  const actor = await currentActor();
  try { requireAdmin(actor); } catch { redirect("/action-plans"); }
  const userList = (await users.list()).filter((user) => user.role === "user");
  const plans = userList[0] ? await actionPlans.list(userList[0].sheetName) : [];
  return <ConnectedMonitoringWorkspace users={userList.map(toSafeUser)} initialPlans={plans} />;
}
