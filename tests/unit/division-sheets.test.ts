import { beforeEach, expect, it, vi } from "vitest";
import type { Division } from "@/domain/models";
import type { ActionPlanApproval } from "@/domain/models";

const google = vi.hoisted(() => ({ get: vi.fn(), batchGet: vi.fn(), update: vi.fn(), append: vi.fn(), metadata: vi.fn(), batchUpdate: vi.fn() }));
vi.mock("@/infrastructure/google-sheets/client", () => ({ spreadsheetId: () => "synthetic-sheet", sheetsClient: () => ({ spreadsheets: { values: { get: google.get, batchGet: google.batchGet, update: google.update, append: google.append }, get: google.metadata, batchUpdate: google.batchUpdate } }) }));

beforeEach(() => { vi.resetModules(); vi.resetAllMocks(); google.update.mockResolvedValue({}); google.append.mockResolvedValue({}); google.batchUpdate.mockResolvedValue({}); });
const legacyHeaders = ["id", "name", "email", "password_hash", "role", "status", "sheet_name", "created_at", "updated_at"];
const legacyUser = ["u-old", "Existing", "old@example.test", "unchanged-hash", "user", "active", "legacy_plan_sheet", "created", "updated"];
const division: Division = { id: "division-a", name: "Marketing", bodUserId: "bod-a", status: "active", createdAt: "created", updatedAt: "updated" };
const approval: ActionPlanApproval = { id: "approval-1", actionPlanId: "plan-1", ownerId: "user-1", divisionId: "division-a", planUpdatedAt: "updated", decision: "submitted", actorId: "user-1", createdAt: "created" };

it("reads nine-column Users without writes or implicit division assignment", async () => {
  google.get.mockResolvedValue({ data: { values: [legacyHeaders, legacyUser] } });
  const { GoogleSheetsUserRepository } = await import("@/infrastructure/google-sheets/repositories");
  const users = await new GoogleSheetsUserRepository().list();
  expect(users[0]).toMatchObject({ id: "u-old", sheetName: "legacy_plan_sheet", passwordHash: "unchanged-hash" });
  expect(users[0].divisionId).toBeUndefined();
  expect(google.update).not.toHaveBeenCalled(); expect(google.batchUpdate).not.toHaveBeenCalled();
});

it("batch reads current Action Plan sheets without triggering a schema write", async () => {
  google.batchGet.mockResolvedValue({ data: { valueRanges: [
    { values: [["tanggal", "action_plan", "status_pagi", "status_sore", "link_hasil", "catatan", "record_id", "created_at", "updated_at", "deleted_at", "deleted_by", "weekly_plan_id", "lampiran"], ["2026-11-18", "Review", "Open", "", "", "", "plan-1", "created", "updated"]] },
    { values: [["tanggal", "action_plan", "status_pagi", "status_sore", "link_hasil", "catatan", "record_id", "created_at", "updated_at", "deleted_at", "deleted_by", "weekly_plan_id", "lampiran"], ["2026-11-17", "Publish", "Open", "", "", "", "plan-2", "created", "updated"]] },
  ] } });
  const { GoogleSheetsActionPlanRepository } = await import("@/infrastructure/google-sheets/repositories");
  const plans = await new GoogleSheetsActionPlanRepository().listMany(["action_plan_a", "action_plan_b"]);
  expect(plans.get("action_plan_a")?.map((plan) => plan.id)).toEqual(["plan-1"]);
  expect(plans.get("action_plan_b")?.map((plan) => plan.id)).toEqual(["plan-2"]);
  expect(google.batchGet).toHaveBeenCalledWith(expect.objectContaining({ spreadsheetId: "synthetic-sheet", ranges: ["action_plan_a!A:M", "action_plan_b!A:M"] }));
  expect(google.get).not.toHaveBeenCalled(); expect(google.update).not.toHaveBeenCalled(); expect(google.batchUpdate).not.toHaveBeenCalled();
});

