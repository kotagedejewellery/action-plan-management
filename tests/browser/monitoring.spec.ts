import { expect, test } from "@playwright/test";
import { bimaPlans, monitoringPlans } from "./monitoring-fixture";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-19T10:00:00+07:00") });
  await page.goto("/monitoring");
  await expect(page.getByRole("heading", { name: "Monitoring", exact: true })).toBeVisible();
});

test("completion tabs use configured afternoon statuses and no extra request", async ({ page }) => {
  let requests = 0;
  page.on("request", (request) => { if (request.url().includes("/api/action-plans?")) requests++; });
  const tabs = page.getByRole("group", { name: "Status pekerjaan" });
  await expect(tabs.getByRole("button", { name: "Semua 32", exact: true })).toBeVisible();
  await tabs.getByRole("button", { name: "Selesai 11", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(11);
  for (const row of await page.locator("tbody tr").all()) await expect(row.locator("td").nth(3)).toContainText("Final");
  await tabs.getByRole("button", { name: "Belum selesai 21", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(20);
  expect(requests).toBe(0);
});

test("period presets include planned dates and reset preserves all dates", async ({ page }) => {
  const periods = page.getByRole("group", { name: "Periode pekerjaan" });
  await periods.getByRole("button", { name: "Hari ini", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("19 Okt 2026");
  await periods.getByRole("button", { name: "Minggu ini", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await expect(page.getByRole("status")).toHaveText("19 Okt 2026 – 25 Okt 2026");
  await expect(page.locator("tbody").getByText("Mendatang", { exact: true })).toBeVisible();
  await periods.getByRole("button", { name: "Bulan ini", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 Okt 2026 – 31 Okt 2026");
  await expect(page.getByRole("button", { name: "Semua 31", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Hapus filter", exact: true }).click();
  await expect(page.getByRole("button", { name: "Semua 32", exact: true })).toBeVisible();
});

test("custom dates validate before applying and support an open end", async ({ page }) => {
  await page.getByRole("button", { name: "Rentang khusus", exact: true }).click();
  await page.getByLabel("Dari tanggal", { exact: true }).fill("2026-10-20");
  await page.getByLabel("Sampai tanggal", { exact: true }).fill("2026-10-10");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Tanggal akhir harus sama dengan atau setelah tanggal mulai");
  await expect(page.getByRole("button", { name: "Semua 32", exact: true })).toBeVisible();
  await page.getByLabel("Sampai tanggal", { exact: true }).fill("");
  await page.getByRole("button", { name: "Terapkan", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Sejak 20 Okt 2026");
  await expect(page.locator("tbody tr")).toHaveCount(1);
});

test("pagination and note search remain bounded and reset page", async ({ page }) => {
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Berikutnya", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(12);
  await page.getByRole("textbox", { name: "Cari pekerjaan, catatan, atau status", exact: true }).fill("KOMPOSISI FOTO");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Halaman pekerjaan" })).toContainText("1–1 dari 1 pekerjaan");
  await expect(page.getByRole("button", { name: "Sebelumnya", exact: true })).toBeDisabled();
});

test("member search supports full names and no matches", async ({ page }) => {
  const picker = page.getByRole("complementary", { name: "Pemilih anggota" });
  await picker.getByRole("textbox", { name: "Cari anggota" }).fill("Citra");
  await expect(picker.getByRole("button")).toHaveCount(1);
  await expect(picker).toContainText("Nama Lengkap Panjang");
  await picker.getByRole("textbox", { name: "Cari anggota" }).fill("tidak-ada");
  await expect(picker).toContainText("Anggota tidak ditemukan");
  await expect(page.getByRole("heading", { name: "Alya Putri", exact: true })).toBeVisible();
});

test("member switching hides old rows during load and ignores an older response", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/action-plans?**", async (route) => {
    const id = new URL(route.request().url()).searchParams.get("userId");
    if (id === "u1") { await pending; await route.fulfill({ json: bimaPlans }); }
    else await route.fulfill({ json: [] });
  });
  const picker = page.getByRole("complementary", { name: "Pemilih anggota" });
  await picker.getByRole("button", { name: /Bima Pratama/ }).click();
  await expect(page.locator("tbody tr")).toHaveCount(0);
  await expect(page.getByText("Memuat pekerjaan Bima Pratama…", { exact: true })).toBeVisible();
  await picker.getByRole("button", { name: /Citra Maharani/ }).click();
  await expect(page.getByText("Belum ada pekerjaan untuk anggota ini", { exact: true })).toBeVisible();
  release();
  await expect(page.getByRole("heading", { name: /Citra Maharani/ })).toBeVisible();
  await expect(page.getByText("Rekap pesanan Bima", { exact: true })).toHaveCount(0);
});

test("failed member load never exposes the previous member and retry works", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/action-plans?**", (route) => ++calls === 1 ? route.fulfill({ status: 503, json: { error: "Layanan sementara tidak tersedia." } }) : route.fulfill({ json: bimaPlans }));
  await page.getByRole("complementary", { name: "Pemilih anggota" }).getByRole("button", { name: /Bima Pratama/ }).click();
  await expect(page.getByRole("alert")).toContainText("Data anggota sebelumnya tidak ditampilkan");
  await expect(page.locator("tbody tr")).toHaveCount(0);
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Rekap pesanan Bima");
});

test("same-member refresh failure retains its data and successful retry clears error", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/action-plans?**", (route) => ++calls === 1 ? route.fulfill({ status: 503, json: { error: "Layanan sementara tidak tersedia." } }) : route.fulfill({ json: monitoringPlans }));
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Data sebelumnya untuk anggota ini tetap ditampilkan");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

for (const status of [401, 403]) {
  test(`access failure ${status} guides login and hides work`, async ({ page }) => {
    await page.route("**/api/action-plans?**", (route) => route.fulfill({ status, json: { error: "Sesi atau hak akses berubah." } }));
    await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Hubungi Admin");
    await expect(page.getByRole("alert").getByRole("link", { name: "Masuk kembali" })).toHaveAttribute("href", "/login");
    await expect(page.locator("tbody tr")).toHaveCount(0);
  });
}

test("desktop detail preserves scroll, restores focus and respects attachment permission", async ({ page }) => {
  await page.route("**/attachments/image1?**", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  const opener = page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true });
  await opener.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await opener.click();
  const panel = page.getByRole("dialog", { name: "Detail Action Plan", exact: true });
  await expect(panel).toHaveAttribute("aria-modal", "false");
  await expect(panel).toContainText("Katalog telah diperiksa");
  await expect(panel.getByRole("link", { name: "Buka hasil", exact: true })).toHaveAttribute("href", "https://example.test/hasil-katalog");
  await expect(panel.getByText("Rekap koleksi.pdf", { exact: true })).toBeVisible();
  await expect(panel.getByRole("link", { name: "Rekap koleksi.pdf", exact: true })).toHaveCount(0);
  await expect(panel).toContainText("Pratinjau belum dapat dimuat");
  await expect(page.locator("tr[aria-selected=true]")).toHaveCount(1);
  const box = await panel.boundingBox();
  expect(box!.width).toBe(460);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test("dashboard deep link opens the requested record with its period", async ({ page }) => {
  await page.goto("/monitoring?recordId=m0&from=2026-10-01&to=2026-10-19");
  await expect(page.getByRole("dialog")).toContainText("Finalisasi katalog cincin");
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 Okt 2026 – 19 Okt 2026");
});

test("empty member, empty team and filtered results have distinct recovery", async ({ page }) => {
  await page.getByRole("textbox", { name: "Cari pekerjaan, catatan, atau status" }).fill("tidak ditemukan");
  await expect(page.getByText("Tidak ada pekerjaan yang sesuai filter", { exact: true })).toBeVisible();
  await page.goto("/monitoring?state=empty");
  await expect(page.getByText("Belum ada pekerjaan untuk anggota ini", { exact: true })).toBeVisible();
  await page.goto("/monitoring?state=no-users");
  await expect(page.getByRole("heading", { name: "Belum ada anggota tim", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buka Users", exact: true })).toHaveAttribute("href", "/users");
});

test.describe("mobile inspection", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("member chooser, labeled status cards and full-screen detail support touch", async ({ page }) => {
    await page.getByRole("button", { name: "Ganti anggota", exact: true }).tap();
    await page.locator("#mobile-member-picker").getByRole("textbox", { name: "Cari anggota" }).fill("Alya");
    await page.locator("#mobile-member-picker").getByRole("button", { name: /Alya Putri/ }).tap();
    await page.getByRole("button", { name: "Hari ini", exact: true }).tap();
    const card = page.getByRole("article").filter({ visible: true });
    await expect(card).toHaveCount(1);
    await expect(card).toContainText("Pagi"); await expect(card).toContainText("Sore");
    const opener = card.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true });
    await opener.tap();
    const panel = page.getByRole("dialog");
    await expect(panel).toHaveAttribute("aria-modal", "true");
    expect((await panel.boundingBox())!.width).toBe(390);
    await page.keyboard.press("Shift+Tab");
    expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    await panel.getByRole("button", { name: "Tutup detail", exact: true }).tap();
    await expect(opener).toBeFocused();
  });
});

test("Monitoring renders at desktop, supplied viewport and mobile without overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("desktop.png"), fullPage: true, animations: "disabled" });
  await page.setViewportSize({ width: 1919, height: 1038 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("user-1919.png"), fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("desktop-detail.png"), fullPage: false, animations: "disabled" });
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Hari ini", exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("mobile.png"), fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("mobile-detail.png"), fullPage: false, animations: "disabled" });
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("button", { name: "Lihat detail: Finalisasi katalog cincin", exact: true }).filter({ visible: true }).click();
  const table = await page.getByLabel("Tabel pekerjaan, dapat digulir", { exact: true }).boundingBox();
  const panel = await page.getByRole("dialog").boundingBox();
  expect(table!.x + table!.width).toBeLessThanOrEqual(panel!.x);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("desktop-detail-1280.png"), fullPage: false, animations: "disabled" });
  await page.getByRole("button", { name: "Tutup detail", exact: true }).click();
  for (const width of [360, 768, 1024, 1280, 1440, 1919]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
