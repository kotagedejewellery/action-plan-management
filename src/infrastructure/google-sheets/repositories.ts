import type { ActionPlanApprovalRepository, ActionPlanRepository, DivisionRepository, StatusRepository, UserRepository, WeeklyPlanRepository } from "@/application/ports";
import type { ActionPlan, ActionPlanApproval, ActionPlanStatus, Division, User, WeeklyPlan } from "@/domain/models";
import { AppError } from "@/application/errors";
import { sheetsClient, spreadsheetId } from "./client";

const PLAN_HEADERS = ["tanggal", "action_plan", "status_pagi", "status_sore", "link_hasil", "catatan", "record_id", "created_at", "updated_at", "deleted_at", "deleted_by", "weekly_plan_id", "lampiran"];
const STATUS_HEADERS = ["id", "label", "is_active", "created_at", "updated_at", "is_completed"];
const WEEKLY_PLAN_HEADERS = ["id", "user_id", "judul", "week_start", "week_end", "catatan", "created_at", "updated_at", "deleted_at", "deleted_by", "planned_action_plan_ids"];
const WEEKLY_PLANS_SHEET = "Weekly Plans";
const APPROVALS_SHEET = "Action Plan Approvals";
const APPROVAL_HEADERS = ["id", "action_plan_id", "owner_id", "division_id", "plan_updated_at", "decision", "note", "actor_id", "created_at"];

type Row = { values: string[]; rowNumber: number };
const value = (input: unknown) => String(input ?? "");
const READ_CACHE_TTL_MS = 30_000;
const USER_READ_CACHE_TTL_MS = 5_000;
type CachedRead = { expiresAt: number; value: Promise<string[][]> };
const readCache = new Map<string, CachedRead>();
const legacyPlanMigrations = new Map<string, Promise<void>>();

// ponytail: local cache assumes one app container; use a shared cache if replicas are added.
function clearReadCache() {
  readCache.clear();
}

function readValues(range: string): Promise<string[][]> {
  const key = `values:${range}`;
  const cached = readCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const ttl = (range.startsWith("Users!") || range.startsWith("Divisions!")) ? USER_READ_CACHE_TTL_MS : READ_CACHE_TTL_MS;
  const entry: CachedRead = { expiresAt: Date.now() + ttl, value: Promise.resolve([]) };
  entry.value = sheetsClient().spreadsheets.values.get({ spreadsheetId: spreadsheetId(), range })
    .then((response) => (response.data.values ?? []).map((entry) => entry.map(value)))
    .catch((error: unknown) => {
      if (readCache.get(key) === entry) readCache.delete(key);
      throw error;
    });
  readCache.set(key, entry);
  return entry.value;
}

async function rows(range: string): Promise<Row[]> {
  return (await readValues(range)).slice(1).map((values, index) => ({ values, rowNumber: index + 2 }));
}

async function append(range: string, values: string[]) {
  await sheetsClient().spreadsheets.values.append({ spreadsheetId: spreadsheetId(), range, valueInputOption: "RAW", requestBody: { values: [values] } });
  clearReadCache();
}

async function appendMany(range: string, values: string[][]) {
  if (values.length) {
    await sheetsClient().spreadsheets.values.append({ spreadsheetId: spreadsheetId(), range, valueInputOption: "RAW", requestBody: { values } });
    clearReadCache();
  }
}

async function replace(range: string, values: string[]) {
  await sheetsClient().spreadsheets.values.update({ spreadsheetId: spreadsheetId(), range, valueInputOption: "RAW", requestBody: { values: [values] } });
  clearReadCache();
}

function rangeSheetName(sheetName: string) {
  return sheetName.includes(" ") ? `'${sheetName}'` : sheetName;
}

function assertApprovalHeaders(headers: string[]) {
  if (APPROVAL_HEADERS.some((header, index) => headers[index] !== header)) throw new AppError("Header Action Plan Approvals tidak sesuai. Periksa sheet tanpa menghapus data existing.", "VALIDATION");
}

async function deleteRow(sheetName: string, rowNumber: number) {
  const sheet = await sheetsClient().spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
  const sheetId = sheet.data.sheets?.find((item) => item.properties?.title === sheetName)?.properties?.sheetId;
  if (sheetId === undefined) throw new Error("Sheet tidak ditemukan.");
  await sheetsClient().spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: rowNumber - 1, endIndex: rowNumber } } }] } });
  clearReadCache();
}

async function ensureHeaders(sheetName: string, headers: string[]) {
  const name = rangeSheetName(sheetName);
  const current = (await readValues(`${name}!1:1`))[0] ?? [];
  const next = headers.map((header, index) => current[index] || header);
  if (next.some((header, index) => current[index] !== header)) await replace(`${name}!A1:${String.fromCharCode(64 + headers.length)}1`, next);
}

