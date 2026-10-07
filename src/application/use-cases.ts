import bcrypt from "bcryptjs";

import { AppError } from "@/application/errors";
import type { ActionPlanRepository, AttachmentStorage, StatusRepository, UserRepository, WeeklyPlanRepository } from "@/application/ports";
import type { ActionPlan, ActionPlanStatus, Actor, SafeUser, User, WeeklyPlan } from "@/domain/models";
import { toSafeUser } from "@/domain/models";

export function requireActiveActor(actor: Actor | null): asserts actor is Actor {
  if (!actor || actor.status !== "active") throw new AppError("Sesi tidak valid atau akun tidak aktif.", "FORBIDDEN");
}

export function requireAdmin(actor: Actor | null): asserts actor is Actor & { role: "admin" } {
  requireActiveActor(actor);
  if (actor.role !== "admin") throw new AppError("Akses khusus Admin diperlukan.", "FORBIDDEN");
}

export async function authenticateUser(users: UserRepository, email: string, password: string): Promise<SafeUser | null> {
  const user = await users.findByEmail(email.trim().toLowerCase());
  if (!user || user.status !== "active") return null;
  return (await bcrypt.compare(password, user.passwordHash)) ? toSafeUser(user) : null;
}

export async function createUser(users: UserRepository, input: Omit<User, "passwordHash" | "createdAt" | "updatedAt" | "sheetName"> & { password: string }): Promise<SafeUser> {
  const email = input.email.trim().toLowerCase();
  if (await users.findByEmail(email)) throw new AppError("Email tersebut sudah digunakan.", "CONFLICT");
  const timestamp = new Date().toISOString();
  const sheetName = input.role === "user" ? `action_plan_${input.id}` : "";
  const user: User = { ...input, email, sheetName, passwordHash: await bcrypt.hash(input.password, 12), createdAt: timestamp, updatedAt: timestamp };
  if (sheetName) await users.createActionPlanSheet(sheetName);
  return toSafeUser(await users.create(user));
}

export async function updateUser(users: UserRepository, existing: User, input: Partial<Pick<User, "name" | "email" | "role" | "status">> & { password?: string }): Promise<SafeUser> {
  const email = input.email ? input.email.trim().toLowerCase() : existing.email;
  const emailOwner = await users.findByEmail(email);
  if (emailOwner && emailOwner.id !== existing.id) throw new AppError("Email tersebut sudah digunakan.", "CONFLICT");
  const role = input.role ?? existing.role;
  const status = input.status ?? existing.status;
  if (existing.role === "admin" && existing.status === "active" && (role !== "admin" || status !== "active")) {
    const anotherActiveAdmin = (await users.list()).some((user) => user.id !== existing.id && user.role === "admin" && user.status === "active");
    if (!anotherActiveAdmin) throw new AppError("Minimal harus ada satu Admin aktif.", "VALIDATION");
  }
  const sheetName = existing.sheetName || (role === "user" ? `action_plan_${existing.id}` : "");
  if (sheetName && !existing.sheetName) await users.createActionPlanSheet(sheetName);
  const user: User = { ...existing, ...input, email, role, status, sheetName, passwordHash: input.password ? await bcrypt.hash(input.password, 12) : existing.passwordHash, updatedAt: new Date().toISOString() };
  return toSafeUser(await users.update(user));
}

export type ActionPlanScope = "active" | "history" | "all";

export async function listVisiblePlans(repository: ActionPlanRepository, statuses: StatusRepository, actor: Actor, target: User | null, scope: ActionPlanScope = "all"): Promise<ActionPlan[]> {
  requireActiveActor(actor);
  const sheetName = actor.role === "user" ? actor.sheetName : target?.role === "user" ? target.sheetName : null;
  if (!sheetName) throw new AppError("User target tidak ditemukan.", "NOT_FOUND");
  const plans = (await repository.list(sheetName)).filter((plan) => !plan.deletedAt);
  if (scope === "all") return plans;
  const completedLabels = new Set((await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label));
  return plans.filter((plan) => scope === "history" ? Boolean(plan.afternoonStatus && completedLabels.has(plan.afternoonStatus)) : !plan.afternoonStatus || !completedLabels.has(plan.afternoonStatus));
}

