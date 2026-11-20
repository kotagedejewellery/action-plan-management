type NoteRuntime = { closeNoteConnections(noteIds: string[]): void; ready(): Promise<boolean> };
type WorkspaceReader = { listForUser(userId: string): Promise<Array<{ id: string }>> };
type NoteReader = { listByWorkspace(workspaceId: string): Promise<Array<{ id: string }>> };

declare global {
  var __actionPlanNotesRuntime: NoteRuntime | undefined;
}

export function noteCollaborationEnabled(): boolean {
  return Boolean(globalThis.__actionPlanNotesRuntime);
}

export function noteCollaborationConfigured(): boolean {
  return Boolean(process.env.NOTES_DATABASE_URL && process.env.NOTES_COLLABORATION_SECRET);
}

export async function noteCollaborationReady(): Promise<boolean> {
  return globalThis.__actionPlanNotesRuntime?.ready() ?? false;
}

export function closeNoteCollaborationConnections(noteIds: Iterable<string>): void {
  const uniqueIds = [...new Set(noteIds)];
  if (uniqueIds.length) globalThis.__actionPlanNotesRuntime?.closeNoteConnections(uniqueIds);
}

export async function closeNoteCollaborationConnectionsForUser(workspaces: WorkspaceReader, notes: NoteReader, userId: string): Promise<void> {
  const ownedWorkspaces = await workspaces.listForUser(userId);
  const noteIds = (await Promise.all(ownedWorkspaces.map((workspace) => notes.listByWorkspace(workspace.id)))).flatMap((items) => items.map((note) => note.id));
  closeNoteCollaborationConnections(noteIds);
}
