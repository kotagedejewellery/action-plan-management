export type PlanStatus = "Selesai" | "On Progress" | "Belum Selesai";

export type ActionPlan = {
  id: string;
  date: string;
  task: string;
  morningStatus: PlanStatus;
  afternoonStatus?: PlanStatus;
  resultLink?: string;
  note?: string;
};

export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  planCount: number;
};

export const actionPlans: ActionPlan[] = [
  { id: "ap-01", date: "30/09/2026", task: "Creative planning kampanye Hijaz", morningStatus: "On Progress", afternoonStatus: "Selesai", resultLink: "https://docs.google.com", note: "Brief siap untuk review." },
  { id: "ap-02", date: "30/09/2026", task: "Backlink outreach website", morningStatus: "On Progress", afternoonStatus: "On Progress", resultLink: "https://drive.google.com", note: "Menunggu respons dari 3 publisher." },
  { id: "ap-03", date: "30/09/2026", task: "Revisi desain ads post", morningStatus: "Belum Selesai", note: "Menunggu feedback visual." },
  { id: "ap-04", date: "29/09/2026", task: "Generate & prompting video AI", morningStatus: "On Progress", afternoonStatus: "Selesai", resultLink: "https://canva.com", note: "Tiga opsi video tersedia." },
  { id: "ap-05", date: "29/09/2026", task: "Setting Google Ads campaign", morningStatus: "Selesai", afternoonStatus: "Selesai", resultLink: "https://ads.google.com" },
];

export const teamMembers: TeamMember[] = [
  { id: "hafidh", initials: "H", name: "Hafidh Akbar", email: "hafidh@kotagedejewellery.com", role: "User", status: "Active", planCount: 5 },
  { id: "bagas", initials: "B", name: "Bagas Pratama", email: "bagas@kotagedejewellery.com", role: "User", status: "Active", planCount: 4 },
  { id: "nabila", initials: "N", name: "Nabila Putri", email: "nabila@kotagedejewellery.com", role: "User", status: "Inactive", planCount: 0 },
  { id: "admin", initials: "A", name: "Admin Workspace", email: "admin@kotagedejewellery.com", role: "Admin", status: "Active", planCount: 0 },
];
