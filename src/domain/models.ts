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
  monitorUserIds?: string[];
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

export type NoteWorkspaceRole = "owner" | "member";

export type NoteWorkspace = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteWorkspaceMember = {
  workspaceId: string;
  userId: string;
  role: NoteWorkspaceRole;
  createdAt: string;
};

export type CollaborativeNote = {
  id: string;
  workspaceId: string;
  title: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  titleUpdatedAt: string;
};

export type NoteImage = {
  id: string;
  noteId: string;
  driveFileId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  createdBy: string;
  createdAt: string;
};

export function toSafeUser(user: User): SafeUser {
  const safeUser: Partial<User> = { ...user };
  delete safeUser.passwordHash;
  return safeUser as SafeUser;
}
