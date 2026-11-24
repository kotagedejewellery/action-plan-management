import { describe, expect, it } from "vitest";
import type { Actor, Division, User } from "@/domain/models";
import type { DivisionRepository, UserRepository } from "@/application/ports";
import { assertCanReadMember, requireUserWorkspace, resolveActor, visibleMembers } from "@/application/access";
import { saveDivision, saveManagedUser } from "@/application/divisions";

const account = (id: string, role: User["role"], divisionId?: string): User => ({ id, role, divisionId, name: id, email: `${id}@example.test`, passwordHash: "existing-hash", status: "active", sheetName: role === "user" ? `sheet_${id}` : "", createdAt: "", updatedAt: "" });
const division = (id: string, bodUserId?: string): Division => ({ id, name: id, bodUserId, status: "active", createdAt: "", updatedAt: "" });
const admin = account("admin", "admin");

function setup() {
  const people = [admin, account("bod-a", "bod"), account("bod-b", "bod"), account("bod-new", "bod"), account("user-a", "user", "division-a"), account("user-b", "user", "division-b"), account("legacy", "user")];
  const records = [division("division-a", "bod-a"), division("division-b", "bod-b")];
  const users: UserRepository = {
    list: async () => [...people], findById: async (id) => people.find((user) => user.id === id) ?? null,
    findByEmail: async (email) => people.find((user) => user.email === email) ?? null,
    create: async (user) => { people.push(user); return user; },
    update: async (user) => { people[people.findIndex((item) => item.id === user.id)] = user; return user; },
    remove: async (id) => { const index = people.findIndex((item) => item.id === id); if (index >= 0) people.splice(index, 1); },
    createActionPlanSheet: async () => undefined,
  };
  const divisions: DivisionRepository = { list: async () => [...records], create: async (item) => { records.push(item); return item; }, update: async (item) => { records[records.findIndex((record) => record.id === item.id)] = item; return item; } };
  return { users, divisions, people, records };
}

