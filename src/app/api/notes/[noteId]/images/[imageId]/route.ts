import { NextResponse } from "next/server";

import { deleteNoteImage, readNoteImage } from "@/application/notes";
import { noteImageStorage, noteImages, noteWorkspaces, notes } from "@/infrastructure/container";
import { apiError } from "@/presentation/server/api-error";
import { currentActor } from "@/presentation/server/actor";

export async function GET(_request: Request, { params }: { params: Promise<{ noteId: string; imageId: string }> }) {
  try {
    const { noteId, imageId } = await params;
    const image = await readNoteImage(noteWorkspaces, notes, noteImages, await currentActor(), noteId, imageId);
    const content = await noteImageStorage.download(image.driveFileId);
    const body = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
    return new NextResponse(body, { headers: { "content-type": image.mimeType, "content-disposition": `inline; filename="${image.name.replace(/[\r\n"]/g, "_")}"`, "x-content-type-options": "nosniff", "cache-control": "private, no-store" } });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ noteId: string; imageId: string }> }) {
  try {
    const { noteId, imageId } = await params;
    await deleteNoteImage(noteWorkspaces, notes, noteImages, noteImageStorage, await currentActor(), noteId, imageId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
