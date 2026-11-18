import type { Division, SafeUser } from "@/domain/models";

const timestamp = "2026-11-18T01:00:00.000Z";
export const divisionFixture: Division[] = [
  { id: "a", name: "Marketing", bodUserId: "bod-a", status: "active", createdAt: timestamp, updatedAt: timestamp },
  { id: "b", name: "Produksi", bodUserId: "bod-b", status: "active", createdAt: timestamp, updatedAt: timestamp },
];
export const divisionUsers: SafeUser[] = [
  { id: "sa", name: "SuperAdmin", role: "admin", email: "sa@example.test", status: "active", sheetName: "", createdAt: timestamp, updatedAt: timestamp },
  ...["a", "b", "new"].map((id): SafeUser => ({ id: `bod-${id}`, name: `BOD ${id === "new" ? "Pengganti" : id.toUpperCase()}`, role: "bod", email: `bod-${id}@example.test`, status: "active", sheetName: "", createdAt: timestamp, updatedAt: timestamp })),
  ...["a", "b", "legacy"].map((id): SafeUser => ({ id: `member-${id}`, name: id === "legacy" ? "Anggota Lama" : `Anggota ${id.toUpperCase()}`, role: "user", email: `member-${id}@example.test`, status: "active", divisionId: id === "legacy" ? undefined : id, sheetName: `sheet_${id}`, createdAt: timestamp, updatedAt: timestamp })),
];
