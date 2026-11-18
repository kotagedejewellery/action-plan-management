import { expect, test } from "@playwright/test";
import { divisionFixture, divisionUsers } from "./division-fixture";
import { dashboardFixture } from "./fixture";

test("division reassignment confirms revoked access and retains failures for retry", async ({ page }) => {
  await page.goto("/divisions");
  await page.getByRole("button", { name: "Kelola Marketing", exact: true }).click();
  await page.getByLabel("BOD penanggung jawab").selectOption("bod-new");
  await expect(page.getByLabel("BOD penanggung jawab").getByRole("option", { name: /BOD B/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Simpan divisi", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText("BOD sebelumnya akan kehilangan akses");
  await page.route("**/api/divisions/a", (route) => route.fulfill({ status: 409, json: { error: "Divisi telah berubah. Muat ulang sebelum menyimpan." } }));
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Muat ulang");
  await expect(page.getByLabel("BOD penanggung jawab")).toHaveValue("bod-new");
  await page.route("**/api/divisions/a", (route) => route.fulfill({ json: { ...divisionFixture[0], bodUserId: "bod-new" } }));
  await page.getByRole("button", { name: "Simpan divisi", exact: true }).click();
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Marketing", exact: true }) })).toContainText("BOD Pengganti");
});

test("legacy account mapping names the new scope and then locks division transfers", async ({ page }) => {
  await page.goto("/users");
  await page.getByLabel("Filter divisi akun").selectOption("unmapped");
  await page.getByRole("button", { name: "Edit Anggota Lama", exact: true }).click();
  await page.getByRole("combobox", { name: /Divisi anggota/ }).selectOption("a");
  await page.getByRole("button", { name: "Simpan User", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Pemetaan awal ke divisi Marketing");
  await expect(page.getByRole("alertdialog")).toContainText("seluruh pekerjaan akun ini");
  const user = divisionUsers.find((user) => user.id === "member-legacy")!;
  await page.route("**/api/users/member-legacy", async (route) => {
    expect(route.request().postDataJSON().divisionId).toBe("a");
    await route.fulfill({ json: { ...user, divisionId: "a" } });
  });
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("Filter divisi akun").selectOption("a");
  await page.getByRole("button", { name: "Edit Anggota Lama", exact: true }).click();
  await expect(page.getByRole("textbox", { name: /Divisi anggota/ })).toHaveValue("Marketing");
  await expect(page.getByRole("textbox", { name: /Divisi anggota/ })).toHaveAttribute("readonly", "");
});

test("BOD navigation exposes only review surfaces and a named division", async ({ page }) => {
  await page.goto("/?actor=bod");
  const navigation = page.getByRole("navigation", { name: "Navigasi utama" });
  await expect(navigation.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Monitoring", exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Users", exact: true })).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "Divisi", exact: true })).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Marketing");
  await expect(page.locator("main").getByRole("combobox", { name: "Divisi", exact: true })).toHaveCount(0);
});

test("SuperAdmin dashboard refresh preserves the selected division", async ({ page }) => {
  await page.goto("/?divisionId=a");
  await page.route("**/api/dashboard?divisionId=a", (route) => route.fulfill({ json: { ...dashboardFixture, divisionId: "a", scopeLabel: "Marketing" } }));
  const request = page.waitForRequest("**/api/dashboard?divisionId=a");
  await page.getByRole("button", { name: "Perbarui data", exact: true }).click();
  await request;
  await expect(page.getByRole("combobox", { name: "Divisi", exact: true })).toHaveValue("a");
});

test("multi-division screens, mapping and forms fit desktop and mobile with keyboard recovery", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 390, 1919]) {
    await page.setViewportSize({ width, height: 900 });
    const suffix = width === 1440 ? "desktop" : width === 390 ? "mobile" : "user-1919";
    for (const [path, name] of [["/divisions", "divisions"], ["/users", "users"], ["/?actor=bod", "bod-dashboard"], ["/monitoring?actor=bod", "bod-monitoring"], ["/?state=unassigned&actor=bod", "unassigned"]]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      expect(await page.locator("body").evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `.impeccable/review/divisions/${name}-${suffix}.png`, fullPage: true, animations: "disabled" });
    }
    await page.goto("/divisions");
    await page.getByRole("button", { name: "Kelola Marketing", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `.impeccable/review/divisions/division-form-${suffix}.png`, fullPage: true, animations: "disabled" });
    await page.keyboard.press("Escape");
    await page.goto("/users");
    const opener = page.getByRole("button", { name: "Edit Anggota Lama", exact: true });
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("button", { name: "Tutup dialog", exact: true })).toBeFocused();
    await dialog.getByRole("combobox", { name: /Divisi anggota/ }).selectOption("a");
    await dialog.getByRole("button", { name: "Simpan User", exact: true }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `.impeccable/review/divisions/mapping-${suffix}.png`, fullPage: true, animations: "disabled" });
    await page.keyboard.press("Escape");
    await expect(dialog.getByRole("button", { name: "Simpan User", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await page.getByRole("alertdialog").getByRole("button", { name: "Batalkan perubahan", exact: true }).click();
    await expect(opener).toBeFocused();
  }
  expect(errors).toEqual([]);
});
