import { expect, test } from "@playwright/test";
import { dashboardFixture } from "./fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard Tim", exact: true })).toBeVisible();
});

test("month preset follows the new month after refreshing", async ({ page }) => {
  await page.route("**/api/dashboard", (route) => route.fulfill({ json: { ...dashboardFixture, today: "2026-11-01", loadedAt: "2026-11-01T01:00:00.000Z" } }));
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.getByText("Dashboard diperbarui", { exact: true })).toBeVisible();
  await expect(page.locator("p[role=status]")).toContainText("1 Nov 2026 – 1 Nov 2026");
  await expect(page.getByRole("button", { name: "Bulan ini", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("week preset follows a new week after refreshing", async ({ page }) => {
  await page.getByRole("button", { name: "Minggu ini", exact: true }).click();
  await page.route("**/api/dashboard", (route) => route.fulfill({ json: { ...dashboardFixture, today: "2026-11-02", loadedAt: "2026-11-02T01:00:00.000Z" } }));
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.getByText("Dashboard diperbarui", { exact: true })).toBeVisible();
  await expect(page.locator("p[role=status]")).toContainText("2 Nov 2026 – 2 Nov 2026");
});

test("custom filter chosen during a refresh is preserved", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/dashboard", async (route) => {
    await pending;
    await route.fulfill({ json: { ...dashboardFixture, today: "2026-11-01" } });
  });
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal").fill("2026-10-12");
  await page.getByLabel("Sampai tanggal").fill("2026-10-18");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  release();
  await expect(page.getByText("Dashboard diperbarui", { exact: true })).toBeVisible();
  await expect(page.locator("p[role=status]")).toContainText("12 Okt 2026 – 18 Okt 2026");
});

for (const status of [401, 403]) {
  test(`access error ${status} offers sign-in and account guidance`, async ({ page }) => {
    const before = await page.locator("p[role=status]").innerText();
    await page.route("**/api/dashboard", (route) => route.fulfill({ status, json: { error: "Sesi atau hak akses tidak berlaku lagi." } }));
    await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
    const alert = page.getByRole("alert");
    await expect(alert).toContainText("Hubungi Admin");
    await expect(alert.getByRole("link", { name: "Masuk kembali", exact: true })).toHaveAttribute("href", "/login");
    await expect(alert.getByRole("button", { name: "Coba lagi", exact: true })).toHaveCount(0);
    await expect(page.locator("p[role=status]")).toHaveText(before);
  });
}

test("temporary failure retains results and can be retried successfully", async ({ page }) => {
  const before = await page.locator("p[role=status]").innerText();
  let requests = 0;
  await page.route("**/api/dashboard", (route) => {
    requests++;
    return requests === 1 ? route.fulfill({ status: 503, json: { error: "Google Sheets sedang mencapai batas permintaan." } }) : route.fulfill({ json: dashboardFixture });
  });
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Data sebelumnya tetap ditampilkan");
  await expect(page.locator("p[role=status]")).toHaveText(before);
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByText("Dashboard diperbarui", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("custom completed labels match the completion badge", async ({ page }) => {
  await page.getByRole("button", { name: /^Selesai / }).click();
  const badge = page.locator("#dashboard-plan-list").getByText("Final", { exact: true }).first();
  await expect(badge).toBeVisible();
  await expect(badge).toHaveClass(/bg-\[#dff3e6\]/);
});

test.describe("touch interaction", () => {
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
test("mobile chart has usable touch targets and responds to keyboard and touch", async ({ page }) => {
  const bars = page.locator("section[aria-labelledby=trend-heading] button");
  const widths = await bars.evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().width));
  expect(Math.min(...widths)).toBeGreaterThanOrEqual(24);
  const day = page.getByRole("button", { name: /^15 Okt 2026:/ });
  await day.focus();
  await expect(day).toHaveAttribute("aria-pressed", "true");
  await day.tap();
  await expect(day).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
});
});

test("unfinished date drafts survive a refresh across the month boundary", async ({ page }) => {
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal").fill("2026-10-12");
  await page.route("**/api/dashboard", (route) => route.fulfill({ json: { ...dashboardFixture, today: "2026-11-01" } }));
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.getByText("Dashboard diperbarui", { exact: true })).toBeVisible();
  await expect(page.locator("p[role=status]")).toContainText("1 Nov 2026 – 1 Nov 2026");
  await expect(page.getByLabel("Dari tanggal")).toHaveValue("2026-10-12");
  await expect(page.getByText("Perubahan tanggal belum diterapkan.", { exact: true })).toBeVisible();
});

test("member and weekly details, bounded lists and Monitoring links work", async ({ page }) => {
  const members = page.locator("section[aria-labelledby=team-heading]");
  await expect(members.locator("details")).toHaveCount(6);
  const member = members.locator("details").first();
  await member.locator("summary").click();
  await expect(member).toHaveAttribute("open", "");
  const link = member.getByRole("link", { name: "Buka Monitoring", exact: true });
  await expect(link).toHaveAttribute("href", /from=2026-10-01&to=2026-10-31/);
  await members.getByRole("button", { name: "Tampilkan lebih banyak (2)", exact: true }).click();
  await expect(members.locator("details")).toHaveCount(8);
  const weekly = page.locator("section[aria-labelledby=weekly-heading]");
  await expect(weekly.locator("details")).toHaveCount(4);
  await weekly.locator("summary").first().click();
  await expect(weekly.locator("details").first().getByRole("listitem")).not.toHaveCount(0);
  await weekly.getByRole("button", { name: "Tampilkan lebih banyak (1)", exact: true }).click();
  await expect(weekly.locator("details")).toHaveCount(5);
});

test("invalid date drafts preserve the applied results", async ({ page }) => {
  const before = await page.locator("p[role=status]").innerText();
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal").fill("");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Isi tanggal mulai yang valid.");
  await expect(page.locator("p[role=status]")).toHaveText(before);
  await page.getByLabel("Dari tanggal").fill("2026-10-31");
  await page.getByLabel("Sampai tanggal").fill("2026-10-01");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Tanggal akhir harus sama dengan atau setelah tanggal mulai.");
  await expect(page.locator("p[role=status]")).toHaveText(before);
});

test("empty data is distinguished from all completed work", async ({ page }) => {
  await page.goto("/?state=empty");
  await expect(page.getByText(/Belum ada Action Plan pada periode ini. Pilih periode lain/)).toBeVisible();
  await expect(page.getByText("Seluruh Action Plan pada periode ini sudah selesai.", { exact: true })).toHaveCount(0);
  await page.goto("/?state=complete");
  await expect(page.getByText("Seluruh Action Plan pada periode ini sudah selesai.", { exact: true })).toBeVisible();
});

test("responsive dashboard remains usable on desktop and mobile", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.screenshot({ path: testInfo.outputPath("desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath("mobile.png"), fullPage: true });
  for (const width of [360, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