export async function saveOwnActionPlan(repository: ActionPlanRepository, statuses: StatusRepository, weeklyPlans: WeeklyPlanRepository, actor: Actor, plan: ActionPlan, expectedUpdatedAt?: string): Promise<ActionPlan> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Admin tidak mengubah Action Plan pada versi ini.", "FORBIDDEN");
  const allowedStatuses = new Set((await statuses.list()).filter((status) => status.isActive).map((status) => status.label));
  if (!allowedStatuses.has(plan.morningStatus) || (plan.afternoonStatus && !allowedStatuses.has(plan.afternoonStatus))) throw new AppError("Pilih status yang masih aktif.", "VALIDATION");
  if (plan.weeklyPlanId) {
    const weeklyPlan = await weeklyPlans.findById(plan.weeklyPlanId);
    if (!weeklyPlan || weeklyPlan.deletedAt || weeklyPlan.userId !== actor.id) throw new AppError("Rencana mingguan tidak ditemukan.", "NOT_FOUND");
    if (plan.date < weeklyPlan.weekStart || plan.date > weeklyPlan.weekEnd) throw new AppError("Tanggal Action Plan harus berada dalam periode rencana mingguan.", "VALIDATION");
  }
  const current = await repository.findById(actor.sheetName, plan.id);
  if (current?.deletedAt) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
  if (current && expectedUpdatedAt && current.updatedAt !== expectedUpdatedAt) throw new AppError("Data telah diubah pengguna lain. Muat ulang halaman sebelum menyimpan.", "CONFLICT");
  const saved = current ? await repository.update(actor.sheetName, plan) : await repository.create(actor.sheetName, plan);
  if (current?.weeklyPlanId !== saved.weeklyPlanId) {
    for (const weeklyPlanId of new Set([current?.weeklyPlanId, saved.weeklyPlanId].filter((value): value is string => Boolean(value)))) {
      const weeklyPlan = await weeklyPlans.findById(weeklyPlanId);
      if (!weeklyPlan || weeklyPlan.deletedAt) continue;
      const plannedActionPlanIds = weeklyPlan.plannedActionPlanIds.filter((item) => item !== saved.id);
      if (weeklyPlanId === saved.weeklyPlanId) plannedActionPlanIds.push(saved.id);
      if (plannedActionPlanIds.join(",") !== weeklyPlan.plannedActionPlanIds.join(",")) await weeklyPlans.update({ ...weeklyPlan, plannedActionPlanIds, updatedAt: new Date().toISOString() });
    }
  }
  return saved;
}

