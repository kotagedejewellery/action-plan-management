import { saveManagedUser } from "@/application/divisions";
import { NextResponse } from "next/server";

import { apiError } from "@/presentation/server/api-error";
import { createUserInputSchema } from "@/application/schemas";
import { requireAdmin } from "@/application/use-cases";
import { toSafeUser } from "@/domain/models";
import { users, divisions } from "@/infrastructure/container";
import { currentActor } from "@/presentation/server/actor";

function responseError(error: unknown) { return apiError(error); }

export async function GET() {
  try { requireAdmin(await currentActor()); return NextResponse.json((await users.list()).map(toSafeUser)); } catch (error) { return responseError(error); }
}

export async function POST(request: Request) {
  try {
    const actor = await currentActor();
    requireAdmin(actor);
    const parsed = createUserInputSchema.parse(await request.json());
    const user = await saveManagedUser(users, divisions, actor, parsed);
    return NextResponse.json(user, { status: 201 });
  } catch (error) { return responseError(error); }
}
