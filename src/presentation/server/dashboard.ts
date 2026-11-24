import type { DashboardPlan } from "@/application/dashboard-analytics";
import { requireMonitorActor, visibleMembers } from "@/application/access";
import { AppError } from "@/application/errors";
import { dashboardPeriodInputSchema } from "@/application/schemas";
import { toSafeUser, type Actor } from "@/domain/models";
import { approvalState } from "@/application/approvals";
import { actionPlans, approvals, statuses, users, weeklyPlans, divisions } from "@/infrastructure/container";
import { bangkokDate } from "@/lib/bangkok-date";

export const DASHBOARD_LOAD_TIMEOUT_MS = 15_000;

export type DashboardPeriod = { from: string; to: string };
export type DashboardPeriodPreset = "week" | "month";

function startOfWeek(date: string) {
  const current = new Date(`${date}T00:00:00Z`);
  current.setUTCDate(current.getUTCDate() - ((current.getUTCDay() + 6) % 7));
  return current.toISOString().slice(0, 10);
}

function resolvePeriod(input: DashboardPeriod | undefined, preset: DashboardPeriodPreset | undefined, today: string) {
  const period = input ?? (preset === "week" ? { from: startOfWeek(today), to: today } : { from: `${today.slice(0, 8)}01`, to: today });
  const parsed = dashboardPeriodInputSchema.safeParse(period);
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Rentang Dashboard tidak valid.", "VALIDATION");
  if (parsed.data.to > today) throw new AppError("Tanggal akhir tidak boleh melewati hari ini.", "VALIDATION");
  return parsed.data;
}

async function withDashboardTimeout<T>(work: Promise<T>) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new AppError("Dashboard membutuhkan waktu terlalu lama untuk dimuat. Coba lagi.", "UNAVAILABLE")), DASHBOARD_LOAD_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function loadDashboard(actor: Actor, divisionId?: string, periodInput?: DashboardPeriod, preset?: DashboardPeriodPreset) {
  return withDashboardTimeout(loadDashboardData(actor, divisionId, periodInput, preset));
}

async function loadDashboardData(actor: Actor, divisionId?: string, periodInput?: DashboardPeriod, preset?: DashboardPeriodPreset) {
  requireMonitorActor(actor);
  const startedAt = performance.now();
  const today = bangkokDate();
  const period = resolvePeriod(periodInput, preset, today);
  const [divisionList, allUsers] = await Promise.all([divisions.list(), users.list()]);
  const directoryLoadedAt = performance.now();
  const allDivisions = actor.role === "admin" ? divisionList : [];
  if (actor.role === "admin" && divisionId && !allDivisions.some((division) => division.id === divisionId)) throw new AppError("Divisi tidak ditemukan.", "NOT_FOUND");
  const userList = visibleMembers(actor, allUsers, divisionId);
  const ownerIds = new Set(userList.map((user) => user.id));
  const [plansBySheet, approvalEvents, allWeeklyPlans, allStatuses] = await Promise.all([
    actionPlans.listMany(userList.map((user) => user.sheetName)), approvals.list(), weeklyPlans.list(), statuses.list(),
  ]);
  const plans: DashboardPlan[] = userList.flatMap((user) => (plansBySheet.get(user.sheetName) ?? [])
    .filter((plan) => !plan.deletedAt && plan.date >= period.from && plan.date <= period.to)
    .map((plan) => ({ ...plan, ownerId: user.id, ownerName: user.name })));
  const approvalEnabledMembers = new Set(userList.filter((user) => divisionList.some((division) => division.id === user.divisionId && division.approvalRequired)).map((user) => user.id));
  const pendingApprovals = plans.filter((plan) => approvalEnabledMembers.has(plan.ownerId) && approvalState(plan, approvalEvents).status === "menunggu");
  const canApprove = actor.role === "bod" && divisionList.some((division) => division.id === actor.divisionId && division.bodUserId === actor.id && division.approvalRequired);
  if (process.env.DASHBOARD_PERF_DEBUG === "1") console.info("[dashboard-perf]", {
    totalMs: Math.round(performance.now() - startedAt), directoryMs: Math.round(directoryLoadedAt - startedAt),
    dataMs: Math.round(performance.now() - directoryLoadedAt), members: userList.length, plans: plans.length, scope: actor.role,
  });
  return {
    canManageUsers: actor.role === "admin",
    canApprove,
    users: userList.map(toSafeUser), plans,
    pendingApprovals,
    weeklyPlans: allWeeklyPlans.filter((plan) => ownerIds.has(plan.userId) && !plan.deletedAt && plan.weekStart <= period.to && plan.weekEnd >= period.from),
    completedStatusLabels: allStatuses.filter((status) => status.isCompleted).map((status) => status.label),
    today, period, loadedAt: new Date().toISOString(),
    divisionId: actor.role === "bod" ? actor.divisionId : divisionId || "",
    scopeLabel: actor.role === "bod" ? actor.divisionName : allDivisions.find((division) => division.id === divisionId)?.name ?? "Seluruh divisi",
  };
}
