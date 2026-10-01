import type { ActionPlanRepository, StatusRepository, UserRepository } from "@/application/ports";
import type { ActionPlan, ActionPlanStatus, User } from "@/domain/models";
import { sheetsClient, spreadsheetId } from "./client";

const PLAN_HEADERS = ["tanggal", "action_plan", "status_pagi", "status_sore", "link_hasil", "catatan", "record_id", "created_at", "updated_at"];

type Row = { values: string[]; rowNumber: number };
const value = (input: unknown) => String(input ?? "");

async function rows(range: string): Promise<Row[]> {
  const response = await sheetsClient().spreadsheets.values.get({ spreadsheetId: spreadsheetId(), range });
  return (response.data.values ?? []).slice(1).map((entry, index) => ({ values: entry.map(value), rowNumber: index + 2 }));
}

async function append(range: string, values: string[]) {
  await sheetsClient().spreadsheets.values.append({ spreadsheetId: spreadsheetId(), range, valueInputOption: "RAW", requestBody: { values: [values] } });
}

async function replace(range: string, values: string[]) {
  await sheetsClient().spreadsheets.values.update({ spreadsheetId: spreadsheetId(), range, valueInputOption: "RAW", requestBody: { values: [values] } });
}

function userFrom(row: Row): User {
  const [id, name, email, passwordHash, role, status, sheetName, createdAt, updatedAt] = row.values;
  return { id, name, email, passwordHash, role: role as User["role"], status: status as User["status"], sheetName, createdAt, updatedAt };
}

function planFrom(row: Row): ActionPlan {
  const [date, task, morningStatus, afternoonStatus, resultLink, note, id, createdAt, updatedAt] = row.values;
  return { id, date, task, morningStatus, afternoonStatus: afternoonStatus || undefined, resultLink: resultLink || undefined, note: note || undefined, createdAt, updatedAt };
}

export class GoogleSheetsUserRepository implements UserRepository {
  async list() { return (await rows("Users!A:I")).filter((row) => row.values[0]).map(userFrom); }
  async findById(id: string) { return (await this.list()).find((user) => user.id === id) ?? null; }
  async findByEmail(email: string) { return (await this.list()).find((user) => user.email === email) ?? null; }
  async create(user: User) { await append("Users!A:I", [user.id, user.name, user.email, user.passwordHash, user.role, user.status, user.sheetName, user.createdAt, user.updatedAt]); return user; }
  async update(user: User) { const row = (await rows("Users!A:I")).find((item) => item.values[0] === user.id); if (!row) throw new Error("User tidak ditemukan."); await replace(`Users!A${row.rowNumber}:I${row.rowNumber}`, [user.id, user.name, user.email, user.passwordHash, user.role, user.status, user.sheetName, user.createdAt, user.updatedAt]); return user; }
  async createActionPlanSheet(sheetName: string) {
    const api = sheetsClient();
    const existing = await api.spreadsheets.get({ spreadsheetId: spreadsheetId(), fields: "sheets.properties" });
    if (existing.data.sheets?.some((sheet) => sheet.properties?.title === sheetName)) return;
    await api.spreadsheets.batchUpdate({ spreadsheetId: spreadsheetId(), requestBody: { requests: [{ addSheet: { properties: { title: sheetName, gridProperties: { frozenRowCount: 1 } } } }] } });
    await replace(`${sheetName}!A1:I1`, PLAN_HEADERS);
  }
}

export class GoogleSheetsActionPlanRepository implements ActionPlanRepository {
  async list(sheetName: string) { return (await rows(`${sheetName}!A:I`)).filter((row) => row.values[6]).map(planFrom).sort((a, b) => b.date.localeCompare(a.date)); }
  async findById(sheetName: string, id: string) { return (await this.list(sheetName)).find((plan) => plan.id === id) ?? null; }
  async create(sheetName: string, plan: ActionPlan) { await append(`${sheetName}!A:I`, [plan.date, plan.task, plan.morningStatus, plan.afternoonStatus ?? "", plan.resultLink ?? "", plan.note ?? "", plan.id, plan.createdAt, plan.updatedAt]); return plan; }
  async update(sheetName: string, plan: ActionPlan) { const row = (await rows(`${sheetName}!A:I`)).find((item) => item.values[6] === plan.id); if (!row) throw new Error("Action Plan tidak ditemukan."); await replace(`${sheetName}!A${row.rowNumber}:I${row.rowNumber}`, [plan.date, plan.task, plan.morningStatus, plan.afternoonStatus ?? "", plan.resultLink ?? "", plan.note ?? "", plan.id, plan.createdAt, plan.updatedAt]); return plan; }
}

export class GoogleSheetsStatusRepository implements StatusRepository {
  async list() { return (await rows("Settings!A:E")).filter((row) => row.values[0]).map((row): ActionPlanStatus => ({ id: row.values[0], label: row.values[1], isActive: row.values[2] === "true", createdAt: row.values[3], updatedAt: row.values[4] })); }
  async create(status: ActionPlanStatus) { await append("Settings!A:E", [status.id, status.label, String(status.isActive), status.createdAt, status.updatedAt]); return status; }
  async update(status: ActionPlanStatus) { const row = (await rows("Settings!A:E")).find((item) => item.values[0] === status.id); if (!row) throw new Error("Status tidak ditemukan."); await replace(`Settings!A${row.rowNumber}:E${row.rowNumber}`, [status.id, status.label, String(status.isActive), status.createdAt, status.updatedAt]); return status; }
}
