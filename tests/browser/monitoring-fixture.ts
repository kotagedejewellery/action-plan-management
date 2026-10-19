import type { ActionPlan, SafeUser } from "@/domain/models";

export const monitoringUsers: SafeUser[] = [
  { id: "u0", name: "Alya Putri", email: "alya@example.test", role: "user", status: "active", sheetName: "action_plan_u0", createdAt: "", updatedAt: "" },
  { id: "u1", name: "Bima Pratama", email: "bima@example.test", role: "user", status: "active", sheetName: "action_plan_u1", createdAt: "", updatedAt: "" },
  { id: "u2", name: "Citra Maharani dengan Nama Lengkap Panjang", email: "citra.maharani@example.test", role: "user", status: "inactive", sheetName: "action_plan_u2", createdAt: "", updatedAt: "" },
];

export const monitoringPlans: ActionPlan[] = Array.from({ length: 32 }, (_, index) => ({
  id: `m${index}`, date: index === 0 ? "2026-10-19" : index === 1 ? "2026-10-23" : index === 31 ? "2026-09-30" : `2026-10-${String(1 + index % 18).padStart(2, "0")}`,
  task: index === 0 ? "Finalisasi katalog cincin" : index === 1 ? "Persiapan koleksi mendatang" : `Pemeriksaan koleksi ${String(index).padStart(2, "0")}`,
  morningStatus: index === 0 ? "On Progress" : "Belum Selesai", afternoonStatus: index % 3 === 0 ? "Final" : index % 3 === 1 ? undefined : "On Progress",
  note: index === 0 ? "Katalog telah diperiksa. Tinjau komposisi foto dan daftar produk sebelum publikasi." : index === 1 ? "Siapkan daftar produk untuk pemotretan pekan depan." : undefined,
  resultLink: index === 0 ? "https://example.test/hasil-katalog" : undefined,
  attachments: index === 0 ? [{ id: "image1", name: "Katalog cincin.png", mimeType: "image/png" }, { id: "doc1", name: "Rekap koleksi.pdf", mimeType: "application/pdf" }] : undefined,
  createdAt: "2026-10-01T01:00:00.000Z", updatedAt: "2026-10-19T08:30:00.000Z",
}));

export const bimaPlans: ActionPlan[] = [{ id: "b1", date: "2026-10-19", task: "Rekap pesanan Bima", morningStatus: "On Progress", createdAt: "2026-10-19T01:00:00.000Z", updatedAt: "2026-10-19T01:00:00.000Z" }];
