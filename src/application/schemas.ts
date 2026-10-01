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
  updatedAt: z.string().datetime().optional(),
});

export const statusInputSchema = z.object({ label: z.string().trim().min(1, "Nama status wajib diisi.").max(50), isCompleted: z.boolean().optional().default(false) });