it("splits large Dashboard reads into bounded Google Sheets batches", async () => {
  google.batchGet.mockImplementation(async ({ ranges }: { ranges: string[] }) => ({ data: { valueRanges: ranges.map(() => ({ values: [["tanggal"], ["2026-11-18", "Task", "Open", "", "", "", "record-id", "created", "updated"]] })) } }));
  const sheetNames = Array.from({ length: 101 }, (_, index) => `action_plan_${index}`);
  const { GoogleSheetsActionPlanRepository } = await import("@/infrastructure/google-sheets/repositories");

  const plans = await new GoogleSheetsActionPlanRepository().listMany(sheetNames);

  expect(plans.size).toBe(101);
  expect(google.batchGet).toHaveBeenCalledTimes(2);
  expect(google.batchGet.mock.calls.map(([request]) => request.ranges.length)).toEqual([100, 1]);
});

it("keeps legacy Action Plan sheets read-only during a Dashboard batch read", async () => {
  google.batchGet.mockResolvedValue({ data: { valueRanges: [{ values: [["tanggal", "action_plan"], ["2026-11-18", "Task legacy", "Open"]] }] } });
  const { GoogleSheetsActionPlanRepository } = await import("@/infrastructure/google-sheets/repositories");

  const plans = await new GoogleSheetsActionPlanRepository().listMany(["action_plan_legacy"]);

  expect(plans.get("action_plan_legacy")?.[0]).toMatchObject({ id: "legacy:action_plan_legacy:2", task: "Task legacy" });
  expect(google.get).not.toHaveBeenCalled(); expect(google.update).not.toHaveBeenCalled(); expect(google.batchUpdate).not.toHaveBeenCalled();
});

it("adds only the new header and existing User affiliation, retaining ID, hash and sheet mapping", async () => {
  let header = [...legacyHeaders];
  google.get.mockImplementation(async () => ({ data: { values: [header, legacyUser] } }));
  google.update.mockImplementation(async ({ range, requestBody }) => { if (range === "Users!J1") header = [...legacyHeaders, ...requestBody.values[0]]; return {}; });
  const { GoogleSheetsUserRepository } = await import("@/infrastructure/google-sheets/repositories");
  const repository = new GoogleSheetsUserRepository();
  const [user] = await repository.list();
  await repository.update({ ...user, divisionId: "division-a" });
  expect(google.update).toHaveBeenCalledWith(expect.objectContaining({ spreadsheetId: "synthetic-sheet", range: "Users!J1", requestBody: { values: [["division_id"]] } }));
  expect(google.update).toHaveBeenCalledWith(expect.objectContaining({ range: "Users!A2:J2", requestBody: { values: [[...legacyUser, "division-a"]] } }));
  expect(google.batchUpdate).not.toHaveBeenCalled();
});

it.each([[[...legacyHeaders, "other_business_column"], [...legacyUser, "existing-data"]], [legacyHeaders, [...legacyUser, "unlabelled-data"]]])("refuses an occupied unknown column J before any write", async (headers, row) => {
  google.get.mockResolvedValue({ data: { values: [headers, row] } });
  const { GoogleSheetsUserRepository } = await import("@/infrastructure/google-sheets/repositories");
  await expect(new GoogleSheetsUserRepository().list()).rejects.toMatchObject({ code: "VALIDATION" });
  expect(google.update).not.toHaveBeenCalled();
});

it("treats a missing Divisions sheet as unconfigured without creating or clearing anything", async () => {
  google.get.mockRejectedValue({ response: { status: 400 } });
  google.metadata.mockResolvedValue({ data: { sheets: [{ properties: { title: "Users" } }] } });
  const { GoogleSheetsDivisionRepository } = await import("@/infrastructure/google-sheets/repositories");
  expect(await new GoogleSheetsDivisionRepository().list()).toEqual([]);
  expect(google.update).not.toHaveBeenCalled(); expect(google.batchUpdate).not.toHaveBeenCalled();
});

