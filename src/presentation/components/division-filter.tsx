import type { Division } from "@/domain/models";

export function DivisionFilter({ divisions, selectedId = "", action }: { divisions: Division[]; selectedId?: string; action: string }) {
  return <form action={action} className="mt-5 flex flex-wrap items-end gap-3"><label className="block text-sm font-medium text-[#294846]">Divisi<select name="divisionId" defaultValue={selectedId} className="mt-2 block h-11 w-full min-w-48 rounded-xl border bg-white px-3"><option value="">Seluruh divisi</option>{divisions.map((division) => <option key={division.id} value={division.id}>{division.name}{division.status === "inactive" ? " (nonaktif)" : ""}</option>)}</select></label><button className="min-h-11 rounded-xl border bg-white px-4 text-sm font-semibold text-[#176d69]">Tampilkan</button></form>;
}
