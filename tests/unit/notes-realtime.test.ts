import { afterEach, expect, it } from "vitest";
import { Server } from "@hocuspocus/server";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

const port = 39123;
const waitFor = async (predicate: () => boolean, message: string) => new Promise<void>((resolve, reject) => {
  const interval = setInterval(() => { if (predicate()) { clearInterval(interval); clearTimeout(timeout); resolve(); } }, 20);
  const timeout = setTimeout(() => { clearInterval(interval); reject(new Error(message)); }, 3_000);
});

let server: Server | undefined;
let providers: HocuspocusProvider[] = [];

afterEach(async () => {
  providers.forEach((provider) => provider.destroy());
  providers = [];
  await server?.destroy();
  server = undefined;
});

it("synchronizes two editors, refreshes the token on reconnect, and closes revoked access", async () => {
  let memberAllowed = true;
  server = new Server({
    port,
    quiet: true,
    onAuthenticate: async ({ token }) => {
      if (token === "owner" || (token === "member" && memberAllowed)) return { userId: token };
      throw new Error("Akses kolaborasi ditolak.");
    },
  });
  await server.listen();

  const ownerDocument = new Y.Doc();
  const memberDocument = new Y.Doc();
  let ownerSynced = false;
  let memberSynced = false;
  let memberTokenRequests = 0;
  let memberClosed = false;
  providers = [
    new HocuspocusProvider({ url: `ws://127.0.0.1:${port}`, name: "note-1", document: ownerDocument, token: async () => "owner", onSynced: () => { ownerSynced = true; } }),
    new HocuspocusProvider({ url: `ws://127.0.0.1:${port}`, name: "note-1", document: memberDocument, token: async () => { memberTokenRequests += 1; return "member"; }, onSynced: () => { memberSynced = true; }, onClose: () => { memberClosed = true; } }),
  ];

  await waitFor(() => ownerSynced && memberSynced, "Kedua editor tidak tersinkron.");
  ownerDocument.getText("content").insert(0, "Keputusan bersama");
  await waitFor(() => memberDocument.getText("content").toString() === "Keputusan bersama", "Perubahan tidak sampai ke editor kedua.");

  const memberSocket = providers[1].configuration.websocketProvider;
  memberSocket.disconnect();
  await waitFor(() => memberSocket.status === "disconnected", "Socket editor kedua tidak terputus.");
  await memberSocket.connect();
  await waitFor(() => memberTokenRequests > 1, "Reconnect tidak meminta token baru.");

  memberAllowed = false;
  server.hocuspocus.closeConnections("note-1");
  await waitFor(() => memberClosed, "Akses yang dicabut tidak menutup editor aktif.");
});
