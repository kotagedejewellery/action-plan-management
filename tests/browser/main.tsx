import { createRoot } from "react-dom/client";
import { dashboardFixture } from "./fixture";
import { ConnectedDashboardWorkspace } from "@/presentation/components/connected-dashboard-workspace";
import { AppShell } from "@/presentation/components/app-shell";
import { FeedbackProvider } from "@/presentation/components/feedback";
import "@/app/globals.css";

const params = new URLSearchParams(window.location.search);
const state = params.get("state");
const empty = state === "empty" || state === "no-users";
const data = {
  ...dashboardFixture,
  today: params.get("today") ?? dashboardFixture.today,
  users: state === "no-users" ? [] : dashboardFixture.users,
  plans: empty ? [] : state === "complete" ? dashboardFixture.plans.map((plan) => ({ ...plan, afternoonStatus: "Final" })) : dashboardFixture.plans,
  weeklyPlans: empty ? [] : dashboardFixture.weeklyPlans,
};

createRoot(document.getElementById("root")!).render(
  <FeedbackProvider>
    <span className="fixed left-16 top-5 z-[80] text-[10px] text-[#59706f] lg:left-[460px]">Pengujian lokal · data sintetis</span>
    <AppShell actor={{ id: "admin", name: "Admin KotaGede", email: "admin@example.test", role: "admin", status: "active", sheetName: "" }} workspacePeriod="Oktober 2026">
      <ConnectedDashboardWorkspace {...data} />
    </AppShell>
  </FeedbackProvider>,
);
