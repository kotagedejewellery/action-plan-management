import type { ActionPlan, ActionPlanAttachment, ActionPlanStatus, User, WeeklyPlan } from "@/domain/models";

export interface UserRepository {
  list(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  createActionPlanSheet(sheetName: string): Promise<void>;
}

export interface ActionPlanRepository {
  list(sheetName: string): Promise<ActionPlan[]>;
  findById(sheetName: string, id: string): Promise<ActionPlan | null>;
  create(sheetName: string, plan: ActionPlan): Promise<ActionPlan>;
  createMany(sheetName: string, plans: ActionPlan[]): Promise<ActionPlan[]>;
  update(sheetName: string, plan: ActionPlan): Promise<ActionPlan>;
  softDelete(sheetName: string, id: string, deletedAt: string, deletedBy: string): Promise<void>;
  hardDelete(sheetName: string, id: string): Promise<void>;
}

export interface WeeklyPlanRepository {
  list(): Promise<WeeklyPlan[]>;
  findById(id: string): Promise<WeeklyPlan | null>;
  create(plan: WeeklyPlan): Promise<WeeklyPlan>;
  update(plan: WeeklyPlan): Promise<WeeklyPlan>;
  softDelete(id: string, deletedAt: string, deletedBy: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}

export interface AttachmentStorage {
  upload(input: { name: string; mimeType: string; content: Buffer; folder: { userId: string; userName: string; actionPlanId: string } }): Promise<ActionPlanAttachment>;
  download(id: string): Promise<Buffer>;
  trash(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}

export interface StatusRepository {
  list(): Promise<ActionPlanStatus[]>;
  create(status: ActionPlanStatus): Promise<ActionPlanStatus>;
  update(status: ActionPlanStatus): Promise<ActionPlanStatus>;
}
