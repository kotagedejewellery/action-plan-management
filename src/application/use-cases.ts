import bcrypt from "bcryptjs";

import { AppError } from "@/application/errors";
import type { ActionPlanRepository, StatusRepository, UserRepository } from "@/application/ports";
import type { ActionPlan, ActionPlanStatus, Actor, SafeUser, User } from "@/domain/models";
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
  const sheetName = existing.sheetName || (role === "user" ? `action_plan_${existing.id}` : "");
  if (sheetName && !existing.sheetName) await users.createActionPlanSheet(sheetName);
  const user: User = { ...existing, ...input, email, role, sheetName, passwordHash: input.password ? await bcrypt.hash(input.password, 12) : existing.passwordHash, updatedAt: new Date().toISOString() };
  return toSafeUser(await users.update(user));
}

export async function listVisiblePlans(repository: ActionPlanRepository, actor: Actor, target: User | null): Promise<ActionPlan[]> {
  requireActiveActor(actor);
  if (actor.role === "user") return repository.list(actor.sheetName);
  if (!target || target.role !== "user") throw new AppError("User target tidak ditemukan.", "NOT_FOUND");
  return repository.list(target.sheetName);
}

export async function saveOwnActionPlan(repository: ActionPlanRepository, statuses: StatusRepository, actor: Actor, plan: ActionPlan, expectedUpdatedAt?: string): Promise<ActionPlan> {
  requireActiveActor(actor);
  if (actor.role !== "user") throw new AppError("Admin tidak mengubah Action Plan pada versi ini.", "FORBIDDEN");
  const allowedStatuses = new Set((await statuses.list()).filter((status) => status.isActive).map((status) => status.label));
  if (!allowedStatuses.has(plan.morningStatus) || (plan.afternoonStatus && !allowedStatuses.has(plan.afternoonStatus))) throw new AppError("Pilih status yang masih aktif.", "VALIDATION");
  const current = await repository.findById(actor.sheetName, plan.id);
  if (current && expectedUpdatedAt && current.updatedAt !== expectedUpdatedAt) throw new AppError("Data telah diubah pengguna lain. Muat ulang halaman sebelum menyimpan.", "CONFLICT");
  return current ? repository.update(actor.sheetName, plan) : repository.create(actor.sheetName, plan);
}

export async function createStatus(repository: StatusRepository, label: string): Promise<ActionPlanStatus> {
  const normalized = label.trim();
  const all = await repository.list();
  if (!normalized) throw new AppError("Nama status wajib diisi.", "VALIDATION");
  if (all.some((status) => status.label.toLowerCase() === normalized.toLowerCase())) throw new AppError("Status tersebut sudah tersedia.", "CONFLICT");
  const timestamp = new Date().toISOString();
  return repository.create({ id: crypto.randomUUID(), label: normalized, isActive: true, createdAt: timestamp, updatedAt: timestamp });
}