describe("division isolation", () => {
  it("derives BOD scope from the one assigned active division", () => {
    const { people, records } = setup();
    const actor = resolveActor(people[1], records);
    expect(actor.divisionId).toBe("division-a");
    expect(visibleMembers(actor, people).map((user) => user.id)).toEqual(["user-a"]);
    expect(() => assertCanReadMember(actor, people[5])).toThrow("di luar divisi");
    expect(() => visibleMembers(actor, people, "division-b")).toThrow("ditolak");
    expect(() => requireUserWorkspace(actor)).toThrow();
  });

  it("keeps unassigned or ambiguously assigned BOD accounts out of team data", () => {
    const { people, records } = setup();
    expect(() => visibleMembers(resolveActor(people[3], records), people)).toThrow();
    expect(() => visibleMembers(resolveActor(people[1], [...records, division("duplicate", "bod-a")]), people)).toThrow();
    expect(() => visibleMembers(resolveActor(people[1], [{ ...records[0], status: "inactive" }]), people)).toThrow();
  });

  it("retains all legacy data for SuperAdmin and locks unmapped User workspaces", () => {
    const { people, records } = setup();
    expect(visibleMembers(admin, people).map((user) => user.id)).toEqual(["user-a", "user-b", "legacy"]);
    expect(() => requireUserWorkspace(resolveActor(people[6], records))).toThrow();
    expect(() => requireUserWorkspace(resolveActor(people[4], records))).not.toThrow();
  });

  it("immediately removes scope from the former BOD when assignment changes", async () => {
    const { users, divisions, people, records } = setup();
    await saveDivision(divisions, users, admin, { name: "division-a", status: "active", bodUserId: "bod-new" }, "division-a");
    expect(() => visibleMembers(resolveActor(people[1], records), people)).toThrow();
    expect(visibleMembers(resolveActor(people[3], records), people).map((user) => user.id)).toEqual(["user-a"]);
  });

  it("rejects concurrent assignment of one BOD to two divisions", async () => {
    const { users, divisions, records } = setup();
    const results = await Promise.allSettled([
      saveDivision(divisions, users, admin, { name: "New A", status: "active", bodUserId: "bod-new" }),
      saveDivision(divisions, users, admin, { name: "New B", status: "active", bodUserId: "bod-new" }),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(records.filter((record) => record.bodUserId === "bod-new")).toHaveLength(1);
  });

  it("requires active divisions to have an active BOD", async () => {
    const { users, divisions } = setup();
    await expect(saveDivision(divisions, users, admin, { name: "Empty", status: "active" })).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(saveDivision(divisions, users, admin, { name: "Wrong role", status: "active", bodUserId: "user-a" })).rejects.toMatchObject({ code: "VALIDATION" });
    await expect(saveDivision(divisions, users, admin, { name: "Draft", status: "inactive" })).resolves.toMatchObject({ status: "inactive" });
  });

  it("rejects BOD account management and protects the designated active BOD", async () => {
    const { users, divisions, people, records } = setup();
    const actor: Actor = resolveActor(people[1], records);
    await expect(saveManagedUser(users, divisions, actor, { ...people[4], name: "Changed" }, "user-a")).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(saveManagedUser(users, divisions, admin, { ...people[1], status: "inactive" }, "bod-a")).rejects.toMatchObject({ code: "VALIDATION" });
  });

  it("keeps BOD assignment valid even while its division is inactive", async () => {
    const { users, divisions, people, records } = setup();
    records[0].status = "inactive";
    people[1].divisionId = "division-a";

    await expect(saveManagedUser(users, divisions, admin, { ...people[1], role: "user" }, "bod-a")).rejects.toMatchObject({ code: "VALIDATION" });
    expect((await users.findById("bod-a"))?.role).toBe("bod");
  });

  it("maps legacy users once without changing IDs, sheet, hash or prior data", async () => {
    const { users, divisions, people } = setup();
    const legacy = people[6];
    const mapped = await saveManagedUser(users, divisions, admin, { ...legacy, divisionId: "division-a" }, legacy.id);
    expect(mapped).toMatchObject({ id: legacy.id, divisionId: "division-a", sheetName: legacy.sheetName });
    expect((await users.findById(legacy.id))?.passwordHash).toBe(legacy.passwordHash);
    await expect(saveManagedUser(users, divisions, admin, { ...legacy, divisionId: "division-b" }, legacy.id)).rejects.toThrow("Perpindahan divisi");
  });

  it("keeps an active SuperAdmin when two admins change their own roles concurrently", async () => {
    const { users, divisions, people } = setup();
    const second = { ...people[0], id: "admin-2", email: "admin2@example.test" };
    people.push(second);
    const results = await Promise.allSettled([
      saveManagedUser(users, divisions, admin, { ...people[0], role: "bod" }, people[0].id),
      saveManagedUser(users, divisions, second, { ...second, role: "bod" }, second.id),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(people.filter((user) => user.role === "admin" && user.status === "active")).toHaveLength(1);
  });

  it("requires a valid active division for new Users and retains an existing fixed affiliation", async () => {
    const { users, divisions, people, records } = setup();
    const input = { name: "New Member", email: "new@example.test", role: "user" as const, status: "active" as const, password: "new-password" };
    await expect(saveManagedUser(users, divisions, admin, input)).rejects.toMatchObject({ code: "VALIDATION" });
    records[1].status = "inactive";
    await expect(saveManagedUser(users, divisions, admin, { ...input, divisionId: "division-b" })).rejects.toMatchObject({ code: "VALIDATION" });
    const existing = people[4];
    const saved = await saveManagedUser(users, divisions, admin, { ...existing, divisionId: "", name: "Renamed" }, existing.id);
    expect(saved.divisionId).toBe("division-a");
    expect(saved.sheetName).toBe(existing.sheetName);
  });

  it("rejects initial work affiliation outside a BOD's assigned division without changing the account", async () => {
    const { users, divisions, people, records } = setup();
    people[1].sheetName = "legacy_bod_sheet";
    await expect(saveManagedUser(users, divisions, admin, { ...people[1], divisionId: "division-b" }, people[1].id)).rejects.toMatchObject({ code: "VALIDATION" });
    expect((await users.findById("bod-a"))?.divisionId).toBeUndefined();
    expect(resolveActor(people[1], records).divisionId).toBe("division-a");
  });

  it("recovers legacy work after promotion before mapping, preserving identity and fixed affiliation", async () => {
    const { users, divisions, people, records } = setup();
    const legacy = { ...people[6] };
    await saveManagedUser(users, divisions, admin, { ...legacy, role: "bod" }, legacy.id);
    const assigned = await saveDivision(divisions, users, admin, { name: "Legacy team", bodUserId: legacy.id, status: "active" });
    const promoted = (await users.findById(legacy.id))!;
    const mapped = await saveManagedUser(users, divisions, admin, { ...promoted, divisionId: assigned.id }, promoted.id);
    expect(mapped).toMatchObject({ id: legacy.id, role: "bod", sheetName: legacy.sheetName, divisionId: assigned.id });
    expect((await users.findById(legacy.id))?.passwordHash).toBe(legacy.passwordHash);
    expect(visibleMembers(resolveActor((await users.findById(legacy.id))!, records), people).map((user) => user.id)).toEqual([legacy.id]);
    await expect(saveManagedUser(users, divisions, admin, { ...mapped, divisionId: "division-b" }, mapped.id)).rejects.toThrow("Perpindahan divisi");
  });
});
