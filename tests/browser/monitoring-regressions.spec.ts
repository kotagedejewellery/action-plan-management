import { expect, test } from "@playwright/test";
import { bimaPlans, monitoringPlans } from "./monitoring-fixture";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-19T10:00:00+07:00") });
  await page.goto("/monitoring");
});

test("access denial survives later service and network failures until authorized success", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/action-plans?**", (route) => {
    calls++;
    if (calls === 1) return route.fulfill({ status: 403, json: { error: "Hak akses berubah." } });
    if (calls === 2) return route.fulfill({ status: 503, json: { error: "Layanan sementara bermasalah." } });
    if (calls === 3) return route.abort("failed");
    return route.fulfill({ json: monitoringPlans });
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
    await expect(page.getByRole("button", { name: "Perbarui data", exact: true })).toBeEnabled();
    await expect(page.locator("tbody tr")).toHaveCount(0);
    await expect(page.getByRole("alert").getByRole("link", { name: "Masuk kembali" })).toBeVisible();
  }
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("closing a modeless panel returns focus to the latest record", async ({ page }) => {
  const first = page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true });
  const second = page.getByRole("button", { name: "Lihat detail: Persiapan koleksi mendatang", exact: true }).filter({ visible: true });
  await first.click();
  await second.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toContainText("Persiapan koleksi mendatang");
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  await expect(second).toBeFocused();
});

test("an older deep-linked record opens on its own page and returns to its row", async ({ page }) => {
  await page.goto("/monitoring?recordId=m31&from=2026-09-01&to=2026-10-31");
  await expect(page.getByRole("dialog")).toContainText("Pemeriksaan koleksi 31");
  await expect(page.locator("tr[aria-selected=true]")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Halaman pekerjaan" })).toContainText("2/2");
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  await expect(page.getByRole("button", { name: "Lihat detail: Pemeriksaan koleksi 31", exact: true }).filter({ visible: true })).toBeFocused();
});

for (const action of ["search", "scope", "page", "period"] as const) {
  test(`changing ${action} closes detail instead of leaving a hidden selected row`, async ({ page }) => {
    await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
    if (action === "search") {
      const input = page.getByRole("textbox", { name: "Cari pekerjaan, catatan, atau status" });
      await input.fill("NOT_MATCHING");
      await expect(input).toBeFocused();
    } else if (action === "scope") await page.getByRole("button", { name: "Belum selesai 21", exact: true }).click();
    else if (action === "page") await page.getByRole("button", { name: "Berikutnya", exact: true }).click();
    else await page.getByRole("button", { name: "Minggu ini", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("desktop keyboard focus stays visible beside the detail panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
  for (let step = 0; step < 5; step++) {
    await page.keyboard.press("Shift+Tab");
    const covered = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement;
      const box = active.getBoundingClientRect();
      const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return Boolean(hit?.closest("dialog") && !active.closest("dialog"));
    });
    expect(covered).toBe(false);
  }
});

test("changing member from desktop detail returns focus to the visible member picker", async ({ page }) => {
  await page.route("**/api/action-plans?**", (route) => route.fulfill({ json: bimaPlans }));
  await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
  await page.getByRole("button", { name: "Ganti anggota", exact: true }).click();
  await page.locator("#mobile-member-picker").getByRole("button", { name: /Bima Pratama/ }).click();
  await expect(page.getByRole("heading", { name: "Bima Pratama", exact: true })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Pemilih anggota" }).getByRole("button", { name: /Bima Pratama/ })).toBeFocused();
});

for (const [preset, before, after, expected] of [
  ["Hari ini", "2026-10-19", "2026-10-20", "20 Okt 2026"],
  ["Minggu ini", "2026-10-25", "2026-10-26", "26 Okt 2026 – 1 Nov 2026"],
  ["Bulan ini", "2026-10-31", "2026-11-01", "1 Nov 2026 – 30 Nov 2026"],
] as const) {
  test(`${preset} follows a new day after refreshing`, async ({ page }) => {
    await page.clock.setSystemTime(new Date(`${before}T10:00:00+07:00`));
    await page.goto(`/monitoring?today=${before}`);
    await page.getByRole("button", { name: preset, exact: true }).click();
    await page.clock.setSystemTime(new Date(`${after}T10:00:00+07:00`));
    await page.route("**/api/action-plans?**", (route) => route.fulfill({ json: monitoringPlans, headers: { "x-workspace-date": after } }));
    await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
    await expect(page.getByText("Monitoring diperbarui", { exact: true })).toBeVisible();
    await expect(page.locator("p[role=status]")).toHaveText(expected);
  });
}

test("a preset clicked after midnight uses the current local work date", async ({ page }) => {
  await page.clock.setSystemTime(new Date("2026-10-20T10:00:00+07:00"));
  await page.getByRole("button", { name: "Hari ini", exact: true }).click();
  await expect(page.locator("p[role=status]")).toHaveText("20 Okt 2026");
});

test("refresh uses the server date and preserves an unfinished preset draft", async ({ page }) => {
  await page.getByRole("button", { name: "Hari ini", exact: true }).click();
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal", { exact: true }).fill("2026-10-21");
  await page.route("**/api/action-plans?**", (route) => route.fulfill({ json: monitoringPlans, headers: { "x-workspace-date": "2026-10-20" } }));
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.locator("p[role=status]")).toHaveText("20 Okt 2026");
  await expect(page.getByLabel("Dari tanggal", { exact: true })).toHaveValue("2026-10-21");
  await expect(page.getByLabel("Sampai tanggal", { exact: true })).toHaveValue("2026-10-19");
});

test("a custom period selected during refresh and an unfinished draft are preserved", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/action-plans?**", async (route) => {
    await pending;
    await route.fulfill({ json: monitoringPlans, headers: { "x-workspace-date": "2026-10-20" } });
  });
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal", { exact: true }).fill("2026-10-12");
  await page.getByLabel("Sampai tanggal", { exact: true }).fill("2026-10-18");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal", { exact: true }).fill("2026-10-13");
  release();
  await expect(page.getByText("Monitoring diperbarui", { exact: true })).toBeVisible();
  await expect(page.locator("p[role=status]")).toHaveText("12 Okt 2026 – 18 Okt 2026");
  await expect(page.getByLabel("Dari tanggal", { exact: true })).toHaveValue("2026-10-13");
});

test.describe("mobile picker focus", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the member chooser restores focus after same and different selections", async ({ page }) => {
    await page.route("**/api/action-plans?**", (route) => route.fulfill({ json: bimaPlans }));
    const toggle = page.getByRole("button", { name: "Ganti anggota", exact: true });
    for (const name of [/Alya Putri/, /Bima Pratama/]) {
      await toggle.tap();
      await page.locator("#mobile-member-picker").getByRole("button", { name }).tap();
      await expect(toggle).toBeFocused();
    }
    await expect(page.getByRole("heading", { name: "Bima Pratama", exact: true })).toBeVisible();
  });
  test("closing an older deep link returns to the matching mobile card", async ({ page }) => {
    await page.goto("/monitoring?recordId=m31&from=2026-09-01&to=2026-10-31");
    await expect(page.getByRole("dialog")).toContainText("Pemeriksaan koleksi 31");
    await page.getByRole("button", { name: "Tutup detail", exact: true }).tap();
    await expect(page.getByRole("button", { name: "Lihat detail: Pemeriksaan koleksi 31", exact: true }).filter({ visible: true })).toBeFocused();
    await expect(page.getByRole("navigation", { name: "Halaman pekerjaan" })).toContainText("2/2");
  });
});
