import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { removeOwnActionPlanAttachment } from "@/application/use-cases";
import { actionPlans, attachments, users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

export async function GET(request: Request, { params }: { params: Promise<{ recordId: string; attachmentId: string }> }) {
  try {
    const actor = await currentActor();
    let sheetName = actor.sheetName;
    if (actor.role === "admin") {
      const targetId = new URL(request.url).searchParams.get("userId");
      const target = targetId ? await users.findById(targetId) : null;
      if (!target || target.role !== "user") throw new AppError("Akses lampiran ditolak.", "FORBIDDEN");
      sheetName = target.sheetName;
    } else if (actor.role !== "user") {
      throw new AppError("Akses lampiran ditolak.", "FORBIDDEN");
    }
    const { recordId, attachmentId } = await params;
    const plan = await actionPlans.findById(sheetName, recordId);
    const attachment = plan?.attachments?.find((item) => item.id === attachmentId);
    if (!plan || plan.deletedAt || !attachment) throw new AppError("Lampiran tidak ditemukan.", "NOT_FOUND");
    if (actor.role === "admin" && !attachment.mimeType.startsWith("image/")) throw new AppError("Admin hanya dapat melihat pratinjau gambar.", "FORBIDDEN");
    const content = await attachments.download(attachment.id);
    const body = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
    return new NextResponse(body, { headers: { "content-type": attachment.mimeType, "content-disposition": `inline; filename="${attachment.name.replace(/[\r\n"]/g, "_")}"`, "x-content-type-options": "nosniff" } });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ recordId: string; attachmentId: string }> }) {
  try {
    const actor = await currentActor();
    const { recordId, attachmentId } = await params;
    return NextResponse.json(await removeOwnActionPlanAttachment(actionPlans, attachments, actor, recordId, attachmentId));
  } catch (error) {
    return apiError(error);
  }
}
