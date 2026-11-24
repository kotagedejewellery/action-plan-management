import { redirect } from "next/navigation";
import { requireAdmin } from "@/application/access";
import { toSafeUser } from "@/domain/models";
import { divisions, users } from "@/infrastructure/container";
import { ConnectedDivisionWorkspace } from "@/presentation/components/connected-division-workspace";
import { currentActor } from "@/presentation/server/actor";

export default async function DivisionsPage({ searchParams }: { searchParams: Promise<{ divisionId?: string }> }) {
  const actor = await currentActor();
  if (actor.role !== "admin") redirect("/");
  requireAdmin(actor);
  const [allDivisions, allUsers] = await Promise.all([divisions.list(), users.list()]);
  const { divisionId } = await searchParams;
  return <ConnectedDivisionWorkspace initialDivisions={allDivisions} initialEditingId={divisionId} users={allUsers.map(toSafeUser)} />;
}
