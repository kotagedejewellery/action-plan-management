import { z } from "zod";

export const userInputSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "inactive"]),
  password: z.union([z.string().min(8, "Password minimal 8 karakter."), z.literal("")]).optional(),
});

export const createUserInputSchema = userInputSchema.extend({ password: z.string().min(8, "Password minimal 8 karakter.") });

export const actionPlanInputSchema = z.object({
  id: z.string().uuid().optional(),
  date: z.string().date("Tanggal tidak valid."),
  task: z.string().trim().min(1, "Action Plan wajib diisi."),
  morningStatus: z.string().trim().min(1, "Status pagi wajib dipilih."),
  afternoonStatus: z.string().trim().optional(),
  resultLink: z.union([z.string().url("Link Hasil harus berupa URL."), z.literal("")]).optional(),
  note: z.string().trim().optional(),
  weeklyPlanId: z.preprocess((value) => value === null || value === "" || value === "null" ? undefined : value, z.string().uuid().optional()),
  updatedAt: z.string().datetime().optional(),
});

export const weeklyPlanInputSchema = z.object({
  title: z.string().trim().min(1, "Judul rencana mingguan wajib diisi."),
  weekStart: z.string().date("Tanggal mulai minggu tidak valid."),
  weekdays: z.array(z.coerce.number().int().min(1).max(5)).min(1, "Pilih minimal satu hari kerja.").refine((days) => new Set(days).size === days.length, "Hari kerja tidak boleh duplikat."),
  morningStatus: z.string().trim().min(1, "Status pagi wajib dipilih."),
  note: z.string().trim().optional(),
});

export const weeklyPlanUpdateSchema = z.object({
  title: z.string().trim().min(1, "Judul rencana mingguan wajib diisi."),
  note: z.string().trim().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const statusInputSchema = z.object({ label: z.string().trim().min(1, "Nama status wajib diisi.").max(50), isCompleted: z.boolean().optional().default(false) });
export const statusUpdateSchema = z.object({ isActive: z.boolean(), isCompleted: z.boolean() });
