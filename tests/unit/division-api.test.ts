import { beforeEach, expect, it, vi } from "vitest";
import type { User, Division } from "@/domain/models";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/infrastructure/container", () => ({
  users: { list: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn() },
  divisions: { list: vi.fn(), create: vi.fn(), update: vi.fn() },
  actionPlans: { list: vi.fn(), findById: vi.fn(), create: vi.fn(), update: vi.fn(), softDelete: vi.fn() },
  weeklyPlans: { list: vi.fn(), update: vi.fn(), hardDelete: vi.fn() },
  statuses: { list: vi.fn(), create: vi.fn() },
  attachments: { download: vi.fn(), upload: vi.fn(), trash: vi.fn() },
}));

import { auth } from "@/auth";
import { users, divisions, actionPlans, weeklyPlans, attachments, statuses } from "@/infrastructure/container";
import { GET as dashboard } from "@/app/api/dashboard/route";
import { GET as plans, POST as createPlan } from "@/app/api/action-plans/route";
import { PATCH as updatePlan, DELETE as deletePlan } from "@/app/api/action-plans/[recordId]/route";
import { GET as image, DELETE as removeImage } from "@/app/api/action-plans/[recordId]/attachments/[attachmentId]/route";
import { GET as accounts, POST as createAccount } from "@/app/api/users/route";
import { GET as divisionList, POST as createDivision } from "@/app/api/divisions/route";
import { PATCH as updateDivision } from "@/app/api/divisions/[divisionId]/route";
import { PATCH as updateAccount } from "@/app/api/users/[userId]/route";
import { DELETE as deleteWeek } from "@/app/api/weekly-plans/[weeklyPlanId]/route";
import { POST as createStatus } from "@/app/api/statuses/route";
import { currentActor } from "@/presentation/server/actor";

const account = (id: string, role: User["role"], divisionId?: string): User => ({ id, role, divisionId, name: id, email: `${id}@example.test`, passwordHash: "synthetic", status: "active", sheetName: role === "user" ? `sheet_${id}` : "", createdAt: "", updatedAt: "" });
const records = [account("sa", "admin"), account("ba", "bod"), account("bb", "bod"), account("ua", "user", "a"), account("ub", "user", "b"), account("old", "user")];
let scope: Division[];
const request = (path: string, body?: unknown) => new Request(`http://localhost/api/${path}`, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : undefined);
const planContext = { params: Promise.resolve({ recordId: "pa" }) };
const imageContext = { params: Promise.resolve({ recordId: "pa", attachmentId: "img" }) };

function login(id: string) { vi.mocked(auth).mockResolvedValue({ user: { id, role: "admin" } } as never); }
beforeEach(() => {
  vi.resetAllMocks();
  scope = ["a", "b"].map((id) => ({ id, name: `Divisi ${id}`, bodUserId: `b${id}`, status: "active", createdAt: "", updatedAt: "" }));
  vi.mocked(users.list).mockResolvedValue(records);
  vi.mocked(users.findById).mockImplementation(async (id) => records.find((user) => user.id === id) ?? null);
  vi.mocked(divisions.list).mockImplementation(async () => scope);
  vi.mocked(actionPlans.list).mockImplementation(async (sheet) => [{ id: sheet, task: sheet, date: "2026-11-18", morningStatus: "On Progress", createdAt: "", updatedAt: "" }]);
  vi.mocked(weeklyPlans.list).mockResolvedValue(["ua", "ub", "old"].map((userId) => ({ id: userId, userId, title: userId, weekStart: "2026-11-16", weekEnd: "2026-11-22", plannedActionPlanIds: [], createdAt: "", updatedAt: "" })));
  vi.mocked(statuses.list).mockResolvedValue([]);
  vi.mocked(actionPlans.findById).mockResolvedValue({ id: "pa", task: "Review", date: "2026-11-18", morningStatus: "On Progress", createdAt: "", updatedAt: "", attachments: [{ id: "img", name: "evidence.png", mimeType: "image/png" }] });
  vi.mocked(attachments.download).mockResolvedValue(Buffer.from([1, 2, 3]));
  login("ba");
});