async function migrateLegacyPlanRecords(sheetName: string) {
  const running = legacyPlanMigrations.get(sheetName);
  if (running) return running;

  const migration = (async () => {
    const legacyRows = (await rows(`${rangeSheetName(sheetName)}!A:M`)).filter((row) => row.values[0] && !row.values[6]);
    if (!legacyRows.length) return;
    const timestamp = new Date().toISOString();
    await sheetsClient().spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId(),
      requestBody: {
        valueInputOption: "RAW",
        data: legacyRows.map((row) => ({ range: `${rangeSheetName(sheetName)}!G${row.rowNumber}:I${row.rowNumber}`, values: [[crypto.randomUUID(), timestamp, timestamp]] })),
      },
    });
    clearReadCache();
  })().finally(() => legacyPlanMigrations.delete(sheetName));
  legacyPlanMigrations.set(sheetName, migration);
  return migration;
}

function userFrom(row: Row): User {
  const [id, name, email, passwordHash, role, status, sheetName, createdAt, updatedAt, divisionId] = row.values;
  return { id, name, email, passwordHash, role: role as User["role"], status: status as User["status"], sheetName, createdAt, updatedAt, divisionId: divisionId || undefined };
}

function planFrom(row: Row): ActionPlan {
  const [date, task, morningStatus, afternoonStatus, resultLink, note, id, createdAt, updatedAt, deletedAt, deletedBy, weeklyPlanId, attachments] = row.values;
  let parsedAttachments: ActionPlan["attachments"] = [];
  try { parsedAttachments = JSON.parse(attachments || "[]"); } catch { parsedAttachments = []; }
  return { id, date, task, morningStatus, afternoonStatus: afternoonStatus || undefined, resultLink: resultLink || undefined, note: note || undefined, weeklyPlanId: weeklyPlanId || undefined, attachments: Array.isArray(parsedAttachments) ? parsedAttachments : [], deletedAt: deletedAt || undefined, deletedBy: deletedBy || undefined, createdAt, updatedAt };
}

function weeklyPlanFrom(row: Row): WeeklyPlan {
  const [id, userId, title, weekStart, weekEnd, note, createdAt, updatedAt, deletedAt, deletedBy, plannedActionPlanIds] = row.values;
  let plannedIds: string[] = [];
  try { plannedIds = JSON.parse(plannedActionPlanIds || "[]"); } catch { plannedIds = []; }
  return { id, userId, title, weekStart, weekEnd, plannedActionPlanIds: Array.isArray(plannedIds) ? plannedIds : [], note: note || undefined, createdAt, updatedAt, deletedAt: deletedAt || undefined, deletedBy: deletedBy || undefined };
}

function weeklyRange(range: string) {
  return `'${WEEKLY_PLANS_SHEET}'!${range}`;
}

async function userRows() {
  const values = await readValues("Users!A:J");
  const header = values[0]?.[9];
  if ((header && header !== "division_id") || (!header && values.slice(1).some((row) => row[9]))) throw new AppError("Kolom J pada Users belum siap untuk division_id. Periksa pemetaan sebelum memperbarui data.", "VALIDATION");
  return values.slice(1).map((values, index) => ({ values, rowNumber: index + 2 }));
}

async function ensureUserDivisionHeader() {
  await userRows();
  if (!(await readValues("Users!A:J"))[0]?.[9]) await replace("Users!J1", ["division_id"]);
}

export class GoogleSheetsUserRepository implements UserRepository {
  async list() { return (await userRows()).filter((row) => row.values[0]).map(userFrom); }
  async findById(id: string) { return (await this.list()).find((user) => user.id === id) ?? null; }
  async findByEmail(email: string) { return (await this.list()).find((user) => user.email === email) ?? null; }
  async create(user: User) {
    await ensureUserDivisionHeader();
    await append("Users!A:J", [user.id, user.name, user.email, user.passwordHash, user.role, user.status, user.sheetName, user.createdAt, user.updatedAt, user.divisionId ?? ""]);
    return user;
  }
  async update(user: User) {
    const row = (await userRows()).find((item) => item.values[0] === user.id);
    if (!row) throw new Error("User tidak ditemukan.");
    await ensureUserDivisionHeader();
    await replace(`Users!A${row.rowNumber}:J${row.rowNumber}`, [user.id, user.name, user.email, user.passwordHash, user.role, user.status, user.sheetName, user.createdAt, user.updatedAt, user.divisionId ?? ""]);
    return user;
  }
  async remove(id: string) {
    const row = (await userRows()).find((item) => item.values[0] === id);
    if (!row) throw new Error("User tidak ditemukan.");
    await deleteRow("Users", row.rowNumber);
  }
  async createActionPlanSheet(sheetName: string) {
    const api = sheetsClient();
    const existing = await api.spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
    if (existing.data.sheets?.some((sheet) => sheet.properties?.title === sheetName)) return;
    await api.spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ addSheet: { properties: { title: sheetName, gridProperties: { frozenRowCount: 1 } } } }] } });
    clearReadCache();
    await replace(`${sheetName}!A1:M1`, PLAN_HEADERS);
  }
}

