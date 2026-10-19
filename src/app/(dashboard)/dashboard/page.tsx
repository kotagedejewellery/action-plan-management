import { redirect } from "next/navigation";

import { requireAdmin } from "@/application/use-cases";
import { ConnectedDashboardWorkspace } from "@/presentation/components/connected-dashboard-workspace";
import { currentActor } from "@/presentation/server/actor";
import { loadDashboard } from "@/presentation/server/dashboard";

export default async function DashboardPage() {
  const actor = await currentActor();
  try {
    requireAdmin(actor);
  } catch {
    redirect("/action-plans");
  }

  return <ConnectedDashboardWorkspace {...await loadDashboard(actor)} />;
}
