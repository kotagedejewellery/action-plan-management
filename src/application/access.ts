import type { Actor, Division, User } from "@/domain/models";
import { AppError } from "./errors";

export function requireActiveActor(actor: Actor | null): asserts actor is Actor {
  if (!actor || actor.status !== "active" || !["admin", "bod", "user"].includes(actor.role)) throw new AppError("Sesi tidak valid atau akun tidak aktif.", "FORBIDDEN");
}

export function requireAdmin(actor: Actor | null): asserts actor is Actor & { role: "admin" } {
  requireActiveActor(actor);
  if (actor.role !== "admin") throw new AppError("Akses khusus SuperAdmin diperlukan.", "FORBIDDEN");
}

export function requireMonitorActor(actor: Actor | null): asserts actor is Actor {
  requireActiveActor(actor);
  if (actor.role !== "admin" && (actor.role !== "bod" || !actor.divisionId)) throw new AppError("Divisi belum ditetapkan atau akses monitoring tidak tersedia. Hubungi SuperAdmin.", "FORBIDDEN");
}

export function requireUserWorkspace(actor: Actor): void {
  requireActiveActor(actor);
  if (actor.role !== "user" || !actor.divisionId) throw new AppError("Akses pengisian pekerjaan memerlukan akun User dengan divisi aktif. Hubungi SuperAdmin.", "FORBIDDEN");
}

export function resolveActor(user: User, divisions: Division[]): Actor {
  const actor: Actor = { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, sheetName: user.sheetName };
  requireActiveActor(actor);
  if (user.role === "admin") return actor;
  const assigned = user.role === "bod" ? divisions.filter((division) => division.bodUserId === user.id) : divisions.filter((division) => division.id === user.divisionId);
  if (assigned.length === 1 && assigned[0].status === "active") return { ...actor, divisionId: assigned[0].id, divisionName: assigned[0].name };
  return actor;
}

export function assertCanReadMember(actor: Actor, target: User | null): asserts target is User {
  requireMonitorActor(actor);
  if (!target || !target.sheetName) throw new AppError("Pekerjaan tidak ditemukan.", "NOT_FOUND");
  if (actor.role === "bod" && target.divisionId !== actor.divisionId) throw new AppError("Akses pekerjaan di luar divisi ditolak.", "FORBIDDEN");
}

export function visibleMembers(actor: Actor, users: User[], divisionId?: string): User[] {
  requireMonitorActor(actor);
  if (actor.role === "bod" && divisionId && divisionId !== actor.divisionId) throw new AppError("Akses divisi ditolak.", "FORBIDDEN");
  const scope = actor.role === "bod" ? actor.divisionId : divisionId;
  return users.filter((user) => Boolean(user.sheetName) && (!scope || user.divisionId === scope));
}
