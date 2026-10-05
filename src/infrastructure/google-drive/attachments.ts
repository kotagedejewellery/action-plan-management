import { Readable } from "node:stream";

import type { AttachmentStorage } from "@/application/ports";
import type { ActionPlanAttachment } from "@/domain/models";
import { driveFolderId, googleDriveClient } from "./oauth";

export class GoogleDriveAttachmentStorage implements AttachmentStorage {
  async upload(input: { name: string; mimeType: string; content: Buffer }): Promise<ActionPlanAttachment> {
    const response = await googleDriveClient().files.create({ requestBody: { name: input.name, mimeType: input.mimeType, parents: [driveFolderId()] }, media: { mimeType: input.mimeType, body: Readable.from(input.content) }, fields: "id,name,mimeType" });
    if (!response.data.id || !response.data.name || !response.data.mimeType) throw new Error("Google Drive tidak mengembalikan metadata lampiran.");
    return { id: response.data.id, name: response.data.name, mimeType: response.data.mimeType };
  }

  async download(id: string): Promise<Buffer> {
    const response = await googleDriveClient().files.get({ fileId: id, alt: "media" }, { responseType: "arraybuffer" });
    return Buffer.from(response.data as unknown as ArrayBuffer);
  }
}
