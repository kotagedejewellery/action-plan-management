import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { createUserInputSchema } from "@/application/schemas";
import { createUser, requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { users } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

function responseError(error: unknown) { return apiError(error); }

export async function GET() {
  try { requireAdmin(await currentActor()); return NextResponse.json((await users.list()).map(toSafeUser)); } catch (error) { return responseError(error); }
}

export async function POST(request: Request) {
  try {
    requireAdmin(await currentActor());
    const parsed = createUserInputSchema.parse(await request.json());
    const user = await createUser(users, { id: crypto.randomUUID(), ...parsed });
    return NextResponse.json(user, { status: 201 });
  } catch (error) { return responseError(error); }
}
