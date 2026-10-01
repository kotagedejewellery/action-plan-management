export type UserRole = "admin" | "user";
export type AccountStatus = "active" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  sheetName: string;
  createdAt: string;
  updatedAt: string;
};

export type SafeUser = Omit<User, "passwordHash">;

export type ActionPlan = {
  id: string;
  date: string;
  task: string;
  morningStatus: string;
  afternoonStatus?: string;
  resultLink?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActionPlanStatus = {
  id: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Actor = Pick<User, "id" | "role" | "status" | "sheetName" | "email" | "name">;

export function toSafeUser(user: User): SafeUser {
  const safeUser: Partial<User> = { ...user };
  delete safeUser.passwordHash;
  return safeUser as SafeUser;
}
