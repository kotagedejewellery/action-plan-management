import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Actor, User } from "@/domain/models";

vi.mock("@/infrastructure/container", () => ({
  users: { list: vi.fn() },
  actionPlans: { list: vi.fn() },
  statuses: { list: vi.fn() },
  weeklyPlans: { list: vi.fn() },
}));
vi.mock("@/presentation/server/actor", () => ({ currentActor: vi.fn() }));

import { users, actionPlans, statuses, weeklyPlans } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";
import { GET } from "@/app/api/dashboard/route";
import { AppError } from "@/application/errors";

const admin: Actor = { id: "admin", name: "Admin", email: "admin@test", role: "admin", status: "active", sheetName: "" };
const member: User = { id: "u1", name: "Alya", email: "alya@test", role: "user", status: "active", sheetName: "action_plan_u1", passwordHash: "private-password-hash", createdAt: "", updatedAt: "" };

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(users.list).mockResolvedValue([member]);
  vi.mocked(actionPlans.list).mockResolvedValue([
    { id: "p1", date: "2026-10-19", task: "Review desain", morningStatus: "Proses", createdAt: "", updatedAt: "" },
    { id: "deleted", date: "2026-10-18", task: "Dihapus", morningStatus: "Proses", deletedAt: "2026-10-19", createdAt: "", updatedAt: "" },
  ]);
  vi.mocked(statuses.list).mockResolvedValue([{ id: "s1", label: "Final", isActive: true, isCompleted: true, createdAt: "", updatedAt: "" }]);
  vi.mocked(weeklyPlans.list).mockResolvedValue([]);
});

describe("dashboard refresh", () => {
  it.each([
    { ...admin, role: "user" as const, sheetName: "action_plan_u1" },
    { ...admin, status: "inactive" as const },
  ])("rejects unauthorized actors before reading team data", async (actor) => {
    vi.mocked(currentActor).mockResolvedValue(actor);
    expect((await GET()).status).toBe(403);
    expect(users.list).not.toHaveBeenCalled();
    expect(actionPlans.list).not.toHaveBeenCalled();
    expect(weeklyPlans.list).not.toHaveBeenCalled();
  });

  it("rejects missing sessions", async () => {
    vi.mocked(currentActor).mockRejectedValue(new AppError("Sesi tidak valid.", "FORBIDDEN"));
    expect((await GET()).status).toBe(403);
    expect(users.list).not.toHaveBeenCalled();
  });

  it("returns safe owned records, completed status labels and the actual load time", async () => {
    vi.mocked(currentActor).mockResolvedValue(admin);
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.plans).toHaveLength(1);
    expect(body.plans[0]).toMatchObject({ id: "p1", ownerId: "u1", ownerName: "Alya" });
    expect(actionPlans.list).toHaveBeenCalledWith("action_plan_u1");
    expect(body.completedStatusLabels).toEqual(["Final"]);
    expect(body.users[0]).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(body)).not.toContain("private-password-hash");
    expect(Number.isNaN(Date.parse(body.loadedAt))).toBe(false);
  });

  it("returns a recoverable Google quota error without leaking request details", async () => {
    vi.mocked(currentActor).mockResolvedValue(admin);
    vi.mocked(users.list).mockRejectedValue(Object.assign(new Error("Quota exceeded for googleapis.com secret-token"), { code: 429 }));
    const response = await GET();
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error).toContain("batas permintaan");
    expect(body.error).not.toContain("secret-token");
  });
});
