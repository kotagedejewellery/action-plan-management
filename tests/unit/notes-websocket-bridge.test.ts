import { createServer, type Server as HttpServer } from "node:http";

import { afterEach, expect, it } from "vitest";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Hocuspocus } from "@hocuspocus/server";
import { WebSocketServer } from "ws";
import * as Y from "yjs";

const waitFor = async (predicate: () => boolean, message: string) => new Promise<void>((resolve, reject) => {
  const interval = setInterval(() => { if (predicate()) { clearInterval(interval); clearTimeout(timeout); resolve(); } }, 20);
  const timeout = setTimeout(() => { clearInterval(interval); reject(new Error(message)); }, 3_000);
});

let server: HttpServer | undefined;
let hocuspocus: Hocuspocus | undefined;
let providers: HocuspocusProvider[] = [];

afterEach(async () => {
  providers.forEach((provider) => provider.destroy());
  providers = [];
  hocuspocus?.closeConnections();
  hocuspocus?.flushPendingStores();
  hocuspocus = undefined;
  await new Promise<void>((resolve) => server?.close(() => resolve()) ?? resolve());
  server = undefined;
});

it("synchronizes a note through the same native WebSocket bridge used by the custom server", async () => {
  hocuspocus = new Hocuspocus({ onAuthenticate: async ({ token }) => ({ userId: token }) });
  const websocket = new WebSocketServer({ noServer: true });
  let controlFrameRoundTrip = false;
  websocket.on("connection", (socket, request) => {
    socket.once("pong", () => { controlFrameRoundTrip = true; });
    socket.ping();
    const connection = hocuspocus?.handleConnection(socket as never, request as never);
    socket.on("message", (message) => {
      const payload = Array.isArray(message) ? Buffer.concat(message) : message instanceof ArrayBuffer ? Buffer.from(message) : message;
      connection?.handleMessage(payload);
    });
    socket.on("close", (code, reason) => connection?.handleClose({ code, reason: reason.toString() }));
  });
  server = createServer((_request, response) => response.end());
  server.on("upgrade", (request, socket, head) => {
    if (new URL(request.url ?? "/", "http://localhost").pathname === "/api/notes/collaboration") websocket.handleUpgrade(request, socket, head, (connection) => websocket.emit("connection", connection, request));
    else socket.destroy();
  });
  await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server test tidak mendapatkan port.");

  const first = new Y.Doc();
  const second = new Y.Doc();
  let firstSynced = false;
  let secondSynced = false;
  providers = [
    new HocuspocusProvider({ url: `ws://127.0.0.1:${address.port}/api/notes/collaboration`, name: "note-1", document: first, token: "owner", onSynced: () => { firstSynced = true; } }),
    new HocuspocusProvider({ url: `ws://127.0.0.1:${address.port}/api/notes/collaboration`, name: "note-1", document: second, token: "member", onSynced: () => { secondSynced = true; } }),
  ];

  await waitFor(() => firstSynced && secondSynced && controlFrameRoundTrip, "Native WebSocket tidak menyelesaikan sinkronisasi editor atau kontrol frame.");
  first.getText("content").insert(0, "Tersinkron melalui bridge");
  await waitFor(() => second.getText("content").toString() === "Tersinkron melalui bridge", "Perubahan tidak melewati native WebSocket.");
  expect(second.getText("content").toString()).toBe("Tersinkron melalui bridge");
});
