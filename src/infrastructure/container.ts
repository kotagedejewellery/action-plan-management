import { GoogleSheetsActionPlanRepository, GoogleSheetsStatusRepository, GoogleSheetsUserRepository } from "@/infrastructure/google-sheets/repositories";

export const users = new GoogleSheetsUserRepository();
export const actionPlans = new GoogleSheetsActionPlanRepository();
export const statuses = new GoogleSheetsStatusRepository();
