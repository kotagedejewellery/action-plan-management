import { beforeEach, expect, it, vi } from "vitest";
import type { Division } from "@/domain/models";

const google = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn(), append: vi.fn(), metadata: vi.fn(), batchUpdate: vi.fn() }));
vi.mock("@/infrastructure/google-sheets/client", () => ({ spreadsheetId: () => "synthetic-sheet", sheetsClient: () => ({ spreadsheets: { values: { get: google.get, update: google.update, append: google.append }, get: google.metadata, batchUpdate: google.batchUpdate } }) }));

beforeEach(() => { vi.resetModules(); vi.resetAllMocks(); google.update.mockResolvedValue({}); google.append.mockResolvedValue({}); google.batchUpdate.mockResolvedValue({}); });
const legacyHeaders = ["id", "name", "email", "password_hash", "role", "status", "sheet_name", "created_at", "updated_at"];
const legacyUser = ["u-old", "Existing", "old@example.test", "unchanged-hash", "user", "active", "legacy_plan_sheet", "created", "updated"];
const division: Division = { id: "division-a", name: "Marketing", bodUserId: "bod-a", status: "active", createdAt: "created", updatedAt: "updated" };

it("reads nine-column Users without writes or implicit division assignment", async () => {
  google.get.mockResolvedValue({ data: { values: [legacyHeaders, legacyUser] } });
  const { GoogleSheetsUserRepository } = await import("@/infrastructure/google-sheets/repositories");
  const users = await new GoogleSheetsUserRepository().list();
  expect(users[0]).toMatchObject({ id: "u-old", sheetName: "legacy_plan_sheet", passwordHash: "unchanged-hash" });
  expect(users[0].divisionId).toBeUndefined();
  expect(google.update).not.toHaveBeenCalled(); expect(google.batchUpdate).not.toHaveBeenCalled();
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
  expect(await repository.list()).toEqual([division]);
  expect(google.batchUpdate).toHaveBeenCalledWith(expect.objectContaining({ requestBody: { requests: [{ addSheet: { properties: { title: "Divisions", gridProperties: { frozenRowCount: 1 } } } }] } }));
  expect(google.update).toHaveBeenCalledTimes(1);
  expect(google.update.mock.calls[0][0].range).toBe("Divisions!A1:F1");
  expect(google.append).toHaveBeenCalledTimes(1);
});
