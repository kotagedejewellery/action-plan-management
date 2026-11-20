import { ConnectedNotesWorkspace } from "@/presentation/components/connected-notes-workspace";
import { currentActor } from "@/presentation/server/actor";

export default async function NotesPage() {
  const actor = await currentActor();
  return <ConnectedNotesWorkspace actor={{ id: actor.id, name: actor.name }} />;
}
