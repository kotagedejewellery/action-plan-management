import { auth } from "@/auth";
import { AppError } from "@/application/errors";
import type { Actor } from "@/domain/models";
import { users } from "@/infrastructure/container";

export async function currentActor(): Promise<Actor> {
  const session = await auth();
  const sessionUser = session?.user;
  if (!sessionUser) throw new AppError("Sesi tidak valid atau akun tidak aktif.", "FORBIDDEN");
  const user = await users.findById(sessionUser.id);
  if (!user || user.status !== "active") throw new AppError("Sesi tidak valid atau akun tidak aktif.", "FORBIDDEN");
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, sheetName: user.sheetName };
}
