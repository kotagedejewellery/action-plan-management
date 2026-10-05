import type { ActionPlan, SafeUser } from "@/domain/models";

export type DashboardPlan = ActionPlan & { ownerId: string; ownerName: string };

type UserSummary = {
  userId: string;
  name: string;
  total: number;
  completed: number;
};

export type DashboardSummary = {
  activeUsers: number;
  total: number;
  completed: number;
  completionRate: number;
  overdue: DashboardPlan[];
  byUser: UserSummary[];
  trend: { date: string; total: number; completed: number }[];
};

function calendarDates(from: string, to: string) {
  const dates: string[] = [];
  const current = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export function summarizeDashboard(
  users: SafeUser[],
  plans: DashboardPlan[],
  completedStatusLabels: string[],
  from: string,
  to: string,
  today: string,
): DashboardSummary {
  const completedStatuses = new Set(completedStatusLabels);
  const visiblePlans = plans.filter(
    (plan) => plan.date >= from && plan.date <= to,
  );
  const isCompleted = (plan: DashboardPlan) =>
    Boolean(
      plan.afternoonStatus && completedStatuses.has(plan.afternoonStatus),
    );
  const completed = visiblePlans.filter(isCompleted).length;

  return {
    activeUsers: users.filter((user) => user.status === "active").length,
    total: visiblePlans.length,
    completed,
    completionRate:
      visiblePlans.length === 0
        ? 0
        : Math.round((completed / visiblePlans.length) * 100),
    overdue: visiblePlans
      .filter((plan) => plan.date < today && !isCompleted(plan))
      .sort((first, second) => first.date.localeCompare(second.date)),
    byUser: users
      .map((user) => {
        const userPlans = visiblePlans.filter(
          (plan) => plan.ownerId === user.id,
        );
        return {
          userId: user.id,
          name: user.name,
          total: userPlans.length,
          completed: userPlans.filter(isCompleted).length,
        };
      })
      .sort(
        (first, second) =>
          second.total - first.total || first.name.localeCompare(second.name),
      ),
    trend: calendarDates(from, to).map((date) => {
      const dailyPlans = visiblePlans.filter((plan) => plan.date === date);
      return {
        date,
        total: dailyPlans.length,
        completed: dailyPlans.filter(isCompleted).length,
      };
    }),
  };
}
