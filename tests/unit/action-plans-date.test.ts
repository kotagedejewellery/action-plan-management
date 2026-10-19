import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { Actor, User } from "@/domain/models";

vi.mock("@/infrastructure/container", () => ({ users: { findById: vi.fn() }, actionPlans: { list: vi.fn() }, statuses: { list: vi.fn() }, weeklyPlans: {} }));
vi.mock("@/presentation/server/actor", () => ({ currentActor: vi.fn() }));

import { actionPlans, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { GET } from "@/app/api/action-plans/route";

const admin: Actor = { id: "admin", name: "Admin", email: "admin@example.test", role: "admin", status: "active", sheetName: "" };
const member: User = { ...admin, id: "u1", role: "user", sheetName: "action_plan_u1", passwordHash: "test-only", createdAt: "", updatedAt: "" };
const plan = { id: "p1", date: "2026-10-20", task: "Review", morningStatus: "On Progress", createdAt: "", updatedAt: "" };

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-19T18:00:00Z"));
  vi.mocked(currentActor).mockResolvedValue(admin);
  vi.mocked(users.findById).mockResolvedValue(member);
  vi.mocked(actionPlans.list).mockResolvedValue([plan]);
});
afterEach(() => vi.useRealTimers());

it("includes the current Bangkok work date without changing the records response", async () => {
  const response = await GET(new Request("http://localhost/api/action-plans?userId=u1&scope=all"));
  expect(response.status).toBe(200);
  expect(response.headers.get("x-workspace-date")).toBe("2026-10-20");
  expect(await response.json()).toEqual([plan]);
  expect(actionPlans.list).toHaveBeenCalledWith("action_plan_u1");
});

it("keeps inactive actors from reading records or receiving a success date", async () => {
  vi.mocked(currentActor).mockResolvedValue({ ...admin, status: "inactive" });
  const response = await GET(new Request("http://localhost/api/action-plans?userId=u1&scope=all"));
  expect(response.status).toBe(403);
  expect(response.headers.get("x-workspace-date")).toBeNull();
  expect(actionPlans.list).not.toHaveBeenCalled();
});
