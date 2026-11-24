import { expect, test } from "@playwright/test";
import { divisionUsers } from "./division-fixture";

test("a legacy BOD remains findable and its history can be mapped only to its assigned division", async ({ page }) => {
  await page.goto("/users?state=legacy-bod");
  await expect(page.getByLabel("Filter divisi akun").getByRole("option", { name: "Belum dipetakan (1)", exact: true })).toHaveCount(1);
  await page.getByLabel("Filter divisi akun").selectOption("unmapped");
  const opener = page.getByRole("button", { name: "Edit Anggota Lama", exact: true });
  await expect(opener).toBeVisible();
  await opener.click();
  const division = page.getByRole("combobox", { name: /Divisi riwayat pekerjaan/ });
  await expect(division).toBeVisible();
  await expect(division.getByRole("option", { name: "Produksi", exact: true })).toHaveCount(0);
  await division.selectOption("a");
  await page.getByRole("button", { name: "Simpan User", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Pemetaan awal ke divisi Marketing");
  await page.route("**/api/users/member-legacy", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({ role: "bod", divisionId: "a" });
    await route.fulfill({ json: { ...divisionUsers.find((user) => user.id === "member-legacy"), role: "bod", divisionId: "a" } });
  });
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("Filter divisi akun").selectOption("a");
  await opener.click();
  await expect(page.getByRole("textbox", { name: /Divisi riwayat pekerjaan/ })).toHaveValue("Marketing");
  await expect(page.getByRole("textbox", { name: /Divisi riwayat pekerjaan/ })).toHaveAttribute("readonly", "");
});

test("BOD division shortcut opens its assigned division and account deletion gives actionable feedback", async ({ page }) => {
  await page.goto("/users");
  const bodRow = page.getByRole("row").filter({ hasText: "BOD A" });
  await expect(bodRow.getByRole("link", { name: "Divisi", exact: true })).toHaveAttribute("href", "/divisions?divisionId=a");
  await bodRow.getByRole("link", { name: "Divisi", exact: true }).click();
  await expect(page).toHaveURL(/\/divisions\?divisionId=a/);
  await expect(page.getByRole("dialog")).toContainText("Kelola divisi");
  await expect(page.getByLabel("BOD penanggung jawab")).toHaveValue("bod-a");

  await page.goto("/users?state=deletable-user");
  await expect(page.getByRole("button", { name: "Hapus Anggota A", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Hapus Akun Sementara", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Tutup dialog", exact: true })).toBeFocused();
  await dialog.getByLabel("Email akun untuk konfirmasi").fill("temporary@example.test");
  let attempt = 0;
  await page.route("**/api/users/temporary", async (route) => {
    attempt += 1;
    await route.fulfill(attempt === 1 ? { status: 400, json: { error: "Akun masih memiliki data terkait." } } : { status: 204 });
  });
  await dialog.getByRole("button", { name: "Hapus akun permanen", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Akun masih memiliki data terkait.");
  await dialog.getByRole("button", { name: "Hapus akun permanen", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText("Akun Sementara", { exact: true })).toHaveCount(0);
});

for (const route of ["/", "/monitoring"]) {
  test(`empty BOD team has a usable recovery without account management on ${route}`, async ({ page }) => {
    await page.goto(`${route}?actor=bod&state=no-users`);
    await expect(page.getByText("Belum ada anggota tim", { exact: true })).toBeVisible();
    await expect(page.locator("main a[href='/users']")).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Hubungi SuperAdmin");
    await page.goto(`${route}?state=no-users`);
    await expect(page.locator("main a[href='/users']")).toHaveCount(1);
  });
}

test("every dashboard Monitoring link retains division and applied period", async ({ page }) => {
  await page.goto("/?divisionId=a");
  const links = page.locator('main a[href^="/monitoring?"]');
  await expect(links.first()).toBeAttached();
  const destinations = await links.evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href));
  expect(destinations.length).toBeGreaterThan(1);
  for (const destination of destinations) {
    const params = new URL(destination).searchParams;
    expect(params.get("divisionId")).toBe("a");
    expect(params.get("from")).toBeTruthy();
    expect(params.get("to")).toBeTruthy();
    if (params.get("scope") === "active") expect(params.get("userId")).toBeNull();
    else expect(params.get("userId")).toBeTruthy();
  }
  await page.getByRole("button", { name: /^Total Action Plan/ }).click();
  const detail = page.locator('#dashboard-plan-list a[href^="/monitoring?"]').first();
  await expect(detail).toBeVisible();
  const detailParams = new URL((await detail.getAttribute("href"))!, "http://localhost").searchParams;
  expect(detailParams.get("from")).toBe("2026-10-01");
  expect(detailParams.get("to")).toBe("2026-10-31");
  await detail.click();
  await expect(page).toHaveURL(/\/monitoring\?/);
  expect(new URL(page.url()).searchParams.get("divisionId")).toBe("a");
  await expect(page.locator("main")).toContainText("Marketing");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("fixed division states and legacy BOD mapping remain usable at all shipped widths", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 390, 1919]) {
    await page.setViewportSize({ width, height: 900 });
    const suffix = width === 1440 ? "desktop" : width === 390 ? "mobile" : "user-1919";
    for (const [path, name] of [["/?actor=bod&state=no-users", "bod-dashboard-empty"], ["/monitoring?actor=bod&state=no-users", "bod-monitoring-empty"], ["/monitoring?divisionId=a&userId=u0&recordId=p0-0&from=2026-10-01&to=2026-10-31", "filtered-monitoring"]]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `.impeccable/review/division-gaps/${name}-${suffix}.png`, fullPage: true, animations: "disabled" });
    }
    await page.goto("/users?state=legacy-bod");
    await page.getByLabel("Filter divisi akun").selectOption("unmapped");
    await expect(page.getByRole("button", { name: "Edit Anggota Lama", exact: true })).toBeVisible();
    await page.screenshot({ path: `.impeccable/review/division-gaps/legacy-filter-${suffix}.png`, fullPage: true, animations: "disabled" });
    await page.getByRole("button", { name: "Edit Anggota Lama", exact: true }).click();
    await expect(page.getByRole("combobox", { name: /Divisi riwayat pekerjaan/ })).toBeVisible();
    await page.screenshot({ path: `.impeccable/review/division-gaps/legacy-form-${suffix}.png`, fullPage: true, animations: "disabled" });
    await page.getByRole("combobox", { name: /Divisi riwayat pekerjaan/ }).selectOption("a");
    await page.getByRole("button", { name: "Simpan User", exact: true }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.screenshot({ path: `.impeccable/review/division-gaps/legacy-confirm-${suffix}.png`, fullPage: true, animations: "disabled" });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog").getByRole("button", { name: "Simpan User", exact: true })).toBeFocused();
  }
  expect(errors).toEqual([]);
});
