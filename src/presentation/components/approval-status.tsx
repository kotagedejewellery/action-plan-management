import type { ApprovalState } from "@/application/approvals";

const labels = { belum_diajukan: "Belum diajukan", menunggu: "Menunggu approval", disetujui: "Disetujui", ditolak: "Perlu revisi" } as const;
const colors = { belum_diajukan: "bg-[#eef3f2] text-[#516967]", menunggu: "bg-[#fff1d7] text-[#9a5b16]", disetujui: "bg-[#dff3e6] text-[#206b43]", ditolak: "bg-[#fff0ed] text-[#a33a2a]" } as const;

export function approvalStatusLabel(state?: ApprovalState) {
  return labels[state?.status ?? "belum_diajukan"];
}

export function ApprovalStatusBadge({ state }: { state?: ApprovalState }) {
  const status = state?.status ?? "belum_diajukan";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{labels[status]}</span>;
}
