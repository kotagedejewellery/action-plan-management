import { describe, expect, it } from "vitest";

import { actionPlanInputSchema, dashboardPeriodInputSchema } from "@/application/schemas";

describe("dashboard period", () => {
  it.each([
    { from: "", to: "2026-10-19" },
    { from: "2026-02-30", to: "2026-03-01" },
    { from: "2026-10-19", to: "" },
    { from: "2026-10-19", to: "2026-10-01" },
  ])("rejects incomplete, invalid or reversed ranges", (period) => {
    expect(dashboardPeriodInputSchema.safeParse(period).success).toBe(false);
  });

  it("accepts a single calendar day", () => {
    expect(dashboardPeriodInputSchema.parse({ from: "2026-10-19", to: "2026-10-19" })).toEqual({ from: "2026-10-19", to: "2026-10-19" });
  });
});

describe("actionPlanInputSchema", () => {
  it("treats the browser's absent weekly-plan field value as unlinked", () => {
    const result = actionPlanInputSchema.safeParse({
      date: "2026-10-05",
      task: "Tindak lanjut pelanggan",
      morningStatus: "Belum Selesai",
      weeklyPlanId: "null",
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.weeklyPlanId).toBeUndefined();
  });
});
