import { describe, expect, it } from "vitest";

import { actionPlanInputSchema } from "@/application/schemas";

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
