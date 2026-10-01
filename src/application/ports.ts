import type { ActionPlan, ActionPlanStatus, User } from "@/domain/models";

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
  update(sheetName: string, plan: ActionPlan): Promise<ActionPlan>;
}

export interface StatusRepository {
  list(): Promise<ActionPlanStatus[]>;
  create(status: ActionPlanStatus): Promise<ActionPlanStatus>;
  update(status: ActionPlanStatus): Promise<ActionPlanStatus>;
}
