"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type FeedbackType = "success" | "error" | "info";
type Feedback = { id: number; type: FeedbackType; title: string; detail?: string };
type FeedbackContextValue = { notify: (type: FeedbackType, title: string, detail?: string) => void };

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const styles: Record<FeedbackType, { dot: string; label: string }> = {
  success: { dot: "bg-[#43a365]", label: "Berhasil" },
  error: { dot: "bg-[#c55b4c]", label: "Perlu diperbaiki" },
  info: { dot: "bg-[#137d79]", label: "Informasi" },
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Feedback[]>([]);
  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const notify = useCallback((type: FeedbackType, title: string, detail?: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setItems((current) => [...current.slice(-3), { id, type, title, detail }]);
    window.setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);
  return <FeedbackContext.Provider value={{ notify }}>{children}<div className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex flex-col gap-3 sm:left-auto sm:right-6 sm:w-[380px]" aria-live="polite" aria-atomic="true">{items.map((item) => <div key={item.id} className="pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-[0_18px_36px_-24px_rgba(23,60,58,0.3)]"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${styles[item.type].dot}`} aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#244542]">{item.title}</p>{item.detail && <p className="mt-0.5 text-sm leading-5 text-[#667c7c]">{item.detail}</p>}</div><button onClick={() => dismiss(item.id)} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#59706f] hover:bg-[#f1f5f4]" aria-label={`Tutup notifikasi ${styles[item.type].label}`}>Tutup</button></div>)}</div></FeedbackContext.Provider>;
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback harus dipakai di dalam FeedbackProvider.");
  return context;
}
