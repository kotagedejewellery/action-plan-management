import { describe, expect, it } from "vitest";

import { deleteManagedUser } from "@/application/divisions";
import type {
  ActionPlanApprovalRepository,
  DivisionRepository,
  UserRepository,
  WeeklyPlanRepository,
} from "@/application/ports";
import type { ActionPlanApproval, Actor, Division, User, WeeklyPlan } from "@/domain/models";

const now = "2026-11-23T00:00:00.000Z";
const account = (id: string, overrides: Partial<User> = {}): User => ({
  id,
  name: id,
  email: `${id}@example.test`,
  passwordHash: "hash",
  role: "user",
  status: "inactive",
  sheetName: "",
  createdAt: now,
  updatedAt: now,
  ...overrides,
});
const admin = account("admin", { role: "admin", status: "active" });
const actor: Actor = {
  id: admin.id,
  name: admin.name,
  email: admin.email,
  role: "admin",
  status: "active",
  sheetName: "",
};

function setup(options: {
  target?: Partial<User>;
  divisions?: Division[];
  weeklyPlans?: WeeklyPlan[];
  approvals?: ActionPlanApproval[];
  hasNoteMembership?: boolean;
} = {}) {
  const target = account("target", options.target);
  const people = [admin, target];
  const users: UserRepository = {
    list: async () => [...people],
    findById: async (id) => people.find((item) => item.id === id) ?? null,
    findByEmail: async (email) =>
      people.find((item) => item.email === email) ?? null,
    create: async (item) => item,
    update: async (item) => item,
    remove: async (id) => {
      const index = people.findIndex((item) => item.id === id);
      if (index >= 0) people.splice(index, 1);
    },
    createActionPlanSheet: async () => undefined,
  };
  const divisions: DivisionRepository = {
    list: async () => options.divisions ?? [],
    create: async (item) => item,
    update: async (item) => item,
  };
  const weeklyPlans: WeeklyPlanRepository = {
    list: async () => options.weeklyPlans ?? [],
    findById: async () => null,
    create: async (item) => item,
    update: async (item) => item,
    softDelete: async () => undefined,
    hardDelete: async () => undefined,
  };
  const approvals: ActionPlanApprovalRepository = {
    list: async () => options.approvals ?? [],
    create: async (item) => item,
  };
  return { target, people, users, divisions, weeklyPlans, approvals };
}

describe("managed user deletion", () => {
  it("removes only an inactive account with no retained relationship", async () => {
    const fixture = setup();

    await deleteManagedUser(
      fixture.users,
      fixture.divisions,
      fixture.weeklyPlans,
      fixture.approvals,
      actor,
      fixture.target.id,
      false,
    );

    expect(fixture.people).toEqual([admin]);
  });

  it("keeps accounts that still protect Action Plan, division, weekly plan, approval, or Notes data", async () => {
    const linkedDivision: Division = {
      id: "division-a",
      name: "Division A",
      bodUserId: "target",
      status: "inactive",
      createdAt: now,
      updatedAt: now,
    };
    const linkedWeeklyPlan: WeeklyPlan = {
      id: "weekly-a",
      userId: "target",
      title: "Target",
      weekStart: "2026-11-23",
      weekEnd: "2026-11-29",
      plannedActionPlanIds: [],
      createdAt: now,
      updatedAt: now,
    };
    const linkedApproval: ActionPlanApproval = {
      id: "approval-a",
      actionPlanId: "plan-a",
      ownerId: "target",
      divisionId: "division-a",
      planUpdatedAt: now,
      decision: "submitted",
      actorId: "target",
      createdAt: now,
    };
    const cases = [
      setup({ target: { status: "active" } }),
      setup({ target: { sheetName: "action_plan_target" } }),
      setup({ divisions: [linkedDivision] }),
      setup({ weeklyPlans: [linkedWeeklyPlan] }),
      setup({ approvals: [linkedApproval] }),
      setup(),
    ];

    for (const [index, fixture] of cases.entries()) {
      await expect(
        deleteManagedUser(
          fixture.users,
          fixture.divisions,
          fixture.weeklyPlans,
          fixture.approvals,
          actor,
          fixture.target.id,
          index === cases.length - 1,
        ),
      ).rejects.toMatchObject({ code: "VALIDATION" });
      expect(fixture.people).toContainEqual(fixture.target);
    }
  });

  it("never permits deletion of the active SuperAdmin account", async () => {
    const fixture = setup();

    await expect(
      deleteManagedUser(
        fixture.users,
        fixture.divisions,
        fixture.weeklyPlans,
        fixture.approvals,
        actor,
        admin.id,
        false,
      ),
    ).rejects.toMatchObject({ code: "VALIDATION" });
  });
});
