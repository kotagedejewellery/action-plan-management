import { redirect } from "next/navigation";

import type { DashboardPlan } from "@/application/dashboard-analytics";
import { listVisiblePlans, requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { actionPlans, statuses, users, weeklyPlans } from "@/infrastructure/container";
import { ConnectedDashboardWorkspace } from "@/presentation/components/connected-dashboard-workspace";
import { currentActor } from "@/presentation/server/actor";

function todayInBangkok() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return value("year") + "-" + value("month") + "-" + value("day");
}

export default async function DashboardPage() {
  const actor = await currentActor();
  try {
    requireAdmin(actor);
  } catch {
    redirect("/action-plans");
  }

  const userList = (await users.list()).filter((user) => user.role === "user");
  const plansByUser = await Promise.all(
    userList.map(async (user) => {
      const plans = await listVisiblePlans(
        actionPlans,
        statuses,
        actor,
        user,
        "all",
      );
      return plans.map((plan): DashboardPlan => ({
        ...plan,
        ownerId: user.id,
        ownerName: user.name,
      }));
    }),
  );
  const completedStatusLabels = (await statuses.list())
    .filter((status) => status.isCompleted)
    .map((status) => status.label);

  return (
    <ConnectedDashboardWorkspace
      users={userList.map(toSafeUser)}
      plans={plansByUser.flat()}
      weeklyPlans={await weeklyPlans.list()}
      completedStatusLabels={completedStatusLabels}
      today={todayInBangkok()}
    />
  );
}
