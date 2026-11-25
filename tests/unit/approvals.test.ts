import { describe, expect, it } from "vitest";

import { approvalState, decideApproval, submitForApproval } from "@/application/approvals";
import type { ActionPlanApprovalRepository, ActionPlanRepository, DivisionRepository, StatusRepository, UserRepository } from "@/application/ports";
import type { ActionPlan, ActionPlanApproval, Actor, Division, User } from "@/domain/models";

const division: Division = { id: "executive", name: "Executive Team", bodUserId: "bod-exec", status: "active", approvalRequired: true, createdAt: "", updatedAt: "" };
const owner: User = { id: "leader", name: "Leader", email: "leader@example.test", passwordHash: "", role: "user", status: "active", divisionId: division.id, sheetName: "leader-plans", createdAt: "", updatedAt: "" };
const userActor: Actor = { id: owner.id, name: owner.name, email: owner.email, role: "user", status: "active", sheetName: owner.sheetName, divisionId: division.id };
const bodActor: Actor = { id: "bod-exec", name: "BOD", email: "bod@example.test", role: "bod", status: "active", sheetName: "", divisionId: division.id };

function setup(overrides: Partial<ActionPlan> = {}) {
  let plan: ActionPlan = { id: "plan-1", date: "2026-11-19", task: "Laporan", morningStatus: "On Progress", afternoonStatus: "Selesai", resultLink: "https://example.test/result", createdAt: "2026-11-19T00:00:00.000Z", updatedAt: "2026-11-19T00:00:00.000Z", ...overrides };
  const events: ActionPlanApproval[] = [];
  const approvals: ActionPlanApprovalRepository = { list: async () => events, create: async (event) => { events.push(event); return event; } };
  const plans: ActionPlanRepository = { list: async () => [plan], findById: async (_sheet, id) => id === plan.id ? plan : null, create: async (_sheet, item) => item, createMany: async (_sheet, items) => items, update: async (_sheet, item) => item, softDelete: async () => undefined, hardDelete: async () => undefined };
  const statuses: StatusRepository = { list: async () => [{ id: "done", label: "Selesai", isActive: true, isCompleted: true, createdAt: "", updatedAt: "" }], create: async (status) => status, update: async (status) => status };
  const divisions: DivisionRepository = { list: async () => [division], create: async (item) => item, update: async (item) => item };
  const users: UserRepository = { list: async () => [owner], findById: async (id) => id === owner.id ? owner : null, findByEmail: async () => null, create: async (item) => item, update: async (item) => item, remove: async () => undefined, createActionPlanSheet: async () => undefined };
  return { approvals, plans, statuses, divisions, users, events, changePlan: (next: ActionPlan) => { plan = next; } };
}

describe("Executive Team approvals", () => {
  it("requires evidence and stores a submitted event without editing the Action Plan", async () => {
    const fixture = setup({ resultLink: undefined, attachments: [] });
    await expect(submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1")).rejects.toMatchObject({ code: "VALIDATION" });
    expect(fixture.events).toEqual([]);
  });

  it("does not submit an unfinished Action Plan even when evidence is available", async () => {
    const fixture = setup({ afternoonStatus: "On Progress" });
    await expect(submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1")).rejects.toMatchObject({ code: "VALIDATION" });
    expect(fixture.events).toEqual([]);
  });

  it("allows only the configured division BOD to decide and requires a rejection reason", async () => {
    const fixture = setup();
    const submitted = await submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1");
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, { ...bodActor, divisionId: "other" }, submitted.id, "approved")).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, bodActor, submitted.id, "rejected")).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, bodActor, submitted.id, "approved", "Sesuai bukti")).resolves.toMatchObject({ decision: "approved", ownerId: owner.id });
  });

  it("does not grant approval authority to a BOD Monitor", async () => {
    const fixture = setup();
    fixture.divisions.list = async () => [{ ...division, monitorUserIds: ["bod-monitor"] }];
    const submitted = await submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1");
    const monitorActor: Actor = { ...bodActor, id: "bod-monitor", divisionId: division.id };
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, monitorActor, submitted.id, "approved")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a decision after the submitted Action Plan was edited", async () => {
    const fixture = setup();
    const submitted = await submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1");
    fixture.changePlan({ id: "plan-1", date: "2026-11-19", task: "Laporan revisi", morningStatus: "On Progress", resultLink: "https://example.test/result", createdAt: "2026-11-19T00:00:00.000Z", updatedAt: "2026-11-19T01:00:00.000Z" });
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, bodActor, submitted.id, "approved")).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.events).toHaveLength(1);
  });

  it("does not reopen an approved Action Plan until the User changes it", async () => {
    const fixture = setup();
    const submitted = await submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1");
    await decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, bodActor, submitted.id, "approved");
    await expect(submitForApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.divisions, userActor, "plan-1")).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("does not approve a legacy submission whose Action Plan is still unfinished", async () => {
    const fixture = setup({ afternoonStatus: "On Progress" });
    fixture.events.push({ id: "legacy-submission", actionPlanId: "plan-1", ownerId: owner.id, divisionId: division.id, planUpdatedAt: "2026-11-19T00:00:00.000Z", decision: "submitted", actorId: owner.id, createdAt: "2026-11-19T00:00:00.000Z" });
    await expect(decideApproval(fixture.approvals, fixture.plans, fixture.statuses, fixture.users, fixture.divisions, bodActor, "legacy-submission", "approved")).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fixture.events).toHaveLength(1);
  });

  it("uses append order when approval events share the same timestamp", () => {
    const plan: ActionPlan = { id: "plan-1", date: "2026-11-19", task: "Laporan", morningStatus: "On Progress", createdAt: "", updatedAt: "version-1" };
    expect(approvalState(plan, [
      { id: "z-submitted", actionPlanId: plan.id, ownerId: owner.id, divisionId: division.id, planUpdatedAt: plan.updatedAt, decision: "submitted", actorId: owner.id, createdAt: "2026-11-19T00:00:00.000Z" },
      { id: "a-approved", actionPlanId: plan.id, ownerId: owner.id, divisionId: division.id, planUpdatedAt: plan.updatedAt, decision: "approved", actorId: bodActor.id, createdAt: "2026-11-19T00:00:00.000Z" },
    ])).toMatchObject({ status: "disetujui", approvalId: "a-approved" });
  });
});
