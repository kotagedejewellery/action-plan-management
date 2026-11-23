import { NextResponse } from "next/server";

import { AppError } from "@/application/errors";
import { uploadNoteImage } from "@/application/notes";
import { noteImageStorage, noteImages, noteWorkspaces, notes } from "@/infrastructure/container";
import { apiError } from "@/presentation/server/api-error";
import { currentActor } from "@/presentation/server/actor";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 10 * 1024 * 1024;

function hasImageSignature(content: Buffer, type: string): boolean {
  if (type === "image/png") return content.length >= 8 && content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/jpeg") return content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  return content.length >= 12 && content.subarray(0, 4).toString() === "RIFF" && content.subarray(8, 12).toString() === "WEBP";
}

export async function POST(request: Request, { params }: { params: Promise<{ noteId: string }> }) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > maxBytes + 1024 * 1024) throw new AppError("Ukuran unggahan maksimal 10 MB.", "VALIDATION");
    const upload = (await request.formData()).get("image");
    if (!upload || typeof upload === "string") throw new AppError("Pilih gambar untuk disisipkan.", "VALIDATION");
    if (!acceptedTypes.has(upload.type) || upload.size > maxBytes) throw new AppError("Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 10 MB.", "VALIDATION");
    const content = Buffer.from(await upload.arrayBuffer());
    if (!hasImageSignature(content, upload.type)) throw new AppError("Isi file tidak sesuai dengan format gambar yang dipilih.", "VALIDATION");
    const image = await uploadNoteImage(noteWorkspaces, notes, noteImages, noteImageStorage, await currentActor(), (await params).noteId, { name: upload.name, mimeType: upload.type, content });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
