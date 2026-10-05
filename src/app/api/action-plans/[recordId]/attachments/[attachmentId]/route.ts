import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { actionPlans, attachments } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET(_request: Request, { params }: { params: Promise<{ recordId: string; attachmentId: string }> }) {
  try {
    const actor = await currentActor();
    if (!actor || actor.role !== "user" || actor.status !== "active") throw new AppError("Akses lampiran ditolak.", "FORBIDDEN");
    const { recordId, attachmentId } = await params;
    const plan = await actionPlans.findById(actor.sheetName, recordId);
    const attachment = plan?.attachments?.find((item) => item.id === attachmentId);
    if (!plan || plan.deletedAt || !attachment) throw new AppError("Lampiran tidak ditemukan.", "NOT_FOUND");
    const content = await attachments.download(attachment.id);
    const body = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
    return new NextResponse(body, { headers: { "content-type": attachment.mimeType, "content-disposition": `inline; filename="${attachment.name.replace(/[\r\n"]/g, "_")}"` } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: error instanceof AppError ? 400 : 500 });
  }
}
