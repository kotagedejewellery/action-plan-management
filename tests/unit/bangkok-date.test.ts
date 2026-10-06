import { describe, expect, it } from "vitest";

import { bangkokDate } from "@/lib/bangkok-date";
import { publicError } from "@/application/errors";

describe("bangkokDate", () => {
  it("uses the Bangkok calendar date instead of UTC", () => {
    expect(bangkokDate(new Date("2026-10-05T18:00:00.000Z"))).toBe("2026-10-06");
  });

  it("turns a Google quota error into a safe recovery message", () => {
    const error = Object.assign(new Error("Quota exceeded for read requests"), { code: 429, config: { url: "https://sheets.googleapis.com/v4/spreadsheets" } });
    expect(publicError(error)).toMatchObject({ code: "UNAVAILABLE", message: expect.stringContaining("Google Sheets sedang mencapai batas") });
  });
});
