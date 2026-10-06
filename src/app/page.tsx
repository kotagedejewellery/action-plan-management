import { redirect } from "next/navigation";

import { AppError } from "@/application/errors";
import { currentActor } from "@/presentation/server/actor";

export default async function Home() {
  let actor;
  try {
    actor = await currentActor();
  } catch (error) {
    if (error instanceof AppError && error.code === "FORBIDDEN") redirect("/login");
    redirect("/login");
  }
  redirect(actor.role === "admin" ? "/dashboard" : "/action-plans");
}
