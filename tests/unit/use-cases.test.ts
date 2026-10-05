import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";

import { AppError } from "@/application/errors";
import { archiveOwnWeeklyPlan, authenticateUser, createOwnWeeklyPlan, createUser, deleteOwnActionPlan, listVisiblePlans, requireAdmin, saveOwnActionPlan, updateOwnWeeklyPlan } from "@/application/use-cases";
import type { ActionPlanRepository, StatusRepository, UserRepository, WeeklyPlanRepository } from "@/application/ports";
import type { ActionPlan, User, WeeklyPlan } from "@/domain/models";

const user = async (overrides: Partial<User> = {}): Promise<User> => ({ id: "user-1", name: "User", email: "user@company.test", passwordHash: await bcrypt.hash("password123", 4), role: "user", status: "active", sheetName: "action_plan_user-1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", ...overrides });

describe("access and account use cases", () => {
  it("rejects inactive accounts even with the correct password", async () => {
    const inactive = await user({ status: "inactive" });
    const repository: UserRepository = { list: async () => [inactive], findById: async () => inactive, findByEmail: async () => inactive, create: async () => inactive, update: async () => inactive, createActionPlanSheet: async () => undefined };
    await expect(authenticateUser(repository, inactive.email, "password123")).resolves.toBeNull();
  });

  it("hashes a new user password and creates a private Action Plan sheet", async () => {
    const stored: User[] = [];
    const sheets: string[] = [];
    const repository: UserRepository = { list: async () => stored, findById: async () => null, findByEmail: async () => null, create: async (item) => { stored.push(item); return item; }, update: async (item) => item, createActionPlanSheet: async (name) => { sheets.push(name); } };
    const created = await createUser(repository, { id: "user-2", name: "New User", email: " NEW@COMPANY.TEST ", role: "user", status: "active", password: "password123" });
    expect(created.email).toBe("new@company.test");
    expect("passwordHash" in created).toBe(false);
    expect(await bcrypt.compare("password123", stored[0].passwordHash)).toBe(true);
    expect(sheets).toEqual(["action_plan_user-2"]);
  });

  it("prevents a non-user actor from changing Action Plans", async () => {
    const plans: ActionPlanRepository = { list: async () => [], findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [], findById: async () => null, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const plan: ActionPlan = { id: "plan-1", date: "2026-01-01", task: "Task", morningStatus: "Open", createdAt: "", updatedAt: "" };
    await expect(saveOwnActionPlan(plans, statuses, weeklyPlans, { id: "admin", name: "Admin", email: "admin@test", role: "admin", status: "active", sheetName: "" }, plan)).rejects.toBeInstanceOf(AppError);
    expect(() => requireAdmin({ id: "user", name: "User", email: "user@test", role: "user", status: "active", sheetName: "" })).toThrow(AppError);
  });

  it("moves completed plans to history and soft deletes only the owner's plan", async () => {
    const activePlan: ActionPlan = { id: "active", date: "2026-01-02", task: "Active", morningStatus: "On Progress", afternoonStatus: "On Progress", createdAt: "", updatedAt: "" };
    const completedPlan: ActionPlan = { id: "done", date: "2026-01-01", task: "Done", morningStatus: "On Progress", afternoonStatus: "Selesai", createdAt: "", updatedAt: "" };
    const deleted: string[] = [];
    const plans: ActionPlanRepository = { list: async () => [activePlan, completedPlan], findById: async (_sheet, id) => id === "done" ? completedPlan : null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async (_sheet, id) => { deleted.push(id); } };
    const statuses: StatusRepository = { list: async () => [{ id: "done", label: "Selesai", isActive: true, isCompleted: true, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const actor = await user();
    await expect(listVisiblePlans(plans, statuses, actor, null, "active")).resolves.toEqual([activePlan]);
    await expect(listVisiblePlans(plans, statuses, actor, null, "history")).resolves.toEqual([completedPlan]);
    await deleteOwnActionPlan(plans, actor, "done");
    expect(deleted).toEqual(["done"]);
  });

  it("creates linked daily Action Plans for a weekly plan", async () => {
    const storedWeekly: WeeklyPlan[] = [];
    const storedDaily: ActionPlan[] = [];
    const plans: ActionPlanRepository = { list: async () => storedDaily, findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => { storedDaily.push(...items); return items; }, update: async (_sheet, plan) => plan, softDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => storedWeekly, findById: async () => null, create: async (item) => { storedWeekly.push(item); return item; }, update: async (item) => item, softDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const result = await createOwnWeeklyPlan(weeklyPlans, plans, statuses, await user(), { title: "Target mingguan", weekStart: "2026-10-05", weekdays: [1, 3, 5], morningStatus: "Open" });
    expect(result.actionPlans.map((plan) => plan.date)).toEqual(["2026-10-05", "2026-10-07", "2026-10-09"]);
    expect(result.actionPlans.every((plan) => plan.weeklyPlanId === result.weeklyPlan.id)).toBe(true);
    expect(result.weeklyPlan.plannedActionPlanIds).toEqual(result.actionPlans.map((plan) => plan.id));
    expect(storedWeekly).toHaveLength(1);
  });

  it("prevents deleting an Action Plan that is part of a weekly plan", async () => {
    const linkedPlan: ActionPlan = { id: "linked", date: "2026-10-05", task: "Target", morningStatus: "Open", weeklyPlanId: "weekly-1", createdAt: "", updatedAt: "" };
    const plans: ActionPlanRepository = { list: async () => [linkedPlan], findById: async () => linkedPlan, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined };
    await expect(deleteOwnActionPlan(plans, await user(), linkedPlan.id)).rejects.toBeInstanceOf(AppError);
  });

  it("prevents linking an Action Plan to another User's weekly plan", async () => {
    const foreignWeeklyPlan: WeeklyPlan = { id: "weekly-foreign", userId: "other-user", title: "Milik orang lain", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: [], createdAt: "", updatedAt: "" };
    const plans: ActionPlanRepository = { list: async () => [], findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [foreignWeeklyPlan], findById: async () => foreignWeeklyPlan, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const plan: ActionPlan = { id: "plan-foreign", date: "2026-10-06", task: "Task", morningStatus: "Open", weeklyPlanId: foreignWeeklyPlan.id, createdAt: "", updatedAt: "" };
    await expect(saveOwnActionPlan(plans, statuses, weeklyPlans, await user(), plan)).rejects.toBeInstanceOf(AppError);
  });

  it("edits and archives only the owner's weekly plan without deleting daily plans", async () => {
    const weekly: WeeklyPlan = { id: "weekly-1", userId: "user-1", title: "Sebelum", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: ["daily-1"], createdAt: "", updatedAt: "" };
    const archived: string[] = [];
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [weekly], findById: async () => weekly, create: async (item) => item, update: async (item) => item, softDelete: async (id) => { archived.push(id); } };
    await expect(updateOwnWeeklyPlan(weeklyPlans, await user(), weekly.id, { title: "Sesudah", note: "Catatan" })).resolves.toMatchObject({ title: "Sesudah", note: "Catatan" });
    await archiveOwnWeeklyPlan(weeklyPlans, await user(), weekly.id);
    expect(archived).toEqual([weekly.id]);
  });
});
