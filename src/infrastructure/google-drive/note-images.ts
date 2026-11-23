import { Readable } from "node:stream";

import type { NoteImageStorage } from "@/application/ports";
import { driveFolderId, googleDriveClient } from "./oauth";

const folderMimeType = "application/vnd.google-apps.folder";

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|\r\n]/g, "_") || "gambar";
}

function driveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export class GoogleDriveNoteImageStorage implements NoteImageStorage {
  private async folder(parentId: string, name: string): Promise<string> {
    const drive = googleDriveClient();
    const existing = await drive.files.list({ q: `mimeType = '${folderMimeType}' and name = '${driveQueryValue(name)}' and '${parentId}' in parents and trashed = false`, fields: "files(id)", pageSize: 1 });
    if (existing.data.files?.[0]?.id) return existing.data.files[0].id;
    const created = await drive.files.create({ requestBody: { name, mimeType: folderMimeType, parents: [parentId] }, fields: "id" });
    if (!created.data.id) throw new Error("Google Drive tidak dapat membuat folder gambar catatan.");
    return created.data.id;
  }

  async upload(input: { name: string; mimeType: string; content: Buffer; folder: { workspaceId: string; noteId: string } }): Promise<{ id: string; name: string; mimeType: string }> {
    const notesFolder = await this.folder(driveFolderId(), "notes");
    const workspaceFolder = await this.folder(notesFolder, input.folder.workspaceId);
    const noteFolder = await this.folder(workspaceFolder, input.folder.noteId);
    const response = await googleDriveClient().files.create({ requestBody: { name: safeFileName(input.name), mimeType: input.mimeType, parents: [noteFolder] }, media: { mimeType: input.mimeType, body: Readable.from(input.content) }, fields: "id,name,mimeType" });
    if (!response.data.id || !response.data.name || !response.data.mimeType) throw new Error("Google Drive tidak mengembalikan metadata gambar catatan.");
    return { id: response.data.id, name: response.data.name, mimeType: response.data.mimeType };
  }

  async download(id: string): Promise<Buffer> {
    const response = await googleDriveClient().files.get({ fileId: id, alt: "media" }, { responseType: "arraybuffer" });
    return Buffer.from(response.data as unknown as ArrayBuffer);
  }

  async trash(id: string): Promise<void> {
    await googleDriveClient().files.update({ fileId: id, requestBody: { trashed: true } });
  }

  async restore(id: string): Promise<void> {
    await googleDriveClient().files.update({ fileId: id, requestBody: { trashed: false } });
  }
}
