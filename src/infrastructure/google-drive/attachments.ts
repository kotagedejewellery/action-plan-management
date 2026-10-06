import { Readable } from "node:stream";

import type { AttachmentStorage } from "@/application/ports";
import type { ActionPlanAttachment } from "@/domain/models";
import { driveFolderId, googleDriveClient } from "./oauth";

const folderMimeType = "application/vnd.google-apps.folder";

function safeFolderName(value: string) {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "user";
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|\r\n]/g, "_") || "lampiran";
}

function driveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export class GoogleDriveAttachmentStorage implements AttachmentStorage {
  private async folder(parentId: string, name: string) {
    const drive = googleDriveClient();
    const existing = await drive.files.list({ q: `mimeType = '${folderMimeType}' and name = '${driveQueryValue(name)}' and '${parentId}' in parents and trashed = false`, fields: "files(id)", pageSize: 1 });
    if (existing.data.files?.[0]?.id) return existing.data.files[0].id;
    const created = await drive.files.create({ requestBody: { name, mimeType: folderMimeType, parents: [parentId] }, fields: "id" });
    if (!created.data.id) throw new Error("Google Drive tidak dapat membuat folder lampiran.");
    return created.data.id;
  }

  async upload(input: { name: string; mimeType: string; content: Buffer; folder: { userId: string; userName: string; actionPlanId: string } }): Promise<ActionPlanAttachment> {
    const usersFolder = await this.folder(driveFolderId(), "users");
    const userFolder = await this.folder(usersFolder, `${safeFolderName(input.folder.userName)}--${input.folder.userId}`);
    const planFolder = await this.folder(userFolder, input.folder.actionPlanId);
    const response = await googleDriveClient().files.create({ requestBody: { name: safeFileName(input.name), mimeType: input.mimeType, parents: [planFolder] }, media: { mimeType: input.mimeType, body: Readable.from(input.content) }, fields: "id,name,mimeType" });
    if (!response.data.id || !response.data.name || !response.data.mimeType) throw new Error("Google Drive tidak mengembalikan metadata lampiran.");
    return { id: response.data.id, name: response.data.name, mimeType: response.data.mimeType };
  }

  async download(id: string): Promise<Buffer> {
    const response = await googleDriveClient().files.get({ fileId: id, alt: "media" }, { responseType: "arraybuffer" });
    return Buffer.from(response.data as unknown as ArrayBuffer);
  }

  async trash(id: string): Promise<void> {
    await googleDriveClient().files.update({ fileId: id, requestBody: { trashed: true } });
  }

  async hardDelete(id: string): Promise<void> {
    try {
      await googleDriveClient().files.delete({ fileId: id });
    } catch (error) {
      const status = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
      if (status !== 404) throw error;
    }
  }
}
