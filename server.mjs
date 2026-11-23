import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import next from "next";
import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import { Pool } from "pg";
import { WebSocketServer } from "ws";

const port = Number(process.env.PORT ?? 3000);
const app = next({ dev: process.env.NODE_ENV === "development", hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();
const databaseUrl = process.env.NOTES_DATABASE_URL;
const collaborationSecret = process.env.NOTES_COLLABORATION_SECRET;

function readSession(token) {
  const [payload, received] = token.split(".");
  if (!payload || !received || !collaborationSecret) return null;
  const expected = createHmac("sha256", collaborationSecret).update(payload).digest("base64url");
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof session.noteId === "string" && typeof session.userId === "string" && typeof session.expiresAt === "number" && session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function collaborationRuntime() {
  if (!databaseUrl || !collaborationSecret) return null;
  const pool = new Pool({ connectionString: databaseUrl });
  let hocuspocus;
  const broadcastPersistence = (documentName, status) => {
    hocuspocus?.documents.get(documentName)?.broadcastStateless(JSON.stringify({ type: "persistence", status }));
  };
  hocuspocus = new Hocuspocus({
    debounce: 1_000,
    maxDebounce: 5_000,
    maxUnauthenticatedQueueSize: 1_048_576,
    maxUnauthenticatedQueueMessages: 20,
    maxPendingDocuments: 5,
    extensions: [new Database({
      fetch: async ({ documentName }) => {
        try {
          const result = await pool.query("SELECT state FROM note_documents WHERE note_id = $1", [documentName]);
          console.info("[notes-realtime] document_load", { persisted: Boolean(result.rows[0]) });
          return result.rows[0] ? new Uint8Array(result.rows[0].state) : null;
        } catch (error) {
          console.error("[notes-realtime] document_load_failed", error);
          throw error;
        }
      },
      store: async ({ documentName, state }) => {
        try {
          await pool.query("WITH live_note AS (UPDATE notes SET updated_at = NOW() WHERE id = $1 RETURNING id) INSERT INTO note_documents (note_id, state, updated_at) SELECT id, $2, NOW() FROM live_note ON CONFLICT (note_id) DO UPDATE SET state = EXCLUDED.state, updated_at = EXCLUDED.updated_at", [documentName, Buffer.from(state)]);
          console.info("[notes-realtime] document_store");
        } catch (error) {
          broadcastPersistence(documentName, "failed");
          console.error("[notes-realtime] document_store_failed", error);
          throw error;
        }
      },
    })],
    afterStoreDocument: ({ documentName }) => broadcastPersistence(documentName, "saved"),
    onAuthenticate: async ({ token, documentName }) => {
      const session = readSession(token);
      if (!session || session.noteId !== documentName) {
        console.warn("[notes-realtime] authentication_rejected", { reason: "invalid_session" });
        throw new Error("Akses kolaborasi ditolak.");
      }
      try {
        const allowed = await pool.query("SELECT 1 FROM notes n INNER JOIN note_workspace_members m ON m.workspace_id = n.workspace_id WHERE n.id = $1 AND m.user_id = $2", [documentName, session.userId]);
        if (!allowed.rows[0]) {
          console.warn("[notes-realtime] authentication_rejected", { reason: "membership" });
          throw new Error("Akses kolaborasi ditolak.");
        }
      } catch (error) {
        if (!(error instanceof Error) || error.message !== "Akses kolaborasi ditolak.") console.error("[notes-realtime] authentication_failed", error);
        throw error;
      }
      console.info("[notes-realtime] authentication_accepted");
      return { userId: session.userId };
    },
    afterLoadDocument: async () => { console.info("[notes-realtime] document_ready"); },
    connected: async () => { console.info("[notes-realtime] synchronized"); },
    onDisconnect: async () => { console.info("[notes-realtime] disconnected"); },
  });
  const websocket = new WebSocketServer({ noServer: true });
  websocket.on("connection", (socket, request) => {
    console.info("[notes-realtime] socket_opened");
    if (process.env.NOTES_REALTIME_DEBUG === "1") {
      for (const method of ["close", "terminate"]) {
        const original = socket[method].bind(socket);
        socket[method] = (...args) => {
          console.warn("[DEBUG-notes-transport] socket_shutdown_requested", {
            method,
            code: typeof args[0] === "number" ? args[0] : undefined,
            stack: new Error().stack?.split("\n").slice(1, 5),
          });
          return original(...args);
        };
      }
      const transport = socket._socket;
      if (transport) {
        for (const method of ["end", "destroy"]) {
          const original = transport[method].bind(transport);
          transport[method] = (...args) => {
            console.warn("[DEBUG-notes-transport] tcp_shutdown_requested", {
              method,
              stack: new Error().stack?.split("\n").slice(1, 5),
            });
            return original(...args);
          };
        }
        transport.once("end", () => console.info("[DEBUG-notes-transport] tcp_end_received"));
        transport.once("close", (hadError) => console.info("[DEBUG-notes-transport] tcp_closed", { hadError }));
      }
      socket.once("pong", () => console.info("[DEBUG-notes-transport] browser_round_trip_confirmed"));
      socket.ping();
    }
    let connection;
    try {
      connection = hocuspocus.handleConnection(socket, request);
      console.info("[notes-realtime] connection_handler_ready");
    } catch (error) {
      console.error("[notes-realtime] connection_handler_failed", error);
      socket.close(1011, "Collaboration connection failed");
      return;
    }
    socket.on("pong", () => connection.touch());
    socket.on("message", (payload) => {
      console.info("[notes-realtime] socket_message", { bytes: payload.byteLength });
      try {
        connection.handleMessage(payload);
      } catch (error) {
        console.error("[notes-realtime] message_handle_failed", error);
        socket.close(1011, "Collaboration message failed");
      }
    });
    socket.on("close", (code, reason) => {
      console.info("[notes-realtime] socket_closed", { code });
      connection.handleClose({ code, reason: reason.toString() });
    });
    socket.on("error", (error) => console.error("[notes-realtime] websocket_failed", error));
  });
  return { pool, websocket, hocuspocus };
}

await app.prepare();
const collaboration = collaborationRuntime();
if (collaboration) globalThis.__actionPlanNotesRuntime = {
  closeNoteConnections: (noteIds) => noteIds.forEach((noteId) => collaboration.hocuspocus.closeConnections(noteId)),
  ready: async () => {
    try { await collaboration.pool.query("SELECT 1"); return true; }
    catch { return false; }
  },
};
const server = createServer((request, response) => handle(request, response));

server.on("upgrade", (request, socket, head) => {
  if (collaboration && new URL(request.url ?? "/", "http://localhost").pathname === "/api/notes/collaboration") {
    collaboration.websocket.handleUpgrade(request, socket, head, (websocket) => {
      collaboration.websocket.emit("connection", websocket, request);
    });
    return;
  }
  socket.destroy();
});

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  const closed = new Promise((resolve) => server.close(resolve));
  try {
    collaboration?.hocuspocus.closeConnections();
    collaboration?.hocuspocus.flushPendingStores();
    await closed;
    await collaboration?.pool.end();
  } finally {
    globalThis.__actionPlanNotesRuntime = undefined;
    process.exit(0);
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { void shutdown(); });

server.listen(port, () => console.log(`Action Plan Management berjalan di port ${port}${collaboration ? " dengan Catatan Kolaboratif" : ""}.`));