export class GoogleSheetsActionPlanRepository implements ActionPlanRepository {
  private async ensureSchema(sheetName: string) { await ensureHeaders(sheetName, PLAN_HEADERS); }
  async list(sheetName: string) { await this.ensureSchema(sheetName); await migrateLegacyPlanRecords(sheetName); return (await rows(`${rangeSheetName(sheetName)}!A:M`)).filter((row) => row.values[6]).map(planFrom).sort((a, b) => b.date.localeCompare(a.date)); }
  async findById(sheetName: string, id: string) { return (await this.list(sheetName)).find((plan) => plan.id === id) ?? null; }
  async create(sheetName: string, plan: ActionPlan) { await this.ensureSchema(sheetName); await append(`${rangeSheetName(sheetName)}!A:M`, [plan.date, plan.task, plan.morningStatus, plan.afternoonStatus ?? "", plan.resultLink ?? "", plan.note ?? "", plan.id, plan.createdAt, plan.updatedAt, plan.deletedAt ?? "", plan.deletedBy ?? "", plan.weeklyPlanId ?? "", JSON.stringify(plan.attachments ?? [])]); return plan; }
  async createMany(sheetName: string, plans: ActionPlan[]) { await this.ensureSchema(sheetName); await appendMany(`${rangeSheetName(sheetName)}!A:M`, plans.map((plan) => [plan.date, plan.task, plan.morningStatus, plan.afternoonStatus ?? "", plan.resultLink ?? "", plan.note ?? "", plan.id, plan.createdAt, plan.updatedAt, plan.deletedAt ?? "", plan.deletedBy ?? "", plan.weeklyPlanId ?? "", JSON.stringify(plan.attachments ?? [])])); return plans; }
  async update(sheetName: string, plan: ActionPlan) { await this.ensureSchema(sheetName); const row = (await rows(`${rangeSheetName(sheetName)}!A:M`)).find((item) => item.values[6] === plan.id); if (!row) throw new Error("Action Plan tidak ditemukan."); await replace(`${rangeSheetName(sheetName)}!A${row.rowNumber}:M${row.rowNumber}`, [plan.date, plan.task, plan.morningStatus, plan.afternoonStatus ?? "", plan.resultLink ?? "", plan.note ?? "", plan.id, plan.createdAt, plan.updatedAt, plan.deletedAt ?? "", plan.deletedBy ?? "", plan.weeklyPlanId ?? "", JSON.stringify(plan.attachments ?? [])]); return plan; }
  async softDelete(sheetName: string, id: string, deletedAt: string, deletedBy: string) { await this.ensureSchema(sheetName); const row = (await rows(`${rangeSheetName(sheetName)}!A:K`)).find((item) => item.values[6] === id); if (!row) throw new Error("Action Plan tidak ditemukan."); await replace(`${rangeSheetName(sheetName)}!J${row.rowNumber}:K${row.rowNumber}`, [deletedAt, deletedBy]); }
  async hardDelete(sheetName: string, id: string) { await this.ensureSchema(sheetName); const row = (await rows(`${rangeSheetName(sheetName)}!A:M`)).find((item) => item.values[6] === id); if (!row) throw new Error("Action Plan tidak ditemukan."); await deleteRow(sheetName, row.rowNumber); }
}

