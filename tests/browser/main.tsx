import { ConnectedDivisionWorkspace } from "@/presentation/components/connected-division-workspace";
import { ConnectedUserManagementWorkspace } from "@/presentation/components/connected-user-management-workspace";
import { DivisionUnavailable } from "@/presentation/components/division-unavailable";
import { DivisionFilter } from "@/presentation/components/division-filter";
import { divisionFixture, divisionUsers } from "./division-fixture";
import { createRoot } from "react-dom/client";
import { dashboardFixture } from "./fixture";
import { ConnectedDashboardWorkspace } from "@/presentation/components/connected-dashboard-workspace";
import { AppShell } from "@/presentation/components/app-shell";
import { FeedbackProvider } from "@/presentation/components/feedback";
import { ConnectedMonitoringWorkspace } from "@/presentation/components/connected-monitoring-workspace";
import DashboardLoading from "@/app/(dashboard)/dashboard/loading";
import { monitoringPlans, monitoringUsers } from "./monitoring-fixture";
import "@/app/globals.css";

const params = new URLSearchParams(window.location.search);
const state = params.get("state");
const bod = params.get("actor") === "bod";
const scoped = params.get("divisionId") === "a" || bod;
const accountUsers = state === "legacy-bod" ? divisionUsers.map((user) => user.id === "member-legacy" ? { ...user, role: "bod" as const } : user) : divisionUsers;
const accountDivisions = state === "legacy-bod" ? divisionFixture.map((division) => division.id === "a" ? { ...division, bodUserId: "member-legacy" } : division) : divisionFixture;
const empty = state === "empty" || state === "no-users";
const data = {
  ...dashboardFixture,
  canManageUsers: !bod,
  divisionId: scoped ? "a" : undefined,
  scopeLabel: scoped ? "Marketing" : undefined,
  today: params.get("today") ?? dashboardFixture.today,
  users: state === "no-users" ? [] : scoped ? dashboardFixture.users.slice(0, 2) : dashboardFixture.users,
  plans: empty ? [] : scoped ? dashboardFixture.plans.filter((plan) => ["u0", "u1"].includes(plan.ownerId)) : state === "complete" ? dashboardFixture.plans.map((plan) => ({ ...plan, afternoonStatus: "Final" })) : dashboardFixture.plans,
  pendingApprovals: state === "approval-queue" ? dashboardFixture.plans.slice(0, 2) : [],
  weeklyPlans: empty ? [] : scoped ? dashboardFixture.weeklyPlans.filter((plan) => ["u0", "u1"].includes(plan.userId)) : dashboardFixture.weeklyPlans,
};

createRoot(document.getElementById("root")!).render(
  <FeedbackProvider>
    <span className="fixed left-16 top-5 z-[80] text-[10px] text-[#59706f] lg:left-[580px]">Pengujian lokal · data sintetis</span>
    <AppShell actor={{ id: "admin", name: "Admin KotaGede", email: "admin@example.test", role: bod ? "bod" : "admin", divisionId: bod ? "a" : undefined, divisionName: bod ? "Marketing" : undefined, status: "active", sheetName: "" }} workspacePeriod="Oktober 2026">
      {state === "unassigned" ? <DivisionUnavailable /> : state === "loading" ? <DashboardLoading /> : window.location.pathname === "/divisions" ? <ConnectedDivisionWorkspace initialDivisions={state === "empty" ? [] : divisionFixture} users={accountUsers} /> : window.location.pathname === "/users" ? <ConnectedUserManagementWorkspace initialUsers={accountUsers} divisions={accountDivisions} initialStatuses={[]} /> : window.location.pathname === "/monitoring" ? <ConnectedMonitoringWorkspace divisionFilter={!bod ? <DivisionFilter divisions={divisionFixture} selectedId={scoped ? "a" : ""} action="/monitoring" /> : undefined} canManageUsers={!bod} scopeLabel={scoped ? "Marketing" : undefined} users={state === "no-users" ? [] : scoped ? monitoringUsers.slice(0, 2) : monitoringUsers} initialPlans={state === "empty" ? [] : params.get("recordId")?.startsWith("p") ? data.plans.filter((plan) => plan.ownerId === params.get("userId")) : monitoringPlans} initialSelectedId={params.get("userId") ?? "u0"} initialRecordId={params.get("recordId") ?? ""} initialDateFrom={params.get("from") ?? ""} initialDateTo={params.get("to") ?? ""} initialScope={params.get("scope") === "active" ? "active" : params.get("scope") === "history" ? "history" : "all"} completedStatusLabels={["Selesai", "Final"]} today={params.get("today") ?? "2026-10-19"} /> : <ConnectedDashboardWorkspace {...data} divisionFilter={!bod ? <DivisionFilter divisions={divisionFixture} selectedId={scoped ? "a" : ""} action="/dashboard" /> : undefined} />}
    </AppShell>
  </FeedbackProvider>,
);
