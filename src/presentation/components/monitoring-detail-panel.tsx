"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ActionPlan, ActionPlanAttachment } from "@/domain/models";
import { Close, ExternalLink } from "./icons";
import { StatusBadge } from "./workspace-ui";

function displayTimestamp(value: string) {
  return value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }).format(new Date(value)) : "Belum tersedia";
}

function AttachmentImage({ attachment, url }: { attachment: ActionPlanAttachment; url: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="min-w-0">
    {failed ? <div className="grid aspect-square place-items-center rounded-xl bg-[#eef3f2] p-3 text-center text-xs text-[#516967]">Pratinjau belum dapat dimuat. Tutup dan buka kembali detail untuk mencoba lagi.</div> : <a href={url} target="_blank" rel="noreferrer" aria-label={`Buka gambar ${attachment.name}`}><Image unoptimized src={url} alt={`Lampiran: ${attachment.name}`} width={240} height={240} onError={() => setFailed(true)} className="aspect-square w-full rounded-xl border object-cover" /></a>}
    <figcaption className="mt-2 break-words text-xs text-[#516967]">{attachment.name}</figcaption>
  </figure>;
}

export function MonitoringDetailPanel({ plan, userId, memberName, completedStatusLabels, onClose }: { plan: ActionPlan; userId: string; memberName: string; completedStatusLabels: string[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const element = dialog.current!;
    const desktop = window.matchMedia("(min-width: 1280px)");
    const previousOverflow = document.body.style.overflow;
    function showPanel() {
      if (element.open) element.close();
      element.setAttribute("aria-modal", String(!desktop.matches));
      document.body.style.overflow = desktop.matches ? previousOverflow : "hidden";
      if (desktop.matches) element.show(); else element.showModal();
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key === "Tab" && !desktop.matches) {
        const targets = Array.from(element.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')).filter((target) => target.getClientRects().length > 0);
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    showPanel();
    desktop.addEventListener("change", showPanel);
    document.addEventListener("keydown", handleKey);
    return () => {
      desktop.removeEventListener("change", showPanel);
      document.removeEventListener("keydown", handleKey);
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  const images = plan.attachments?.filter((attachment) => attachment.mimeType.startsWith("image/")) ?? [];
  const documents = plan.attachments?.filter((attachment) => !attachment.mimeType.startsWith("image/")) ?? [];
  const date = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok" }).format(new Date(`${plan.date}T00:00:00+07:00`));

  return <dialog ref={dialog} aria-labelledby="monitoring-detail-title" onCancel={(event) => { event.preventDefault(); onClose(); }} className="monitoring-detail fixed inset-y-0 right-0 left-auto z-50 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-white p-0 text-[#173c3a] shadow-[-12px_0_40px_-20px_rgba(23,60,58,0.3)] xl:w-[460px] xl:border-l">
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-4 border-b p-5 sm:p-6"><div className="min-w-0"><h2 id="monitoring-detail-title" className="text-lg font-semibold">Detail Action Plan</h2><p className="mt-1 break-words text-sm text-[#516967]">{memberName}</p><p className="mt-1 text-xs text-[#516967]">{date}</p></div><button type="button" autoFocus onClick={onClose} aria-label="Tutup detail" className="grid size-11 shrink-0 place-items-center rounded-xl text-[#516967] hover:bg-[#eef4f3]"><Close className="size-5" /></button></header>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 sm:p-6">
        <section><h3 className="text-sm font-semibold">Pekerjaan</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#294846]">{plan.task}</p></section>
        <dl className="grid grid-cols-2 gap-3 border-y py-4 text-xs text-[#516967]">{[["Status pagi", plan.morningStatus], ["Status sore", plan.afternoonStatus]].map(([label, status]) => <div key={label}><dt>{label}</dt><dd className="mt-2">{status ? <StatusBadge status={status} completedStatusLabels={completedStatusLabels} /> : "Belum diisi"}</dd></div>)}</dl>
        <section><h3 className="text-sm font-semibold">Catatan</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#516967]">{plan.note || "Belum ada catatan."}</p></section>
        <section><h3 className="text-sm font-semibold">Hasil kerja</h3>{plan.resultLink ? <a href={plan.resultLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold text-[#137d79] hover:bg-[#eef4f3]">Buka hasil <ExternalLink className="size-4" /></a> : <p className="mt-2 text-sm text-[#516967]">Belum ada link hasil.</p>}</section>
        <section><h3 className="text-sm font-semibold">Lampiran{plan.attachments?.length ? ` (${plan.attachments.length})` : ""}</h3>{images.length > 0 && <div className="mt-3 grid grid-cols-2 gap-4">{images.map((attachment) => <AttachmentImage key={`${plan.id}-${attachment.id}`} attachment={attachment} url={`/api/action-plans/${encodeURIComponent(plan.id)}/attachments/${encodeURIComponent(attachment.id)}?userId=${encodeURIComponent(userId)}`} />)}</div>}{documents.length > 0 && <><ul className="mt-3 divide-y">{documents.map((attachment) => <li key={attachment.id} className="break-words py-3 text-sm text-[#516967]">{attachment.name}</li>)}</ul><p className="mt-1 text-xs leading-5 text-[#516967]">Nama dokumen ditampilkan sebagai referensi. Akses Admin terbatas pada pratinjau gambar.</p></>}{!plan.attachments?.length && <p className="mt-2 text-sm text-[#516967]">Belum ada lampiran.</p>}</section>
        <dl className="space-y-4 border-t pt-5 text-xs text-[#516967]"><div><dt>Dibuat</dt><dd className="mt-1">{displayTimestamp(plan.createdAt)}</dd></div><div><dt>Terakhir diperbarui</dt><dd className="mt-1">{displayTimestamp(plan.updatedAt)}</dd></div></dl>
      </div>
    </div>
  </dialog>;
}
