export type AppErrorCode = "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION" | "UNAVAILABLE";

export class AppError extends Error {
  constructor(message: string, public readonly code: AppErrorCode) {
    super(message);
  }
}

function errorStatus(error: object) {
  if ("code" in error && typeof error.code === "number") return error.code;
  if ("status" in error && typeof error.status === "number") return error.status;
  if ("response" in error && typeof error.response === "object" && error.response && "status" in error.response && typeof error.response.status === "number") return error.response.status;
  return undefined;
}

export function publicError(error: unknown): Error {
  if (error instanceof AppError) return error;
  if (!(error instanceof Error)) return new Error("Terjadi kesalahan pada server. Coba lagi.");

  const url = "config" in error && typeof error.config === "object" && error.config && "url" in error.config ? String(error.config.url) : "";
  const details = `${error.message} ${url}`.toLowerCase();
  const google = details.includes("googleapis.com") || details.includes("google_") || details.includes("quota exceeded");
  if (!google) return new Error("Terjadi kesalahan pada server. Coba lagi.");

  const service = details.includes("drive") || details.includes("google_oauth") ? "Google Drive" : "Google Sheets";
  const status = errorStatus(error);
  if (status === 429 || details.includes("quota exceeded")) return new AppError(`${service} sedang mencapai batas permintaan. Tunggu sekitar satu menit, lalu coba lagi.`, "UNAVAILABLE");
  if (status === 401 || status === 403) return new AppError(`Akses ${service} tidak tersedia. Periksa kredensial dan izin integrasi, lalu coba lagi.`, "UNAVAILABLE");
  if (details.includes("environment variable")) return new AppError(`Integrasi ${service} belum dikonfigurasi di server. Hubungi Admin.`, "UNAVAILABLE");
  return new AppError(`Koneksi ke ${service} sedang bermasalah. Coba lagi beberapa saat lagi.`, "UNAVAILABLE");
}
