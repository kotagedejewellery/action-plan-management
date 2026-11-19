import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { metadata, viewport } from "@/app/layout";

const appDirectory = path.join(process.cwd(), "src", "app");

function pngSize(filePath: string) {
  const image = readFileSync(filePath);
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

describe("application icons", () => {
  it("publishes self-contained browser, Apple, and Safari pinned-tab icons", () => {
    const favicon = readFileSync(path.join(appDirectory, "favicon.ico"));

    expect(favicon.readUInt16LE(0)).toBe(0);
    expect(favicon.readUInt16LE(2)).toBe(1);
    expect(favicon.readUInt16LE(4)).toBe(3);
    expect([0, 1, 2].map((index) => favicon.readUInt8(6 + index * 16))).toEqual([16, 32, 48]);
    expect(pngSize(path.join(appDirectory, "icon.png"))).toEqual({ width: 512, height: 512 });
    expect(pngSize(path.join(appDirectory, "apple-icon.png"))).toEqual({ width: 180, height: 180 });
    const dashboardLogo = path.join(process.cwd(), "public", "kotagede-jewellery-logo-dashboard.png");
    expect(pngSize(dashboardLogo)).toEqual({ width: 480, height: 397 });
    expect(statSync(dashboardLogo).size).toBeLessThan(100 * 1024);
    expect(readFileSync(path.join(process.cwd(), "public", "kotagede-pinned-tab.svg"), "utf8")).toContain("viewBox");
    expect(metadata.icons).toMatchObject({
      icon: { url: "/icon.png", sizes: "512x512", type: "image/png" },
      apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      other: { rel: "mask-icon", url: "/kotagede-pinned-tab.svg", color: "#173c3a" },
    });
    expect(viewport).toMatchObject({ themeColor: "#173c3a" });
  });
});
