import { NextResponse } from "next/server";

import { noteCollaborationConfigured, noteCollaborationReady } from "@/lib/note-collaboration";

export async function GET() {
  if (!noteCollaborationConfigured() || await noteCollaborationReady()) return NextResponse.json({ status: "ok" }, { headers: { "cache-control": "no-store" } });
  return NextResponse.json({ status: "unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
}
