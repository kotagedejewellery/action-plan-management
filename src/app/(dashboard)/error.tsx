"use client";

import { DataUnavailable } from "@/presentation/components/data-unavailable";
import { publicError } from "@/application/errors";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return <DataUnavailable description={publicError(error).message} onRetry={reset} />;
}
