import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";

import { AppError } from "@/application/errors";
import { authenticateUser, createUser, requireAdmin, saveOwnActionPlan } from "@/application/use-cases";
import type { ActionPlanRepository, StatusRepository, UserRepository } from "@/application/ports";
import type { ActionPlan, User } from "@/domain/models";

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
    const plans: ActionPlanRepository = { list: async () => [], findById: async () => null, create: async (_sheet, plan) => plan, update: async (_sheet, plan) => plan };
    const statuses: StatusRepository = { list: async () => [{ id: "open", label: "Open", isActive: true, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
    const plan: ActionPlan = { id: "plan-1", date: "2026-01-01", task: "Task", morningStatus: "Open", createdAt: "", updatedAt: "" };
    await expect(saveOwnActionPlan(plans, statuses, { id: "admin", name: "Admin", email: "admin@test", role: "admin", status: "active", sheetName: "" }, plan)).rejects.toBeInstanceOf(AppError);
    expect(() => requireAdmin({ id: "user", name: "User", email: "user@test", role: "user", status: "active", sheetName: "" })).toThrow(AppError);
  });
});
