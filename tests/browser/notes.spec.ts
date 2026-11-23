import { expect, test } from "@playwright/test";

const timestamp = "2026-11-23T00:00:00.000Z";

test("Notes requires an exact workspace confirmation and recovers safely from title changes", async ({ page }) => {
  let workspaceExists = true;
  let title = "Keputusan awal";
  let confirmationName = "";
  const workspace = { id: "workspace-1", name: "Strategi", ownerId: "admin", updatedAt: timestamp };
  const note = () => ({ id: "note-1", workspaceId: workspace.id, title, createdBy: "admin", updatedAt: timestamp, titleUpdatedAt: timestamp });

  await page.route("**/api/notes/events", (route) => route.fulfill({ status: 200, headers: { "content-type": "text/event-stream" }, body: "" }));
  await page.route("**/api/notes/note-1/session", (route) => route.fulfill({ status: 503, json: { error: "Editor sintetis tidak tersedia." } }));
  await page.route("**/api/notes/workspaces/workspace-1/notes", (route) => route.fulfill({ json: workspaceExists ? [note()] : [] }));
  await page.route("**/api/notes/workspaces/workspace-1/members", (route) => route.fulfill({ json: workspaceExists ? [{ userId: "admin", role: "owner", name: "Admin KotaGede", email: "admin@example.test" }] : [] }));
  await page.route("**/api/notes/workspaces/workspace-1", async (route) => {
    if (route.request().method() !== "DELETE") return route.fallback();
    confirmationName = String((await route.request().postDataJSON()).confirmationName);
    workspaceExists = false;
    await route.fulfill({ status: 204 });
  });
  await page.route("**/api/notes/note-1", async (route) => {
    if (route.request().method() !== "PATCH") return route.fallback();
    title = String((await route.request().postDataJSON()).title);
    await route.fulfill({ json: note() });
  });
  await page.route("**/api/notes/workspaces", (route) => route.fulfill({ json: workspaceExists ? [workspace] : [] }));

  await page.goto("/notes");
  await expect(page.getByRole("heading", { name: "Catatan Kolaboratif", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Ubah nama", exact: true }).click();
  const nameInput = page.getByRole("textbox", { name: "Nama catatan", exact: true });
  await expect(nameInput).toBeFocused();
  await nameInput.fill("Keputusan final");
  await page.getByRole("button", { name: "Simpan nama", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Keputusan final", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Hapus workspace", exact: true }).click();
  const confirmation = page.getByRole("textbox", { name: "Nama workspace", exact: true });
  await expect(confirmation).toBeFocused();
  await expect(page.getByRole("button", { name: "Hapus workspace permanen", exact: true })).toBeDisabled();
  await expect(page.getByText("Anda akan menghapus 1 catatan dan mencabut akses 1 anggota.", { exact: false })).toBeVisible();
  await confirmation.fill(workspace.name);
  await page.getByRole("button", { name: "Hapus workspace permanen", exact: true }).click();
  await expect.poll(() => confirmationName).toBe(workspace.name);
  await expect(page.getByText("Pilih atau buat workspace untuk memulai Catatan Kolaboratif.", { exact: true })).toBeVisible();
});