export class GoogleSheetsActionPlanApprovalRepository implements ActionPlanApprovalRepository {
  private async ensureSchema() {
    const metadata = await sheetsClient().spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
    if (!metadata.data.sheets?.some((sheet) => sheet.properties?.title === APPROVALS_SHEET)) {
      await sheetsClient().spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ addSheet: { properties: { title: APPROVALS_SHEET, gridProperties: { frozenRowCount: 1 } } } }] } });
      await replace(`'${APPROVALS_SHEET}'!A1:I1`, APPROVAL_HEADERS);
      return;
    }
    const current = await readValues(`'${APPROVALS_SHEET}'!A:I`);
    if (!current.length) await replace(`'${APPROVALS_SHEET}'!A1:I1`, APPROVAL_HEADERS);
    else assertApprovalHeaders(current[0]);
  }
  async list() {
    try {
      const values = await readValues(`'${APPROVALS_SHEET}'!A:I`);
      if (!values.length) return [];
      assertApprovalHeaders(values[0]);
      return values.slice(1).filter((row) => row[0]).map(([id, actionPlanId, ownerId, divisionId, planUpdatedAt, decision, note, actorId, createdAt]): ActionPlanApproval => {
        if (decision !== "submitted" && decision !== "approved" && decision !== "rejected") throw new AppError("Nilai keputusan pada Action Plan Approvals tidak valid.", "VALIDATION");
        return { id, actionPlanId, ownerId, divisionId, planUpdatedAt, decision, note: note || undefined, actorId, createdAt };
      });
    } catch (error) {
      const status = Number((error as { code?: number; response?: { status?: number } }).response?.status ?? (error as { code?: number }).code);
      if (status !== 400) throw error;
      const metadata = await sheetsClient().spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
      if (metadata.data.sheets?.some((sheet) => sheet.properties?.title === APPROVALS_SHEET)) throw error;
      return [];
    }
  }
  async create(approval: ActionPlanApproval) { await this.ensureSchema(); await append(`'${APPROVALS_SHEET}'!A:I`, [approval.id, approval.actionPlanId, approval.ownerId, approval.divisionId, approval.planUpdatedAt, approval.decision, approval.note ?? "", approval.actorId, approval.createdAt]); return approval; }
}

export class GoogleSheetsWeeklyPlanRepository implements WeeklyPlanRepository {
  private async ensureSchema() {
    const api = sheetsClient();
    const existing = await api.spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
    if (!existing.data.sheets?.some((sheet) => sheet.properties?.title === WEEKLY_PLANS_SHEET)) {
      await api.spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ addSheet: { properties: { title: WEEKLY_PLANS_SHEET, gridProperties: { frozenRowCount: 1 } } } }] } });
      clearReadCache();
    }
    await ensureHeaders(WEEKLY_PLANS_SHEET, WEEKLY_PLAN_HEADERS);
  }

  async list() { await this.ensureSchema(); return (await rows(weeklyRange("A:K"))).filter((row) => row.values[0]).map(weeklyPlanFrom); }
  async findById(id: string) { return (await this.list()).find((plan) => plan.id === id) ?? null; }
  async create(plan: WeeklyPlan) { await this.ensureSchema(); await append(weeklyRange("A:K"), [plan.id, plan.userId, plan.title, plan.weekStart, plan.weekEnd, plan.note ?? "", plan.createdAt, plan.updatedAt, plan.deletedAt ?? "", plan.deletedBy ?? "", JSON.stringify(plan.plannedActionPlanIds)]); return plan; }
  async update(plan: WeeklyPlan) {
    await this.ensureSchema();
    const row = (await rows(weeklyRange("A:K"))).find((item) => item.values[0] === plan.id);
    if (!row) throw new Error("Rencana mingguan tidak ditemukan.");
    await replace(weeklyRange(`A${row.rowNumber}:K${row.rowNumber}`), [plan.id, plan.userId, plan.title, plan.weekStart, plan.weekEnd, plan.note ?? "", plan.createdAt, plan.updatedAt, plan.deletedAt ?? "", plan.deletedBy ?? "", JSON.stringify(plan.plannedActionPlanIds)]);
    return plan;
  }
  async softDelete(id: string, deletedAt: string, deletedBy: string) {
    await this.ensureSchema();
    const row = (await rows(weeklyRange("A:K"))).find((item) => item.values[0] === id);
    if (!row) throw new Error("Rencana mingguan tidak ditemukan.");
    await replace(weeklyRange(`I${row.rowNumber}:J${row.rowNumber}`), [deletedAt, deletedBy]);
  }
  async hardDelete(id: string) {
    await this.ensureSchema();
    const row = (await rows(weeklyRange("A:K"))).find((item) => item.values[0] === id);
    if (!row) throw new Error("Rencana mingguan tidak ditemukan.");
    await deleteRow(WEEKLY_PLANS_SHEET, row.rowNumber);
  }
}

