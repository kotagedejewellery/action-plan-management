import type { DashboardPlan } from "@/application/dashboard-analytics";
import type { SafeUser, WeeklyPlan } from "@/domain/models";

const names = ["Alya Putri", "Bima Pratama", "Citra Maharani", "Dimas Saputra", "Nadia Ayu", "Fajar Ramadhan", "Salsa Anindita", "Rizki Aditya"];
const tasks = ["Finalisasi desain katalog cincin", "Pemeriksaan kualitas koleksi baru", "Rekap pesanan pelanggan", "Persiapan materi kampanye"];
const users: SafeUser[] = names.map((name, index) => ({ id: `u${index}`, name, email: `member${index}@example.test`, role: "user", status: "active", sheetName: `action_plan_u${index}`, createdAt: "", updatedAt: "" }));
const plans: DashboardPlan[] = users.flatMap((user, index) => Array.from({ length: 3 + index % 4 }, (_, day) => ({
  id: `p${index}-${day}`, ownerId: user.id, ownerName: user.name,
  date: `2026-10-${String(13 + day).padStart(2, "0")}`, task: tasks[(index + day) % tasks.length],
  morningStatus: "On Progress", afternoonStatus: day === 0 ? "Final" : day < 3 - index % 3 ? "Selesai" : undefined,
  weeklyPlanId: index < 5 ? `w${index}` : undefined, createdAt: "", updatedAt: "",
})));
const weeklyPlans: WeeklyPlan[] = users.slice(0, 5).map((user, index) => ({
  id: `w${index}`, userId: user.id, title: `Target mingguan ${user.name}`,
  weekStart: "2026-10-12", weekEnd: "2026-10-18",
  plannedActionPlanIds: plans.filter((plan) => plan.weeklyPlanId === `w${index}`).map((plan) => plan.id), createdAt: "", updatedAt: "",
}));

export const dashboardFixture = { users, plans, weeklyPlans, completedStatusLabels: ["Selesai", "Final"], today: "2026-10-31", loadedAt: "2026-10-31T07:30:00.000Z" };
