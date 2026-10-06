import { AppError, publicError } from "@/application/errors";
import { NextResponse } from "next/server";

export function apiError(error: unknown) {
  const resolved = publicError(error);
  const status = resolved instanceof AppError
    ? { NOT_FOUND: 404, CONFLICT: 409, FORBIDDEN: 403, VALIDATION: 400, UNAVAILABLE: 503 }[resolved.code]
    : 500;
  return NextResponse.json({ error: resolved.message }, { status });
}
