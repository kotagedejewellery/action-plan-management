import { GoogleSheetsActionPlanRepository, GoogleSheetsStatusRepository, GoogleSheetsUserRepository, GoogleSheetsWeeklyPlanRepository } from "@/infrastructure/google-sheets/repositories";
import { GoogleDriveAttachmentStorage } from "@/infrastructure/google-drive/attachments";

export const users = new GoogleSheetsUserRepository();
export const actionPlans = new GoogleSheetsActionPlanRepository();
export const statuses = new GoogleSheetsStatusRepository();
export const weeklyPlans = new GoogleSheetsWeeklyPlanRepository();
export const attachments = new GoogleDriveAttachmentStorage();
