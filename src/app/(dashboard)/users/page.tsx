import { redirect } from "next/navigation";

import { requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { ConnectedUserManagementWorkspace } from "@/presentation/components/connected-user-management-workspace";
import { statuses, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export default async function UsersPage() {
  const actor = await currentActor();
  try { requireAdmin(actor); } catch { redirect("/monitoring"); }
  const [allUsers, allStatuses] = await Promise.all([users.list(), statuses.list()]);
  return <ConnectedUserManagementWorkspace initialUsers={allUsers.map(toSafeUser)} initialStatuses={allStatuses} />;
}
