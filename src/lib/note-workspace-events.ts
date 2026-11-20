import { EventEmitter } from "node:events";

type NoteWorkspaceEvents = { emitter: EventEmitter };

declare global {
  var __actionPlanNoteWorkspaceEvents: NoteWorkspaceEvents | undefined;
}

function events(): EventEmitter {
  if (!globalThis.__actionPlanNoteWorkspaceEvents) {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(0);
    globalThis.__actionPlanNoteWorkspaceEvents = { emitter };
  }
  return globalThis.__actionPlanNoteWorkspaceEvents.emitter;
}

export function publishNoteWorkspaceChange(userIds: Iterable<string>): void {
  [...new Set(userIds)].forEach((userId) => events().emit(userId));
}

export function subscribeToNoteWorkspaceChanges(userId: string, listener: () => void): () => void {
  events().on(userId, listener);
  return () => events().off(userId, listener);
}
