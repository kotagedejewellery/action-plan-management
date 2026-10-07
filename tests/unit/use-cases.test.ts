import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";

import { AppError } from "@/application/errors";
import { addOwnActionPlanAttachments, authenticateUser, createOwnWeeklyPlan, createStatus, createUser, deleteOwnActionPlan, deleteOwnWeeklyPlan, listOwnArchivedWeeklyPlans, listOwnWeeklyPlans, listVisiblePlans, removeOwnActionPlanAttachment, requireAdmin, saveOwnActionPlan, updateOwnWeeklyPlan, updateStatus, updateUser } from "@/application/use-cases";
import type { ActionPlanRepository, AttachmentStorage, StatusRepository, UserRepository, WeeklyPlanRepository } from "@/application/ports";
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

  it("prevents deactivating or demoting the last active admin", async () => {
    const admin = await user({ id: "admin-1", role: "admin", sheetName: "" });
    const repository: UserRepository = { list: async () => [admin], findById: async () => admin, findByEmail: async () => null, create: async (item) => item, update: async (item) => item, createActionPlanSheet: async () => undefined };
    await expect(updateUser(repository, admin, { status: "inactive" })).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(updateUser(repository, admin, { role: "user" })).rejects.toMatchObject({ code: "VALIDATION" });
  });

  it("prevents a non-user actor from changing Action Plans", async () => {
    const plans: ActionPlanRepository = { list: async () => [], findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined, hardDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [], findById: async () => null, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined, hardDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const plan: ActionPlan = { id: "plan-1", date: "2026-01-01", task: "Task", morningStatus: "Open", createdAt: "", updatedAt: "" };
    await expect(saveOwnActionPlan(plans, statuses, weeklyPlans, { id: "admin", name: "Admin", email: "admin@test", role: "admin", status: "active", sheetName: "" }, plan)).rejects.toBeInstanceOf(AppError);
    expect(() => requireAdmin({ id: "user", name: "User", email: "user@test", role: "user", status: "active", sheetName: "" })).toThrow(AppError);
  });

  it("moves completed plans to history and soft deletes only the owner's plan", async () => {
    const activePlan: ActionPlan = { id: "active", date: "2026-01-02", task: "Active", morningStatus: "On Progress", afternoonStatus: "On Progress", createdAt: "", updatedAt: "" };
    const completedPlan: ActionPlan = { id: "done", date: "2026-01-01", task: "Done", morningStatus: "On Progress", afternoonStatus: "Selesai", createdAt: "", updatedAt: "" };
    const deleted: string[] = [];
    const plans: ActionPlanRepository = { list: async () => [activePlan, completedPlan], findById: async (_sheet, id) => id === "done" ? completedPlan : null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async (_sheet, id) => { deleted.push(id); }, hardDelete: async () => undefined };
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
    const plans: ActionPlanRepository = { list: async () => storedDaily, findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => { storedDaily.push(...items); return items; }, update: async (_sheet, plan) => plan, softDelete: async () => undefined, hardDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => storedWeekly, findById: async () => null, create: async (item) => { storedWeekly.push(item); return item; }, update: async (item) => item, softDelete: async () => undefined, hardDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const result = await createOwnWeeklyPlan(weeklyPlans, plans, statuses, await user(), { title: "Target mingguan", weekStart: "2026-10-05", weekdays: [1, 3, 5], morningStatus: "Open" });
    expect(result.actionPlans.map((plan) => plan.date)).toEqual(["2026-10-05", "2026-10-07", "2026-10-09"]);
    expect(result.actionPlans.every((plan) => plan.weeklyPlanId === result.weeklyPlan.id)).toBe(true);
    expect(result.weeklyPlan.plannedActionPlanIds).toEqual(result.actionPlans.map((plan) => plan.id));
    expect(storedWeekly).toHaveLength(1);
  });

  it("lists archived weekly plans separately from active plans", async () => {
    const active: WeeklyPlan = { id: "active", userId: "user-1", title: "Aktif", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: [], createdAt: "", updatedAt: "" };
    const archived: WeeklyPlan = { id: "archived", userId: "user-1", title: "Arsip", weekStart: "2026-09-28", weekEnd: "2026-10-04", plannedActionPlanIds: [], deletedAt: "2026-10-05T10:00:00.000Z", createdAt: "", updatedAt: "" };
    const repository: WeeklyPlanRepository = { list: async () => [active, archived], findById: async () => null, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined, hardDelete: async () => undefined };
    const actor = await user();
    await expect(listOwnWeeklyPlans(repository, actor)).resolves.toEqual([active]);
    await expect(listOwnArchivedWeeklyPlans(repository, actor)).resolves.toEqual([archived]);
  });

  it("prevents deleting an Action Plan that is part of a weekly plan", async () => {
    const linkedPlan: ActionPlan = { id: "linked", date: "2026-10-05", task: "Target", morningStatus: "Open", weeklyPlanId: "weekly-1", createdAt: "", updatedAt: "" };
    const plans: ActionPlanRepository = { list: async () => [linkedPlan], findById: async () => linkedPlan, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined, hardDelete: async () => undefined };
    await expect(deleteOwnActionPlan(plans, await user(), linkedPlan.id)).rejects.toBeInstanceOf(AppError);
  });

  it("keeps weekly plan membership in sync when a daily plan is linked or unlinked", async () => {
    const weekly: WeeklyPlan = { id: "weekly-1", userId: "user-1", title: "Target", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: [], createdAt: "", updatedAt: "" };
    let current: ActionPlan | null = null;
    const updates: WeeklyPlan[] = [];
    const plans: ActionPlanRepository = { list: async () => current ? [current] : [], findById: async () => current, create: async (_sheet, plan) => { current = plan; return plan; }, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => { current = plan; return plan; }, softDelete: async () => undefined, hardDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [weekly], findById: async () => weekly, create: async (item) => item, update: async (item) => { updates.push(item); weekly.plannedActionPlanIds = item.plannedActionPlanIds; return item; }, softDelete: async () => undefined, hardDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const actor = await user();
    const linked: ActionPlan = { id: "daily-1", date: "2026-10-06", task: "Task", morningStatus: "Open", weeklyPlanId: weekly.id, createdAt: "", updatedAt: "" };
    await saveOwnActionPlan(plans, statuses, weeklyPlans, actor, linked);
    await saveOwnActionPlan(plans, statuses, weeklyPlans, actor, { ...linked, weeklyPlanId: undefined, updatedAt: "later" });
    expect(updates.map((item) => item.plannedActionPlanIds)).toEqual([[linked.id], []]);
  });

  it("prevents deactivating the final active status", async () => {
    const onlyStatus = { id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" };
    const repository: StatusRepository = { list: async () => [onlyStatus], create: async (status) => status, update: async (status) => status };
    await expect(updateStatus(repository, onlyStatus.id, { isActive: false, isCompleted: false })).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(createStatus(repository, "Selesai", true)).resolves.toMatchObject({ label: "Selesai", isCompleted: true });
  });

  it("places an attachment in its owner's Action Plan folder and moves a removed file to trash", async () => {
    let stored: ActionPlan = { id: "plan-attachment", date: "2026-10-06", task: "Task", morningStatus: "Open", createdAt: "", updatedAt: "" };
    const plans: ActionPlanRepository = { list: async () => [stored], findById: async () => stored, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => { stored = plan; return plan; }, softDelete: async () => undefined, hardDelete: async () => undefined };
    const uploads: { userId: string; userName: string; actionPlanId: string }[] = [];
    const trashed: string[] = [];
    const storage: AttachmentStorage = { upload: async (input) => { uploads.push(input.folder); return { id: "file-1", name: input.name, mimeType: input.mimeType }; }, download: async () => Buffer.from(""), trash: async (id) => { trashed.push(id); }, hardDelete: async () => undefined };
    const actor = await user();
    await addOwnActionPlanAttachments(plans, storage, actor, stored.id, [{ name: "laporan.pdf", mimeType: "application/pdf", content: Buffer.from("pdf") }]);
    expect(uploads).toEqual([{ userId: actor.id, userName: actor.name, actionPlanId: stored.id }]);
    const result = await removeOwnActionPlanAttachment(plans, storage, actor, stored.id, "file-1");
    expect(trashed).toEqual(["file-1"]);
    expect(result.attachments).toEqual([]);
  });

  it("prevents linking an Action Plan to another User's weekly plan", async () => {
    const foreignWeeklyPlan: WeeklyPlan = { id: "weekly-foreign", userId: "other-user", title: "Milik orang lain", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: [], createdAt: "", updatedAt: "" };
    const plans: ActionPlanRepository = { list: async () => [], findById: async () => null, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined, hardDelete: async () => undefined };
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [foreignWeeklyPlan], findById: async () => foreignWeeklyPlan, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined, hardDelete: async () => undefined };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, isCompleted: false, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const plan: ActionPlan = { id: "plan-foreign", date: "2026-10-06", task: "Task", morningStatus: "Open", weeklyPlanId: foreignWeeklyPlan.id, createdAt: "", updatedAt: "" };
    await expect(saveOwnActionPlan(plans, statuses, weeklyPlans, await user(), plan)).rejects.toBeInstanceOf(AppError);
  });

  it("permanently deletes a weekly plan together with its linked daily plans", async () => {
    const weekly: WeeklyPlan = { id: "weekly-1", userId: "user-1", title: "Sebelum", weekStart: "2026-10-05", weekEnd: "2026-10-11", plannedActionPlanIds: ["daily-1"], createdAt: "", updatedAt: "" };
    const daily: ActionPlan = { id: "daily-1", date: "2026-10-05", task: "Target", morningStatus: "Open", weeklyPlanId: weekly.id, attachments: [{ id: "file-1", name: "bukti.pdf", mimeType: "application/pdf" }], createdAt: "", updatedAt: "" };
    const dailyTwo: ActionPlan = { id: "daily-2", date: "2026-10-06", task: "Target", morningStatus: "Open", weeklyPlanId: weekly.id, createdAt: "", updatedAt: "" };
    const deletedWeekly: string[] = [];
    const deletedDaily: string[] = [];
    const deletedAttachments: string[] = [];
    const weeklyPlans: WeeklyPlanRepository = { list: async () => [weekly], findById: async () => weekly, create: async (item) => item, update: async (item) => item, softDelete: async () => undefined, hardDelete: async (id) => { deletedWeekly.push(id); } };
    const actionPlans: ActionPlanRepository = { list: async () => [daily, dailyTwo], findById: async () => daily, create: async (_sheet, plan) => plan, createMany: async (_sheet, items) => items, update: async (_sheet, plan) => plan, softDelete: async () => undefined, hardDelete: async (_sheet, id) => { deletedDaily.push(id); } };
    const storage: AttachmentStorage = { upload: async () => ({ id: "", name: "", mimeType: "" }), download: async () => Buffer.from(""), trash: async () => undefined, hardDelete: async (id) => { deletedAttachments.push(id); } };
    await expect(updateOwnWeeklyPlan(weeklyPlans, await user(), weekly.id, { title: "Sesudah", note: "Catatan" })).resolves.toMatchObject({ title: "Sesudah", note: "Catatan" });
    await deleteOwnWeeklyPlan(weeklyPlans, actionPlans, storage, await user(), weekly.id);
    expect(deletedDaily).toEqual([daily.id, dailyTwo.id]);
    expect(deletedWeekly).toEqual([weekly.id]);
    expect(deletedAttachments).toEqual(["file-1"]);
  });
});
