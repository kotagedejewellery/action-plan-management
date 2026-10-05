"use client";

import { DataUnavailable } from "@/presentation/components/data-unavailable";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <DataUnavailable onRetry={reset} />;
}
