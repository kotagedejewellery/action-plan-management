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
import { ConnectedNotesWorkspace } from "@/presentation/components/connected-notes-workspace";
import DashboardLoading from "@/app/(dashboard)/dashboard/loading";
import { monitoringPlans, monitoringUsers } from "./monitoring-fixture";
import "@/app/globals.css";

const params = new URLSearchParams(window.location.search);
const state = params.get("state");
const user = params.get("actor") === "user";
const bod = params.get("actor") === "bod";
const bodMonitor = params.get("actor") === "bod-monitor";
const divisionBod = bod || bodMonitor;
const approvalScope = params.get("approval") === "scope";
const scoped = params.get("divisionId") === "a" || divisionBod;
const baseAccountUsers = state === "legacy-bod" ? divisionUsers.map((user) => user.id === "member-legacy" ? { ...user, role: "bod" as const } : user) : divisionUsers;
const accountUsers = state === "deletable-user" ? [...baseAccountUsers, { id: "temporary", name: "Akun Sementara", email: "temporary@example.test", role: "user" as const, status: "inactive" as const, sheetName: "", createdAt: "2026-11-24T00:00:00.000Z", updatedAt: "2026-11-24T00:00:00.000Z" }] : baseAccountUsers;
const accountDivisions = state === "legacy-bod" ? divisionFixture.map((division) => division.id === "a" ? { ...division, bodUserId: "member-legacy" } : division) : divisionFixture;
const empty = state === "empty" || state === "no-users";
const data = {
  ...dashboardFixture,
  canManageUsers: !divisionBod,
  canApprove: bod,
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
    <AppShell actor={{ id: user ? "user-a" : bodMonitor ? "bod-monitor" : bod ? "bod-a" : "admin", name: user ? "User KotaGede" : bodMonitor ? "BOD Monitor" : "Admin KotaGede", email: user ? "user@example.test" : "admin@example.test", role: user ? "user" : divisionBod ? "bod" : "admin", divisionId: divisionBod ? "a" : undefined, divisionName: divisionBod ? "Marketing" : undefined, status: "active", sheetName: "" }} workspacePeriod="Oktober 2026">
      {state === "unassigned" ? <DivisionUnavailable /> : state === "loading" ? <DashboardLoading /> : window.location.pathname === "/divisions" ? <ConnectedDivisionWorkspace initialDivisions={state === "empty" ? [] : state === "missing-monitor" ? divisionFixture.map((division) => division.id === "a" ? { ...division, monitorUserIds: ["missing-bod"] } : division) : divisionFixture} initialEditingId={params.get("divisionId") ?? undefined} users={accountUsers} /> : window.location.pathname === "/users" ? <ConnectedUserManagementWorkspace initialUsers={accountUsers} divisions={accountDivisions} initialStatuses={[]} /> : window.location.pathname === "/monitoring" ? <ConnectedMonitoringWorkspace divisionFilter={!divisionBod ? <DivisionFilter divisions={divisionFixture} selectedId={scoped ? "a" : ""} action="/monitoring" /> : undefined} canManageUsers={!divisionBod} canViewApproval={divisionBod || approvalScope} canApprove={bod} approvalUserIds={divisionBod ? monitoringUsers.map((user) => user.id) : approvalScope ? ["u0"] : []} initialApprovalStates={divisionBod || approvalScope ? { m0: { status: "menunggu", approvalId: "approval-m0" }, m3: { status: "disetujui", approvalId: "approval-m3" }, m6: { status: "ditolak", approvalId: "approval-m6" } } : {}} scopeLabel={scoped ? "Marketing" : undefined} users={state === "no-users" ? [] : scoped ? monitoringUsers.slice(0, 2) : monitoringUsers} initialPlans={state === "empty" ? [] : params.get("recordId")?.startsWith("p") ? data.plans.filter((plan) => plan.ownerId === params.get("userId")) : monitoringPlans} initialSelectedId={params.get("userId") ?? "u0"} initialRecordId={params.get("recordId") ?? ""} initialDateFrom={params.get("from") ?? ""} initialDateTo={params.get("to") ?? ""} initialScope={params.get("scope") === "active" ? "active" : params.get("scope") === "history" ? "history" : "all"} completedStatusLabels={["Selesai", "Final"]} today={params.get("today") ?? "2026-10-19"} /> : window.location.pathname === "/notes" ? <ConnectedNotesWorkspace actor={{ id: "admin", name: "Admin KotaGede" }} /> : <ConnectedDashboardWorkspace {...data} divisionFilter={!divisionBod ? <DivisionFilter divisions={divisionFixture} selectedId={scoped ? "a" : ""} action="/dashboard" /> : undefined} />}
    </AppShell>
  </FeedbackProvider>,
);
