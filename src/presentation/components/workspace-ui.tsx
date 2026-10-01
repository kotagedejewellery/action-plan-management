import type { ReactNode } from "react";

import { Close } from "./icons";

export function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-sm text-[#90a09f]">—</span>;
  const styles = status === "Selesai" ? "bg-[#dff3e6] text-[#206b43]" : status === "On Progress" ? "bg-[#e5efff] text-[#265b9b]" : "bg-[#fff1d7] text-[#9a5b16]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>{status}</span>;
}

export function AccountStatus({ status }: { status: string }) {
  const active = status.toLowerCase() === "active";
  return <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${active ? "text-[#277145]" : "text-[#8a7770]"}`}><span className={`size-1.5 rounded-full ${active ? "bg-[#43a365]" : "bg-[#b9a69d]"}`} />{active ? "Active" : "Inactive"}</span>;
}

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#173c3a] sm:text-[2rem]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#667c7c]">{description}</p></div>{action}</div>;
}

export function DialogFrame({ title, description, children, onClose }: { title: string; description: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end bg-[#173c3a]/30 p-0 sm:items-center sm:justify-center sm:p-6" role="presentation"><div className="w-full rounded-t-2xl bg-white p-6 shadow-[0_-20px_56px_-25px_rgba(23,60,58,0.55)] sm:max-w-xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="flex items-start justify-between gap-5"><div><h2 id="dialog-title" className="text-xl font-semibold tracking-[-0.025em] text-[#173c3a]">{title}</h2><p className="mt-1.5 text-sm leading-6 text-[#667c7c]">{description}</p></div><button type="button" className="grid size-9 shrink-0 place-items-center rounded-lg text-[#667c7c] hover:bg-[#f1f5f4]" onClick={onClose} aria-label="Tutup dialog"><Close className="size-5" /></button></div>{children}</div></div>;
}

export function ConfirmDialog({ title, description, confirmLabel, onCancel, onConfirm, confirming = false, destructive = false }: { title: string; description: ReactNode; confirmLabel: string; onCancel: () => void; onConfirm: () => void; confirming?: boolean; destructive?: boolean }) {
  const confirmClass = destructive ? "bg-[#a34c3f] hover:bg-[#8b3c31]" : "bg-[#137d79] hover:bg-[#0e6865]";
  return <div className="fixed inset-0 z-[60] flex items-end bg-[#173c3a]/40 p-0 sm:items-center sm:justify-center sm:p-6" role="presentation"><div className="w-full rounded-t-2xl bg-white p-6 shadow-[0_-20px_56px_-25px_rgba(23,60,58,0.55)] sm:max-w-md sm:rounded-2xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description"><h2 id="confirm-dialog-title" className="text-xl font-semibold tracking-[-0.025em] text-[#173c3a]">{title}</h2><div id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-[#667c7c]">{description}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} disabled={confirming} className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60">Batal</button><button type="button" onClick={onConfirm} disabled={confirming} className={`h-10 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-60 ${confirmClass}`}>{confirming ? "Memproses..." : confirmLabel}</button></div></div></div>;
}
