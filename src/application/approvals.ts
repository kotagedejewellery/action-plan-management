import { assertCanReadMember, requireApprovalBod, requireUserWorkspace } from "./access";
import { AppError } from "./errors";
import type { ActionPlanApprovalRepository, ActionPlanRepository, DivisionRepository, StatusRepository, UserRepository } from "./ports";
import type { ActionPlan, ActionPlanApproval, Actor, User } from "@/domain/models";

export type ApprovalState = { status: "belum_diajukan" | "menunggu" | "disetujui" | "ditolak"; approvalId?: string; note?: string };

let approvalWrite: Promise<unknown> = Promise.resolve();
// shortcut: serializes writes in one app process; use a distributed lock before adding app replicas.
function serializeApprovalWrite<T>(action: () => Promise<T>): Promise<T> {
  const next = approvalWrite.then(action, action);
  approvalWrite = next.catch(() => undefined);
  return next;
}

function latestForPlan(events: ActionPlanApproval[], plan: ActionPlan) {
  return events.filter((event) => event.actionPlanId === plan.id && event.planUpdatedAt === plan.updatedAt).at(-1);
}

export function approvalState(plan: ActionPlan, events: ActionPlanApproval[]): ApprovalState {
  const latest = latestForPlan(events, plan);
  if (!latest) return { status: "belum_diajukan" };
  return { status: latest.decision === "submitted" ? "menunggu" : latest.decision === "approved" ? "disetujui" : "ditolak", approvalId: latest.id, note: latest.note };
}

export function approvalStates(plans: ActionPlan[], events: ActionPlanApproval[]) {
  return Object.fromEntries(plans.map((plan) => [plan.id, approvalState(plan, events)]));
}

export async function listMemberApprovalStates(approvals: ActionPlanApprovalRepository, actionPlans: ActionPlanRepository, actor: Actor, owner: User | null) {
  if (actor.role === "user") {
    requireUserWorkspace(actor);
    if (!owner || owner.id !== actor.id) throw new AppError("Akses pekerjaan di luar akun Anda ditolak.", "FORBIDDEN");
  } else assertCanReadMember(actor, owner);
  const plans = (await actionPlans.list(owner!.sheetName)).filter((plan) => !plan.deletedAt);
  return approvalStates(plans, await approvals.list());
}

export async function submitForApproval(approvals: ActionPlanApprovalRepository, actionPlans: ActionPlanRepository, statuses: StatusRepository, divisions: DivisionRepository, actor: Actor, planId: string) {
  return serializeApprovalWrite(async () => {
    requireUserWorkspace(actor);
    const division = (await divisions.list()).find((item) => item.id === actor.divisionId);
    if (!division?.approvalRequired) throw new AppError("Approval tidak diaktifkan untuk divisi Anda.", "FORBIDDEN");
    const plan = await actionPlans.findById(actor.sheetName, planId);
    if (!plan || plan.deletedAt) throw new AppError("Action Plan tidak ditemukan.", "NOT_FOUND");
    const completedStatusLabels = new Set((await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label));
    if (!plan.afternoonStatus || !completedStatusLabels.has(plan.afternoonStatus)) throw new AppError("Selesaikan status sore sebelum mengajukan approval.", "VALIDATION");
    if (!plan.resultLink && !plan.attachments?.length) throw new AppError("Lampirkan minimal satu bukti berupa link hasil atau file sebelum mengajukan approval.", "VALIDATION");
    const state = approvalState(plan, await approvals.list());
    if (state.status === "menunggu") throw new AppError("Action Plan ini sudah menunggu approval.", "CONFLICT");
    if (state.status === "disetujui") throw new AppError("Action Plan sudah disetujui. Perbarui pekerjaan terlebih dahulu jika perlu mengajukan ulang.", "CONFLICT");
    const event: ActionPlanApproval = { id: crypto.randomUUID(), actionPlanId: plan.id, ownerId: actor.id, divisionId: division.id, planUpdatedAt: plan.updatedAt, decision: "submitted", actorId: actor.id, createdAt: new Date().toISOString() };
    await approvals.create(event);
    return event;
  });
}

export async function decideApproval(approvals: ActionPlanApprovalRepository, actionPlans: ActionPlanRepository, statuses: StatusRepository, users: UserRepository, divisions: DivisionRepository, actor: Actor, submissionId: string, decision: "approved" | "rejected", note?: string) {
  return serializeApprovalWrite(async () => {
    if (decision === "rejected" && !note?.trim()) throw new AppError("Alasan penolakan wajib diisi.", "VALIDATION");
    const events = await approvals.list();
    const submission = events.find((event) => event.id === submissionId && event.decision === "submitted");
    if (!submission) throw new AppError("Pengajuan approval tidak ditemukan.", "NOT_FOUND");
    const division = (await divisions.list()).find((item) => item.id === submission.divisionId);
    if (!division) throw new AppError("Divisi pengajuan tidak ditemukan.", "NOT_FOUND");
    requireApprovalBod(actor, division);
    const owner = await users.findById(submission.ownerId);
    if (!owner || owner.role !== "user" || owner.divisionId !== division.id || !owner.sheetName) throw new AppError("Pemilik Action Plan tidak berada dalam cakupan approval.", "FORBIDDEN");
    const plan = await actionPlans.findById(owner.sheetName, submission.actionPlanId);
    if (!plan || plan.deletedAt || plan.updatedAt !== submission.planUpdatedAt) throw new AppError("Action Plan telah berubah; minta User mengajukan ulang approval.", "CONFLICT");
    const completedStatusLabels = new Set((await statuses.list()).filter((status) => status.isCompleted).map((status) => status.label));
    if (!plan.afternoonStatus || !completedStatusLabels.has(plan.afternoonStatus)) throw new AppError("Action Plan belum selesai; minta User memperbarui status sore dan mengajukan ulang approval.", "CONFLICT");
    if (latestForPlan(events, plan)?.id !== submission.id) throw new AppError("Pengajuan ini sudah diproses atau digantikan pengajuan baru.", "CONFLICT");
    const event: ActionPlanApproval = { id: crypto.randomUUID(), actionPlanId: plan.id, ownerId: owner.id, divisionId: division.id, planUpdatedAt: plan.updatedAt, decision, note: note?.trim() || undefined, actorId: actor.id, createdAt: new Date().toISOString() };
    await approvals.create(event);
    return event;
  });
}