it("does not hide permission/network failures as an empty division directory", async () => {
  google.get.mockRejectedValue({ response: { status: 403 } });
  const { GoogleSheetsDivisionRepository } = await import("@/infrastructure/google-sheets/repositories");
  await expect(new GoogleSheetsDivisionRepository().list()).rejects.toMatchObject({ response: { status: 403 } });
  expect(google.metadata).not.toHaveBeenCalled(); expect(google.update).not.toHaveBeenCalled();
});

it("creates only a missing Divisions tab and invalidates the cached assignment after a write", async () => {
  let values: string[][] = [];
  google.metadata.mockResolvedValue({ data: { sheets: [] } });
  google.get.mockImplementation(async () => ({ data: { values } }));
  google.update.mockImplementation(async ({ requestBody }) => { values = requestBody.values; return {}; });
  google.append.mockImplementation(async ({ requestBody }) => { values = [...values, ...requestBody.values]; return {}; });
  const { GoogleSheetsDivisionRepository } = await import("@/infrastructure/google-sheets/repositories");
  const repository = new GoogleSheetsDivisionRepository();
  await repository.create(division);
  expect(await repository.list()).toEqual([{ ...division, approvalRequired: false, monitorUserIds: [] }]);
  expect(google.batchUpdate).toHaveBeenCalledWith(expect.objectContaining({ requestBody: { requests: [{ addSheet: { properties: { title: "Divisions", gridProperties: { frozenRowCount: 1 } } } }] } }));
  expect(google.update).toHaveBeenCalledTimes(1);
  expect(google.update.mock.calls[0][0].range).toBe("Divisions!A1:H1");
  expect(google.append).toHaveBeenCalledTimes(1);
});

it("reads the legacy six-column Divisions sheet without changing approval configuration", async () => {
  google.get.mockResolvedValue({ data: { values: [["id", "name", "bod_user_id", "status", "created_at", "updated_at"], ["division-a", "Marketing", "bod-a", "active", "created", "updated"]] } });
  const { GoogleSheetsDivisionRepository } = await import("@/infrastructure/google-sheets/repositories");
  await expect(new GoogleSheetsDivisionRepository().list()).resolves.toEqual([{ ...division, approvalRequired: false, monitorUserIds: [] }]);
  expect(google.update).not.toHaveBeenCalled();
});

it("adds the monitor header only when a SuperAdmin explicitly updates a legacy division", async () => {
  const values = [["id", "name", "bod_user_id", "status", "created_at", "updated_at", "approval_required"], ["division-a", "Marketing", "bod-a", "active", "created", "updated", "false"]];
  google.get.mockImplementation(async () => ({ data: { values } }));
  google.update.mockImplementation(async ({ range, requestBody }) => {
    if (range === "Divisions!A1:H1") values[0] = requestBody.values[0];
    return {};
  });
  const { GoogleSheetsDivisionRepository } = await import("@/infrastructure/google-sheets/repositories");
  await new GoogleSheetsDivisionRepository().update({ ...division, monitorUserIds: ["bod-monitor"] });
  expect(google.update).toHaveBeenCalledWith(expect.objectContaining({ range: "Divisions!A1:H1", requestBody: { values: [["id", "name", "bod_user_id", "status", "created_at", "updated_at", "approval_required", "bod_monitor_user_ids"]] } }));
  expect(google.update).toHaveBeenCalledWith(expect.objectContaining({ range: "Divisions!A2:H2", requestBody: expect.objectContaining({ values: [expect.arrayContaining(["[\"bod-monitor\"]"])] }) }));
});

it("refuses a pre-existing approval tab with unknown headers before appending an event", async () => {
  google.metadata.mockResolvedValue({ data: { sheets: [{ properties: { title: "Action Plan Approvals" } }] } });
  google.get.mockResolvedValue({ data: { values: [["unexpected_header"]] } });
  const { GoogleSheetsActionPlanApprovalRepository } = await import("@/infrastructure/google-sheets/repositories");
  await expect(new GoogleSheetsActionPlanApprovalRepository().create(approval)).rejects.toMatchObject({ code: "VALIDATION" });
  expect(google.append).not.toHaveBeenCalled();
});
