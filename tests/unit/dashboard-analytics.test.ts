import { describe, expect, it } from "vitest";

import {
  summarizeDashboard,
  type DashboardPlan,
} from "@/application/dashboard-analytics";
import type { SafeUser } from "@/domain/models";

const users: SafeUser[] = [
  {
    id: "u1",
    name: "Alya",
    email: "alya@test",
    role: "user",
    status: "active",
    sheetName: "action_plan_u1",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "u2",
    name: "Bima",
    email: "bima@test",
    role: "user",
    status: "inactive",
    sheetName: "action_plan_u2",
    createdAt: "",
    updatedAt: "",
  },
];

const plan = (
  id: string,
  ownerId: string,
  date: string,
  afternoonStatus?: string,
): DashboardPlan => ({
  id,
  ownerId,
  ownerName: ownerId === "u1" ? "Alya" : "Bima",
  date,
  task: id,
  morningStatus: "Proses",
  afternoonStatus,
  createdAt: "",
  updatedAt: "",
});

describe("dashboard analytics", () => {
  it("summarizes the selected period using configurable completed statuses", () => {
    const summary = summarizeDashboard(
      users,
      [
        plan("done", "u1", "2026-10-01", "Selesai"),
        plan("late", "u1", "2026-10-02", "Proses"),
        plan("outside", "u2", "2026-09-30", "Selesai"),
      ],
      ["Selesai"],
      "2026-10-01",
      "2026-10-03",
      "2026-10-03",
    );

    expect(summary).toMatchObject({
      activeUsers: 1,
      total: 2,
      completed: 1,
      completionRate: 50,
    });
    expect(summary.overdue.map((item) => item.id)).toEqual(["late"]);
    expect(summary.byUser).toEqual([
      { userId: "u1", name: "Alya", total: 2, completed: 1 },
      { userId: "u2", name: "Bima", total: 0, completed: 0 },
    ]);
    expect(summary.trend).toEqual([
      { date: "2026-10-01", total: 1, completed: 1 },
      { date: "2026-10-02", total: 1, completed: 0 },
      { date: "2026-10-03", total: 0, completed: 0 },
    ]);
  });
});
