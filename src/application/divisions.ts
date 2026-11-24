import type { Actor, Division, User } from "@/domain/models";
import type { ActionPlanApprovalRepository, DivisionRepository, UserRepository, WeeklyPlanRepository } from "./ports";
import { AppError } from "./errors";
import { requireAdmin } from "./access";
import { createUser, updateUser } from "./use-cases";

let accessWrite: Promise<unknown> = Promise.resolve();
// shortcut: serializes the single app process; use a distributed lock before adding app replicas.
function serializeAccessWrite<T>(action: () => Promise<T>): Promise<T> {
  const next = accessWrite.then(action, action);
  accessWrite = next.catch(() => undefined);
  return next;
}

async function activeAdmin(users: UserRepository, actor: Actor) {
  requireAdmin(actor);
  requireAdmin(await users.findById(actor.id));
}

export type DivisionInput = Pick<Division, "name" | "status" | "bodUserId" | "approvalRequired"> & { updatedAt?: string };

export function saveDivision(repository: DivisionRepository, users: UserRepository, actor: Actor, input: DivisionInput, id?: string): Promise<Division> {
  return serializeAccessWrite(async () => {
    await activeAdmin(users, actor);
    const all = await repository.list();
    const existing = id ? all.find((division) => division.id === id) : undefined;
    if (id && !existing) throw new AppError("Divisi tidak ditemukan.", "NOT_FOUND");
    if (existing && input.updatedAt && existing.updatedAt !== input.updatedAt) throw new AppError("Divisi telah berubah. Muat ulang sebelum menyimpan.", "CONFLICT");
    const name = input.name.trim();
    if (!name) throw new AppError("Nama divisi wajib diisi.", "VALIDATION");
    if (all.some((division) => division.id !== id && division.name.toLowerCase() === name.toLowerCase())) throw new AppError("Nama divisi sudah digunakan.", "CONFLICT");
    const bodUserId = input.bodUserId || undefined;
    if (input.status === "active" && !bodUserId) throw new AppError("Divisi aktif wajib memiliki satu BOD aktif.", "VALIDATION");
    if (bodUserId) {
      const bod = await users.findById(bodUserId);
      if (!bod || bod.role !== "bod" || bod.status !== "active") throw new AppError("Pilih akun BOD yang aktif.", "VALIDATION");
      if (bod.divisionId && bod.divisionId !== id) throw new AppError("Riwayat anggota BOD terikat pada divisi lain.", "VALIDATION");
      if (all.some((division) => division.id !== id && division.bodUserId === bodUserId)) throw new AppError("BOD sudah ditugaskan ke divisi lain.", "CONFLICT");
    }
    const timestamp = new Date().toISOString();
    const division: Division = { id: existing?.id ?? crypto.randomUUID(), name, bodUserId, status: input.status, approvalRequired: input.approvalRequired ?? existing?.approvalRequired ?? false, createdAt: existing?.createdAt ?? timestamp, updatedAt: timestamp };
    return existing ? repository.update(division) : repository.create(division);
  });
}

export type ManagedUserInput = Pick<User, "name" | "email" | "role" | "status" | "divisionId"> & { password?: string };

export function saveManagedUser(users: UserRepository, divisions: DivisionRepository, actor: Actor, input: ManagedUserInput, id?: string) {
  return serializeAccessWrite(async () => {
    await activeAdmin(users, actor);
    const existing = id ? await users.findById(id) : null;
    if (id && !existing) throw new AppError("User tidak ditemukan.", "NOT_FOUND");
    const allDivisions = await divisions.list();
    const divisionId = input.divisionId || existing?.divisionId || undefined;
    if (existing?.divisionId && input.divisionId && existing.divisionId !== input.divisionId) throw new AppError("Perpindahan divisi belum tersedia. Divisi awal dipertahankan.", "VALIDATION");
    if (existing && divisionId && divisionId !== existing.divisionId && allDivisions.some((division) => division.bodUserId === existing.id && division.id !== divisionId)) throw new AppError("Divisi riwayat pekerjaan harus sesuai dengan divisi penugasan BOD.", "VALIDATION");
    if ((input.role === "user" && !existing) || (divisionId && divisionId !== existing?.divisionId) || (input.role === "user" && existing?.role !== "user" && !divisionId)) {
      if (!divisionId || !allDivisions.some((division) => division.id === divisionId && division.status === "active")) throw new AppError("Pilih divisi aktif untuk User.", "VALIDATION");
    }
    if (existing && allDivisions.some((division) => division.bodUserId === existing.id) && (input.role !== "bod" || input.status !== "active")) throw new AppError("Ganti atau lepaskan penugasan BOD divisi sebelum mengubah akses akun ini.", "VALIDATION");
    const next = { ...input, divisionId };
    if (existing) return updateUser(users, existing, next);
    if (!input.password) throw new AppError("Password wajib diisi.", "VALIDATION");
    return createUser(users, { ...next, id: crypto.randomUUID(), password: input.password });
  });
}

export function deleteManagedUser(users: UserRepository, divisions: DivisionRepository, weeklyPlans: WeeklyPlanRepository, approvals: ActionPlanApprovalRepository, actor: Actor, id: string, hasNoteMembership: boolean): Promise<void> {
  return serializeAccessWrite(async () => {
    await activeAdmin(users, actor);
    const target = await users.findById(id);
    if (!target) throw new AppError("User tidak ditemukan.", "NOT_FOUND");
    if (target.id === actor.id) throw new AppError("Akun yang sedang digunakan tidak dapat dihapus.", "VALIDATION");
    if (target.status !== "inactive") throw new AppError("Nonaktifkan akun terlebih dahulu sebelum menghapusnya permanen.", "VALIDATION");
    if (target.sheetName) throw new AppError("Akun memiliki riwayat Action Plan. Pertahankan sebagai akun nonaktif agar data tetap aman.", "VALIDATION");
    if ((await divisions.list()).some((division) => division.bodUserId === target.id)) throw new AppError("Lepaskan penugasan BOD dari seluruh divisi sebelum menghapus akun.", "VALIDATION");
    if ((await weeklyPlans.list()).some((plan) => plan.userId === target.id)) throw new AppError("Akun masih memiliki riwayat Rencana Mingguan dan tidak dapat dihapus permanen.", "VALIDATION");
    if ((await approvals.list()).some((approval) => approval.ownerId === target.id || approval.actorId === target.id)) throw new AppError("Akun masih tercatat pada riwayat approval dan tidak dapat dihapus permanen.", "VALIDATION");
    if (hasNoteMembership) throw new AppError("Akun masih menjadi anggota atau Owner Catatan Kolaboratif dan tidak dapat dihapus permanen.", "VALIDATION");
    await users.remove(target.id);
  });
}
