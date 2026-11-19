import type { Division } from "@/domain/models";

export function DivisionFilter({ divisions, selectedId = "", action }: { divisions: Division[]; selectedId?: string; action: string }) {
  const selectedName = divisions.find((division) => division.id === selectedId)?.name ?? "Seluruh divisi";
  return <form action={action} aria-label="Cakupan data" className="flex flex-wrap items-end gap-3 border-y bg-white px-4 py-3"><label className="block text-sm font-medium text-[#294846]">Cakupan<select name="divisionId" defaultValue={selectedId} className="mt-1.5 block h-11 w-full min-w-48 rounded-xl border bg-white px-3"><option value="">Seluruh divisi</option>{divisions.map((division) => <option key={division.id} value={division.id}>{division.name}{division.status === "inactive" ? " (nonaktif)" : ""}</option>)}</select></label><button className="min-h-11 rounded-xl border bg-white px-4 text-sm font-semibold text-[#176d69]">Terapkan divisi</button><span className="min-h-9 rounded-lg bg-[#f1f5f4] px-3 py-2 text-xs font-medium text-[#59706f]" aria-live="polite">Menampilkan: {selectedName}</span></form>;
}
