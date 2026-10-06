import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { apiError } from "@/presentation/server/api-error";
import { addOwnActionPlanAttachments } from "@/application/use-cases";
import { actionPlans, attachments } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]);
const maxBytes = 10 * 1024 * 1024;

export async function POST(request: Request, { params }: { params: Promise<{ recordId: string }> }) {
  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((value): value is File => value instanceof File);
    if (!files.length) throw new AppError("Pilih minimal satu lampiran.", "VALIDATION");
    if (files.some((file) => !acceptedTypes.has(file.type) || file.size > maxBytes)) throw new AppError("Gunakan JPG, PNG, WebP, PDF, Word, Excel, atau PowerPoint dengan ukuran maksimal 10 MB.", "VALIDATION");
    const uploads = await Promise.all(files.map(async (file) => ({ name: file.name, mimeType: file.type, content: Buffer.from(await file.arrayBuffer()) })));
    const plan = await addOwnActionPlanAttachments(actionPlans, attachments, await currentActor(), (await params).recordId, uploads);
    return NextResponse.json(plan);
  } catch (error) {
    return apiError(error);
  }
}