export class GoogleSheetsStatusRepository implements StatusRepository {
  private async ensureSchema() { await ensureHeaders("Settings", STATUS_HEADERS); }
  async list() { await this.ensureSchema(); return (await rows("Settings!A:F")).filter((row) => row.values[0]).map((row): ActionPlanStatus => ({ id: row.values[0], label: row.values[1], isActive: row.values[2] === "true", createdAt: row.values[3], updatedAt: row.values[4], isCompleted: row.values[5] === "true" || (!row.values[5] && row.values[1].toLowerCase() === "selesai") })); }
  async create(status: ActionPlanStatus) { await this.ensureSchema(); await append("Settings!A:F", [status.id, status.label, String(status.isActive), status.createdAt, status.updatedAt, String(status.isCompleted)]); return status; }
  async update(status: ActionPlanStatus) { await this.ensureSchema(); const row = (await rows("Settings!A:F")).find((item) => item.values[0] === status.id); if (!row) throw new Error("Status tidak ditemukan."); await replace(`Settings!A${row.rowNumber}:F${row.rowNumber}`, [status.id, status.label, String(status.isActive), status.createdAt, status.updatedAt, String(status.isCompleted)]); return status; }
}

const DIVISION_HEADERS = ["id", "name", "bod_user_id", "status", "created_at", "updated_at", "approval_required", "bod_monitor_user_ids"];
const APPROVAL_DIVISION_HEADERS = DIVISION_HEADERS.slice(0, 7);
const LEGACY_DIVISION_HEADERS = DIVISION_HEADERS.slice(0, 6);

function monitorUserIdsFrom(value: string | undefined) {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string" && id)) return [...new Set(parsed)];
  } catch { /* fall through */ }
  throw new AppError("Data BOD Monitor pada Divisions tidak valid. Periksa sheet tanpa menghapus data existing.", "VALIDATION");
}

export class GoogleSheetsDivisionRepository implements DivisionRepository {
  async list(): Promise<Division[]> {
    let values: string[][];
    try { values = await readValues("Divisions!A:H"); }
    catch (error) {
      const status = Number((error as { code?: number; response?: { status?: number } }).response?.status ?? (error as { code?: number }).code);
      if (status !== 400) throw error;
      const metadata = await sheetsClient().spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
      if (metadata.data.sheets?.some((sheet) => sheet.properties?.title === "Divisions")) throw error;
      return [];
    }
    if (!values.length) return [];
    const headers = values[0];
    const isLegacy = LEGACY_DIVISION_HEADERS.every((header, index) => headers[index] === header) && !headers[6];
    const hasApprovalHeader = APPROVAL_DIVISION_HEADERS.every((header, index) => headers[index] === header) && !headers[7];
    if (!isLegacy && !hasApprovalHeader && DIVISION_HEADERS.some((header, index) => headers[index] !== header)) throw new AppError("Header Divisions tidak sesuai. Periksa sheet tanpa menghapus data existing.", "VALIDATION");
    return values.slice(1).filter((row) => row[0]).map(([id, name, bodUserId, status, createdAt, updatedAt, approvalRequired, monitorUserIds]) => ({ id, name, bodUserId: bodUserId || undefined, monitorUserIds: monitorUserIdsFrom(monitorUserIds), status: status as Division["status"], createdAt, updatedAt, approvalRequired: approvalRequired === "true" }));
  }
  private async ensureDivisionHeaders() {
    await this.list();
    const headers = (await readValues("Divisions!A:H"))[0] ?? [];
    if (!headers[7]) await replace("Divisions!A1:H1", DIVISION_HEADERS);
  }
  async create(division: Division) {
    const metadata = await sheetsClient().spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
    if (!metadata.data.sheets?.some((sheet) => sheet.properties?.title === "Divisions")) {
      await sheetsClient().spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ addSheet: { properties: { title: "Divisions", gridProperties: { frozenRowCount: 1 } } } }] } });
      clearReadCache();
    }
    const values = await readValues("Divisions!A:H");
    if (!values.length) await replace("Divisions!A1:H1", DIVISION_HEADERS);
    else await this.list();
    await this.ensureDivisionHeaders();
    await append("Divisions!A:H", [division.id, division.name, division.bodUserId ?? "", division.status, division.createdAt, division.updatedAt, String(Boolean(division.approvalRequired)), JSON.stringify(division.monitorUserIds ?? [])]);
    return division;
  }
  async update(division: Division) {
    await this.ensureDivisionHeaders();
    const row = (await rows("Divisions!A:H")).find((item) => item.values[0] === division.id);
    if (!row) throw new AppError("Divisi tidak ditemukan.", "NOT_FOUND");
    await replace(`Divisions!A${row.rowNumber}:H${row.rowNumber}`, [division.id, division.name, division.bodUserId ?? "", division.status, division.createdAt, division.updatedAt, String(Boolean(division.approvalRequired)), JSON.stringify(division.monitorUserIds ?? [])]);
    return division;
  }
}