it("scopes actual dashboard JSON and weekly plans before reading other sheets, ignoring a stale admin JWT", async () => {
  const response = await dashboard(request("dashboard"));
  const data = await response.json();
  expect(response.status).toBe(200);
  expect(data.users.map((user: User) => user.id)).toEqual(["ua"]);
  expect(data.canManageUsers).toBe(false);
  expect(data.plans.map((plan: { id: string }) => plan.id)).toEqual(["sheet_ua"]);
  expect(data.weeklyPlans.map((plan: { userId: string }) => plan.userId)).toEqual(["ua"]);
  expect(JSON.stringify(data)).not.toMatch(/sheet_ub|passwordHash|bb@example/);
  expect(actionPlans.list).toHaveBeenCalledTimes(1);
  expect(actionPlans.list).toHaveBeenCalledWith("sheet_ua");
  expect((await dashboard(request("dashboard?divisionId=b"))).status).toBe(403);
});

it("denies tampered member, division and attachment identifiers before work or Drive reads", async () => {
  expect((await plans(request("action-plans?userId=ub"))).status).toBe(403);
  expect((await image(request("action-plans/pa/attachments/img?userId=ub"), imageContext)).status).toBe(403);
  expect(actionPlans.list).not.toHaveBeenCalled();
  expect(actionPlans.findById).not.toHaveBeenCalled();
  expect(attachments.download).not.toHaveBeenCalled();
  expect((await plans(request("action-plans?userId=ua"))).status).toBe(200);
  expect((await image(request("action-plans/pa/attachments/img?userId=ua"), imageContext)).status).toBe(200);
  expect(attachments.download).toHaveBeenCalledWith("img");
  expect((await image(request("action-plans/pa/attachments/wrong?userId=ua"), { params: Promise.resolve({ recordId: "pa", attachmentId: "wrong" }) })).status).toBe(404);
});

it("keeps BOD read-only across account, division, status, daily, weekly and attachment mutations", async () => {
  const daily = { date: "2026-11-18", task: "Task", morningStatus: "On Progress" };
  const accountInput = { name: "Member", email: "member@example.test", role: "user", status: "active", password: "12345678" };
  const responses = await Promise.all([
    accounts(), createAccount(request("users", accountInput)), updateAccount(request("users/ua", accountInput), { params: Promise.resolve({ userId: "ua" }) }),
    divisionList(), createDivision(request("divisions", { name: "Other", status: "active" })), updateDivision(request("divisions/a", { name: "Other", status: "active" }), { params: Promise.resolve({ divisionId: "a" }) }),
    createStatus(request("statuses", { label: "Blocked", isCompleted: false })),
    createPlan(request("action-plans", daily)), updatePlan(request("action-plans/pa", daily), planContext), deletePlan(request("action-plans/pa"), planContext),
    deleteWeek(request("weekly-plans/wa"), { params: Promise.resolve({ weeklyPlanId: "wa" }) }), removeImage(request("action-plans/pa/attachments/img"), imageContext),
  ]);
  expect(responses.map((response) => response.status)).toEqual(Array(responses.length).fill(403));
  expect(actionPlans.create).not.toHaveBeenCalled(); expect(actionPlans.update).not.toHaveBeenCalled(); expect(actionPlans.softDelete).not.toHaveBeenCalled();
  expect(users.update).not.toHaveBeenCalled(); expect(divisions.update).not.toHaveBeenCalled(); expect(weeklyPlans.hardDelete).not.toHaveBeenCalled(); expect(attachments.trash).not.toHaveBeenCalled();
});

it("rechecks canonical BOD assignment for every request and fails closed after deactivation", async () => {
  expect((await plans(request("action-plans?userId=ua"))).status).toBe(200);
  scope = scope.map((division) => division.id === "a" ? { ...division, bodUserId: "replacement" } : division);
  expect((await plans(request("action-plans?userId=ua"))).status).toBe(403);
  scope = scope.map((division) => ({ ...division, status: "inactive" }));
  expect((await dashboard(request("dashboard"))).status).toBe(403);
});

it("keeps SuperAdmin global visibility and preserves User isolation", async () => {
  login("sa");
  expect((await (await dashboard(request("dashboard"))).json()).users).toHaveLength(3);
  expect((await (await dashboard(request("dashboard?divisionId=b"))).json()).users.map((user: User) => user.id)).toEqual(["ub"]);
  login("ua");
  expect((await dashboard(request("dashboard"))).status).toBe(403);
  expect((await (await plans(request("action-plans?userId=ub&scope=all"))).json())[0].id).toBe("sheet_ua");
  login("old");
  expect((await plans(request("action-plans?scope=all"))).status).toBe(403);
  expect((await currentActor()).divisionId).toBeUndefined();
});
