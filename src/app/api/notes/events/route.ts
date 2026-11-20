import { subscribeToNoteWorkspaceChanges } from "@/lib/note-workspace-events";
import { currentActor } from "@/presentation/server/actor";
import { apiError } from "@/presentation/server/api-error";

export const runtime = "nodejs";

export async function GET() {
  try {
    const actor = await currentActor();
    const encoder = new TextEncoder();
    let unsubscribe: () => void = () => {};
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    const stream = new ReadableStream({
      start(controller) {
        const send = () => controller.enqueue(encoder.encode("event: refresh\ndata: {}\n\n"));
        unsubscribe = subscribeToNoteWorkspaceChanges(actor.id, send);
        heartbeat = setInterval(() => controller.enqueue(encoder.encode(": keepalive\n\n")), 25_000);
      },
      cancel() {
        unsubscribe();
        if (heartbeat) clearInterval(heartbeat);
      },
    });
    return new Response(stream, { headers: { "cache-control": "no-cache, no-transform", connection: "keep-alive", "content-type": "text/event-stream", "x-accel-buffering": "no" } });
  } catch (error) { return apiError(error); }
}
