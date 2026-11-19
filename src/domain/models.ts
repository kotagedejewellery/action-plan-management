export type UserRole = "admin" | "bod" | "user";
export type AccountStatus = "active" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  sheetName: string;
  divisionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type SafeUser = Omit<User, "passwordHash">;

export type Division = {
  id: string;
  name: string;
  bodUserId?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  approvalRequired?: boolean;
};

export type ActionPlanApproval = {
  id: string;
  actionPlanId: string;
  ownerId: string;
  divisionId: string;
  planUpdatedAt: string;
  decision: "submitted" | "approved" | "rejected";
  note?: string;
  actorId: string;
  createdAt: string;
};

export type ActionPlan = {
  id: string;
  date: string;
  task: string;
  morningStatus: string;
  afternoonStatus?: string;
  resultLink?: string;
  attachments?: ActionPlanAttachment[];
  note?: string;
  weeklyPlanId?: string;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActionPlanAttachment = {
  id: string;
  name: string;
  mimeType: string;
};

export type WeeklyPlan = {
  id: string;
  userId: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  plannedActionPlanIds: string[];
  note?: string;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActionPlanStatus = {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Actor = Pick<User, "id" | "role" | "status" | "sheetName" | "email" | "name" | "divisionId"> & { divisionName?: string };

export function toSafeUser(user: User): SafeUser {
  const safeUser: Partial<User> = { ...user };
  delete safeUser.passwordHash;
  return safeUser as SafeUser;
}
