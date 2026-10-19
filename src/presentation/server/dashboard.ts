import type { DashboardPlan } from "@/application/dashboard-analytics";
import { listVisiblePlans, requireAdmin } from "@/application/use-cases";
import { toSafeUser, type Actor } from "@/domain/models";
import { actionPlans, statuses, users, weeklyPlans } from "@/infrastructure/container";
import { bangkokDate } from "@/lib/bangkok-date";

export async function loadDashboard(actor: Actor) {
  requireAdmin(actor);
  const userList = (await users.list()).filter((user) => user.role === "user");
  const plans: DashboardPlan[] = [];
  for (const user of userList) {
    const ownPlans = await listVisiblePlans(actionPlans, statuses, actor, user, "all");
    plans.push(...ownPlans.map((plan) => ({ ...plan, ownerId: user.id, ownerName: user.name })));
  }
  return {
    users: userList.map(toSafeUser),
    plans,
    weeklyPlans: await weeklyPlans.list(),
    completedStatusLabels: (await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label),
    today: bangkokDate(),
    loadedAt: new Date().toISOString(),
  };
}