function dateAtWeekday(weekStart: string, weekday: number) {
  const date = new Date(`${weekStart}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + weekday - 1);
  return date.toISOString().slice(0, 10);
}

export async function listOwnWeeklyPlans(repository: WeeklyPlanRepository, actor: Actor): Promise<WeeklyPlan[]> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Rencana mingguan hanya tersedia untuk User.", "FORBIDDEN");
  return (await repository.list()).filter((plan) => plan.userId === actor.id && !plan.deletedAt).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

export async function listOwnArchivedWeeklyPlans(repository: WeeklyPlanRepository, actor: Actor): Promise<WeeklyPlan[]> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Riwayat rencana mingguan hanya tersedia untuk User.", "FORBIDDEN");
  return (await repository.list()).filter((plan) => plan.userId === actor.id && plan.deletedAt).sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""));
}

export async function createOwnWeeklyPlan(weeklyPlans: WeeklyPlanRepository, actionPlans: ActionPlanRepository, statuses: StatusRepository, actor: Actor, input: { title: string; weekStart: string; weekdays: number[]; morningStatus: string; note?: string }): Promise<{ weeklyPlan: WeeklyPlan; actionPlans: ActionPlan[] }> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Rencana mingguan hanya dapat dibuat oleh User.", "FORBIDDEN");
  if (new Date(`${input.weekStart}T00:00:00Z`).getUTCDay() !== 1) throw new AppError("Tanggal mulai harus hari Senin.", "VALIDATION");
  const allowedStatuses = new Set((await statuses.list()).filter((status) => status.isActive).map((status) => status.label));
  if (!allowedStatuses.has(input.morningStatus)) throw new AppError("Pilih status yang masih aktif.", "VALIDATION");

  const timestamp = new Date().toISOString();
  const weeklyPlanId = crypto.randomUUID();
  const dailyPlans = [...input.weekdays].sort((a, b) => a - b).map((weekday): ActionPlan => ({ id: crypto.randomUUID(), date: dateAtWeekday(input.weekStart, weekday), task: input.title.trim(), morningStatus: input.morningStatus, note: input.note || undefined, weeklyPlanId, createdAt: timestamp, updatedAt: timestamp }));
  const weeklyPlan: WeeklyPlan = { id: weeklyPlanId, userId: actor.id, title: input.title.trim(), weekStart: input.weekStart, weekEnd: dateAtWeekday(input.weekStart, 7), plannedActionPlanIds: dailyPlans.map((plan) => plan.id), note: input.note || undefined, createdAt: timestamp, updatedAt: timestamp };

  await weeklyPlans.create(weeklyPlan);
  try {
    await actionPlans.createMany(actor.sheetName, dailyPlans);
  } catch (error) {
    await weeklyPlans.hardDelete(weeklyPlan.id);
    throw error;
  }
  return { weeklyPlan, actionPlans: dailyPlans };
}

export async function updateOwnWeeklyPlan(repository: WeeklyPlanRepository, actor: Actor, id: string, input: { title: string; note?: string; updatedAt?: string }): Promise<WeeklyPlan> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Rencana mingguan hanya dapat diubah oleh User.", "FORBIDDEN");
  const current = await repository.findById(id);
  if (!current || current.deletedAt || current.userId !== actor.id) throw new AppError("Rencana mingguan tidak ditemukan.", "NOT_FOUND");
  if (input.updatedAt && current.updatedAt !== input.updatedAt) throw new AppError("Rencana mingguan telah diubah pengguna lain. Muat ulang halaman sebelum menyimpan.", "CONFLICT");
  return repository.update({ ...current, title: input.title.trim(), note: input.note || undefined, updatedAt: new Date().toISOString() });
}

export async function deleteOwnWeeklyPlan(repository: WeeklyPlanRepository, actionPlans: ActionPlanRepository, storage: AttachmentStorage, actor: Actor, id: string): Promise<void> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Rencana mingguan hanya dapat dihapus oleh User.", "FORBIDDEN");
  const current = await repository.findById(id);
  if (!current || current.deletedAt || current.userId !== actor.id) throw new AppError("Rencana mingguan tidak ditemukan.", "NOT_FOUND");
  const linkedPlans = (await actionPlans.list(actor.sheetName)).filter((plan) => plan.weeklyPlanId === id && !plan.deletedAt);
  for (const plan of linkedPlans) {
    await Promise.all((plan.attachments ?? []).map((attachment) => storage.hardDelete(attachment.id)));
    await actionPlans.hardDelete(actor.sheetName, plan.id);
  }
  await repository.hardDelete(id);
}

export async function deleteOwnActionPlan(repository: ActionPlanRepository, actor: Actor, id: string): Promise<void> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Admin tidak menghapus Action Plan pada versi ini.", "FORBIDDEN");
  const current = await repository.findById(actor.sheetName, id);
  if (!current || current.deletedAt) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
  if (current.weeklyPlanId) throw new AppError("Action Plan yang terhubung ke Rencana Mingguan tidak dapat dihapus. Lepaskan hubungannya terlebih dahulu bila tidak diperlukan.", "VALIDATION");
  await repository.softDelete(actor.sheetName, id, new Date().toISOString(), actor.id);
}

export async function addOwnActionPlanAttachments(repository: ActionPlanRepository, storage: AttachmentStorage, actor: Actor, id: string, files: { name: string; mimeType: string; content: Buffer }[]): Promise<ActionPlan> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Admin tidak mengubah Action Plan pada versi ini.", "FORBIDDEN");
  const current = await repository.findById(actor.sheetName, id);
  if (!current || current.deletedAt) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
  if ((current.attachments?.length ?? 0) + files.length > 3) throw new AppError("Maksimal tiga lampiran untuk setiap Action Plan.", "VALIDATION");
  const uploaded = [];
  for (const file of files) uploaded.push(await storage.upload({ ...file, folder: { userId: actor.id, userName: actor.name, actionPlanId: current.id } }));
  return repository.update(actor.sheetName, { ...current, attachments: [...(current.attachments ?? []), ...uploaded], updatedAt: new Date().toISOString() });
}

export async function removeOwnActionPlanAttachment(repository: ActionPlanRepository, storage: AttachmentStorage, actor: Actor, id: string, attachmentId: string): Promise<ActionPlan> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Admin tidak mengubah Action Plan pada versi ini.", "FORBIDDEN");
  const current = await repository.findById(actor.sheetName, id);
  const attachment = current?.attachments?.find((item) => item.id === attachmentId);
  if (!current || current.deletedAt || !attachment) throw new AppError("Lampiran tidak ditemukan.", "NOT_FOUND");
  await storage.trash(attachment.id);
  return repository.update(actor.sheetName, { ...current, attachments: current.attachments?.filter((item) => item.id !== attachmentId), updatedAt: new Date().toISOString() });
}

export async function createStatus(repository: StatusRepository, label: string, isCompleted = false): Promise<ActionPlanStatus> {
  const normalized = label.trim();
  const all = await repository.list();
  if (!normalized) throw new AppError("Nama status wajib diisi.", "VALIDATION");
  if (all.some((status) => status.label.toLowerCase() === normalized.toLowerCase())) throw new AppError("Status tersebut sudah tersedia.", "CONFLICT");
  const timestamp = new Date().toISOString();
  return repository.create({ id: crypto.randomUUID(), label: normalized, isActive: true, isCompleted, createdAt: timestamp, updatedAt: timestamp });
}

export async function updateStatus(repository: StatusRepository, id: string, input: Pick<ActionPlanStatus, "isActive" | "isCompleted">): Promise<ActionPlanStatus> {
  const statuses = await repository.list();
  const current = statuses.find((status) => status.id === id);
  if (!current) throw new AppError("Status tidak ditemukan.", "NOT_FOUND");
  if (current.isActive && !input.isActive && statuses.filter((status) => status.isActive).length === 1) throw new AppError("Minimal harus ada satu status aktif.", "VALIDATION");
  return repository.update({ ...current, ...input, updatedAt: new Date().toISOString() });
}
